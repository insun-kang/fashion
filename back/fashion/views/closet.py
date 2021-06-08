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


@bp.route('/closet', methods=['GET'])
@jwt_required()
@swag_from('../swagger_config/closet.yml')
def closet():

    header = request.headers.get('Authorization')

    user_id = decode_token(header[7:] , csrf_value = None , allow_expired = False)['sub']

    bookmark=models.Bookmark.query.filter_by(user_id=user_id).all()

    data={}
    
    for i in bookmark:
        cards=[]
        asin_id=i.asin_id
        card={}
        keywords=[]

        #card['keywords']
        asin=models.ProductKeyword.query.filter_by(asin_id=asin_id).all()
        for j in asin:
            keywords.append(j.product_keyword)
            catagory=j.catagory
        #card['price'],card['title']
        product=models.Product.query.filter_by(id=asin_id).first()
        #card['bookmark']
        bookmark = models.Bookmark.query.filter_by(user_id=user_id, asin_id=asin_id).first()

        #card['nlpResults'], card['posReveiwRate'], card['negReviewRate']
        review = models.ProductReview.query.filter_by(asin_id=asin_id).first()

        card['keywords']=keywords
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


        if catagory == 'overall':
            data['overall']=[cards]
        elif catagory == 'top':
            data['top']=[cards]
        elif catagory == 'bottom':
            data['bottom']=[cards]
        else:
            data['etc']=[cards]
    

    return { 'data':data, 'catagories': ['overall','top','bottom','etc']}, 200


