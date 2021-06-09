import os


BASE_DIR = os.path.dirname(__file__)

SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:@localhost:3306/fashion'.format(os.path.join(BASE_DIR, 'fashion.db'))
SQLALCHEMY_TRACK_MODIFICATIONS = False

CLIENT_ID = "4a3d0a9c3e37f3f000598e652cc812d1"
CLIENT_SECRET = "3pdc4f1198f759Ey4yFPR24198f759ZzO"
REDIRECT_URI = "http://localhost:5000/oauth"