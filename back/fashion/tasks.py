# 인공지능 비동기 처리
# from celery import Celery

# celery = Celery('tasks', broker='redis://localhost:6379/0', backend='redis://localhost:6379/0')

# def make_celery():
#     celery = Celery(__name__, broker='redis://localhost:6379/0', backend='redis://localhost:6379/0')
#     return celery

# def make_celery(app):
#     celery = Celery(
#         __name__,
#         backend='redis://localhost:6379',
#         broker='redis://localhost:6379'
#     )
#     celery.conf.update(app.config)

#     class ContextTask(celery.Task):
#         def __call__(self, *args, **kwargs):
#             with app.app_context():
#                 return self.run(*args, **kwargs)

#     celery.Task = ContextTask
#     return celery

# Initialize Celery
# app = Celery('tasks', broker='redis://localhost:6379/0', backend='redis://localhost:6379/0')
# celery.conf.update(app.config)
