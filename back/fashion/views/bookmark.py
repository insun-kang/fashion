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

bp = Blueprint('bookmark', __name__, url_prefix='/')

@bp.route('/bookmark', methods=['POST'])
@jwt_required()
@swag_from('../swagger_config/bookmark.yml')
def Bookmark():
    if not request.is_json:
        return error_code.missing_json_error

    else:
        body = request.get_json()
        
        asin_id = body['asin']
        header = request.headers.get('Authorization')

        user_id = decode_token(header[7:] , csrf_value = None , allow_expired = False)['sub']
        bookmark = models.Bookmark.query.filter_by(asin_id=asin_id, user_id=user_id).first()

        if bookmark is not None:
            models.db.session.delete(bookmark)
            models.db.session.commit()

            return {'msg' : 'Delete bookmark'}, 200
            
        else:
            bookmark = models.Bookmark(
                            asin_id=asin_id,
                            user_id=user_id,
                            date=datetime.now()
                        )
            models.db.session.add(bookmark)
            models.db.session.commit()

            return {'msg' : 'Make bookmark'}, 200