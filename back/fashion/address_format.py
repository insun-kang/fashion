# 제품 링크 포맷팅
def product(asin):
    return 'https://www.amazon.com/dp/{asin}'.format(asin = asin)

# 제품 이미지 링크 포맷팅
def img(asin):
    return 'https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN={asin}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=SL250'.format(asin = asin)
