from fashion import db
from sqlalchemy import ForeignKey, DateTime, Column, Integer, String, DATE, Text, func, Boolean, Float, Table
from sqlalchemy.orm import relationship, backref


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
class SearchKeyword(db.Model):
    __tablename__:'search_keyword'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    keyword = Column(String(256), nullable=False)
    count = Column(Integer, nullable=False)


#상품 테이블(키워드 포함)
class Product(db.Model):
    __tablename__:'product'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    asin = Column(String(256), unique=True, primary_key=True)
    title = Column(Text(16000000), nullable=False)
    price = Column(Float, nullable=True)
    rating = Column(Float, nullable=True)
    shared = Column(Integer, nullable=False, default=0)


class ProductKeyword(db.Model):
    __tablename__:'product_keyword'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    asin = Column(String(256), nullable=False)
    type_keyword=Column(String(256), nullable=False)
    product_keyword = Column(Text(16000000), nullable=True) # 제품키워드

class ProductReview(db.Model):
    __tablename__:'product_review'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    asin = Column(String(256))

    positive_review_number = Column(Integer, nullable=False, default=0) # 긍정 리뷰 수
    negative_review_number = Column(Integer, nullable=False, default=0) # 부정 리뷰 수

    positive_review_summary = Column(Text(16000000), nullable=True) # 긍정 리뷰 요약
    negative_review_summary = Column(Text(16000000), nullable=True) #부정 리뷰 요약


class ProductUserPlayed(db.Model):
    __tablename__:'product_user_played'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)

    asin = Column(String(256), ForeignKey('product.asin', ondelete='cascade'))
    user_id = Column(Integer, ForeignKey('user.id', ondelete='cascade'))

    love_or_hate = Column(Integer)


class Bookmark(db.Model):
    __tablename__:'bookmark'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)

<<<<<<< HEAD
    asin = Column(String(256), nullable=False)
    user_id = Column(Integer, nullable=False)
=======
    asin = Column(String(256), ForeignKey('product.asin', ondelete='cascade'))
    user_id = Column(Integer, ForeignKey('user.id', ondelete='cascade'))
    date = Column(DATE)


class Share(db.Model):
    __tablename__:'share'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)

    asin = Column(String(256), ForeignKey('product.asin', ondelete='cascade'))
    user_id = Column(Integer, ForeignKey('user.id', ondelete='cascade'))
    shared_date = Column(DATE)



#계단식 삭제일 때는 , passive_deletes=True도 붙여야 한다.
>>>>>>> 2b643f11e405d68fc144084c2f546981825ab2b6
