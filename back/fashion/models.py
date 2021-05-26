from fashion import db
from sqlalchemy import ForeignKey, DateTime, Column, Integer, String, DATE, Text

class User(db.Model):  # usertable
    __tablename__ = 'user'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    nickname = Column(String(64), unique=True)
    email = Column(String(320), unique=True)
    name = Column(String(500), nullable=False)
    pw = Column(String(64), nullable=False)
    birth = Column(DATE, nullable=False)
    sign_up_date = Column(DATE, nullable=False)


#count가 큰 50개의 키워드를 뽑아 검색에 사용할 테이블
class Keyword(db.Model):
    __tablename__:'keyword'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    keyword = Column(String(256), nullable=False)
    count = Column(Integer, nullable=False)


#상품 테이블(키워드 포함)
class Product(db.Model):
    __tablename__:'product'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    asin = Column(String(256), nullable=False)
    title = Column(Text(16000000), nullable=False)
    brand = Column(String(1024), nullable=True)
    price = Column(Integer, nullable=False)
    rating = Column(Integer)
    shared = Column(Integer, nullable=False, default=0)


class Productkeyword(db.Model):
    __tablename__:'Productkeyword'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    asin = Column(String(256), nullable=False)
    product_keyword = Column(Text(16000000), nullable=True)#제품키워드
    good_review_keyword = Column(Text(16000000), nullable=True)#긍정키워드
    bad_review_keyword = Column(Text(16000000), nullable=True)#부정키워드
