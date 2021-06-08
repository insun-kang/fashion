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
<<<<<<< HEAD
=======
import json
import os

# 인공지능
import pandas as pd
from surprise import SVD, accuracy # SVD model, 평가
from surprise import Reader, Dataset # SVD model의 dataset
import pickle

# import datetime
# import redis

# red = redis.StrictRedis()
>>>>>>> 2b643f11e405d68fc144084c2f546981825ab2b6

bp = Blueprint('cardgame', __name__, url_prefix='/')

# -------------------------------------------------------------------------------------
# def event_stream():
#     pub = redis.pubsub()
#     pub.subscribe('sse_example_channel')
#     for msg in pub.listen():
#         if msg['type'] != 'subscribe':
#             event, data = json.loads(msg['data'])
#             yield u'event: {0}\ndata: {1}\n\n'.format(event, data)
#         else:
#             yield u'data: {0}\n\n'.format(msg['data'])


# @app.route('/stream')
# def get_pushes():
#     return Response(event_stream(), mimetype="text/event-stream")

# @app.route('/post')
# def publish_data():
#     # ...
#     redis.publish('sse_example_channel', json.dumps([event, data]))

# # ===================================================================


# @bp.route('/stream')
# @jwt_required()
# # @swag_from('../swagger_config/backcard.yml', validation=True)
# def stream():
#     user_id = get_jwt_identity()

#     def event_stream():
#         pubsub = red.pubsub()
#         pubsub.subscribe(user_id) # 채널이름 => user_id
#         # TODO: handle client disconnection.
#         for message in pubsub.listen():
#             print (message)
#             if message['type']=='message':
#                 yield 'data: %s\n\n' % message['data'].decode('utf-8')

#     return flask.Response(event_stream(), mimetype="text/event-stream")

# @bp.route('/post', methods=['POST'])
# @jwt_required()
# # @swag_from('../swagger_config/backcard.yml', validation=True)
# def post():
#     user_id = get_jwt_identity()

#     message = 'json file 생성 완료'
#     user = models.User.query.filter(id=user_id).first()
#     now = datetime.datetime.now().replace(microsecond=0).time()
#     red.publish(user_id, u'[%s] %s: %s' % (now.isoformat(), user, message))
#     return flask.Response(status=200)


# -------------------------------------------------------------------------------------

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
<<<<<<< HEAD
        # return {
        #         "productsList": [
        #             {
        #             "productImage": address_format.img(asin[0]),
        #             "productTitle": "womens blue popular shirts"
        #             },
        #             {
        #             "productImage": address_format.img(asin[1]),
        #             "productTitle": "Womens blue popular shirts"
        #             }
        #         ],
        #         "requestNum": 5,
        #         "totalNum": 2
        #         }, 200

# api 문서화-----------------------------------------------제작은 아직 안 들어감!

# 1,2,3,5,10,20,30,40,50(문구 10개 중 돌리거나)
# 3번 뒤 상품 준비가 됐다고 팝업이 뜸
# 백엔드에서 유저에게 맞는 상품리스트 만들면 프론트에 push를 줄건지 프론트에서 rule base
# 게임 플레이 누적 횟수
# 메인카드 10개 단위로
# 결과보기 했을 때 발전시키게

=======
>>>>>>> 2b643f11e405d68fc144084c2f546981825ab2b6

# 메인 카드 api
@bp.route('/maincard', methods=['GET','POST'])
@jwt_required()
@swag_from('../swagger_config/maincard_get.yml', methods=['GET'])
@swag_from('../swagger_config/maincard_post.yml', methods=['POST'])
def maincard():
    if request.method =='GET': # GET 요청
<<<<<<< HEAD
        # 별점이 3점 이상인 제품중 유저 선호키워드와 맞는것
        # 신성님 알고리즘=> 누적된 키워드 보내주면 제품 asin 보내줌(?)
        # => 알고리즘을 자세히 알아야...
        #
        # if asin in models.ProductUserPlayed.query.filter_by(user_id=user_id).all():
            # 이미 user가 본 카드는 return 안 함!
            # 새로이 제품 asin 받아오기
            # while로 돌려줘야할 듯
            # 알고리즘이 어떤 식으로 결과가 나와야 완성 가능
        # else: # 본 카드가 아니라면 결과 반환

        # 게임 플레이 횟수 ProductUserPlayed 테이블에서 len(user가 플레이한 product 갯수) 하면 될듯
        # len(models.ProductUserPlayed.query.filter_by(user_id=user_id).all())
        # 1,2,3,5,10,20,30,40,50(문구 10개 중 돌리거나)
        # 지금은 랜덤으로 뜨게 해놓음
        # len(models.ProductUserPlayed.query.filter_by(user_id=user_id).all()) == 0이면 첫 게임

        user_play_num = random.randint(0,8)
        bg_sentence_list = ['당신의 스타일이면 좋아요를 눌러주세요!', # 1
        '이런 스타일은 어떠세요?', # 2
        '스타일 평가를 많이 할 수록 추천이 정확해져요!', # 3
        '게임 5번 플레이 하면 뜨는 문구에요!',  # 5
        '게임 10번 플레이 하면 뜨는 문구에요!', # 10
        '게임 20번 플레이 하면 뜨는 문구에요!', # 20
        '게임 30번 플레이 하면 뜨는 문구에요!', # 30
        '게임 40번 플레이 하면 뜨는 문구에요!', # 40
        '게임 50번 플레이 하면 뜨는 문구에요! 다영님 최고에요' # 50
        ]
=======

        user_id = get_jwt_identity()
        products_user_played = models.ProductUserPlayed.query.filter_by(user_id=user_id).all()
        asins_user_played = [product_user_played.asin for product_user_played in products_user_played]
        # user 게임 플레이 횟수
        user_play_num = len(asins_user_played)

        # print('-'*50) print(os.getcwd()) print('-'*50) # /home/project/back
>>>>>>> 2b643f11e405d68fc144084c2f546981825ab2b6

        with open(f'fashion/user_recommendations/game_{user_id}.json', 'r') as f:
            json_data = json.load(f)

        products_list = []

        products_list_num = 0
        for product in json_data['products']:
            if product['asin'] not in asins_user_played and product['keywords']:
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

            product_asin = body['asin']
            love_or_hate = body['loveOrHate']

            product_user_played = models.ProductUserPlayed(
                user_id = user_id,
                asin = product_asin,
                love_or_hate=love_or_hate,
            )
            models.db.session.add(product_user_played)
            models.db.session.commit()

            user_play_num = models.ProductUserPlayed.query.filter_by(user_id=user_id).count() # user 게임 플레이 횟수

            if not user_play_num % 10: # user가 10회 플레이할 때마다
                json_update()

            result = {
                'userPlayNum': user_play_num,
                'userId': user_id,
                'productAsin': product_asin,
                'loveOrHate': love_or_hate
            }
            return {
                    'result': result
                    }, 200

# 게임 결과 api
<<<<<<< HEAD
@bp.route('/result-cards', methods=['GET'])
@jwt_required()
@swag_from('../swagger_config/result_cards.yml')
def result_cards():
    # bookmarks = models.Product_user_match.query.all()
    # products = models.Product.query.all()

    asin = ['B00HGRB3CE', 'B07PGCYWRJ', '1975421663']
    return {
            'productsNum': 3,
            'products':
                [
                    {
                        'keywords': ['flower', 'dress', 'red', 'summer', 'womens'],
                        'asin': asin[0],
                        'price': 300000.00,
                        'bookmark': True,
                        'nlpResults': {
                                            'posReviewSummary': 'The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building . It was the first structure to reach a height of 300 metres . It is now taller than the Chrysler Building in New York City by 5.2 metres (17 ft) Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France .',
                                            'negReviewSummary': 'The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building . It was the first structure to reach a height of 300 metres . It is now taller than the Chrysler Building in New York City by 5.2 metres (17 ft) Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France .'
                                        },
                        'starRating': 3.24,
                        'posReveiwRate': 0.50,
                        'negReviewRate': 0.50,
                        'image': address_format.img(asin[0]),
                        'productUrl': address_format.product(asin[0]),
                        'title': 'women\'s flower sundress'
                    },
                    {
                        'keywords': ['flower', 'pants', 'green', 'winter', 'womens'],
                        'asin': asin[1],
                        'price': 1000.20,
                        'bookmark': False,
                        'nlpResults': {
                                            'posReviewSummary': 'The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building . It was the first structure to reach a height of 300 metres . It is now taller than the Chrysler Building in New York City by 5.2 metres (17 ft) Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France .',
                                            'negReviewSummary': 'The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building . It was the first structure to reach a height of 300 metres . It is now taller than the Chrysler Building in New York City by 5.2 metres (17 ft) Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France .'
                                        },
                        'starRating': 4.05,
                        'posReveiwRate': 0.50,
                        'negReviewRate': 0.50,
                        'image': address_format.img(asin[1]),
                        'productUrl': address_format.product(asin[1]),
                        'title': 'women\'s flower green pants'
                    },
                    {
                        'keywords': ['flower', 'dress', 'red', 'summer', 'womens'],
                        'asin': asin[2],
                        'price': 300000.00,
                        'bookmark': True,
                        'nlpResults': {
                                        'posReviewSummary': 'The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building . It was the first structure to reach a height of 300 metres . It is now taller than the Chrysler Building in New York City by 5.2 metres (17 ft) Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France .',
                                        'negReviewSummary': 'The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building . It was the first structure to reach a height of 300 metres . It is now taller than the Chrysler Building in New York City by 5.2 metres (17 ft) Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France .'
                                     },
                        'starRating': 5.00,
                        'posReveiwRate': 0.50,
                        'negReviewRate': 0.50,
                        'image': address_format.img(asin[2]),
                        'productUrl': address_format.product(asin[2]),
                        'title': 'women\'s flower sundress'
                    },
                ]
            }, 200
=======
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
        asins_user_played = [product_user_played.asin for product_user_played in products_user_played_hate]

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
                if product['asin'] not in asins_user_played and product['keywords']:
                    bookmark = models.Bookmark.query.filter_by(asin=product['asin'], user_id=user_id).first()
                    product['bookmark'] = True if bookmark else False
                    products_list.append(product)
                    products_list_num += 1
                if products_list_num == data_size:
                    break
            # 싫어요 횟수/전체 플레이 횟수 => 정확도가 낮아요 추가
            return {
                    'accuracy': round(len(asins_user_played)/user_play_num, 2),
                    'productsNum': len(products_list),
                    'products': products_list
                    }, 200

# 코드 위에 다 삽입해서 한번에 돌리기
# json으로 이 위에 다 만들고
# get 요청 오면 json import해서 보내주기


# 인공 지능 API
@bp.route('/ai-model', methods=['GET'])
@jwt_required()
@swag_from('../swagger_config/ai_model.yml')
def ai_model():
    import time
    start = time.time()
    user_id = get_jwt_identity()

    # 리뷰파일 불러오기
    review_df = pd.read_csv('fashion/user_recommendations/review_df.csv', encoding='cp949', index_col=0)
    products_user_played = models.ProductUserPlayed.query.all()

    for product in products_user_played:
        review_df=review_df.append({'user_id' : str(product.user_id) , 'asin' : product.asin, 'overall' : float(product.love_or_hate)}, ignore_index=True)

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

    # 중복되지 않은 어신 리스트=>얘도 피클로 저장해놓으면 더 빠르려나
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
    return{
        'result': cut_review
    }

# 속도가 너무 느릴경우: product_user_played가 100 개 넘을 때마다 새로 학습한다던지....
# ai 모델 학습과 predict 부분 분리?


# 인공 지능 함수 결과 바탕으로 json 파일 업데이트
@bp.route('/json-update', methods=['GET'])
@jwt_required()
@swag_from('../swagger_config/json_update.yml')
def json_update():
    # 게임카드 json 업데이트 코드-----------------------------------------------------------------------------------------------------
    user_id = get_jwt_identity()

    asins = ai_model()['result'][:100]

    print(f'1. asins 리스트 만들어짐 : {asins[:5]}')

    products_list = {}
    products_list['products'] = []

    a = 0
    for asin in asins:
        keywords = [product_keyword.product_keyword for product_keyword in models.ProductKeyword.query.filter_by(asin=asin).all()]
        try:
            product_title = models.Product.query.filter_by(asin=asin).first().title
        except:
            continue
        products_list['products'].append({
            'keywords': keywords if len(keywords) <= 6 else keywords[:6],
            'image': address_format.img(asin),
            'title': product_title,
            'asin': asin
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
    for asin in asins:
        keywords = [product_keyword.product_keyword for product_keyword in models.ProductKeyword.query.filter_by(asin=asin).all()]
        product = models.Product.query.filter_by(asin=asin).first()
        product_review = models.ProductReview.query.filter_by(asin=asin).first()
        pos_review_rate = product_review.positive_review_number / (product_review.positive_review_number + product_review.negative_review_number)
        try:
            product_title = product.title
        except:
            continue
        products_result_list['products'].append({
            'keywords': keywords if len(keywords) <= 6 else keywords[:6],
            'asin': asin,
            'price': product.price,
            'nlpResults': {
                            'posReviewSummary': product_review.positive_review_summary if product_review.positive_review_summary else 'Oh no....there is no positive review at all...;(',
                            'negReviewSummary': product_review.negative_review_summary if product_review.negative_review_summary else 'OMG! There is no negative review at all!;)'
                        },
            'starRating': round(product.rating, 2),
            'posReveiwRate': round(pos_review_rate, 2),
            'image': address_format.img(asin),
            'productUrl': address_format.product(asin),
            'title': product_title
        })
        a += 1
        print(f'{a}번째 데이터 생성')

    print(f'product_result_list 파일 만들어짐')

    file_path_result = f'fashion/user_recommendations/result_{user_id}.json'

    with open(file_path_result, 'w') as file:
        json.dump(products_result_list, file)
    print('결과 파일 생성 끝')

    return{
        'result':'성공'
    }
>>>>>>> 2b643f11e405d68fc144084c2f546981825ab2b6
