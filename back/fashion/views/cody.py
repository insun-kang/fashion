from flask import Blueprint
from flask import Flask, request
import bcrypt
from flask_cors import CORS
from .. import models
from . import checkvalid
from datetime import datetime, timedelta
from flask_jwt_extended import (JWTManager, jwt_required, create_access_token, decode_token,
                                get_jwt_identity, unset_jwt_cookies, create_refresh_token)
from ast import literal_eval

# Flasgger
from flasgger.utils import swag_from
from .. import error_code
from .. import address_format

bp = Blueprint('cody', __name__, url_prefix='/')

@bp.route('/load-cody', methods=['GET'])
@jwt_required()
@swag_from('../swagger_config/load-cody.yml')
def load_cody():
    header = request.headers.get('Authorization')

    user_id = decode_token(header[7:] , csrf_value = None , allow_expired = False)['sub']
    asin_ids = models.Cody.query.filter_by(user_id=user_id).all()
    
    if not asin_ids:
        return {'cards': [], 'msg' : 'Make Your Cody!!'}, 200

    cards=[]
    for i in asin_ids:
            
        asin_id=i.asin_id
        card={}
        keywords=[]
        
        #card['price'],card['title']
        product=models.Product.query.filter_by(id=asin_id).first()

        card['asin']=product.id
        card['image']=address_format.img(product.asin)
        card['title']=product.title
        
        cards.append(card)
    return {'cards': cards, 'msg' : 'Loading success'}, 200

@bp.route('/save-cody', methods=['POST'])
@jwt_required()
@swag_from('../swagger_config/save-cody.yml')
def save_cody():
    if not request.is_json:
        return error_code.missing_json_error

    else:
        body = request.get_json()
        
        asin_ids = body['asins'] #array
        header = request.headers.get('Authorization')

        user_id = decode_token(header[7:] , csrf_value = None , allow_expired = False)['sub']

        total_bookmark = 0
        total_shared = 0


        codies = models.Cody.query.filter_by(user_id=user_id).all()



        if not codies:
            for asin_id in asin_ids:
                cody = models.Cody(
                        asin_id=asin_id,
                        user_id=user_id,
                    )

                models.db.session.add(cody)
                models.db.session.commit()

                share = models.Share.query.filter_by(asin_id=asin_id).count()
                bookmark = models.Bookmark.query.filter_by(asin_id=asin_id).count()

                total_bookmark += bookmark
                total_shared += share

            return {'totalBookmark' : total_bookmark, 'totalShared' : total_shared,'msg' : 'Save success'}, 200
        
        for cody in codies:
            models.db.session.delete(cody)
            models.db.session.commit()
            
        for asin_id in asin_ids:
            cody = models.Cody(
                    asin_id=asin_id,
                    user_id=user_id,
                )

            models.db.session.add(cody)
            models.db.session.commit()

            #asin의 찜개수 다 더하고 공유개수 다 더하기 {totalBookMark:12, totalShared:5}

            share = models.Share.query.filter_by(asin_id=asin_id).count()
            bookmark = models.Bookmark.query.filter_by(asin_id=asin_id).count()
            total_bookmark += bookmark
            total_shared += share



        return {'totalBookmark' : total_bookmark, 'totalShared' : total_shared,'msg' : 'Save success'}, 200

@bp.route('/delete-cody', methods=['GET'])
@jwt_required()
@swag_from('../swagger_config/delete-cody.yml')
def delete_cody():
    header = request.headers.get('Authorization')

    user_id = decode_token(header[7:] , csrf_value = None , allow_expired = False)['sub']
    codies=models.Cody.query.filter_by(user_id=user_id).all()

    for cody in codies:
        models.db.session.delete(cody)
        models.db.session.commit()

    return {'msg' : 'Delete success'}, 200

