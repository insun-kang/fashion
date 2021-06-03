from flask import Blueprint
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
        find_keyword=models.SearchKeyword.query.filter(models.SearchKeyword.keyword.like(search)).all()

        if not keyword:
            return {'msg': "You haven't entered anything", 'keywords': return_keywords}, 200
        
        if not find_keyword:
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
        asins = models.db.session.query(models.ProductKeyword.asin, models.func.count(models.ProductKeyword.product_keyword))\
        .filter(models.ProductKeyword.product_keyword.in_(existing_keywords))\
        .group_by("asin")\
        .having(models.func.count(models.ProductKeyword.product_keyword)<=size)\
        .offset(page_num)\
        .limit(data_size)\
        .all()

        
        for i in asins:
            asin=i.asin
            card={}
            keywords=[]
            
            #card['keywords']
            keywords_by_asin=models.ProductKeyword.query.filter_by(asin=asin).all()
            for keyword in keywords_by_asin:
                if keyword not in keywords:
                    keywords.append(keyword.product_keyword)
            #card['price'],card['title']
            product=models.Product.query.filter_by(asin=asin).first()

            #card['bookmark']
            bookmark = models.Bookmark.query.filter_by(user_id=user_id, asin=asin).first()

            card['keywords']=keywords
            card['asin']=asin
            card['price']=product.price
            if not bookmark:
                card['bookmark']=False
            else:
                card['bookmark']=True
            card['nlpResults']={'posReviewSummary': 0, 'negReviewSummary':0}
            card['starRating']=product.rating
            card['posReveiwRate']=0
            card['negReviewRate']=0
            card['image']=address_format.img(asin)
            card['productUrl']=address_format.product(asin)
            card['title']=product.title
            
            cards.append(card)

        return {'cards':cards}


# select asin, count(product_keyword) as count from product_keyword 
# where product_keyword="black" or product_keyword="red" group by asin having count = 2;

