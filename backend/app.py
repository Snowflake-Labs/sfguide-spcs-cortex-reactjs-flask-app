import os
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from snowflake.snowpark.session import Session
from snowflake.snowpark.types import Variant
from snowflake.snowpark.functions import udf,sum,col,array_construct,month,year,call_udf,lit
from snowflake.snowpark.version import VERSION
from time import gmtime, strftime
import logging
import sys

# Misc
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
DATA_DB = os.getenv("DATA_DB")
DATA_SCHEMA = os.getenv("DATA_SCHEMA")
LLAMA2_MODEL = os.getenv("LLAMA2_MODEL")

# logger = logging.getLogger("snowflake.connector")
# logger.setLevel(logging.DEBUG)
# handler = logging.StreamHandler(sys.stderr)
# handler.setLevel(logging.DEBUG)
# formatter = logging.Formatter("%(name)s - %(levelname)s - %(message)s")
# handler.setFormatter(formatter)
# logger.addHandler(handler)

# Current Environment Details
print('Account                     : {}'.format(SNOWFLAKE_ACCOUNT))
print('User                        : {}'.format(SNOWFLAKE_USER))
print('Host                        : {}'.format(SNOWFLAKE_HOST))
print('Database                    : {}'.format(SNOWFLAKE_DATABASE))
print('Schema                      : {}'.format(SNOWFLAKE_SCHEMA))
print('Warehouse                   : {}'.format(SNOWFLAKE_WAREHOUSE))
print('Llama 2 Model               : {}'.format(LLAMA2_MODEL))
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
      "schema": SNOWFLAKE_SCHEMA,
      "insecure_mode": True
    }
  else:
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

session = get_snowflake_session()

@app.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": f"Hello from Dash!"})

@app.route('/llmpfs', methods=['GET', 'POST'])
def llmpfs():
    llmpfs_response = ""
    try:
      data = request.get_json()
      transcript = data['transcript'].replace("'","\\'")
      ticket_id = data['ticket_id']
      # transcript = "Customer: Hello, this is Jane. I recently purchased a Snow49 winter jacket and I wanted to let you know how thrilled I am with it.\nSnow49 Representative: Hello Jane! Thank you for reaching out. We are so glad to hear that. What in particular did you like about the jacket?\nCustomer: It is incredibly warm, yet light. I wore it on a trip to the mountains and was amazed at how comfortable I felt. And the pockets are so well-designed!\nSnow49 Representative: We always aim for high quality. Your feedback is much appreciated, Jane. Enjoy your adventures in the mountains!\nCustomer: I certainly will. Thank you and kudos to the Snow49 team."
      # print(f"In llmpfs for ticket id {ticket_id}")
      llmpfs_prompt = "'[INST] Summarize this transcript in less than 200 words. Also include the product name in a new line, defect in a new line, along with summary in a new line. Do not using any special characters or apostrophes and do no repeat any part of the prompt in your response: " + transcript + " [/INST]'"
      session = get_snowflake_session() 
      llmpfs_sql = f"select snowflake.cortex.complete('{LLAMA2_MODEL}', {llmpfs_prompt}) as response"
      print(f"{strftime('%Y-%m-%d %H:%M:%S', gmtime())} >> {llmpfs_sql}")
      df = session.sql(llmpfs_sql).to_pandas()
      llmpfs_response = df.iloc[0]['RESPONSE'].replace("'","\\'")
      print(f"{strftime('%Y-%m-%d %H:%M:%S', gmtime())} >> {llmpfs_response}")
    except Exception as e:
      print(f'Caught {type(e)} >>> {str(e)} <<< while executing snowflake.cortex.complete...')
    finally:
      return jsonify([{'llmpfs_response': llmpfs_response}])

@app.route('/llmpfs_save', methods=['GET', 'POST'])
def llmpfs_save():
    # Update ticket with the generated call summary
    try:
      data = request.get_json()
      summary = data['summary']
      ticket_id = data['ticket_id']
      session = get_snowflake_session() 
      update_sql = f"update {DATA_DB}.{DATA_SCHEMA}.support_tickets set call_summary = '{summary}' where ticket_id = {ticket_id}"
      print(f"{strftime('%Y-%m-%d %H:%M:%S', gmtime())} >> {update_sql}")
      session.sql(update_sql).collect()
    except Exception as e:
      print(f'Caught {type(e)} >>> {str(e)} <<< while executing update support_tickets set call_summary...')
    finally:
      return jsonify([{'Status': 'Ok'}])

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
