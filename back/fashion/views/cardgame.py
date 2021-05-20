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
# Flasgger
from flasgger.utils import swag_from

bp = Blueprint('cardgame', __name__, url_prefix='/')


# front-end에서 limit_num 보내주면 그 수만큼 products 반환하는 api
@bp.route('/back-card', methods=['POST'])
@swag_from("../swagger_config/backcard.yml", validation=True)
def backcard():
    # 예외: json 파일이 없을 경우
    if not request.is_json:
        return {"msg": "Missing JSON in request"}, 400
    else:
        body=request.get_json()
        limit_num = body['limit_num']
        # 예외: limit_num 만큼의 제품이 없을 경우
        try:
            bg_products = models.Product.query.order_by(func.rand()).limit(limit_num)
            bg_products_list = []
            img_address = 'https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN={asin}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=SL250'

            for bg_product in bg_products:
                print(bg_product)
                bg_products_list.append({'product_title': bg_product.title, 'product_image': img_address.format(asin = bg_product.asin)})
            return {
                    "msg": "제품"+str(limit_num)+"개 반환 성공",
                    'bg_products_list': bg_products_list
                    }, 200
        except:
            return {"msg": str(limit_num)+"개의 데이터가 없습니다."}, 400
