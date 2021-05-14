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

bp = Blueprint('auth', __name__, url_prefix='/')

# # bp 테스트
# @bp.route('/')
# def home():
#     return 'auth page ok'


@bp.route('/sign-up', methods=['POST'])
@swag_from("swagger_config/random_letters.yml")
def register():
    print("check")  # 확인용... 나중에 삭제할것
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 402

    else:
        print('check')
        body = literal_eval(request.get_json()['body'])

        email = body['email']
        pw = body['pw']
        name = body['name']
        nickname = body['nickname']
        birth = body['birth']
        gender = body['gender']
        

        print(email, password, name, nickname)  # 확인용....나중에 삭제할것

        emailcheck = models.User.query.filter_by(email=email).first()
        nicknamecheck = models.User.query.filter_by(
            nickname=nickname).first()
        print(emailcheck)
        if not(name and email and password and nickname):
            return jsonify({"msg": "빈칸 오류", 'status': 301})
        elif emailcheck is not None:
            return jsonify({"msg": "이미 가입된 이메일입니다.", 'status': 302})
        elif nicknamecheck is not None:
            return jsonify({"msg": "닉네임이 존재할때", 'status': 303})
        else:
            if checkvalid.passwordCheck(password) == 1:
                hashpw = bcrypt.hashpw(
                    password.encode('utf-8'), bcrypt.gensalt())

                user = models.User(
                    nickname=nickname,
                    email=email,
                    name=name,
                    pw=hashpw,
                    birth=birth,
                    gender=gender,
                    date=datetime.now()
                )
                models.db.session.add(user)
                models.db.session.commit()
                return jsonify({"msg": "회원가입 성공", 'status': 300})
            elif checkvalid.passwordCheck(password) == 2:

                return jsonify({'msg': '비밀번호 기준에 맞지 않습니다. 비밀번호는 8자이상, 숫자+영어+특수문자 조합으로 이루어집니다.', 'status': 304})
            else:
                return jsonify({'msg': '비밀번호는 하나이상의 특수문자가 들어가야합니다', 'status': 305})


@bp.route('/sign-in', methods=['POST'])
@swag_from("swagger_config/random_letters.yml")
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 402
    else:
        print('check')
        body = literal_eval(request.get_json()['body'])
        print(body)
        userEmail = body['userEmail']
        userPassword = body['userPassword']
        print(userEmail, userPassword)
        if not userEmail:
            return jsonify({"msg": "아이디 치세요", 'status': 401})

        elif not userPassword:
            return jsonify({"msg": "비번 치세요", 'status': 401})

        queried = models.User.query.filter_by(email=userEmail).first()
        print('checkpw:', queried.pw)
        if bcrypt.checkpw(userPassword.encode('utf-8'), queried.pw.encode('utf-8')):
            # Identity can be any data that is json serializable
            access_token = create_access_token(identity=queried.id)
            refresh_token = create_refresh_token(identity=queried.id)
            print('ok')
            print(queried.id, queried.nickname)
            user_object = {
                "id": queried.id,
                "email": queried.email,
                "nickname": queried.nickname,
                "birth"=queried.birth,
                "gender"=queried.gender

            }

            return jsonify({
                'access_token': access_token,
                'refresh_token': refresh_token,
                'user_object': user_object,
                'status': 400
            })
        else:
            return jsonify({"msg": "비밀번호 불일치", "status": 401})


@bp.route("/refresh", methods=["POST"])
@swag_from("swagger_config/random_letters.yml")
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=queried.id, fresh=False)
    return jsonify(access_token=access_token)


# Only allow fresh JWTs to access this route with the `fresh=True` arguement.
@bp.route("/protected", methods=["GET"])
@swag_from("swagger_config/random_letters.yml")
@jwt_required(fresh=True)
def protected():
    return jsonify(foo="bar")
