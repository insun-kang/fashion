from back import db
from sqlalchemy import ForeignKey, DateTime, Column, Integer, String, DATE, Text
# from flask.ext.mongoalchemy  import  MongoAlchemy


class User(db.Model):  # usertable
    __tablename__ = 'user'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    nickname = Column(String(64), primary_key=True, unique=True)
    email = Column(String(64), unique=True)
    name = Column(String(32), nullable=False)
    pw = Column(String(64), nullable=False)
    birth=Column(DATE, nullable=False)
    gender = Column(String(32), nullable=False)
    date = Column(DATE, nullable=False)

    

