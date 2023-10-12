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

# Custom environment variables for LOCAL Testing only
SNOWFLAKE_USER = os.getenv("SNOWFLAKE_USER")
SNOWFLAKE_PASSWORD = os.getenv("SNOWFLAKE_PASSWORD")
SNOWFLAKE_ROLE = os.getenv("SNOWFLAKE_ROLE")
SNOWFLAKE_WAREHOUSE = os.getenv("SNOWFLAKE_WAREHOUSE")

# Current Environment Details
print('Account                     : {}'.format(SNOWFLAKE_ACCOUNT))
print('User                        : {}'.format(SNOWFLAKE_USER))
print('Host                        : {}'.format(SNOWFLAKE_HOST))
print('Database                    : {}'.format(SNOWFLAKE_DATABASE))
print('Schema                      : {}'.format(SNOWFLAKE_SCHEMA))
print('Warehouse                   : {}'.format(SNOWFLAKE_WAREHOUSE))
print("Current Directory           :", os.getcwd())

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
    # print('Pwd: {}'.format(SNOWFLAKE_PASSWORD))
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

def get_snowflake_session():
  # Create Snowflake Session object
  session = Session.builder.configs(get_connection_params()).create()
  session.sql_simplifier_enabled = True
  snowflake_environment = session.sql('select current_user(), current_version()').collect()
  snowpark_version = VERSION

  # Current Environment Details
  print('Snowflake version           : {}'.format(snowflake_environment[0][1]))
  print('Snowpark for Python version : {}.{}.{}'.format(snowpark_version[0],snowpark_version[1],snowpark_version[2]))
  return session

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

    session = get_snowflake_session() # Not ideal to create a session every time. This is a hack for dealing with timeouts.
    df = session.table('cities').select('name','lat','lon').to_pandas()
    cities = [{'name': row['NAME'], 'coordinates': [row['LAT'], row['LON']]} for index, row in df.iterrows()]
    print(cities)
    return jsonify(cities)

@app.route('/llmpfs', methods=['GET', 'POST'])
def llmpfs():
    data = request.get_json()
    transcript = data['transcript']
    ticket_id = data['ticket_id']
    # transcript = "Customer: Hello, this is Jane. I recently purchased a Snow49 winter jacket and I wanted to let you know how thrilled I am with it.\nSnow49 Representative: Hello Jane! Thank you for reaching out. We are so glad to hear that. What in particular did you like about the jacket?\nCustomer: It is incredibly warm, yet light. I wore it on a trip to the mountains and was amazed at how comfortable I felt. And the pockets are so well-designed!\nSnow49 Representative: We always aim for high quality. Your feedback is much appreciated, Jane. Enjoy your adventures in the mountains!\nCustomer: I certainly will. Thank you and kudos to the Snow49 team."
    print(f"In llmpfs for ticket id {ticket_id} and transcript {transcript}")
    llmpfs_prompt = "'[INST] In less than 200 words, summarize this call transcript between representative and a customer. And do not use any special characters or apostrophes: " + transcript + " [/INST]'"
    # print(llmpfs_prompt)

    session = get_snowflake_session() # Not ideal to create a session every time. This is a hack for dealing with timeouts.
    df = session.sql(f"select snowflake.ml.complete('llama2-7b-chat-hf', {llmpfs_prompt}) as response").to_pandas()
    llmpfs_response = df.iloc[0]['RESPONSE']

    # Update ticket with the call summary
    session.sql(f"update support_tickets_ht set call_summary = '{llmpfs_response}' where ticket_id = {ticket_id}").collect()
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
