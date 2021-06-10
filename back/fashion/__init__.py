
from flask import Flask
import logging
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
from flask_jwt_extended import (JWTManager, jwt_required, create_access_token,
                                get_jwt_identity, unset_jwt_cookies, create_refresh_token)
import pymysql
from flask_cors import CORS
import config
import json

# Flasgger
from flask import request
from flasgger import Swagger
from flasgger import LazyString, LazyJSONEncoder

db = SQLAlchemy()
migrate = Migrate()
# --------------------------------------------------------------------------- #

def create_app():
    app = Flask(__name__)
# --------------------------------- [edit] ---------------------------------- #
    app.config.from_object(config)

    # ORM
    db.init_app(app)
    migrate.init_app(app, db)

    CORS(app, supports_credentials=True)

    # 블루프린트
# --------------------------------------------------------------------------- #
    from .views import auth, main, cardgame, share, bookmark, details, closet, cody

    app.register_blueprint(auth.bp)
    app.register_blueprint(main.bp)
    app.register_blueprint(cardgame.bp)
    app.register_blueprint(share.bp)
    app.register_blueprint(bookmark.bp)
    app.register_blueprint(details.bp)
    app.register_blueprint(closet.bp)
    app.register_blueprint(cody.bp)

    app.config['JWT_SECRET_KEY'] = 'fashion'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(hours=20)


    jwt = JWTManager(app)
    bcrypt = Bcrypt(app)

    #kakao oauth
    @app.route('/oauth')
    def oauth():
        code = str(request.args.get('code'))
        resToken = getAccessToken("4a3d0a9c3e37f3f000598e652cc812d1",str(code))  #XXXXXXXXX 자리에 RESET API KEY값을 사용
        return 'code=' + str(code) + '<br/>response for token=' + str(resToken)

    def getAccessToken(clientId, code) :  # 세션 코드값 code 를 이용해서 ACESS TOKEN과 REFRESH TOKEN을 발급 받음
        url = "https://kauth.kakao.com/oauth/token"
        payload = "grant_type=authorization_code"
        payload += "&client_id=" + clientId
        payload += "&redirect_url=http%3A%2F%2Flocalhost%3A5000%2Foauth&code=" + code
        headers = {
            'Content-Type' : "application/x-www-form-urlencoded",
            'Cache-Control' : "no-cache",
        }
        reponse = requests.request("POST",url,data=payload, headers=headers)
        
        access_token = json.loads(((reponse.text).encode('utf-8')))
        return access_token

    # Flasgger
    app.config["SWAGGER"] = {"title": "오늘옷데 API", "openapi": "3.0.2"}

    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": "apispec",
                "route": "/apispec.json"
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/swagger/"
    }

    swagger_template = {
        "components": {
            "securitySchemes": {
                "ApiKeyAuth": {
                    "type": "apiKey",
                    "in": "header",
                    "name": "Authorization"
                }
            },
            'security':[{
                'ApiKeyAuth': []
            }]
        }
    }
    app.json_encoder = LazyJSONEncoder
    swagger = Swagger(app, config=swagger_config, template=swagger_template)

    return app



# 현재 위치를 RESISTER로.
# export FLASK_APP=fashion
# export FLASK_ENV=development
# export LANG=C.UTF-8
# flask run
