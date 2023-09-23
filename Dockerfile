# Starting with a standard Python base image
FROM python:3.9-slim as build-stage

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y wget build-essential patch

# Install Miniconda and set up the environment
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh && \
    sh Miniconda3-latest-Linux-x86_64.sh -b -p /opt/conda && \
    /opt/conda/bin/conda create -n myenv python=3.9 -y && \
    /opt/conda/bin/conda install -n myenv -c https://repo.anaconda.com/pkgs/snowflake/ snowflake-snowpark-python pandas -y

# Set up the PATH for the new environment
ENV PATH=/opt/conda/envs/myenv/bin:$PATH

# Copy the requirements and install them
COPY backend/requirements.txt /backend/requirements.txt
RUN pip install -r /backend/requirements.txt

# Copy the patch for oscrypto
COPY support-openssl-3.0.10.patch /tmp/
# Apply the patch
RUN patch -d /opt/conda/envs/myenv/lib/python3.9/site-packages/ -p1 < /tmp/support-openssl-3.0.10.patch

# Copy everything else
COPY backend/connection.json /app/
COPY . /app/

# Start from a fresh image for the final build
FROM python:3.9-slim

WORKDIR /app

# Copy only what we need from the build stage
COPY --from=build-stage /app /app
COPY --from=build-stage /opt/conda /opt/conda

# Set up the environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PATH /opt/conda/envs/myenv/bin:$PATH
ENV FLASK_APP=backend/app.py

# Copy the entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 5000
ENTRYPOINT ["/app/entrypoint.sh"]
