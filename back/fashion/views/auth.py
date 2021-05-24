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
        return {'errorCode': 'Missing_JSON', 'msg': 'Missing JSON in request'}, 400

    else:
        body=request.get_json()

        email = body['email']
        pw = body['pw']
        name = body['name']
        nickname = body['nickname']
        birth = body['birth']
        gender = body['gender']


        emailcheck = models.User.query.filter_by(email=email).first()
        nicknamecheck = models.User.query.filter_by(nickname=nickname).first()

        if not(name and email and pw and nickname):
            return {'errorCode': 'Missing_Param', 'msg': 'Missing parameter in request'}, 400

        elif emailcheck is not None:
            return {'errorCode': 'Alr_Signed_email', 'msg': 'This email has already been signed up'}, 400

        elif nicknamecheck is not None:
            return {'errorCode': 'Alr_Signed_nickname', 'msg': 'This nickname has already been signed up'}, 400

        else:
            if checkvalid.passwordCheck(pw) == 1:
                hashpw = bcrypt.hashpw(
                    pw.encode('utf-8'), bcrypt.gensalt())

                user = models.User(
                    nickname=nickname,
                    email=email,
                    name=name,
                    pw=hashpw,
                    birth=birth,
                    gender=gender,
                    sign_up_date=datetime.now()
                )
                models.db.session.add(user)
                models.db.session.commit()


                #바로 로그인 실행
                queried = models.User.query.filter_by(email=email).first()

                access_token = create_access_token(identity=queried.id, fresh=True)
                refresh_token = create_refresh_token(identity=queried.id)

                return {
                            'access_token': access_token,
                            'nickname': queried.nickname
                        }, 200

            elif checkvalid.passwordCheck(pw) == 2:
                return {'errorCode': 'Invalid_pw', 'msg': 'Password must contain at least one number digit, one special character, one English character,and be at least 8 characters'}, 400
            else:
                return {'errorCode': 'Invalid_pw', 'msg': 'Password must contain at least one special character'}, 400


@bp.route('/sign-in', methods=['POST'])
@swag_from('../swagger_config/login.yml')
def login():
    if not request.is_json:
        return {'errorCode': 'Missing_JSON', 'msg': 'Missing JSON in request'}, 400

    else:
        body=request.get_json()

        email = body['email']
        pw = body['pw']

        queried = models.User.query.filter_by(email=email).first()

        if queried is None:
            return error_code.error_body('Not_Exists','This member does not exist')

        if not email:
            return {'errorCode': 'Missing_email', 'msg': 'Missing email in request'}, 400

        if not pw:
            return {'errorCode': 'Missing_pw', 'msg': 'Missing password in request'}, 400

        if bcrypt.checkpw(pw.encode('utf-8'), queried.pw.encode('utf-8')):
            access_token = create_access_token(identity=queried.id, fresh=True)
            refresh_token = create_refresh_token(identity=queried.id)


            return {
                     'access_token': access_token,
                     'nickname': queried.nickname
                  }, 200

        else:
            return {'errorCode': 'Incorrect_pw', 'msg': 'Incorrect Password'}, 400

@bp.route('/mypage', methods=['POST'])
@jwt_required()
@swag_from('../swagger_config/check_pw.yml', validation=True)
def check_pw():
    if not request.is_json:
        return {'errorCode': 'Missing_JSON', 'msg': 'Missing JSON in request'}, 400

    else:
        body = request.get_json()
        header = request.headers.get('Authorization')

        userid = decode_token(header[7:] , csrf_value = None , allow_expired = False)['sub']

        queried = models.User.query.filter_by(id=userid).first()

        pw=body['pw']

        if not pw:
            return {'errorCode': 'Missing_pw', 'msg': 'Missing password in request'}, 400

        if bcrypt.checkpw(pw.encode('utf-8'), queried.pw.encode('utf-8')):
            return {'msg': 'Correct Password'}, 200
        else:
            return {'errorCode': 'Incorrect_pw', 'msg': 'Incorrect Password'}, 400


@bp.route('/modification', methods=['GET','POST'])
@jwt_required()
@swag_from('../swagger_config/modify_get.yml', methods=['GET'])
@swag_from('../swagger_config/modify_post.yml', methods=['POST'])
def modify():
    if request.method =='GET':
        header = request.headers.get('Authorization')
        userid = decode_token(header[7:] , csrf_value = None , allow_expired = False)['sub']
        # print(userid)
        userinfo=models.User.query.filter_by(id=userid).first()

        return {
                    'nickname' : userinfo.nickname,
                    'email' : userinfo.email,
                    'name' : userinfo.name,
                    'birth' : userinfo.birth,
                    'gender' : userinfo.gender,
                    'sign_up_date' : userinfo.sign_up_date
                }, 200
    else:
        if not request.is_json:
            return {'errorCode': 'Missing_JSON', 'msg': 'Missing JSON in request'}, 400

        else:
            body = request.get_json()
            header = request.headers.get('Authorization')
            userid = decode_token(header[7:] , csrf_value = None , allow_expired = False)['sub']

            email = body['email']
            pw = body['pw']
            name = body['name']
            nickname = body['nickname']

            hashpw = bcrypt.hashpw(
                        pw.encode('utf-8'), bcrypt.gensalt())

            admin=models.User.query.filter_by(id=userid).first()

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

                return {'msg': 'Succeed to change member info', 'nickname': admin.nickname}, 200
            except:
                return {'errorCode': 'Failed_ChangeInfo', 'msg': 'Failed to change member info'}, 400

@bp.route('/withdrawal', methods=['GET'])
@jwt_required()
@swag_from('../swagger_config/withdrawal.yml')
def withdrawal():
    header = request.headers.get('Authorization')
    userid = decode_token(header[7:] , csrf_value = None , allow_expired = False)['sub']

    admin=models.User.query.filter_by(id=userid).first()
    models.db.session.delete(admin)
    models.db.session.commit()
    return {'msg': 'Succeed deleting members account'}, 200


@bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
@swag_from('../swagger_config/refresh.yml', validation=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity, fresh=False)
    return {'access_token': access_token}, 200


# Only allow fresh JWTs to access this route with the `fresh=True` arguement.
@bp.route("/protected", methods=["GET"])
@jwt_required(fresh=True)
@swag_from("../swagger_config/protected.yml")
def protected():
    return {'msg': 'Succeed accessing protected area'}, 200
