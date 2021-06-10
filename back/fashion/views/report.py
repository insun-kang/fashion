from flask import Blueprint
from flask import Flask, request
import bcrypt
from flask_cors import CORS
from .. import models
from . import checkvalid
from datetime import datetime, timedelta
from flask_jwt_extended import (JWTManager, jwt_required, create_access_token, decode_token,
                                get_jwt_identity, unset_jwt_cookies, create_refresh_token)
from ast import literal_eval

# Flasgger
from flasgger.utils import swag_from
from .. import error_code

bp = Blueprint('report', __name__, url_prefix='/')

@bp.route('/report', methods=['POST'])
@jwt_required()
@swag_from('../swagger_config/report.yml')
def Report():
    if not request.is_json:
        return error_code.missing_json_error
    else:
        body = request.get_json()
        asin_id = body['asin']
        user_id = get_jwt_identity()

        report = models.Report.query.filter_by(asin_id=asin_id, user_id=user_id).first()
        report_count = models.Report.query.filter_by(asin_id=asin_id).count()

        if report is None:
            report = models.Report(
                            asin_id=asin_id,
                            user_id=user_id
                        )
            models.db.session.add(report)
            models.db.session.commit()
            return {'reportCount': report_count}, 200
        else:
            return {'reportCount': report_count}, 200
