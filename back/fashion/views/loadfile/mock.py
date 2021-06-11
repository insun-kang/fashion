# -*- coding: utf-8 -*-
import csv
from usedb import UseDB
db = UseDB()

# with open('fake_user_df.csv', 'r', encoding='UTF8') as f:
#     reader = csv.DictReader(f)

#     for row in reader:
        
#         db.mockuser_insert(row['email'],row['nickname'], row['pw'], row['birth'] , row['sign_up_date'])

# db.db_free()

# with open('fake_share_df.csv', 'r', encoding='UTF8') as f:
#     reader = csv.DictReader(f)

#     for row in reader:
        
#         db.mockshare_insert(row['asin_id'],row['user_id'], row['date'])

# db.db_free()

with open('fake_bookmark_df.csv', 'r', encoding='UTF8') as f:
    reader = csv.DictReader(f)

    for row in reader:
        
        db.mockbookmark_insert(row['asin_id'],row['user_id'], row['date'])

db.db_free()