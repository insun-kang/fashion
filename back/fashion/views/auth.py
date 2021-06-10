from flask import Blueprint
from flask import Flask, request, redirect,jsonify
import bcrypt
from flask_cors import CORS
from .. import models
from . import checkvalid
from datetime import datetime, timedelta
from flask_jwt_extended import (JWTManager, jwt_required, create_access_token, decode_token,
                                get_jwt_identity, unset_jwt_cookies, create_refresh_token)
from ast import literal_eval
from config import CLIENT_ID, REDIRECT_URI, CLIENT_SECRET
from ..controller import Oauth
# Flasgger
from flasgger.utils import swag_from
from .. import error_code
import requests
import json
from .. import address_format
import shutil
import os
import pandas as pd

bp = Blueprint('auth', __name__, url_prefix='/')



# http://localhost:5000/oauth/url
@bp.route('/oauth/url')
# @swag_from('../swagger_config/oauth_url.yml')
def oauth_url():
    """
    Kakao OAuth URL 가져오기
    """
    kakao_oauth_url="https://kauth.kakao.com/oauth/authorize?client_id=%s&response_type=code&redirect_uri=%s&response_type=code" \
    % (CLIENT_ID, REDIRECT_URI)
    return redirect(kakao_oauth_url)

@bp.route('/oauth', methods=["POST"])
@swag_from('../swagger_config/oauth.yml')
def oauth_token():
    if not request.is_json:
        return error_code.missing_json_error

    else:
        oauth = Oauth()

        body=request.get_json()

        code = body['code']
        auth_info = oauth.auth(code)
        user = oauth.userinfo("Bearer " + auth_info['access_token'])

        email=str(user["id"])+'@onod.email'
        profile=user["kakao_account"]
        nickname = profile["profile"]["nickname"]
        usercheck = models.User.query.filter_by(email=email).first()


        if usercheck is None:
            user = models.User(
                email=email,
                nickname=nickname,
                sign_up_date=datetime.now()
            )
            models.db.session.add(user)
            models.db.session.commit()
            # 추천 디폴트 json 파일 생성----------------------------------------------------------------------------------------------
            queried = models.User.query.filter_by(email=email).first()
            file_game = f'fashion/user_recommendations/game_{queried.id}.json'
            file_result = f'fashion/user_recommendations/result_{queried.id}.json'

            try:
                shutil.copy2("fashion/user_recommendations/default_game.json", file_game)
                shutil.copy2("fashion/user_recommendations/default_result.json", file_result)
            except:
                admin=models.User.query.filter_by(id=queried.id).first()
                models.db.session.delete(admin)
                models.db.session.commit()
                if os.path.isfile(file_game) or os.path.isfile(file_result):
                    os.remove(file_game)
                    os.remove(file_result)
                return error_code.error_body('failed_copying','Failed copying default json file')
            # ----------------------------------------------------------------------------------------------------------------------------------

        user = models.User.query.filter_by(email=email).first()
        accessToken = create_access_token(identity=user.id, fresh=True)
        return {
                     'accessToken': accessToken,
                     'nickname': user.nickname
                  }, 200


# @bp.route("/oauth/userinfo", methods=['POST'])
# @swag_from('../swagger_config/oauth_userinfo.yml')
# def oauth_userinfo():
#     """
#     # OAuth Userinfo API
#     kakao access token을 인자로 받은 후,
#     kakao에서 해당 유저의 실제 Userinfo를 가져옴
#     """
#     access_token = request.get_json()['access_token']
#     result = Oauth().userinfo("Bearer " + access_token)
#     return jsonify(result)

@bp.route('/sign-up', methods=['POST'])
@swag_from('../swagger_config/register.yml', validation=True)
def register():
    if not request.is_json:
        return error_code.missing_json_error

    else:
        body=request.get_json()

        email = body['email']
        pw = body['pw']
        nickname = body['nickname']
        birth = body['birth']


        emailcheck = models.User.query.filter_by(email=email).first()
        nicknamecheck = models.User.query.filter_by(nickname=nickname).first()

        if not(email and pw and nickname):
            return error_code.error_body('missing_param','Missing parameter in request')
        elif emailcheck is not None:
            return error_code.error_body('alr_signed_email','This email has already been signed up')

        elif nicknamecheck is not None:
            return error_code.error_body('alr_signed_nickname','This nickname has already been signed up')

        if checkvalid.passwordCheck(pw) == 1:
            hashpw = bcrypt.hashpw(
                pw.encode('utf-8'), bcrypt.gensalt())

            user = models.User(
                nickname=nickname,
                email=email,
                pw=hashpw,
                birth=birth,
                sign_up_date=datetime.now()
            )
            models.db.session.add(user)
            models.db.session.commit()
            # 추천 디폴트 json 파일 생성----------------------------------------------------------------------------------------------
            queried = models.User.query.filter_by(email=email).first()
            file_game = f'fashion/user_recommendations/game_{queried.id}.json'
            file_result = f'fashion/user_recommendations/result_{queried.id}.json'

            try:
                shutil.copy2("fashion/user_recommendations/default_game.json", file_game)
                shutil.copy2("fashion/user_recommendations/default_result.json", file_result)
            except:
                admin=models.User.query.filter_by(id=queried.id).first()
                models.db.session.delete(admin)
                models.db.session.commit()
                if os.path.isfile(file_game) or os.path.isfile(file_result):
                    os.remove(file_game)
                    os.remove(file_result)
                return error_code.error_body('failed_copying','Failed copying default json file')
            # ----------------------------------------------------------------------------------------------------------------------------------

            #바로 로그인 실행

            accessToken = create_access_token(identity=queried.id, fresh=True)

            return {
                        'accessToken': accessToken,
                        'nickname': queried.nickname
                    }, 200

        elif checkvalid.passwordCheck(pw) == 2:
            return error_code.error_body('invalid_pw','Password must contain at least one number digit, one special character, one English character,and be at least 8 characters')
        else:
            return error_code.error_body('invalid_pw','Password must contain at least one special character')


@bp.route('/sign-in', methods=['POST'])
@swag_from('../swagger_config/login.yml')
def login():
    if not request.is_json:
        return error_code.missing_json_error

    else:
        body=request.get_json()

        email = body['email']
        pw = body['pw']

        queried = models.User.query.filter_by(email=email).first()

        if queried is None:
            return error_code.error_body('not_exists','This member does not exist')

        if not email:
            return error_code.error_body('missing_email','Missing email in request')

        if not pw:
            return error_code.error_body('missing_pw','Missing password in request')

        if bcrypt.checkpw(pw.encode('utf-8'), queried.pw.encode('utf-8')):
            accessToken = create_access_token(identity=queried.id, fresh=True)
            return {
                     'accessToken': accessToken,
                     'nickname': queried.nickname
                  }, 200

        else:
            return error_code.error_body('incorrect_pw','Incorrect Password')

@bp.route('/mypage', methods=['POST'])
@jwt_required()
@swag_from('../swagger_config/check_pw.yml', validation=True)
def check_pw():
    if not request.is_json:
        return error_code.missing_json_error

    else:
        body = request.get_json()
        header = request.headers.get('Authorization')

        user_id = decode_token(header[7:] , csrf_value = None , allow_expired = False)['sub']

        queried = models.User.query.filter_by(id=user_id).first()

        pw=body['pw']

        if not pw:
            return error_code.error_body('missing_pw','Missing password in request')

        if bcrypt.checkpw(pw.encode('utf-8'), queried.pw.encode('utf-8')):
            return {'msg': 'Correct Password'}, 200
        else:
            return error_code.error_body('incorrect_pw','Incorrect Password')


@bp.route('/modification', methods=['GET','POST'])
@jwt_required()
@swag_from('../swagger_config/modify_get.yml', methods=['GET'])
@swag_from('../swagger_config/modify_post.yml', methods=['POST'])
def modify():
    if request.method =='GET':
        header = request.headers.get('Authorization')
        user_id = decode_token(header[7:] , csrf_value = None , allow_expired = False)['sub']
        # print(user_id)
        userinfo=models.User.query.filter_by(id=user_id).first()

        return {
                    'nickname' : userinfo.nickname,
                    'email' : userinfo.email,
                    'birth' : userinfo.birth,
                    'signUpDate' : userinfo.sign_up_date
                }, 200
    else:
        if not request.is_json:
            return error_code.missing_json_error

        else:
            body = request.get_json()
            header = request.headers.get('Authorization')
            user_id = decode_token(header[7:] , csrf_value = None , allow_expired = False)['sub']

            email = body['email']
            pw = body['pw']
            nickname = body['nickname']

            hashpw = bcrypt.hashpw(
                        pw.encode('utf-8'), bcrypt.gensalt())

            admin=models.User.query.filter_by(id=user_id).first()

            emailcheck=models.User.query.filter_by(email=email).first()
            nicknamecheck=models.User.query.filter_by(nickname=nickname).first()
            try:
                if admin.email != email and emailcheck is None:
                    admin.email=email
                    models.db.session.commit()

                if admin.pw != pw:
                    admin.pw=hashpw
                    models.db.session.commit()

                if admin.nickname != nickname and nicknamecheck is None:
                    admin.nickname=nickname
                    models.db.session.commit()

                return {'nickname': admin.nickname}, 200
            except:
                return error_code.error_body('failed_change_info','Failed to change member info')

@bp.route('/withdrawal', methods=['GET'])
@jwt_required()
@swag_from('../swagger_config/withdrawal.yml')
def withdrawal():
    header = request.headers.get('Authorization')
    user_id = decode_token(header[7:] , csrf_value = None , allow_expired = False)['sub']

    admin=models.User.query.filter_by(id=user_id).first()
    models.db.session.delete(admin)
    models.db.session.commit()

    file = f'fashion/user_recommendations/game_{user_id}.json'
    file2 = f'fashion/user_recommendations/result_{user_id}.json'

    if os.path.isfile(file) or os.path.isfile(file2):
        os.remove(file)
        os.remove(file2)

    return {'msg': 'Succeed deleting members account'}, 200




# Only allow fresh JWTs to access this route with the `fresh=True` arguement.
@bp.route("/protected", methods=["GET"])
@jwt_required(fresh=True)
@swag_from("../swagger_config/protected.yml")
def protected():
    return {'msg': 'Succeed accessing protected area'}, 200
