from flask import Blueprint
from flask import Flask, request
import bcrypt
from flask_cors import CORS
from .. import models
from . import checkvalid
from sqlalchemy import func
from datetime import datetime, timedelta
from flask_jwt_extended import (JWTManager, jwt_required, create_access_token,
                                get_jwt_identity, unset_jwt_cookies, create_refresh_token)
from ast import literal_eval

# Flasgger
from flasgger.utils import swag_from
from .. import error_code

bp = Blueprint('search', __name__, url_prefix='/')

@bp.route('/search', methods=['POST'])
@swag_from('../swagger_config/search.yml')
def search():
    if not request.is_json:
        return error_code.missing_json_error

    else:
        body=request.get_json()

        keyword=body['keyword']
        existing_keywords=body['existing_keywords']

        return_keyword=[]

        search = "{}%".format(keyword.lower())
        find_keyword=models.SearchKeyword.query.filter(models.SearchKeyword.keyword.like(search)).all()

        
        if len(keyword) == 0:
            return {'msg': "You haven't entered anything", 'keyword': return_keyword}, 200
        
        if len(find_keyword) == 0:
            return {'msg': 'No results were found for your search', 'keyword': return_keyword}, 200.1

        
        if not existing_keywords:
            for i in find_keyword:
                return_keyword.append((i.keyword))
            return {'msg': 'success', 'keyword': return_keyword}, 200.2

        else:
            for i in find_keyword:
                if i.keyword not in existing_keywords:
                    return_keyword.append((i.keyword))
            return {'msg': 'success', 'keyword': return_keyword}, 200.3
        
        

    
# SELECT 컬럼명 FROM 테이블 WHERE 컬럼명 LIKE 'A%'
