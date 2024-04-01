use role ACCOUNTADMIN;

create database DASH_DB;
create schema DASH_SCHEMA;
create warehouse DASH_S WAREHOUSE_SIZE=SMALL;

use schema DASH_DB.DASH_SCHEMA;

create stage DASH_STAGE;
create image repository DASH_REPO;

create security integration SNOWSERVICES_INGRESS_OAUTH
  type=oauth
  oauth_client=snowservices_ingress
  enabled=true;

create compute pool DASH_STANDARD_2
MIN_NODES = 1
MAX_NODES = 1
INSTANCE_FAMILY = STANDARD_2
AUTO_SUSPEND_SECS = 7200;

-- >>>>>>>>>> Customers Table
-- Option 1: Standard Table
create or replace TABLE CUSTOMERS (
	CUSTOMER_ID NUMBER(38,0) NOT NULL,
	CUSTOMER_NAME VARCHAR(255),
	EMAIL VARCHAR(255),
	COMPANY_NAME VARCHAR(255)
);

-- OR
-- Option 2: Hybrid Table
CREATE or REPLACE HYBRID TABLE CUSTOMERS (
  customer_id INT PRIMARY KEY,
  customer_name VARCHAR(255),
  email VARCHAR(255),
  company_name VARCHAR(255)
);

-- Load data into CUSTOMERS table using Snowsight from customers.csv
---- Header: Skip first line

-- >>>>>>>>>> Support Tickets Table
-- Option 1: Standard Table
create or replace TABLE SUPPORT_TICKETS (
	TICKET_ID NUMBER(38,0) NOT NULL,
	CUSTOMER_ID NUMBER(38,0) NOT NULL,
	SUBJECT VARCHAR(255),
	DESCRIPTION VARCHAR(255),
	PRIORITY VARCHAR(255),
	CURRENT_STATUS VARCHAR(255),
	ASSIGNEE VARCHAR(255),
	CREATED_AT TIMESTAMP_NTZ(9),
	UPDATED_AT TIMESTAMP_NTZ(9),
	RESOLVED_AT TIMESTAMP_NTZ(9),
	COMMENTS VARCHAR(255),
	ATTACHMENTS VARCHAR(255),
	TICKET_TAGS VARCHAR(255),
	RELATED_TICKETS VARCHAR(255),
	RESPONSE_TIME_SLA VARCHAR(255),
	RESOLUTION_TIME_SLA VARCHAR(255),
	ESCALATION_INFO VARCHAR(255),
	CLOSED_REASON VARCHAR(255),
	FEEDBACK_RATING VARCHAR(255),
	CALL_SUMMARY VARCHAR(2048),
	CALL_SENTIMENT VARCHAR(255)
);

-- OR
-- Option 2: Hybrid Table
CREATE or REPLACE HYBRID TABLE SUPPORT_TICKETS (
  ticket_id INT PRIMARY KEY,
  customer_id INT FOREIGN KEY REFERENCES customers NOT NULL,
  subject VARCHAR(255),
  description VARCHAR(255),
  priority VARCHAR(255),
  current_status VARCHAR(255),
  assignee VARCHAR(255),
  created_at timestamp,
  updated_at timestamp,
  resolved_at timestamp,
  comments VARCHAR(255),
  attachments VARCHAR(255),
  ticket_tags VARCHAR(255),
  related_tickets VARCHAR(255),
  response_time_sla VARCHAR(255),
  resolution_time_sla VARCHAR(255),
  escalation_info VARCHAR(255),
  closed_reason VARCHAR(255),
  feedback_rating VARCHAR(255),
  call_summary VARCHAR(2048),
  call_sentiment VARCHAR(255)
);

-- Load data into SUPPORT_TICKETS using Snowsight from support_tickets.csv
---- Header: Skip first line

