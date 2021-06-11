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
def search():
    if not request.is_json:
        return error_code.missing_json_error

    else:
        body=request.get_json()

        keyword=body['keyword']
        existing_keywords=body['existingKeywords']  #array

        return_keywords=[]

        search = "{}%".format(keyword.lower())
        find_keyword=models.SearchKeyword.query.filter(models.SearchKeyword.keyword.like(search)).all()

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



        if len(keyword) == 0:
            return {'msg': "You haven't entered anything", 'keywords': return_keywords}, 200

        if len(find_keyword) == 0:
            return {'msg': 'No results were found for your search', 'keywords': return_keywords}, 200

        if not existing_keywords:
            for i in find_keyword:
                return_keywords.append((i.keyword))
            return {'msg': 'success', 'keywords': return_keywords}, 200

        else:
            for i in find_keyword:
                if i.keyword not in existing_keywords:
                    return_keywords.append((i.keyword))
            return {'msg': 'success', 'keywords': return_keywords}, 200


@bp.route('/result-search', methods=['POST'])
@jwt_required()
@swag_from('../swagger_config/result_search.yml')
def result_search():
    if not request.is_json:
        return error_code.missing_json_error

    else:
        body=request.get_json()


        request_history=body['requestHistory']  #array
        data_size=body['dataSize']
 
        existing_keywords=body['existingKeywords']  #array

        header = request.headers.get('Authorization')

        user_id = decode_token(header[7:] , csrf_value = None , allow_expired = False)['sub']


        size=len(existing_keywords)

        cards=[]

        offset_num = sum(request_history)
        limit_num = data_size
        
        
        #limit, offset
        asin_ids = models.db.session.query(models.ProductKeyword.asin_id, models.func.count(models.ProductKeyword.product_keyword))\
        .filter(models.ProductKeyword.product_keyword.in_(existing_keywords))\
        .group_by("asin_id")\
        .having(models.func.count(models.ProductKeyword.product_keyword)<=size)\
        .offset(offset_num)\
        .limit(limit_num)\
        .all()

        filtered = [1,8,32768,65620,65633,65674,65841,65920,33241,66027,33316,66110,33349,
        66175,33497,33557,33566,33694,2304,3072,611,1479,2426,2839,3235,3660,3661,3662,914,3454,
        7392,5554,999,2302,2123,6896,2258,2259,2433,4121,4609,6092,6296,6415,6419]

        for i in asin_ids:
            if i.asin_id not in filtered:
                asin_id=i.asin_id
                card={}
                keywords=[]
                #card['keywords']
                keywords = list(set([product_keyword.product_keyword for product_keyword in models.ProductKeyword.query.filter_by(asin_id=asin_id).all()]))
                # keywords_by_asin=models.db.session.query(models.ProductKeyword.product_keyword).filter_by(asin_id=asin_id).all()

                #card['price'],card['title']
                product=models.Product.query.filter_by(id=asin_id).first()
                #card['bookmark']
                bookmark = models.Bookmark.query.filter_by(user_id=user_id, asin_id=asin_id).first()

                #card['nlpResults'], card['posReveiwRate'], card['negReviewRate']
                review = models.ProductReview.query.filter_by(asin_id=asin_id).first()

                card['keywords']=(keywords if len(keywords) <=6 else keywords[:6])
                # card['keywords']=literal_eval(str(keywords_by_asin))
                card['asin']=product.id
                card['price']=product.price
                if not bookmark:
                    card['bookmark']=False
                else:
                    card['bookmark']=True
                if not review:
                    card['nlpResults']={
                                    'posReviewSummary': 'Oh no....there is no positive review at all...;(',
                                    'negReviewSummary': 'OMG! There is no negative review at all!;)'
                    }
                    card['posReveiwRate']= 0
                else:
                    card['nlpResults']={
                                    'posReviewSummary': review.positive_review_summary if review.positive_review_summary else 'Oh no....there is no positive review at all...;(',
                                    'negReviewSummary': review.negative_review_summary if review.negative_review_summary else 'OMG! There is no negative review at all!;)'
                    }
                    card['posReveiwRate'] = round(review.positive_review_number/(review.positive_review_number+review.negative_review_number),2)
                card['starRating']=round(product.rating,2)
                card['image']=address_format.img(product.asin)
                card['productUrl']=address_format.product(product.asin)
                card['title']=product.title

                cards.append(card)

        return {'cards':cards}, 200


# select asin, asin_id, count(product_keyword) as count from product_keyword
# where product_keyword="black" or product_keyword="red" group by asin having count = 2;
