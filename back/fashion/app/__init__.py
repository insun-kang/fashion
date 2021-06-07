
# import config





# --------------------------------------------------------------------------- #
# from celery import Celery
# def make_celery(app_name=__name__):
#     app = app or create_app()
#     celery = Celery(
#         app.import_name,
#         backend="redis://localhost:6379/0",
#         broker="redis://localhost:6379/1"
#     )
#     celery.conf.update(app.config)

#     class ContextTask(celery.Task):
#         def __call__(self, *args, **kwargs):
#             with app.app_context():
#                 return self.run(*args, **kwargs)

#     celery.Task = ContextTask
#     return celery

# def create_app():
#     app = Flask(__name__)
# # --------------------------------- [edit] ---------------------------------- #
#     app.config.from_object(config)

#     # ORM
#     db.init_app(app)
#     migrate.init_app(app, db)

#     CORS(app, supports_credentials=True)
#     # 블루프린트
# # --------------------------------------------------------------------------- #
#     from .views import auth, main, cardgame, share, bookmark, details, json_update
#     app.register_blueprint(auth.bp)
#     app.register_blueprint(main.bp)
#     app.register_blueprint(cardgame.bp)
#     app.register_blueprint(share.bp)
#     app.register_blueprint(bookmark.bp)
#     app.register_blueprint(details.bp)
#     app.register_blueprint(json_update.bp)


#     app.config['JWT_SECRET_KEY'] = 'fashion'
#     app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
#     app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(hours=20)


#     jwt = JWTManager(app)
#     bcrypt = Bcrypt(app)

#     # Flasgger
#     app.config["SWAGGER"] = {"title": "오늘옷데 API", "openapi": "3.0.2"}

#     swagger_config = {
#         "headers": [],
#         "specs": [
#             {
#                 "endpoint": "apispec",
#                 "route": "/apispec.json"
#             }
#         ],
#         "static_url_path": "/flasgger_static",
#         "swagger_ui": True,
#         "specs_route": "/swagger/"
#     }

#     swagger_template = {
#         "components": {
#             "securitySchemes": {
#                 "ApiKeyAuth": {
#                     "type": "apiKey",
#                     "in": "header",
#                     "name": "Authorization"
#                 }
#             },
#             'security':[{
#                 'ApiKeyAuth': []
#             }]
#         }
#     }
#     app.json_encoder = LazyJSONEncoder
#     swagger = Swagger(app, config=swagger_config, template=swagger_template)

#     return app



# 현재 위치를 RESISTER로.
# export FLASK_APP=app
# export FLASK_ENV=development
# export LANG=C.UTF-8
# flask run


from celery import Celery
def make_celery(app_name=__name__):
    redis_uri = "redis://localhost:6379"
    return Celery(app_name, backend=redis_uri, broker=redis_uri)
celery = make_celery()