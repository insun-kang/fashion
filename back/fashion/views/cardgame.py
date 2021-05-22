from flask import Blueprint
from flask import Flask, request, jsonify
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

bp = Blueprint('cardgame', __name__, url_prefix='/')


# front-end에서 limit_num 보내주면 그 수만큼 products 반환하는 api
@bp.route('/back-card', methods=['POST'])
# @jwt_required()
@swag_from('../swagger_config/backcard.yml', validation=True)
def backcard():
    # 예외: json 파일이 없을 경우
    if not request.is_json:
        return {'errorCode': 'Missing_JSON', 'msg': 'Missing JSON in request'}, 400
    else:
        body=request.get_json()
        limit_num = body['limit_num']
        bg_products = models.Product.query.order_by(func.rand()).limit(limit_num).all()
        bg_products_list = []
        img_address = 'https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN={asin}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=SL250'

        for bg_product in bg_products:
            print(bg_product)
            bg_products_list.append({'product_title': bg_product.title, 'product_image': img_address.format(asin = bg_product.asin)})
        return {
                'request_num': str(limit_num),
                'total_num': str(len(bg_products)),
                'msg': '제품 반환 성공',
                'bg_products_list': bg_products_list
                }, 200

# api 문서화-----------------------------------------------제작은 아직 안 들어감!
# 배경 위 문구 반환 api
@bp.route('/bg-sentence', methods=['GET'])
# @jwt_required()
@swag_from('../swagger_config/bg_sentence.yml')
def bg_sentence():
    # db 테이블 만든 뒤 바꿀 예정
    # bg_sentence = models.Bgsentence.query.order_by(func.rand()).first()
    n = random.randint(0,2)
    # db에 들어갈 문장들
    bg_sentence_list = ['당신의 스타일이면 좋아요를 눌러주세요!', '이런 스타일은 어떠세요?', '스타일 평가를 많이 할 수록 추천이 정확해져요!']

    return {
            'msg': '메시지 반환 성공',
            'bg_sentence': bg_sentence_list[n]
            }, 200


# 1,2,3,5,10,20,30,40,50(문구 10개 중 돌리거나)
# 3번 뒤 상품 준비가 됐다고 팝업이 뜸
# 백엔드에서 유저에게 맞는 상품리스트 만들면 프론트에 push를 줄건지 프론트에서 rule base
# 게임 플레이 누적 횟수
# 메인카드 10개 단위로
# 결과보기 했을 때 발전시키게


# 메인 카드 api
@bp.route('/maincard', methods=['GET','POST'])
# @jwt_required()
@swag_from('../swagger_config/maincard_get.yml', methods=['GET'])
@swag_from('../swagger_config/maincard_post.yml', methods=['POST'])
def maincard():
    if request.method =='GET': # GET 요청
        # 별점이 3점 이상인 제품중 유저 선호키워드와 맞는것
        # 신성님 알고리즘=> 누적된 키워드 보내주면 제품 asin 보내줌(?)
        # => 알고리즘을 자세히 알아야...
        #
        # if models.Product_user_match.query.filter_by(user_id=user_id).first():
            # 이미 user가 본 카드는 return 안 함!
            # 새로이 제품 asin 받아오기
            # while로 돌려줘야할 듯
            # 알고리즘이 어떤 식으로 결과가 나와야 완성 가능
        # else: # 본 카드가 아니라면 결과 반환

        img_address = 'https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN={asin}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=SL250'

        # 제품 10개 안될때 예외 처리 해주기
        return {
            'msg': '제품 10개 반환 성공',
            'products':
                [
                    {
                        'keyword': 'flower, dress, red, summer, womens',
                        'image': img_address.format(asin = '7106116521'),
                        'title': 'women\'s flower sundress'
                    },
                    {
                        'keyword': 'blue, womens, shirts, popular',
                        'image': img_address.format(asin = 'B00007GDFV'),
                        'title': 'women\'s blue popular shirts'
                    },
                    {
                        'keyword': 'green, poledance, top, sports',
                        'image': img_address.format(asin = 'B00007GDFV'),
                        'title': 'green poledance sports top - very popular now!'
                    },
                    {
                        'keyword': 'flower, pink, winter, mens',
                        'image': img_address.format(asin = 'B00007GDFV'),
                        'title': 'men\'s flower pink winter shoes'
                    },
                    {
                        'keyword': 'idk, what, to, type, anymore',
                        'image': img_address.format(asin = 'B00007GDFV'),
                        'title': 'There are too many products here....'
                    },
                    {
                        'keyword': 'five, more, left, omg',
                        'image': img_address.format(asin = 'B00007GDFV'),
                        'title': 'so now I\'m typing whatever things'
                    },
                    {
                        'keyword': 'you, might, not, understand, whatIM, typing',
                        'image': img_address.format(asin = 'B00007GDFV'),
                        'title': 'I\'m doing my best so plz understand'
                    },
                    {
                        'keyword': 'ok, now, three, products, left',
                        'image': img_address.format(asin = 'B00007GDFV'),
                        'title': 'I\'m writing this in the Gongcha'
                    },
                    {
                        'keyword': 'Taro, milk, tea, is, JMT',
                        'image': img_address.format(asin = 'B00007GDFV'),
                        'title': 'Boba tea is the love'
                    },
                    {
                        'keyword': 'finally, this, is, last, one',
                        'image': img_address.format(asin = 'B00007GDFV'),
                        'title': 'oh yeah!!!!!!!!!!'
                    }
                ]

            }, 200
        # 만약 모든 제품을 user가 다봤을 경우 return "msg": no product available 이런거 보내주기
        # Product_keyword_match 테이블, 유저 테이블, 유저와 유저가 이미 선택한 상품을 매칭시켜주는 Product_user_match 테이블(컬럼: user id, product_id)
    else: # POST 요청:
        # 예외: json 파일이 없을 경우
        if not request.is_json:
            return {'errorCode': 'Missing_JSON', 'msg': 'Missing JSON in request'}, 400
        else:
            # 요소 중 빠진 게 있을 경우 예외처리1
            # db에 이미 있는 user-product set일 경우 예외처리2=>get에서 이미 예외처리 해서 필요 없을듯
            body=request.get_json()
            user_id = body['user_id']
            product_asin = body['asin']
            love_or_hate = body['love_or_hate']

            # 아직 db 없어서 주석 처리
            # product_user_match = models.Product_user_match(
            #     user_id = user_id,
            #     asin = product_asin,
            #     love_or_hate=love_or_hate,
            #     bookmark=False
            # )
            # models.db.session.add(product_user_match)
            # models.db.session.commit()
            result = {
                'user_id': user_id,
                'product_asin': product_asin,
                'love_or_hate': love_or_hate
            }
            return {
                    'msg': '결과 db 추가 성공',
                    'result': result
                    }, 200

# 게임 결과 api
@bp.route('/result-cards', methods=['GET'])
# @jwt_required()
@swag_from('../swagger_config/result_cards.yml')
def result_cards():
    # bookmarks = models.Product_user_match.query.all()
    # products = models.Product.query.all()

    img_address = 'https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN={asin}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=SL250'
    poduct_address = 'https://www.amazon.com/dp/{asin}'
    asin = 'B00007GDFV'
    return {
            'msg': '사용자 취향 맞춤 제품들 반환 성공',
            'products_num': 3,
            'products':
                [
                    {
                        'keyword': 'flower, dress, red, summer, womens',
                        'asin': asin,
                        'price': '300,000',
                        'bookmarks': True,
                        'nlp_result': {
                                            'good_review': ['reasonable','pretty','cute'],
                                            'bad_review': ['small','dirty','smelly']
                                        },
                        'star_rating': '5.0',
                        'good_review_rating': '80%',
                        'bad_review_rating': '20%',
                        'image': img_address.format(asin = asin),
                        'product_url': poduct_address.format(asin = asin),
                        'title': 'women\'s flower sundress'
                    },
                    {
                        'keyword': 'flower, pants, green, winter, womens',
                        'asin': asin,
                        'price': '1,000',
                        'bookmarks': False,
                        'nlp_result': {
                                            'good_review': ['clean','good quality','cute'],
                                            'bad_review': ['expensive','not useful','ugly']
                                        },
                        'star_rating': '3.5',
                        'good_review_rating': '55%',
                        'bad_review_rating': '45%',
                        'image': img_address.format(asin = asin),
                        'product_url': poduct_address.format(asin = asin),
                        'title': 'women\'s flower green pants'
                    },
                    {
                        'keyword': 'flower, dress, red, summer, womens',
                        'asin': asin,
                        'price': '300,000',
                        'bookmarks': True,
                        'nlp_result': {
                                        'good_review': ['reasonable','pretty','cute'],
                                        'bad_review': ['small','dirty','smelly']
                                     },
                        'star_rating': '5.0',
                        'good_review_rating': '80%',
                        'bad_review_rating': '20%',
                        'image': img_address.format(asin = asin),
                        'product_url': poduct_address.format(asin = asin),
                        'title': 'women\'s flower sundress'
                    },
                ]
            }, 200
