
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

# Flasgger
from flask import request
from flasgger import Swagger
from flasgger import LazyString, LazyJSONEncoder

db = SQLAlchemy()
migrate = Migrate()
# --------------------------------------------------------------------------- #

def create_app():
    app = Flask(__name__)
    # Flasgger
    app.config["SWAGGER"] = {"title": "Swagger-UI", "uiversion": 2}

    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": "apispec_1",
                "route": "/apispec_1.json",
                "rule_filter": lambda rule: True,  # all in
                "model_filter": lambda tag: True,  # all in
            }
        ],
        "static_url_path": "/flasgger_static",
        # "static_folder": "static",  # must be set by user
        "swagger_ui": True,
        "specs_route": "/swagger/",
    }

    template = dict(
        swaggerUiPrefix=LazyString(lambda: request.environ.get("HTTP_X_SCRIPT_NAME", ""))
    )

    app.json_encoder = LazyJSONEncoder
    swagger = Swagger(app, config=swagger_config, template=template)
# --------------------------------- [edit] ---------------------------------- #
    app.config.from_object(config)

    # ORM
    db.init_app(app)
    migrate.init_app(app, db)

    CORS(app, supports_credentials=True)
    # 블루프린트
# --------------------------------------------------------------------------- #
    from .views import auth
    app.register_blueprint(auth.bp)

    app.config['JWT_SECRET_KEY'] = 'fashion'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(hours=20)


    jwt = JWTManager(app)
    bcrypt = Bcrypt(app)

    return app



# 현재 위치를 RESISTER로.
# export FLASK_APP=fashion
# export FLASK_ENV=development
# export LANG=C.UTF-8
# flask run
