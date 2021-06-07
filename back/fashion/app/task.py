from app import celery
@celery.task()
def make_file(fname, content):
    with open(fname, content):
        f.write(content)