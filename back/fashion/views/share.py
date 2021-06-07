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

bp = Blueprint('share', __name__, url_prefix='/')

@bp.route('/share', methods=['POST'])
@jwt_required()
@swag_from('../swagger_config/share.yml')
def Share():
    if not request.is_json:
        return error_code.missing_json_error

    else:
        body = request.get_json()
        
        asin_id = body['asin_id']
        header = request.headers.get('Authorization')

        user_id = decode_token(header[7:] , csrf_value = None , allow_expired = False)['sub']
        product = models.Product.query.filter_by(id=asin_id).first()

        shared=product.shared
        
        share = models.Share(
                
                asin_id=asin_id,
                user_id=user_id,
                shared_date=datetime.now()
            )
        models.db.session.add(share)
        models.db.session.commit()

        product.shared = shared+1
        models.db.session.commit()

        return {'msg' : 'Share success'}, 200