def init_celery(celery, app):
    celery.conf.update(task_serializer='json',
                        accept_content=['json'],	# JSON을 제외한 다른 content 설정들은 무시
                        result_serializer='json',
                        timezone='Asia/Seoul',
                        enable_utc=True,)
    TaskBase = celery.Task
    class ContextTask(TaskBase):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)
    celery.Task = ContextTask