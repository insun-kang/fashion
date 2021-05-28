from flask import Blueprint
from flask import Flask, request
import bcrypt
from flask_cors import CORS
from .. import models
from . import checkvalid
from datetime import datetime, timedelta
from flask_jwt_extended import (JWTManager, jwt_required, create_access_token,
                                get_jwt_identity, unset_jwt_cookies, create_refresh_token)
from ast import literal_eval


# Flasgger
from flasgger.utils import swag_from
from .. import error_code

bp = Blueprint('main', __name__, url_prefix='/')


@bp.route('/search', methods=['POST'])
@swag_from('../swagger_config/search.yml')
def Search():
    if not request.is_json:
        return error_code.missing_json_error

    else:
        body=request.get_json()

        keyword=body['keyword']
        existing_keywords=body['existingKeywords']  #array

        return_keywords=[]

        search = "{}%".format(keyword.lower())
        find_keyword=models.SearchKeyword.query.filter(models.SearchKeyword.keyword.like(search)).all()

        if len(keyword) == 0:
            return {'msg': "You haven't entered anything", 'keywords': return_keywords}, 200
        
        if len(find_keyword) == 0:
            return {'msg': 'No results were found for your search', 'keywords': return_keywords}, 200

        if not existing_keywords:
            for i in find_keyword:
                return_keywords.append((i.keyword))
            return {'msg': 'success', 'keywords': return_keywords}, 200

        else:
            for i in find_keyword:
                if i.keyword not in existing_keywords:
                    return_keywords.append((i.keyword))
            return {'msg': 'success', 'keywords': return_keywords}, 200

@bp.route('/result-search', methods=['GET','POST'])
@swag_from('../swagger_config/result_search.yml')
def ResultSearch():
    if request.method =='GET':
        #초기에는 게임 결과순
        #검색시에는 긍정 높은순
        return None

    
    else:
        body=request.get_json()

        existing_keywords=body['existingKeywords']  #array

        print(existing_keywords)
        asins = models.ProductKeyword.query.filter(
            ~models.ProductKeyword.product_keyword.in_(existing_keywords)).all()
        for i in asins:
            print(i.asin)

        return 'test'


