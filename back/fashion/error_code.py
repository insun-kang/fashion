def error_body(error_code, msg):
    return {'errorCode': error_code, 'msg': msg}, 400

missing_json_error = ({'errorCode': 'Missing_JSON', 'msg': 'Missing JSON in request'}, 400)
