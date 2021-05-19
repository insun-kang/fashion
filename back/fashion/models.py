from fashion import db
from sqlalchemy import ForeignKey, DateTime, Column, Integer, String, DATE, Text

class User(db.Model):  # usertable
    __tablename__ = 'user'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    nickname = Column(String(64), unique=True)
    email = Column(String(64), unique=True)
    name = Column(String(100), nullable=False)
    pw = Column(String(64), nullable=False)
    birth=Column(DATE, nullable=False)
    gender = Column(String(32), nullable=False)
    sign_up_date = Column(DATE, nullable=False)


class Keyword(db.Model):
    __tablename__:'keyword'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    userid = Column(Integer)
    keyword = Column(Text(4294000000), nullable=True )

