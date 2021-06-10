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

bp = Blueprint('share', __name__, url_prefix='/')

@bp.route('/share', methods=['POST'])
@jwt_required()
@swag_from('../swagger_config/share.yml')
def share():
    if not request.is_json:
        return error_code.missing_json_error

    else:
        try:
            body = request.get_json()

            asin_ids = body['asins'] #array
            header = request.headers.get('Authorization')

            user_id = decode_token(header[7:] , csrf_value = None , allow_expired = False)['sub']


            for asin_id in asin_ids:
                product = models.Product.query.filter_by(id=asin_id).first()

                shared=product.shared

                share = models.Share(
                        asin_id=asin_id,
                        user_id=user_id,
                        shared_date=datetime.now()
                    )

                models.db.session.add(share)
                models.db.session.commit()

                product.shared = shared+1
                models.db.session.commit()

            return {'msg' : 'Share success'}, 200
        except:
            return error_code.failed_try

@bp.route('/shared-page', methods=['POST'])
@swag_from('../swagger_config/shared_page.yml')
def shared_page():
    try:
        body = request.get_json()

        asin_ids = body['asins'] #array

        cards=[]
        for asin_id in asin_ids:
            card={}
            keywords=[]
            #card['keywords']
            # keywords_by_asin=models.db.session.query(models.ProductKeyword.product_keyword).filter_by(asin_id=asin_id).all()
            keywords = list(set([product_keyword.product_keyword for product_keyword in models.ProductKeyword.query.filter_by(asin_id=asin_id).all()]))

            #card['price'],card['title']
            product=models.Product.query.filter_by(id=asin_id).first()

            #card['nlpResults'], card['posReveiwRate'], card['negReviewRate']
            review = models.ProductReview.query.filter_by(asin_id=asin_id).first()

            card['keywords']=(keywords if len(keywords) <=6 else keywords[:6])
            # card['keywords']=literal_eval(str(keywords_by_asin))
            card['asin']=product.id
            card['price']=product.price
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
        return {'cards': cards, 'msg' : 'Loading success'}, 200
    except:
        return error_code.failed_try
