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


# api 문서화-----------------------------------------------제작은 아직 안 들어감!
# 3번 뒤 상품 준비가 됐다고 팝업이 뜸
# 백엔드에서 유저에게 맞는 상품리스트 만들면 프론트에 push를 줄건지 프론트에서 rule base
# 게임 플레이 누적 횟수
# 메인카드 10개 단위로
# 결과보기 했을 때 발전시키게

# 메인 카드 api
@bp.route('/maincard', methods=['GET','POST'])
@jwt_required()
@swag_from('../swagger_config/maincard_get.yml', methods=['GET'])
@swag_from('../swagger_config/maincard_post.yml', methods=['POST'])
def maincard():
    if request.method =='GET': # GET 요청
        # 별점이 3점 이상인 제품중 유저 선호키워드와 맞는것
        # 신성님 알고리즘=> 누적된 키워드 보내주면 제품 asin 보내줌(?)
        # => 알고리즘을 자세히 알아야...
        user_id = get_jwt_identity()

        ai_result = ['0764443682','1291691480','1940280001','1940735033','1940967805',
                    '1942705034','3293015344','5378828716','6041002984','630456984X','7106116521',
                    '8037200124','8037200221','8279996567','9239282785','9239281533','9269808971',
                    '9654263246','B00004T3SN','B00005OTJ8']

        # 유저가 플레이한 제품 제외하기
        products_user_played = models.ProductUserPlayed.query.filter_by(user_id=user_id).all()

        asins_user_played = [product_user_played.asin for product_user_played in products_user_played]
        print(asins_user_played)

        asins_user_not_played = [x for x in ai_result if x not in asins_user_played]
        print(asins_user_not_played)

        user_play_num = len(asins_user_played) # user 게임 플레이 횟수

        # user가 플레이 하지 않은 게임 중 결과 반환
        # 제품 10개 안될때 예외 처리 해주기
        products_list = []
        for asin in asins_user_not_played:
            keywords = [product_keyword.product_keyword for product_keyword in models.ProductKeyword.query.filter_by(asin=asin).all()]
            product_title = models.Product.query.filter_by(asin=asin).first().title
            products_list.append({
                'keywords': keywords if len(keywords) <= 6 else keywords[:6],
                'image': address_format.img(asin),
                'title': product_title,
                'asin': asin
            })

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
            print(user_id)
            product_asin = body['asin']
            love_or_hate = body['loveOrHate']

            product_user_played = models.ProductUserPlayed(
                user_id = user_id,
                asin = product_asin,
                love_or_hate=love_or_hate,
            )
            models.db.session.add(product_user_played)
            models.db.session.commit()

            result = {
                'userId': user_id,
                'productAsin': product_asin,
                'loveOrHate': love_or_hate
            }
            return {
                    'result': result
                    }, 200

# 게임 결과 api
@bp.route('/result-cards', methods=['GET'])
@jwt_required()
@swag_from('../swagger_config/result_cards.yml')
def result_cards():

    ai_result = ['0764443682','1291691480','1940280001','1940735033','1940967805',
                    '1942705034','3293015344','5378828716','6041002984','630456984X','7106116521',
                    '8037200124','8037200221','8279996567','9239282785','9239281533','9269808971',
                    '9654263246','B00004T3SN','B00005OTJ8']

    user_id = get_jwt_identity()
    products_list = []

    for asin in ai_result:
        bookmark = models.Bookmark.query.filter_by(asin=asin, user_id=user_id).first()
        keywords = [product_keyword.product_keyword for product_keyword in models.ProductKeyword.query.filter_by(asin=asin).all()]
        product = models.Product.query.filter_by(asin=asin).first()
        product_review = models.ProductReview.query.filter_by(asin=asin).first()
        pos_review_rate = product_review.positive_review_number / (product_review.positive_review_number + product_review.negative_review_number)
        products_list.append({
            'keywords': keywords if len(keywords) <= 6 else keywords[:6],
            'asin': asin,
            'price': product.price,
            'bookmark' : True if bookmark else False, # 존재하면 True 아니면 False
            'nlpResults': {
                            'posReviewSummary': product_review.positive_review_summary if product_review.positive_review_summary else 'OMG! There is no negative review at all!;)',
                            'negReviewSummary': product_review.negative_review_summary if product_review.negative_review_summary else 'Oh no....there is no positive review at all...;('
                        },
            'starRating': round(product.rating, 2),
            'posReveiwRate': round(pos_review_rate, 2),
            'image': address_format.img(asin),
            'productUrl': address_format.product(asin),
            'title': product.title
        })
    return {
            'productsNum': len(products_list),
            'products': products_list
            }, 200
