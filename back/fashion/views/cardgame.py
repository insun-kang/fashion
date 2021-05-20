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
        return {'msg': 'Missing JSON in request'}, 400
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
