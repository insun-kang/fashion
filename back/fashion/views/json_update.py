from flask import Blueprint
from flask import Flask, request
import bcrypt
from flask_cors import CORS
from fashion import models

from sqlalchemy.sql.expression import func
import random
# Flasgger
from flasgger.utils import swag_from
from fashion import error_code
from fashion import address_format
import json
import os

# 인공지능
import pandas as pd
from surprise import SVD, accuracy # SVD model, 평가
from surprise import Reader, Dataset # SVD model의 dataset

# from .. import tasks
# celery = tasks.make_celery()

# from celery import Celery
# celery = Celery(__name__, broker='redis://localhost:6379/0', backend='redis://localhost:6379/0')

from fashion.__init__ import celery

# @app.task(bind=True)
@celery.task(bind=True)
def json_update(self, user_id):
    # user_id = get_jwt_identity() # 리스트로 받아올 예정 jwt가 아니라
    # 인공지능------------------------------------------------------------------------
    # 리뷰파일 불러오기
    review_df = pd.read_csv('fashion/user_recommendations/review_df.csv', encoding='cp949', index_col=0)
    products_user_played = models.ProductUserPlayed.query.all()

    for product in products_user_played:
        review_df=review_df.append({'user_id' : str(product.user_id) , 'asin' : product.asin, 'overall' : float(product.love_or_hate)}, ignore_index=True)

    # 별점범위 지정
    reader = Reader(rating_scale= (1, 5))

    # 데이터 가공
    data = Dataset.load_from_df(df=review_df, reader=reader)

    # 데이터 분할
    train = data.build_full_trainset()
    test = train.build_testset()

    # 훈련
    model = SVD(n_factors=100, n_epochs=20, random_state=10)
    model.fit(train)

    # 중복되지 않은 어신 리스트=>얘도 피클로 저장해놓으면 더 빠르려나
    clean_asin = list(set(list(review_df['asin'])))

    # --------------------------학습-------------------------------------

    # 추천 정보를 받아 올 대상
    item_ids = clean_asin # 추천 대상 제품들
    actual_rating = 0

    # 추천 결과 저장 => 멀티 프로세싱하면 더 빨라지지 않을까?
    review_pred = []
    for item_id in item_ids :
        review_pred.append(model.predict(user_id, item_id, actual_rating))

    # 추천결과에서 어신과 예상 별점만 추출
    filter_review_pred = {}
    for i in review_pred:
        filter_review_pred[i[1]] = i[3]

    # 예상 별점이 큰 순서대로 정렬
    sorted_review = sorted(filter_review_pred.items(), key=lambda x: x[1], reverse=True)

    # 예상 별점이 3.65 이상인 제품의 어신만 추출
    filter_review = []
    for i in sorted_review:
        if i[1] >= 3.65:
            filter_review.append(i[0])

    # 리뷰 만개로 컷
    cut_review = filter_review[:10000]

    # 게임카드 json 업데이트 코드-----------------------------------------------------------------------------------------------------

    asins = cut_review[:100]

    print(f'1. asins 리스트 만들어짐 : {asins[:5]}')

    products_list = {}
    products_list['products'] = []

    a = 0
    for asin in asins:
        keywords = [product_keyword.product_keyword for product_keyword in models.ProductKeyword.query.filter_by(asin=asin).all()]
        try:
            product_title = models.Product.query.filter_by(asin=asin).first().title
        except:
            continue
        products_list['products'].append({
            'keywords': keywords if len(keywords) <= 6 else keywords[:6],
            'image': address_format.img(asin),
            'title': product_title,
            'asin': asin
        })
        a += 1
        print(f'{a}번째 데이터 생성')

    print(f'product_list 파일 만들어짐')

    file_path = f'fashion/user_recommendations/game_{user_id}.json'

    with open(file_path, 'w') as outfile:
        json.dump(products_list, outfile)
    print('파일 업데이트 끝')

    # 결과카드 json 업데이트 코드-----------------------------------------------------------------------------------------------------
    products_result_list = {}
    products_result_list['products'] = []

    a = 0
    for asin in asins:
        keywords = [product_keyword.product_keyword for product_keyword in models.ProductKeyword.query.filter_by(asin=asin).all()]
        product = models.Product.query.filter_by(asin=asin).first()
        product_review = models.ProductReview.query.filter_by(asin=asin).first()
        pos_review_rate = product_review.positive_review_number / (product_review.positive_review_number + product_review.negative_review_number)
        try:
            product_title = product.title
        except:
            continue
        products_result_list['products'].append({
            'keywords': keywords if len(keywords) <= 6 else keywords[:6],
            'asin': asin,
            'price': product.price,
            'nlpResults': {
                            'posReviewSummary': product_review.positive_review_summary if product_review.positive_review_summary else 'Oh no....there is no positive review at all...;(',
                            'negReviewSummary': product_review.negative_review_summary if product_review.negative_review_summary else 'OMG! There is no negative review at all!;)'
                        },
            'starRating': round(product.rating, 2),
            'posReveiwRate': round(pos_review_rate, 2),
            'image': address_format.img(asin),
            'productUrl': address_format.product(asin),
            'title': product_title
        })
        a += 1
        print(f'{a}번째 데이터 생성')

    print(f'product_result_list 파일 만들어짐')

    file_path_result = f'fashion/user_recommendations/result_{user_id}.json'

    with open(file_path_result, 'w') as file:
        json.dump(products_result_list, file)
    print('결과 파일 생성 끝')

    return{
        'result':'성공'
    }
