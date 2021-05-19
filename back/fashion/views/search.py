from flask import Blueprint
from flask import Flask, request, jsonify
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

bp = Blueprint('search', __name__, url_prefix='/')

@bp.route('/search', methods=['GET','POST'])
@swag_from("../swagger_config/login.yml")
def search():
    if request.method =='GET':
        keyword=[]
        search_keyword=models.Keyword.query.order_by(models.Keyword.count.desc()).limit(50)
        for i in search_keyword:
            keyword.append(i.keyword)
        print(keyword)
        return jsonify({"msg": "성공","keyword": keyword ,'status': 200})
    else:
        body=request.get_json()

        keyword = body['keyword']
        count = body['count']
        keyword = models.Keyword(
                    keyword=keyword,
                    count=count
                )
        models.db.session.add(keyword)
        models.db.session.commit()
        return jsonify({'msg': '성공', 'status': 200})

    