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
import time

# 인공지능
import pandas as pd
from surprise import SVD, accuracy # SVD model, 평가
from surprise import Reader, Dataset # SVD model의 dataset

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

        if user_play_num >= 50:
            bg_sentence = '50번 이상 플레이한 당신이 패션의 그랜드마스터!'
        elif user_play_num >= 40:
            bg_sentence = '40번 이상 플레이하다니....패션(passion)황이신가요?'
        elif user_play_num >= 30:
            bg_sentence = '30번 이상 플레이한 사람은 당신이 처음이야! 반해버렸어요!'
        elif user_play_num >= 20:
            bg_sentence = '20번 이상 플레이하셨군요! 아주 칭찬해!'
        elif user_play_num >= 10:
            bg_sentence = '팁: 15번 이상 플레이하면 더 좋은 결과를 받을 수 있어요! 5번 남았답니다!'
        elif user_play_num >= 5:
            bg_sentence = '흠! 아직은 잘 모르겠어요. 그래도 결과는 보실 수 있어요!'
        elif user_play_num >= 3:
            bg_sentence = '스타일 평가를 많이 할 수록 추천이 정확해져요!'
        elif user_play_num == 2:
            bg_sentence = '이런 스타일은 어떠세요?'
        else:
            bg_sentence = '당신의 스타일이면 좋아요를 눌러주세요!'


        return {
            'bgSentence': bg_sentence,
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


            if not user_play_num % 30: # user가 55회 플레이할 때마다
                ai_model_game(user_id,ai_model(user_id))

            if not user_play_num % 15: # user가 15회 플레이할 때마다
                ai_model_result(user_id,ai_model(user_id))
            print(user_play_num)
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

        request_history=body['requestHistory']  #array[0, ]
        data_size=body['dataSize'] #30
        offset_num = sum(request_history)


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
            # 24/36/48
            products_list_num = 0
            for product in json_data['products'][offset_num:]:
                if product['keywords']:
                # if product['asin'] not in asin_ids_user_played and product['keywords']:
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

def ai_model(user_id):
    user_id = str(user_id)
    # 리뷰파일 불러오기
    start = time.time()
    review_df = pd.read_csv('fashion/user_recommendations/review_df.csv', encoding='cp949', index_col=0)
    review_df.reset_index(inplace=True)
    products_user_played = models.ProductUserPlayed.query.all()

    # 새로운 사용자 기록 추가하기
    for product in products_user_played:
        review_df=review_df.append({'user_id' : str(product.user_id) , 'asin' : product.asin_id, 'overall' : float(product.love_or_hate)}, ignore_index=True)

    # 데이터 가공
    data = Dataset.load_from_df(df=review_df, reader=Reader(rating_scale= (1, 5)))

    # 데이터 분할
    train = data.build_full_trainset()
    test = train.build_testset()

    # 훈련
    model = SVD(n_factors=100, n_epochs=20, random_state=10)
    model.fit(train)

    # 추천 정보를 받아 올 대상
    # 중복되지 않은 어신 리스트
    item_ids = list(set(review_df['asin'])) # 추천 대상 제품들

    # 추천 결과 저장
    review_pred = []
    for item_id in item_ids :
        review_pred.append(model.predict(user_id, item_id, 0))

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
    asin_id_list = filter_review[:10000]
    return asin_id_list

def ai_model_game(user_id,asin_id_list):
    start = time.time()

    filtered = [1,8,32768,65620,65633,65674,65841,65920,33241,66027,33316,66110,33349,
        66175,33497,33557,33566,33694,2304,3072,611,1479,2426,2839,3235,3660,3661,3662,914,3454,
        7392,5554,999,2302,2123,6896,2258,2259,2433,4121,4609,6092,6296,6415,6419]
    products_list = {}
    products_list['products'] = []

    for asin_id in asin_id_list:
        if asin_id not in filtered:
            try:
                keywords = list(set([product_keyword.product_keyword for product_keyword in models.ProductKeyword.query.filter_by(asin_id=asin_id).all()]))
                product= models.Product.query.filter_by(id=asin_id).first()
                image = address_format.img(product.asin)
                title = product.title
            except:
                continue
            products_list['products'].append({
                'keywords': keywords if len(keywords) <=6 else keywords[:6],
                'image': image,
                'title': title,
                'asin': asin_id
            })

    file_path = f'fashion/user_recommendations/game_{user_id}.json'

    with open(file_path, 'w') as outfile:
        json.dump(products_list, outfile)

    print('게임')
    print('게임 time:', time.time() - start)


def ai_model_result(user_id,asin_id_list):
    start = time.time()

    filtered = [1,8,32768,65620,65633,65674,65841,65920,33241,66027,33316,66110,33349,
        66175,33497,33557,33566,33694,2304,3072,611,1479,2426,2839,3235,3660,3661,3662,914,3454,
        7392,5554,999,2302,2123,6896,2258,2259,2433,4121,4609,6092,6296,6415,6419]

    products_user_played_hate = models.ProductUserPlayed.query.filter_by(user_id=user_id, love_or_hate=1).all()
    asin_ids_user_played = [product_user_played.asin_id for product_user_played in products_user_played_hate] + filtered

    products_result_list = {}
    products_result_list['products'] = []

    for asin_id in asin_id_list:
        if asin_id not in asin_ids_user_played:
            try:
                keywords = list(set([product_keyword.product_keyword for product_keyword in models.ProductKeyword.query.filter_by(asin_id=asin_id).all()]))
                product = models.Product.query.filter_by(id=asin_id).first()
                product_review = models.ProductReview.query.filter_by(asin_id=asin_id).first()
                pos_review_rate = product_review.positive_review_number / (product_review.positive_review_number + product_review.negative_review_number)
                title = product.title
                product_url = address_format.product(product.asin)
                image = address_format.img(product.asin)
                price = product.price
            except:
                continue
            products_result_list['products'].append({
                'keywords': keywords if len(keywords) <=6 else keywords[:6],
                'asin': asin_id,
                'price': price,
                'nlpResults': {
                                'posReviewSummary': product_review.positive_review_summary if product_review.positive_review_summary else 'Oh no....there is no positive review at all...;(',
                                'negReviewSummary': product_review.negative_review_summary if product_review.negative_review_summary else 'OMG! There is no negative review at all!;)'
                            },
                'starRating': round(product.rating, 2),
                'posReveiwRate': round(pos_review_rate, 2),
                'image': image,
                'productUrl': product_url,
                'title': title
            })

    file_path_result = f'fashion/user_recommendations/result_{user_id}.json'

    with open(file_path_result, 'w') as file:
        json.dump(products_result_list, file)

    print('결과time:', time.time() - start)
