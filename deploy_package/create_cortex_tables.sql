CREATE OR REPLACE TABLE CALL_TRANSCRIPTS ( 
  date_created date,
  language varchar(60),
  country varchar(60),
  product varchar(60),
  category varchar(60),
  damage_type varchar(90),
  transcript varchar
);

-- Load data using Snowsight from call_transcripts.csv
---- Header: Skip first line
---- Field optionally enclosed by: Double quotes

create or replace TABLE WIKI (
	CONTENT VARCHAR(16777216)
);

-- Load data using Snowsight from wiki.csv
---- Header: Skip first line
---- Field optionally enclosed by: Double quotes