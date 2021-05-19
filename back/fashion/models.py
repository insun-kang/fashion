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

#count가 큰 50개의 키워드를 뽑아 검색에 사용할 테이블
class Keyword(db.Model):
    __tablename__:'keyword'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    keyword = Column(String(256), nullable=False)
    count = Column(Integer, nullable=False)


#상품과 키워드를 매칭시켜서 저장하는 테이블(asion과 키워드를 매칭하면 될듯??)
class Product_keyword_match(db.Model):
    __tablename__:'product_keyword_match'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    asin= Column(String(256), nullable=False)
    product_keyword = Column(Text(16000000), nullable=True)#제품키워드
    good_review_keyword = Column(Text(16000000), nullable=True)#긍정키워드
    bad_review_keyword = Column(Text(16000000), nullable=True)#부정키워드
    rating = Column(Integer)



#게임을 통해 얻어진 키워드를 유저와 매칭시켜주는 테이블(일대일로 매칭시켜주고 count를 해줘서 많은 키워드를 가져오면 될듯)
class Preferred_keyword(db.Model):
    __tablename__:'preferred_keyword'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    id = Column(Integer, primary_key=True, autoincrement=True)
    userid= Column(Integer)
    keyword = Column(String(256), nullable=True)


