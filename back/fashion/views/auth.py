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

bp = Blueprint('auth', __name__, url_prefix='/')

@bp.route('/sign-up', methods=['POST'])
@swag_from('../swagger_config/register.yml', validation=True)
def register():
    if not request.is_json:
        return error_code.missing_json_error

    else:
        body=request.get_json()

        email = body['email']
        pw = body['pw']
        name = body['name']
        nickname = body['nickname']
        birth = body['birth']

        emailcheck = models.User.query.filter_by(email=email).first()
        nicknamecheck = models.User.query.filter_by(nickname=nickname).first()

        if not(name and email and pw and nickname):
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
                name=name,
                pw=hashpw,
                birth=birth,
                sign_up_date=datetime.now()
            )
            models.db.session.add(user)
            models.db.session.commit()


            #바로 로그인 실행
            queried = models.User.query.filter_by(email=email).first()

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
                    'name' : userinfo.name,
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
            name = body['name']
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

                if admin.name != name:
                    admin.name=name
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
    return {'msg': 'Succeed deleting members account'}, 200




# Only allow fresh JWTs to access this route with the `fresh=True` arguement.
@bp.route("/protected", methods=["GET"])
@jwt_required(fresh=True)
@swag_from("../swagger_config/protected.yml")
def protected():
    return {'msg': 'Succeed accessing protected area'}, 200
