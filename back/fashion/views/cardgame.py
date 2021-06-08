from flask import Blueprint
from flask import Flask, request
import bcrypt
from flask_cors import CORS
from .. import models
from . import checkvalid
from datetime import datetime, timedelta
from flask_jwt_extended import (JWTManager, jwt_required, create_access_token,
                                get_jwt_identity, unset_jwt_cookies, create_refresh_token)

from sqlalchemy.sql.expression import func
import random
# Flasgger
from flasgger.utils import swag_from
from .. import error_code
from .. import address_format
import json
import os

# 인공지능
import pandas as pd
from surprise import SVD, accuracy # SVD model, 평가
from surprise import Reader, Dataset # SVD model의 dataset

import asyncio
import queue

bp = Blueprint('cardgame', __name__, url_prefix='/')


# front-end에서 limit_num 보내주면 그 수만큼 products 반환하는 api
@bp.route('/back-card', methods=['POST'])
@jwt_required()
@swag_from('../swagger_config/backcard.yml', validation=True)
def backcard():
    # 예외: json 파일이 없을 경우
    if not request.is_json:
        return error_code.missing_json_error
    else:
        body = request.get_json()
        limit_num = body['limitNum']

        bg_products = models.Product.query.order_by(func.rand()).limit(limit_num).all()

        products_list = []

        products_list = [
            {
                'productTitle': bg_product.title,
                'productImage': address_format.img(bg_product.asin)
            } for bg_product in bg_products
        ]

        return {
                'requestNum': limit_num,
                'totalNum': len(products_list),
                'productsList': products_list
                }, 200

# 메인 카드 api
@bp.route('/maincard', methods=['GET','POST'])
@jwt_required()
@swag_from('../swagger_config/maincard_get.yml', methods=['GET'])
@swag_from('../swagger_config/maincard_post.yml', methods=['POST'])
def maincard():
    if request.method =='GET': # GET 요청

        user_id = get_jwt_identity()
        products_user_played = models.ProductUserPlayed.query.filter_by(user_id=user_id).all()
        asin_ids_user_played = [product_user_played.asin_id for product_user_played in products_user_played]
        # user 게임 플레이 횟수
        user_play_num = len(asin_ids_user_played)

        # print('-'*50) print(os.getcwd()) print('-'*50) # /home/project/back

        with open(f'fashion/user_recommendations/game_{user_id}.json', 'r') as f:
            json_data = json.load(f)

        products_list = []

        products_list_num = 0
        for product in json_data['products']:
            if product['asin'] not in asin_ids_user_played and product['keywords']:
                products_list.append(product)
                products_list_num += 1
            if products_list_num == 10:
                break

        return {
            'firstPlay': True if user_play_num == 0 else False,
            'userPlayNum': user_play_num,
            'products': products_list
            }, 200

        # 만약 모든 제품을 user가 다봤을 경우 return "msg": no product available 이런거 보내주기
        # Product_keyword_match 테이블, 유저 테이블, 유저와 유저가 이미 선택한 상품을 매칭시켜주는 Product_user_match 테이블(컬럼: user id, product_id)
    else: # POST 요청:
        # 예외: json 파일이 없을 경우
        if not request.is_json:
            return error_code.missing_json_error
        else:
            # 요소 중 빠진 게 있을 경우 예외처리1
            # db에 이미 있는 user-product set일 경우 예외처리2=>get에서 이미 예외처리 해서 필요 없을듯
            body=request.get_json()

            user_id = get_jwt_identity()

            product_asin_id = body['asin']
            love_or_hate = body['loveOrHate']

            product_user_played = models.ProductUserPlayed(
                user_id = user_id,
                asin_id = product_asin_id,
                love_or_hate=love_or_hate,
            )
            models.db.session.add(product_user_played)
            models.db.session.commit()

            user_play_num = models.ProductUserPlayed.query.filter_by(user_id=user_id).count() # user 게임 플레이 횟수

            # if not user_play_num % 10: # user가 10회 플레이할 때마다
            user_queue(user_id)
            # loop = asyncio.get_event_loop()
            # loop.run_until_complete(json_update(user_id))
            # loop.close()


            result = {
                'userPlayNum': user_play_num,
                'userId': user_id,
                'asin': product_asin_id,
                'loveOrHate': love_or_hate
            }
            return {
                    'result': result
                    }, 200

# 게임 결과 api
@bp.route('/result-cards', methods=['POST'])
@jwt_required()
@swag_from('../swagger_config/result_cards.yml')
def result_cards():
    if not request.is_json:
        return error_code.missing_json_error
    else:
        body=request.get_json()

        page_num=body['pageNum']
        data_size=body['dataSize']

        user_id = get_jwt_identity()
        products_user_played_hate = models.ProductUserPlayed.query.filter_by(user_id=user_id, love_or_hate=1).all()
        asin_ids_user_played = [product_user_played.asin_id for product_user_played in products_user_played_hate]

        user_play_num = models.ProductUserPlayed.query.filter_by(user_id=user_id).count() # user 게임 플레이 횟수

        # 추천 결과 페이지에서 사용자가 게임을 5번 미만 했다면 결과를 주지 말고 에러 반환해주세요!
        if user_play_num < 5:
            return error_code.error_body('play_too_little','This user played game less than 5 times')
        else:
            with open(f'fashion/user_recommendations/result_{user_id}.json', 'r') as f:
                json_data = json.load(f)

            products_list = []

            products_list_num = 0
            for product in json_data['products'][page_num*data_size:]:
                if product['asin'] not in asin_ids_user_played and product['keywords']:
                    bookmark = models.Bookmark.query.filter_by(asin_id=product['asin'], user_id=user_id).first()
                    product['bookmark'] = True if bookmark else False
                    products_list.append(product)
                    products_list_num += 1
                if products_list_num == data_size:
                    break
            # 싫어요 횟수/전체 플레이 횟수 => 정확도가 낮아요 추가
            return {
                    'accuracy': round(len(asin_ids_user_played)/user_play_num, 2),
                    'productsNum': len(products_list),
                    'products': products_list
                    }, 200

# 코드 위에 다 삽입해서 한번에 돌리기
# json으로 이 위에 다 만들고
# get 요청 오면 json import해서 보내주기

# 큐 함수
async def user_queue(user_id):
    user_queue = queue.Queue()
    user_queue.put(user_id)
    return json_update(user_queue.get())


# 인공 지능 함수 결과 바탕으로 json 파일 업데이트
# @bp.route('/json-update', methods=['GET'])
# @jwt_required()
# @swag_from('../swagger_config/json_update.yml')
# def json_update(user_id):
async def json_update(user_id):
    import time
    start = time.time()
    # user_id = get_jwt_identity()

    # 리뷰파일 불러오기
    review_df = pd.read_csv('fashion/user_recommendations/reviews_df.csv', encoding='cp949', index_col=0)
    products_user_played = models.ProductUserPlayed.query.all()

    for product in products_user_played:
        real_product = models.Product.query.filter_by(id=product.asin_id).first()
        review_df=review_df.append({'user_id' : str(product.user_id) , 'asin' : real_product.asin, 'overall' : float(product.love_or_hate)}, ignore_index=True)

    # 별점범위 지정
    reader = Reader(rating_scale= (1, 5))

    # 데이터 가공
    data = Dataset.load_from_df(df=review_df, reader=reader)

    # 데이터 분할
    train = data.build_full_trainset()
    test = train.build_testset()

    # 훈련
    model = SVD(n_factors=100, n_epochs=20, random_state=10)
    model.fit(train)

    # 중복되지 않은 어신 리스트
    clean_asin = list(set(list(review_df['asin'])))

    # --------------------------학습-------------------------------------

    # 추천 정보를 받아 올 대상
    item_ids = clean_asin # 추천 대상 제품들
    actual_rating = 0

    # 추천 결과 저장 => 멀티 프로세싱하면 더 빨라지지 않을까?
    review_pred = []
    for item_id in item_ids :
        review_pred.append(model.predict(user_id, item_id, actual_rating))

    # 추천결과에서 어신과 예상 별점만 추출
    filter_review_pred = {}
    for i in review_pred:
        filter_review_pred[i[1]] = i[3]

    # 예상 별점이 큰 순서대로 정렬
    sorted_review = sorted(filter_review_pred.items(), key=lambda x: x[1], reverse=True)

    # 예상 별점이 3.65 이상인 제품의 어신만 추출
    filter_review = []
    for i in sorted_review:
        if i[1] >= 3.65:
            filter_review.append(i[0])

    # 리뷰 만개로 컷
    cut_review = filter_review[:10000]

    print("time :", time.time() - start)  # 현재시각 - 시작시간 = 실행 시간
    # return{
    #     'result': cut_review
    # }
    # 게임카드 json 업데이트 코드-----------------------------------------------------------------------------------------------------
    # user_id = get_jwt_identity()

    # asins = ai_model()['result'][:100]
    asins = cut_review[:100]
    # asin_id_list = [models.Product.query.filter_by(asin=asin).first().id for asin in asins]
    # 데이터 정제될때까지 임시 예외처리----------------------------------------------------------------------
    asin_id_list = []
    for asin in asins:
        try:
            asin_id_list.append(models.Product.query.filter_by(asin=asin).first().id)
        except:
            continue
    # -----------------------------------------------------------------------------------------------------------

    print(f'1. asin_ids 리스트 만들어짐 : {asin_id_list[:5]}')

    products_list = {}
    products_list['products'] = []

    a = 0
    for asin_id in asin_id_list:
        keywords = [product_keyword.product_keyword for product_keyword in models.ProductKeyword.query.filter_by(asin_id=asin_id).all()]
        try:
            product= models.Product.query.filter_by(id=asin_id).first()
        except:
            continue
        products_list['products'].append({
            'keywords': keywords if len(keywords) <= 6 else keywords[:6],
            'image': address_format.img(product.asin),
            'title': product.title,
            'asin': asin_id
        })
        a += 1
        print(f'{a}번째 데이터 생성')

    print(f'product_list 파일 만들어짐')

    file_path = f'fashion/user_recommendations/game_{user_id}.json'

    with open(file_path, 'w') as outfile:
        json.dump(products_list, outfile)
    print('파일 업데이트 끝')

    # 결과카드 json 업데이트 코드-----------------------------------------------------------------------------------------------------
    products_result_list = {}
    products_result_list['products'] = []

    a = 0
    for asin_id in asin_id_list:
        keywords = [product_keyword.product_keyword for product_keyword in models.ProductKeyword.query.filter_by(asin_id=asin_id).all()]
        product = models.Product.query.filter_by(id=asin_id).first()
        try:
            product_review = models.ProductReview.query.filter_by(asin_id=asin_id).first()
            pos_review_rate = product_review.positive_review_number / (product_review.positive_review_number + product_review.negative_review_number)
        except:
            continue
        try:
            product_title = product.title
        except:
            continue
        products_result_list['products'].append({
            'keywords': keywords if len(keywords) <= 6 else keywords[:6],
            'asin': asin_id,
            'price': product.price,
            'nlpResults': {
                            'posReviewSummary': product_review.positive_review_summary if product_review.positive_review_summary else 'Oh no....there is no positive review at all...;(',
                            'negReviewSummary': product_review.negative_review_summary if product_review.negative_review_summary else 'OMG! There is no negative review at all!;)'
                        },
            'starRating': round(product.rating, 2),
            'posReveiwRate': round(pos_review_rate, 2),
            'image': address_format.img(product.asin),
            'productUrl': address_format.product(product.asin),
            'title': product_title
        })
        a += 1
        print(f'{a}번째 데이터 생성')

    print(f'product_result_list 파일 만들어짐')

    file_path_result = f'fashion/user_recommendations/result_{user_id}.json'

    with open(file_path_result, 'w') as file:
        json.dump(products_result_list, file)
    print('결과 파일 생성 끝')

    print("time :", time.time() - start)  # 현재시각 - 시작시간 = 실행 시간
    return{
        'result':'성공',
        'time': time.time() - start
    }
