from fashion import db
from sqlalchemy import ForeignKey, DateTime, Column, Integer, String, DATE, Text, func, Boolean, Float
from sqlalchemy.orm import relationship

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

    products_user_played = relationship("ProductUserPlayed")
    bookmarks = relationship("Bookmark")


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
    asin = Column(String(256), nullable=False, ForeignKey('product_keyword.asin'))
    title = Column(Text(16000000), nullable=False)
    price = Column(Float, nullable=True)
    rating = Column(Float, nullable=True)
    shared = Column(Integer, nullable=False, default=0)

    # product_keyword 1:n
    product_keywords = relationship("ProductKeyword")

    # product_review 1:1
    product_review = relationship("ProductReview", back_populates="product")

    # productUserPlayed m:n
    products_user_played = relationship("ProductUserPlayed",secondary=product_product_user_played)

    # bookmark m:n관계
    bookmarks = relationship("Bookmark",secondary=product_bookmark)

product_product_user_played = Table('product_product_user_played',
                            Base.metadata,
                            Column('product_id', Integer, ForeignKey('product.id')),
                            Column('product_user_played_id', Integer, ForeignKey('product_user_played.id')) )

product_bookmark = Table('product_bookmark',
                    Base.metadata,
                    Column('product_id', Integer, ForeignKey('product.id')),
                    Column('bookmark_id', Integer, ForeignKey('bookmark.id')) )

class ProductKeyword(db.Model):
    __tablename__:'product_keyword'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    asin = Column(String(256), nullable=False, ForeignKey('product.asin'))
    type_keyword=Column(String(256), nullable=False)
    product_keyword = Column(Text(16000000), nullable=True) # 제품키워드

class ProductReview(db.Model):
    __tablename__:'product_review'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    asin = Column(String(256), nullable=False)

    positive_review_number = Column(Integer, nullable=False, default=0) # 긍정 리뷰 수
    negative_review_number = Column(Integer, nullable=False, default=0) # 부정 리뷰 수

    positive_review_summary = Column(Text(16000000), nullable=True) # 긍정 리뷰 요약
    negative_review_summary = Column(Text(16000000), nullable=True) #부정 리뷰 요약

    product = relationship("Product", back_populates="product_review", uselist=False)


class ProductUserPlayed(db.Model):
    __tablename__:'product_user_played'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)

    asin = Column(String(256), nullable=False)
    user_id = Column(Integer, nullable=False, ForeignKey('user.id'))

    love_or_hate = Column(Boolean, nullable=False, default=0)


class Bookmark(db.Model):
    __tablename__:'bookmark'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)

    asin = Column(String(256), nullable=False)
    user_id = Column(Integer, nullable=False, ForeignKey('user.id'))
    date = Column(DATE, nullable=False)
