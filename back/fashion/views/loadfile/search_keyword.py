import csv
from usedb import UseDB
db = UseDB()

keywords=db.keyword_select()

for keyword, count in keywords:
    db.search_keyword_insert(keyword, int(count))

db.db_free()