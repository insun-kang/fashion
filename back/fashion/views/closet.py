from flask import Blueprint
from flask import Flask, request
import bcrypt
from flask_cors import CORS
from .. import models
from . import checkvalid
from datetime import datetime, timedelta
from flask_jwt_extended import (JWTManager, jwt_required, create_access_token, decode_token,
                                get_jwt_identity, unset_jwt_cookies, create_refresh_token)


# Flasgger
from flasgger.utils import swag_from
from .. import error_code
from .. import address_format

bp = Blueprint('closet', __name__, url_prefix='/')


@bp.route('/closet', methods=['GET'])
@jwt_required()
@swag_from('../swagger_config/closet.yml')
def closet():

    header = request.headers.get('Authorization')

    user_id = decode_token(header[7:] , csrf_value = None , allow_expired = False)['sub']

    bookmark=models.Bookmark.query.filter_by(user_id=user_id).all()

    data={'overall': [], 'top': [], 'bottom': [], 'etc': []}
    
    for i in bookmark:
        asin_id=i.asin_id
        card={}
        catagory=''

        #card['keywords']
        asin=models.ProductKeyword.query.filter_by(asin_id=asin_id).first()
        catagory=asin.catagory

        #card['price'],card['title']
        product=models.Product.query.filter_by(id=asin_id).first()


        card['asin']=product.id
        card['image']=address_format.img(product.asin)
        card['title']=product.title
        

        if catagory == 'overall':
            data['overall'].append(card)
        elif catagory == 'top':
            data['top'].append(card)
        elif catagory == 'bottom':
            data['bottom'].append(card)
        else:
            data['etc'].append(card)
    

    return { 'data':data, 'catagories': ['overall','top','bottom','etc']}, 200


