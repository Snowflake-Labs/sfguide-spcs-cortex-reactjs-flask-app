import os
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from snowflake.snowpark.session import Session
from snowflake.snowpark.types import Variant
from snowflake.snowpark.functions import udf,sum,col,array_construct,month,year,call_udf,lit
from snowflake.snowpark.version import VERSION

# # Misc
import pandas as pd
import json

app = Flask(__name__, static_url_path='', static_folder='/app/build')
app.config['DEBUG'] = True

CORS(app)

# Environment variables below will be automatically populated by Snowflake.
SNOWFLAKE_ACCOUNT = os.getenv("SNOWFLAKE_ACCOUNT")
SNOWFLAKE_HOST = os.getenv("SNOWFLAKE_HOST")
SNOWFLAKE_DATABASE = os.getenv("SNOWFLAKE_DATABASE")
SNOWFLAKE_SCHEMA = os.getenv("SNOWFLAKE_SCHEMA")

# Custom environment variables
SNOWFLAKE_USER = os.getenv("SNOWFLAKE_USER")
SNOWFLAKE_PASSWORD = os.getenv("SNOWFLAKE_PASSWORD")
SNOWFLAKE_ROLE = os.getenv("SNOWFLAKE_ROLE")
SNOWFLAKE_WAREHOUSE = os.getenv("SNOWFLAKE_WAREHOUSE")

# Current Environment Details
print('Account                     : {}'.format(SNOWFLAKE_ACCOUNT))
print('Host                        : {}'.format(SNOWFLAKE_HOST))
print('User                        : {}'.format(SNOWFLAKE_USER))
print('Role                        : {}'.format(SNOWFLAKE_ROLE))
print('Database                    : {}'.format(SNOWFLAKE_DATABASE))
print('Schema                      : {}'.format(SNOWFLAKE_SCHEMA))
print('Warehouse                   : {}'.format(SNOWFLAKE_WAREHOUSE))

def get_login_token():
  """
  Read the login token supplied automatically by Snowflake. These tokens
  are short lived and should always be read right before creating any new connection.
  """
  with open("/snowflake/session/token", "r") as f:
    return f.read()

def get_connection_params():
  """
  Construct Snowflake connection params from environment variables.
  """
  if os.path.exists("/snowflake/session/token"):
    return {
      "account": SNOWFLAKE_ACCOUNT,
      "host": SNOWFLAKE_HOST,
      "authenticator": "oauth",
      "token": get_login_token(),
      "warehouse": SNOWFLAKE_WAREHOUSE,
      "database": SNOWFLAKE_DATABASE,
      "schema": SNOWFLAKE_SCHEMA
    }
  else:
    print('Pwd: {}'.format(SNOWFLAKE_PASSWORD))
    return {
      "account": SNOWFLAKE_ACCOUNT,
      "host": SNOWFLAKE_HOST,
      "user": SNOWFLAKE_USER,
      "password": SNOWFLAKE_PASSWORD,
      "role": SNOWFLAKE_ROLE,
      "warehouse": SNOWFLAKE_WAREHOUSE,
      "database": SNOWFLAKE_DATABASE,
      "schema": SNOWFLAKE_SCHEMA
    }

# Create Snowflake Session object
session = Session.builder.configs(get_connection_params()).create()
session.sql_simplifier_enabled = True
snowflake_environment = session.sql('select current_user(), current_version()').collect()
snowpark_version = VERSION

# Current Environment Details
print('Snowflake version           : {}'.format(snowflake_environment[0][1]))
print('Snowpark for Python version : {}.{}.{}'.format(snowpark_version[0],snowpark_version[1],snowpark_version[2]))
print("Current Directory           :", os.getcwd())

@app.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": f"Hello from Dash!"})

@app.route('/cities', methods=['GET'])
def get_cities():
    print("In get_cities")
    # cities = [
    #     {'name': 'NYC', 'coordinates': [40.7128, -74.0060]},
    #     {'name': 'LA', 'coordinates': [34.0522, -118.2437]},
    #     {'name': 'Chicago', 'coordinates': [41.8781, -87.6298]}
    # ]
    df = session.table('cities').select('name','lat','lon').to_pandas()
    cities = [{'name': row['NAME'], 'coordinates': [row['LAT'], row['LON']]} for index, row in df.iterrows()]
    print(cities)
    return jsonify(cities)

@app.route('/llmpfs', methods=['GET', 'POST'])
def llmpfs():
    data = request.get_json()
    user_input = data['cityName']
    print("In llmpfs for: " + user_input)
    # session.sql("select snowflake.ml.complete('llama2-7b-chat-hf', '[INST] What are Large Language Models? [/INST]') as response")
    llmpfs_prompt = "'[INST] What are your thoughts on the city of " + user_input + "? [/INST]'"
    print(llmpfs_prompt)
    df = session.sql("select snowflake.ml.complete('llama2-7b-chat-hf', " + llmpfs_prompt + ") as response").to_pandas()
    llmpfs_response = df.iloc[0]['RESPONSE']
    print(llmpfs_response)
    return jsonify([{'llmpfs_response': llmpfs_response}])

@app.route('/cwd')
def print_cwd():
    return os.getcwd()

@app.route('/')
def index():
    print("In index....")
    return send_from_directory('/app/build', 'index.html')

@app.route('/static/<path:filename>')
def send_file(filename):
    print("In send_file")
    return send_from_directory('/app/build/static', filename)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
