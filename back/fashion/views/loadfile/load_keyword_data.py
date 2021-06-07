# -*- coding: utf-8 -*-
import csv
from usedb import UseDB
db = UseDB()

with open('productkeyword.csv', 'r', encoding='UTF8') as f:
    reader = csv.DictReader(f)

    for row in reader:
        db.product_keyword_insert(row['asin'],row['type'],row['keyword'])


db.db_free()