from flask import Blueprint
from flask import Flask, request
import bcrypt
from flask_cors import CORS
from .. import models
from . import checkvalid
from datetime import datetime, timedelta
from flask_jwt_extended import (JWTManager, jwt_required, create_access_token, decode_token,
                                get_jwt_identity, unset_jwt_cookies, create_refresh_token)
from ast import literal_eval

# Flasgger
from flasgger.utils import swag_from
from .. import error_code
from .. import address_format

bp = Blueprint('details', __name__, url_prefix='/')

@bp.route('/details', methods=['POST'])
@swag_from('../swagger_config/details.yml')
def Details():
    if not request.is_json:
        return error_code.missing_json_error

    else:
        body=request.get_json()

        asin_id=body['asin']

            
        datas={}
        keywords=[]

        now=datetime.now()

        #card['keywords']
        keywords_by_asin=models.ProductKeyword.query.filter_by(asin_id=asin_id).all()

        for keyword in keywords_by_asin:
            if keyword not in keywords:
                keywords.append(keyword.product_keyword)

        #card['price'],card['title']
        product = models.Product.query.filter_by(id=asin_id).first()

        #card['bookmark'], date, count
        bookmark = models.Bookmark.query.filter_by(asin_id=asin_id).all()
        bookmark_count=len(bookmark)
        bookmark_date=[]
        if bookmark is not None:
            for i in bookmark:
                if i.date + timedelta(weeks=1) > datetime.date(now):
                    bookmark_date.append(i.date)


        #datas['share'], date, count
        share = models.Share.query.filter_by(asin_id=asin_id).all()
        share_count=len(share)
        share_date=[]
        if share is not None:
            for i in share:
                if i.shared_date + timedelta(weeks=1) > datetime.date(now):
                    share_date.append(i.shared_date)

        # card['nlpResults'], card['posReveiwRate'], card['negReviewRate'], number
        review = models.ProductReview.query.filter_by(asin_id=asin_id).first()


        datas['keywords']=keywords
        datas['asin']=asin_id
        datas['price']=product.price
        if not review:
            datas['nlpResults']={
                            'posReviewSummary': 'Oh no....there is no positive review at all...;(',
                            'negReviewSummary': 'OMG! There is no negative review at all!;)'
            }
            datas['posReveiwRate']= 0
        else:
            datas['nlpResults']={
                            'posReviewSummary': review.positive_review_summary if review.positive_review_summary else 'Oh no....there is no positive review at all...;(',
                            'negReviewSummary': review.negative_review_summary if review.negative_review_summary else 'OMG! There is no negative review at all!;)'
            }
            datas['posReveiwRate'] = round(review.positive_review_number/(review.positive_review_number+review.negative_review_number),2)
        datas['positive_review_number']=review.positive_review_number   
        datas['negative_review_number']=review.negative_review_number    

        datas['starRating']=product.rating
        datas['image']=address_format.img(product.asin)
        datas['productUrl']=address_format.product(product.asin)
        datas['title']=product.title
        datas['bookmark_date']=bookmark_date
        datas['bookmark_count']=bookmark_count
        datas['share_date']= share_date
        datas['share_count']=share_count
        
        return {'datas':datas}, 200
            