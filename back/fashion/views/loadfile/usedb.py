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
    #characters
    def product_keyword_insert(self, asin, type_keyword, product_keyword):
        sql = ''' insert into product_keyword(`asin`, `type_keyword`, `product_keyword`)
              values(%s, %s, %s);  '''
        with self.con.cursor() as cursor:
            cursor.execute(sql, (asin, type_keyword, product_keyword))
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