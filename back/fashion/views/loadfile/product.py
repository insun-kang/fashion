# -*- coding: utf-8 -*-
import csv
from usedb import UseDB
db = UseDB()

with open('ProductTable.csv', 'r', encoding='UTF8') as f:
    reader = csv.DictReader(f)

    for row in reader:
        
        db.product_insert(row['asin'],row['title'], row['price'],row['rating'], 0)

db.db_free()