from flask import Flask
import os
from .celery_utils import init_celery
from flask_sqlalchemy import SQLAlchemy
import config

import logging
from flask_migrate import Migrate

from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
from flask_jwt_extended import (JWTManager, jwt_required, create_access_token,
                                get_jwt_identity, unset_jwt_cookies, create_refresh_token)
import pymysql
from flask_cors import CORS

# Flasgger
from flask import request
from flasgger import Swagger
from flasgger import LazyString, LazyJSONEncoder
PKG_NAME= os.path.dirname(os.path.realpath(__file__)).split("/")[-1]

db = SQLAlchemy()
migrate = Migrate()
def create_app(app_name=PKG_NAME, **kwargs):
    app=Flask(app_name)
    if kwargs.get("celery"):
        init_celery(kwargs.get("celery"), app)
    from .views import auth, json_update, main, cardgame, share, bookmark, details
    app.register_blueprint(auth.bp)
    app.register_blueprint(main.bp)
    app.register_blueprint(cardgame.bp)
    app.register_blueprint(share.bp)
    app.register_blueprint(bookmark.bp)
    app.register_blueprint(details.bp)
    app.register_blueprint(json_update.bp)

    app.config.from_object(config)

    # ORM
    db.init_app(app)
    migrate.init_app(app, db)

    CORS(app, supports_credentials=True)
    # 블루프린트
# --------------------------------------------------------------------------- #


    app.config['JWT_SECRET_KEY'] = 'fashion'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(hours=20)


    jwt = JWTManager(app)
    bcrypt = Bcrypt(app)

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

