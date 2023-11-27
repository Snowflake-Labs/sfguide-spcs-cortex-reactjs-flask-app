# ReactJS Application in Snowpark Container Sevices (SPCS)

## Prerequisites

* Snowflake Account that has SPCS and Snowflake Cortex enabled
* Docker Desktop (https://docs.docker.com/desktop) 
* npm (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)  
* Node.js (https://nodejs.org/en/download)

## Local Setup

### Step 1: Clone Repository

Clone this repo and browse to the cloned repo

### Step 2: Create Environment

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

Assuming you were able to run the application locally just fine, follow the steps below to run it end-to-end in Docker. At that point you should also be able to deploy it in SPCS.

### Step 1: Build Docker Image

Make sure Docker is running and then in a terminal window, browse to the cloned folder and execute the following command to build the Docker image.

`docker build --platform linux/amd64 -t snowday .`

**NOTE**: The first time you build the image it can take about ~45-60mins.

### Step 2: Run End-to-End Application in Docker

Once the Docker image is built follow these steps to run the end-to-end application.

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



