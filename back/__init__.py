# from flask import Flask
# import logging
# # --------------------------------- [edit] ---------------------------------- #
# from flask_migrate import Migrate
# from flask_sqlalchemy import SQLAlchemy
# from flask_bcrypt import Bcrypt
# from datetime import datetime, timedelta
# from flask_jwt_extended import (JWTManager, jwt_required, create_access_token,
#                                 get_jwt_identity, unset_jwt_cookies, create_refresh_token)
# import pymysql
# from flask_cors import CORS


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
    from .views import auth
    app.register_blueprint(auth.bp)

    app.config['JWT_SECRET_KEY'] = 'fashion'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(hours=20)


    jwt = JWTManager(app)
    bcrypt = Bcrypt(app)

    return app


# 구조 : 전체폴더(RESISTER) - medical - __init__.py
# 현재 위치를 RESISTER로.
# export FLASK_APP=back
# export FLASK_ENV=development
# export LANG=C.UTF-8
# flask run



