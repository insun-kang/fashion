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

bp = Blueprint('closet', __name__, url_prefix='/')


@bp.route('/closet', methods=['POST'])
@jwt_required()
@swag_from('../swagger_config/closet.yml')
def Closet():
    if not request.is_json:
        return error_code.missing_json_error

    else:
        body=request.get_json()

        catagory=body['catagory']

        header = request.headers.get('Authorization')

        user_id = decode_token(header[7:] , csrf_value = None , allow_expired = False)['sub']

        bookmark=models.Bookmark.query.filter_by(user_id=user_id).all()

        catagories=[]

        

        for i in bookmark:
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

            #card['nlpResults'], card['posReveiwRate'], card['negReviewRate']
            review = models.ProductReview.query.filter_by(asin=asin).first()

            #catagory
            keyword=models.ProductKeyword.query.filter_by(asin=asin, type_keyword='catagory').all()
            for i in keyword:
                if i.type_keyword not in catagories:
                    catagories.append(i.type_keyword)

            card['keywords']=keywords
            card['asin']=asin
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
            
                card['posReveiwRate']=0
            else:
                card['nlpResults']={
                                    'posReviewSummary': review.positive_review_summary, 
                                    'negReviewSummary': review.negative_review_summary
                                    }
                card['posReveiwRate']=review.positive_review_number/(review.positive_review_number+review.negative_review_number)                        
            card['starRating']=product.rating
            card['image']=address_format.img(asin)
            card['productUrl']=address_format.product(asin)
            card['title']=product.title
            
            cards.append(card)
        
        return {'cards':cards, 'catagory': catagories}, 200
