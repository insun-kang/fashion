import os


BASE_DIR = os.path.dirname(__file__)

SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:@localhost:3306/fashion'.format(os.path.join(BASE_DIR, 'fashion.db'))
SQLALCHEMY_TRACK_MODIFICATIONS = False

CLIENT_ID = "ffdcddd25e03578e6a58136ef5d458fe"
CLIENT_SECRET = "s30Zo9BY2PP0vUJ8H5xDTPriw91GILqm"
REDIRECT_URI = "https://localhost.com"