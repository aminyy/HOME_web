#-*-coding:utf-8-*-

import sqlalchemy
from sqlalchemy.types import TypeDecorator
from  lxml  import  etree


class XMLType(sqlalchemy.types.UserDefinedType):
    def get_col_spec(self):
        return 'XML'

    def bind_processor(self, dialect):
        def process(value):
            if value is not None:
                if isinstance(value, str):
                    return value
                else:
                    return etree.tostring(value)
            else:
                return None
        return process

    def result_processor(self, dialect, coltype):
        def process(value):
            if value is not None:
                value = etree.fromstring(value)
            return value
        return process