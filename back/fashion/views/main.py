from flask import Blueprint, jsonify
from flask import Flask, request
import bcrypt
from flask_cors import CORS
from .. import models
from . import checkvalid
from datetime import datetime, timedelta
from flask_jwt_extended import (JWTManager, jwt_required, create_access_token, decode_token,
                                get_jwt_identity, unset_jwt_cookies, create_refresh_token)

# Flasgger
from flasgger.utils import swag_from
from .. import error_code
from .. import address_format
from ast import literal_eval
bp = Blueprint('main', __name__, url_prefix='/')


@bp.route('/search', methods=['POST'])
@swag_from('../swagger_config/search.yml')
def Search():
    if not request.is_json:
        return error_code.missing_json_error

    else:
        body=request.get_json()

        keyword=body['keyword']
        existing_keywords=body['existingKeywords']  #array

        return_keywords=[]

        search = "{}%".format(keyword.lower())
        find_keyword=models.db.session.query(models.SearchKeyword.keyword).filter(models.SearchKeyword.keyword.like(search)).all()

        #이스터애그
        if keyword=='dayong':
            # return {'msg': "신성하게 남다르게 강인하게 황송하게(황정하게) 이게 다인가 싶을 때 김건우, 이범석(코치님들) 화이팅", 'keywords': '혼내기 담당: 남나영'}, 200
            return '혼내기 담당: 남나영'
        elif keyword=='dain':
            # return {'msg': "신성하게 남다르게 강인하게 황송하게(황정하게) 이게 다인가 싶을 때 김건우, 이범석(코치님들) 화이팅", 'keywords': '쪼렙 담당: 김하인'}, 200
            return '쪼렙 담당: 김하인'
        elif keyword=='jongwoo':
            # return {'msg': "신성하게 남다르게 강인하게 황송하게(황정하게) 이게 다인가 싶을 때 김건우, 이범석(코치님들) 화이팅", 'keywords': '밤새기 담당: 패션황'}, 200
            return '밤새기 담당: 패션황'
        elif keyword=='sinsung':
            # return {'msg': "신성하게 남다르게 강인하게 황송하게(황정하게) 이게 다인가 싶을 때 김건우, 이범석(코치님들) 화이팅", 'keywords': '리더 담당: 홀리킴'}, 200
            return '리더 담당: 홀리킴'
        elif keyword== 'insun':
            # return {'msg': "신성하게 남다르게 강인하게 황송하게(황정하게) 이게 다인가 싶을 때 김건우, 이범석(코치님들) 화이팅", 'keywords': '인성 담당: 강인성'}, 200
            return '인성 담당: 강인성'

        if not keyword:
            return {'msg': "You haven't entered anything", 'keywords': return_keywords}, 200
        
        if not find_keyword:
            return {'msg': 'No results were found for your search', 'keywords': return_keywords}, 200

        if not existing_keywords:
            return {'msg': 'success', 'keywords': literal_eval(str(find_keyword))}, 200

        else:
            return {'msg': 'success', 'keywords': literal_eval(str(find_keyword))}, 200

@bp.route('/result-search', methods=['POST'])
@jwt_required()
@swag_from('../swagger_config/result_search.yml')
def ResultSearch():
    if not request.is_json:
        return error_code.missing_json_error

    else:
        body=request.get_json()

        page_num=body['pageNum']
        data_size=body['dataSize']
        existing_keywords=body['existingKeywords']  #array

        header = request.headers.get('Authorization')

        user_id = decode_token(header[7:] , csrf_value = None , allow_expired = False)['sub']


        size=len(existing_keywords)

        cards=[]
        
        #limit, offset
        asin_ids = models.db.session.query(models.ProductKeyword.asin_id, models.func.count(models.ProductKeyword.product_keyword))\
        .filter(models.ProductKeyword.product_keyword.in_(existing_keywords))\
        .group_by("asin_id")\
        .having(models.func.count(models.ProductKeyword.product_keyword)<=size)\
        .offset(page_num*data_size)\
        .limit(data_size)\
        .all()

        

        
        for i in asin_ids:
            
            asin_id=i.asin_id
            card={}
            keywords=[]
            #card['keywords']
            keywords_by_asin=models.db.session.query(models.ProductKeyword.product_keyword).filter_by(asin_id=asin_id).all()
            
            #card['price'],card['title']
            product=models.Product.query.filter_by(id=asin_id).first()
            #card['bookmark']
            bookmark = models.Bookmark.query.filter_by(user_id=user_id, asin_id=asin_id).first()

            #card['nlpResults'], card['posReveiwRate'], card['negReviewRate']
            review = models.ProductReview.query.filter_by(asin_id=asin_id).first()


            card['keywords']=literal_eval(str(keywords_by_asin))
            card['asin']=product.id
            card['price']=product.price
            if not bookmark:
                card['bookmark']=False
            else:
                card['bookmark']=True
            if not review:
                card['nlpResults']={
                                'posReviewSummary': review.positive_review_summary if review.positive_review_summary else 'Oh no....there is no positive review at all...;(',
                                'negReviewSummary': review.negative_review_summary if review.negative_review_summary else 'OMG! There is no negative review at all!;)'
                }
            
                card['posReveiwRate']=0
            else:
                card['nlpResults']={
                                'posReviewSummary': review.positive_review_summary if review.positive_review_summary else 'Oh no....there is no positive review at all...;(',
                                'negReviewSummary': review.negative_review_summary if review.negative_review_summary else 'OMG! There is no negative review at all!;)'
                }
            card['posReveiwRate']=round(review.positive_review_number/(review.positive_review_number+review.negative_review_number),2)                        
            card['starRating']=round(product.rating,2)
            card['image']=address_format.img(product.asin)
            card['productUrl']=address_format.product(product.asin)
            card['title']=product.title
            
            cards.append(card)
        
        return {'cards':cards}, 200


# select asin, asin_id, count(product_keyword) as count from product_keyword 
# where product_keyword="black" or product_keyword="red" group by asin having count = 2;

