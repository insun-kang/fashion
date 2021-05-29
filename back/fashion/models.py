from fashion import db
<<<<<<< HEAD
from sqlalchemy import ForeignKey, DateTime, Column, Integer, String, DATE, Text
=======
from sqlalchemy import ForeignKey, DateTime, Column, Integer, String, DATE, Text, func, Boolean, Float
>>>>>>> feature_UI/UX

class User(db.Model):  # usertable
    __tablename__ = 'user'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    nickname = Column(String(64), unique=True)
    email = Column(String(320), unique=True)
    name = Column(String(500), nullable=False)
    pw = Column(String(64), nullable=False)
    birth = Column(DATE, nullable=False)
<<<<<<< HEAD
    gender = Column(String(32), nullable=False)
=======
>>>>>>> feature_UI/UX
    sign_up_date = Column(DATE, nullable=False)


#count가 큰 50개의 키워드를 뽑아 검색에 사용할 테이블
<<<<<<< HEAD
class Keyword(db.Model):
    __tablename__:'keyword'
=======
class SearchKeyword(db.Model):
    __tablename__:'search_keyword'
>>>>>>> feature_UI/UX
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
<<<<<<< HEAD
    brand = Column(String(1024), nullable=True)
    price = Column(Integer, nullable=False)
    rating = Column(Integer)

    product_keyword = Column(Text(16000000), nullable=True)#제품키워드
    good_review_keyword = Column(Text(16000000), nullable=True)#긍정키워드
    bad_review_keyword = Column(Text(16000000), nullable=True)#부정키워드



#게임을 통해 얻어진 키워드를 유저와 매칭시켜주는 테이블(일대일로 매칭시켜주고 count를 해줘서 많은 키워드를 가져오면 될듯)
class Preferred_keyword(db.Model):
    __tablename__:'preferred_keyword'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    userid = Column(Integer)
    keyword = Column(String(256), nullable=True)
=======
    price = Column(Float, nullable=True)
    rating = Column(Float, nullable=True)
    shared = Column(Integer, nullable=False, default=0)


class ProductKeyword(db.Model):
    __tablename__:'product_keyword'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    asin = Column(String(256), nullable=False)
    type_keyword=Column(String(256), nullable=False)
    product_keyword = Column(Text(16000000), nullable=True)#제품키워드


class ProductReview(db.Model):
    __tablename__:'product_review'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    asin = Column(String(256), nullable=False)

    positive_review_number = Column(Integer, nullable=False, default=0) # 긍정 리뷰 수
    negative_review_number = Column(Integer, nullable=False, default=0) # 부정 리뷰 수

    positive_review_summary = Column(Text(16000000), nullable=True) # 긍정 리뷰 요약
    negative_review_summary = Column(Text(16000000), nullable=True) #부정 리뷰 요약


class ProductUserPlayed(db.Model):
    __tablename__:'product_user_played'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)

    asin = Column(String(256), nullable=False)
    user_id = Column(Integer, nullable=False)

    love_or_hate = Column(Boolean, nullable=False, default=0)


class Bookmark(db.Model):
    __tablename__:'bookmark'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)

    asin = Column(String(256), nullable=False)
    user_id = Column(Integer, nullable=False)
>>>>>>> feature_UI/UX
