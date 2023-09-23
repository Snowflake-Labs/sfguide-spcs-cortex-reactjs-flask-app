import os
from flask import send_from_directory
from flask import Flask, jsonify
from flask_cors import CORS
from snowflake.snowpark.session import Session
from snowflake.snowpark.types import Variant
from snowflake.snowpark.functions import udf,sum,col,array_construct,month,year,call_udf,lit
from snowflake.snowpark.version import VERSION

# Misc
import pandas as pd
import json

app = Flask(__name__)
CORS(app)

# Create Snowflake Session object
connection_parameters = json.load(open('connection.json'))
session = Session.builder.configs(connection_parameters).create()
session.sql_simplifier_enabled = True

snowflake_environment = session.sql('select current_user(), current_version()').collect()
snowpark_version = VERSION

# Current Environment Details
print('User                        : {}'.format(snowflake_environment[0][0]))
print('Role                        : {}'.format(session.get_current_role()))
print('Database                    : {}'.format(session.get_current_database()))
print('Schema                      : {}'.format(session.get_current_schema()))
print('Warehouse                   : {}'.format(session.get_current_warehouse()))
print('Snowflake version           : {}'.format(snowflake_environment[0][1]))
print('Snowpark for Python version : {}.{}.{}'.format(snowpark_version[0],snowpark_version[1],snowpark_version[2]))

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists("build/" + path):
        return send_from_directory('build', path)
    else:
        return send_from_directory('build', 'index.html')

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": f"Hello from {session.get_current_role()}"})

@app.route('/cities', methods=['GET'])
def get_cities():
    # cities = [
    #     {'name': 'New York', 'coordinates': [40.7128, -74.0060]},
    #     {'name': 'Los Angeles', 'coordinates': [34.0522, -118.2437]},
    #     {'name': 'Chicago', 'coordinates': [41.8781, -87.6298]}
    # ]

    df = session.table('cities').select('name','lat','lon').to_pandas()
    cities = [{'name': row['NAME'], 'coordinates': [row['LAT'], row['LON']]} for index, row in df.iterrows()]

    # print("cities")
    # print(cities)
    return jsonify(cities)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)