# ReactJS Application with Snowflake Cortex in Snowpark Container Sevices (SPCS)

This repo contains instructions for replicating ReactJS application running in Snowpark Container Sevices (SPCS) that was presented at Snowday 2023. It also demonstrates the use of Snowflake Cortex from within the application.

Here is the outline of what's covered:

* [Prerequisites](#prerequisites)
* [Create Tables and Load Data](#create-tables-and-load-data)
* [Setup Environment And Build Application](#setup-environment-and-build-application)
  * [Clone Repository](#step-1-clone-repository)
  * [Create Conda Environment](#step-2-create-conda-environment)
  * [Install Flask](#step-3-install-flask)
  * [Install React And Its Components](#step-4-install-react-and-its-components)
  * [Build Application](#step-5-build-application)
  * [Run Application Locally](#step-6-run-application-locally)
* [Docker Setup](#docker-setup)
  * [Build Docker Image](#step-1-build-docker-image)
  * [Run Application in Docker](#step-2-run-application-in-docker)
  * [Push Docker Image to Snowflake Registry](#step-3-push-docker-image-to-snowflake-registry)
* [Deploy and Run Application in Snowpark Container Sevices (SPCS)](#deploy-and-run-application-in-snowpark-container-sevices-spcs)
  * [Update SPCS Specification File](#step-1-update-spcs-specification-file)
  * [Create Compute Pool](#step-2-create-compute-pool)
  * [Create Service](#step-3-create-service)
  * [Check Service Status](#step-4-check-service-status)
  * [Get Public (App) Endpoint](#step-4-get-public-app-endpoint)
  * [Run Application in SPCS](#step-5-run-application-in-spcs)

For questions, comments, feedback, please reach out to [Dash](dash.desai@snowflake.com).

## Prerequisites

* Snowflake Account that has SPCS and Snowflake Cortex enabled
* Docker Desktop (https://docs.docker.com/desktop) 
* npm (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)  
* Node.js (https://nodejs.org/en/download)

## Create Tables And Load Data

Follow instructions in [create_tables_load_data.sql](deploy_package/create_tables_load_data.sql) to create tables and load data using Snowsight.

## Setup Environment And Build Application

### Step 1: Clone Repository

Clone this repo and browse to the cloned repo

### Step 2: Create Conda Environment

In a terminal window, browse to the cloned repo folder and run the following commands:

* Download and install the miniconda installer from https://conda.io/miniconda.html. (OR, you may use any other Python environment, for example, [virtualenv](https://virtualenv.pypa.io/en/latest/)).
* Execute `conda create --name snowpark-spcs -c https://repo.anaconda.com/pkgs/snowflake python=3.9`
* Execute `conda activate snowpark-spcs`
* Execute `conda install -c https://repo.anaconda.com/pkgs/snowflake snowflake-snowpark-python pandas`

### Step 3: Install Flask

In a terminal window where you have `snowpark-spcs` env activated, execute `pip install Flask`

### Step 4: Install React And Its Components

In a terminal window where you have `snowpark-spcs` env activated, execute `npm install`

### Step 5: Build Application

In a terminal window, execute `npm run build` to build the application for basic UI testing.

### Step 6: Run Application Locally

In a terminal window, execute `npm run start` and you should see the application running locally in a web browser.

At this point, you can test the UI and make sure everything looks good, but in order to test the app end-to-end such that it's wired up to work with Flask backend--which ultimately interacts with your Snowflake account via SPCS, see **Docker Setup** section below.

## Docker Setup

Assuming you were able to [build](#step-5-build-application) and [run](#step-6-run-application-locally) the application locally just fine, follow the steps below to run it end-to-end in Docker. At that point you should also be able to deploy it in SPCS.

### Step 1: Build Docker Image

Make sure Docker is running and then in a terminal window, browse to the cloned folder and execute the following command to build the Docker image.

`docker build --platform linux/amd64 -t snowday .`

**NOTE**: The first time you build the image it can take about ~45-60mins.

### Step 2: Run Application in Docker

Once the Docker image is built follow these steps to run the end-to-end application in Docker.

* Update [env.list](env.list) with your credentials and other information regarding your Snowflake account that's enabled for SPCS.

```
SNOWFLAKE_ACCOUNT=
SNOWFLAKE_HOST=
SNOWFLAKE_DATABASE=
SNOWFLAKE_SCHEMA=
SNOWFLAKE_USER=
SNOWFLAKE_PASSWORD=
SNOWFLAKE_ROLE=
SNOWFLAKE_WAREHOUSE=
LLAMA2_MODEL=llama2-70b-chat
```

NOTE: Please leave **LLAMA2_MODEL** set to `llama2-70b-chat`

* After you update the env.list file as described above, execute the following command in the terminal window to run the application in Docker.

`docker run --env-file env.list -p 5000:5000 snowday`

If all goes well, you should be able to see the app running in a browser window at http://127.0.0.1:5000

### Step 3: Push Docker Image to Snowflake Registry

* Create image repository in Snowsight under your database and schema

For example, `create image repository dash_db.dash_schema.dash_repo;`

* Execute the following command in the terminal window to tag image

`docker tag snowday:latest YOUR_IMAGE_URL_GOES_HERE`

For example, `docker tag snowday:latest qa6-llmpfs.registry-dev.snowflakecomputing.com/dash_db/dash_schema/dash_repo/snowday:latest`

* Execute the following command in the terminal to login to your Snowflake account that's enabled for SPCS

`docker login YOUR_ACCOUNT_URL`

For example, `docker login qa6-llmpfs.registry-dev.snowflakecomputing.com`

* Execute the follwing command in the terminal to push the image to Snowflake registry

`docker push YOUR_IMAGE_URL_GOES_HERE`

For example, `docker push qa6-llmpfs.registry-dev.snowflakecomputing.com/dash_db/dash_schema/dash_repo/snowday:latest`

## Deploy and Run Application in Snowpark Container Sevices (SPCS)

Assuming you were able to run the application locally and in Docker just fine, follow the steps below to deploy it in SPCS.

### Step 1: Update SPCS Specification File

* Update the following attributes in [snowday.yaml](deploy_package/snowday.yaml)

  * Set `image` to your image URL. For example, `/dash_db/dash_schema/dash_repo/snowday:latest`
  * Set `SNOWFLAKE_WAREHOUSE` to the name of your warehouse that you'd like to use for this application
  * Set `DATA_DB` and `DATA_SCHEMA` to the names of database and schema where you created the CUSTOMERS and SUPPORT_TICKETS tables

* Create a Snowflake internal stage in Snowsight under your database and schema

For example, `create stage dash_db.dash_schema.dash_stage;`and upload **updated** [snowday.yaml](deploy_package/snowday.yaml) as described above.

### Step 2: Create Compute Pool

Execute the following SQL to create a compute pool.

```sql
create compute pool DASH_SNOWDAY
MIN_NODES = 1
MAX_NODES = 1
INSTANCE_FAMILY = STANDARD_2
AUTO_SUSPEND_SECS = 7200;
```

NOTE: This may take a few mins so please be patient and check the status of the compute pool to make sure it's in IDLE or ACTIVE state before proceeding.

`show compute pools like 'DASH_SNOWDAY';`

### Step 3: Create Service

In Snowsight, execute the following SQL statememt to create and launch the application service.

```sql
create service snowday
in compute pool DASH_SNOWDAY
from @dash_stage
spec='snowday.yaml';
```

NOTE: Replace `@dash_stage` with the name of your stage where you uploaded snowday.yaml.

### Step 4: Check Service Status

Execute the following SQL statement and check the status of the service to make sure it's in READY state before proceeding.

```sql
select 
  v.value:containerName::varchar container_name
  ,v.value:status::varchar status  
  ,v.value:message::varchar message
from (select parse_json(system$get_service_status('snowday'))) t, 
lateral flatten(input => t.$1) v;
```

To get logs, execute this SQL statment `CALL SYSTEM$GET_SERVICE_LOGS('YOUR_DB.YOUR_SCHEMA.snowday', 0, 'snowday', 1000);`

You should see output similar to this...

```
Account                     : LLMPFS
User                        : None
Host                        : snowflake.qa6.us-west-2.aws.snowflakecomputing.com
Database                    : DASH_DB
Schema                      : DASH_SCHEMA
Warehouse                   : DASH_L
Llama 2 Model               : llama2-70b-chat
Current Directory           : /app
Snowflake version           : 7.44.0 b202311242124246c9c7986
Snowpark for Python version : 1.9.0
 * Serving Flask app 'backend/app.py'
 * Debug mode: off
[31m[1mWARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.[0m
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://10.244.5.10:5000
```

### Step 4: Get Public (App) Endpoint

Assuming compute pool is in IDLE or ACTIVE state and the service is in READY state, execute the following SQL statement to get the public endpoint of the application.

```sql
show endpoints in service snowday;
```

If everything has gone well, you should see `ingress_url` of the application in the **Results** pane--something similar to `bmksamn-sfengineering-llmpfs.awsuswest2qa6.test-snowflakecomputing.app`

### Step 5: Run Application In SPCS

In a new browser window, copy-paste URL from **Step 4** above and you should see the login screen. To launch the application, enter your Snowflake credentials and you should see the application up and running!

In the application, clicking on **Generate Call Summary** button will call `/llmpfs` endpoint served by the Flask backend--which will call Snowflake Cortex function `snowflake.ml.complete` using Snowpark Python API to generate call summary for the given transcript. Then, the application will call `llmpfs_save` endpoint which will update the support ticket record with the generated call summary based on the ticket ID.

CONGRATULATIONS!!! :) 

## Questions, Comments, Feedback

For questions, comments, feedback, please reach out to [Dash](dash.desai@snowflake.com).
