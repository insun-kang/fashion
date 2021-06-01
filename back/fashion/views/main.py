from flask import Blueprint
from flask import Flask, request
import bcrypt
from flask_cors import CORS
from .. import models
from . import checkvalid
from datetime import datetime, timedelta
from flask_jwt_extended import (JWTManager, jwt_required, create_access_token,
                                get_jwt_identity, unset_jwt_cookies, create_refresh_token)
from sqlalchemy import func


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

@bp.route('/result-search', methods=['GET','POST'])
@swag_from('../swagger_config/result_search.yml')
def ResultSearch():
    if request.method =='GET':
        #초기에는 게임 결과순
        #검색시에는 긍정 높은순
        return None

    
    else:
        body=request.get_json()

        count=body['count']
        data_num=body[dataNum]
        existing_keywords=body['existingKeywords']  #array

        size=len(existing_keywords)

        cards=[]
        
        asins = models.db.session.query(models.ProductKeyword.asin, models.func.count(models.ProductKeyword.product_keyword).label('cnt')).filter(
            models.ProductKeyword.product_keyword.in_(existing_keywords)).group_by(models.ProductKeyword.asin)
        
        for i in asins[(count-1)*data_num:count*data_num]:
            asin=i.asin
            card={}
            keywords=[]
            
            #card['keywords']
            keywords_by_asin=models.ProductKeyword.query.filter_by(asin=asin).all()
            for keyword in keywords_by_asin:
                keywords.append(keyword.product_keyword)
            #card['price'],card['title']
            product=models.Product.query.filter_by(asin=asin).first()

            card['keywords']=keywords
            card['asin']=asin
            card['price']=product.price
            card['bookmark']=0
            card['nlpResults']={'posReviewSummary': 0, 'negReviewSummary':0}
            card['starRating']=product.rating
            card['posReveiwRate']=0
            card['negReviewRate']=0
            card['image']=address_format.img(asin)
            card['productUrl']=address_format.product(asin)
            card['title']=product.title
            
            cards.append(card)
            

        return {'cards' : cards}


# select asin, count(product_keyword) as count from product_keyword 
# where product_keyword="black" or product_keyword="red" group by asin having count = 2;

