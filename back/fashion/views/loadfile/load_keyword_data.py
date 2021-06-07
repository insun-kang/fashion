# -*- coding: utf-8 -*-
import csv
from usedb import UseDB
import pymysql
db = UseDB()


with open('productkeyword.csv', 'r', encoding='UTF8') as f:
    reader = csv.DictReader(f)

    for row in reader:
        asin_id=db.product_select(row['asin'])


        db.product_keyword_insert(asin_id, row['asin'],row['type'],row['keyword'])


db.db_free()