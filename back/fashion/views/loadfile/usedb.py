import pymysql

class UseDB:
    def __init__(self):
        self.db_init()
    def db_init(self):
        self.con = pymysql.connect(host="localhost", user='root',
                passwd='', db='fashion', charset='utf8', port = 3306)
    def db_free(self):
        if self.con:
            self.con.close()
    # load_reveiw_summary
    def review_summary_insert(self, asin_id, asin, negative_review_summary, positive_review_summary, negative_review_number, positive_review_number):
        sql = ''' insert into product_review(`asin_id`, `asin`, `negative_review_summary`, `positive_review_summary`, `negative_review_number`, `positive_review_number`)
              values(%s, %s, %s, %s, %s, %s);  '''
        with self.con.cursor() as cursor:
            cursor.execute(sql, (asin_id, asin, negative_review_summary, positive_review_summary, negative_review_number, positive_review_number))
        self.con.commit()
    #
    def product_keyword_insert(self, asin_id, asin, type_keyword, product_keyword,catagory):
        sql = ''' insert into product_keyword(`asin_id`, `asin`, `type_keyword`, `product_keyword`, `catagory`)
              values(%s, %s, %s, %s, %s);  '''
        with self.con.cursor() as cursor:
            cursor.execute(sql, (asin_id, asin, type_keyword, product_keyword, catagory))
        self.con.commit()

    def search_keyword_insert(self, keyword, count):
        sql = ''' insert into search_keyword(`keyword`, `count`)
              values(%s, %s);  '''
        with self.con.cursor() as cursor:
            cursor.execute(sql, (keyword, count))
        self.con.commit()

    def keyword_select(self):
        sql = ''' SELECT product_keyword, COUNT(product_keyword) FROM product_keyword GROUP BY product_keyword;  '''
        with self.con.cursor() as cursor:
            cursor.execute(sql)
            result = cursor.fetchall()
        self.con.commit()
        lst=[]
        for i in result:
            lst.append(i)
        return lst

    def product_insert(self, asin, title, price, rating, shared):
        sql = ''' insert into product(`asin`, `title`, `price`, `rating`, `shared`)
              values(%s, %s, %s, %s, %s);  '''
        with self.con.cursor() as cursor:
            cursor.execute(sql, (asin, title, price, rating, shared))
        self.con.commit()

    def product_select(self, asin):
        sql = ''' SELECT id FROM product WHERE asin = %s;  '''
        with self.con.cursor() as cursor:
            cursor.execute(sql, (asin))
            result = cursor.fetchall()
        self.con.commit()
        lst=[]
        for i in result:
            lst.append(i)
        return lst

    def mockuser_insert(self, email, nickname, pw, birth, sign_up_data):
        sql = ''' insert into product(`email`, `nickname`, `pw`, `birth`, `sign_up_data`)
              values(%s, %s, %s, %s, %s);  '''
        with self.con.cursor() as cursor:
            cursor.execute(sql, (email, nickname, pw, birth, sign_up_data))
        self.con.commit()

    def mockshare_insert(self, asin_id, user_id, shared_date):
        sql = ''' insert into product(`asin_id`, `user_id`, `shared_date`)
              values(%s, %s, %s);  '''
        with self.con.cursor() as cursor:
            cursor.execute(sql, (asin_id, user_id, shared_date))
        self.con.commit()

    def mockbookmark_insert(self, asin_id, user_id, date):
        sql = ''' insert into product(`asin_id`, `user_id`, `date`)
              values(%s, %s, %s);  '''
        with self.con.cursor() as cursor:
            cursor.execute(sql, (asin_id, user_id, date))
        self.con.commit()