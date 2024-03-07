
use role ACCOUNTADMIN;

create role DASH_SPCS;
grant usage on database DASH_DB to role DASH_SPCS;
grant all on schema DASH_SCHEMA to role DASH_SPCS;
grant create service on schema DASH_SCHEMA to role DASH_SPCS;
grant usage on warehouse DASH_S to role DASH_SPCS;
grant READ,WRITE on stage DASH_STAGE to role DASH_SPCS;
grant READ,WRITE on image repository DASH_REPO to role DASH_SPCS;
grant all on compute pool DASH_STANDARD_2 to role DASH_SPCS;
grant all on table CUSTOMERS to role DASH_SPCS;
grant all on table SUPPORT_TICKETS to role DASH_SPCS;
grant monitor usage on account to role DASH_SPCS;
grant database role SNOWFLAKE.CORTEX_USER to role DASH_SPCS;



