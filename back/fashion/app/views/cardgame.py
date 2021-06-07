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

from . import json_update

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
        asins_user_played = [product_user_played.asin for product_user_played in products_user_played]
        # user 게임 플레이 횟수
        user_play_num = len(asins_user_played)

        # print('-'*50) print(os.getcwd()) print('-'*50) # /home/project/back

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
                json_update.json_update.delay(user_id)

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
