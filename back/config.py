import os


BASE_DIR = os.path.dirname(__file__)

SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:@localhost:3306/fashion'.format(os.path.join(BASE_DIR, 'fashion.db'))
SQLALCHEMY_TRACK_MODIFICATIONS = False
