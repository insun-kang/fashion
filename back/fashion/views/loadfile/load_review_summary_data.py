# -*- coding: utf-8 -*-
import csv
from usedb import UseDB
db = UseDB()

with open('product_review.csv', 'r', encoding='UTF8') as f:
    reader = csv.DictReader(f)

    for row in reader:
        asin_id=db.product_select(row['asin'])
        db.review_summary_insert(asin_id, row['asin'],row['negative_review_summary'],row['positive_review_summary']
        ,row['negative_review_number'],row['positive_review_number'])


db.db_free()
