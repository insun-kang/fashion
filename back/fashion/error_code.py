def error_body(error_code, msg):
    return {'errorCode': error_code, 'msg': msg}, 400

missing_json_error = ({'errorCode': 'missing_json', 'msg': 'Missing JSON in request'}, 400)
failed_try = ({'errorCode': 'failed_try', 'msg': 'failed_try'}, 400)
kakao_user = ({'errorCode': 'kakao_oauth', 'msg': "kakao user can't access this page"})