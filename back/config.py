import os


BASE_DIR = os.path.dirname(__file__)

SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:@localhost:3306/fashion'.format(os.path.join(BASE_DIR, 'fashion.db'))
SQLALCHEMY_TRACK_MODIFICATIONS = False

CLIENT_ID = "4a3d0a9c3e37f3f000598e652cc812d1"
CLIENT_SECRET = "Wvho5T5rqQc7c2OZtvfifqyFlvbG7bXF"
REDIRECT_URI = "http://elice-kdt-ai-track-vm-distribute-21.koreacentral.cloudapp.azure.com:3000/"