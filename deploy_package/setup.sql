-- ==========================================
-- This script runs when the app is installed 
-- ==========================================

-- Create Application Role and Schema
create application role if not exists app_instance_role;
create schema if not exists app_instance_schema;

-- Create Store Procedure to create and resume Snowpark Container Service 
create procedure app_instance_schema.start_app_procedure(compute_pool String)
returns varchar
language SQL
as $$
declare
query varchar;
begin
    drop service if exists app_instance_schema.app_service;
    query := (select 'create service app_instance_schema.app_service in compute pool ' || :compute_pool || ' spec=snowday.yaml');
    execute immediate :query;
    grant usage on schema app_instance_schema to application role app_instance_role;
    grant usage on service app_instance_schema.app_service to application role app_instance_role;
    grant monitor on service app_instance_schema.app_service to application role app_instance_role;
    alter service if exists app_instance_schema.app_service resume;
end;
$$;

-- Create Store Procedure to suspend Snowpark Container Service 
create procedure app_instance_schema.stop_app_procedure()
returns varchar
language SQL
as $$
declare
query varchar;
begin
    alter service if exists app_instance_schema.app_service suspend;
end;
$$;

create procedure app_instance_schema.resume_app_procedure()
returns varchar
language SQL
as $$
declare
query varchar;
begin
    alter service if exists app_instance_schema.app_service resume;
end;
$$;

-- Grant usage and permissions on objects
grant usage on schema app_instance_schema to application role app_instance_role;
grant usage on procedure app_instance_schema.start_app_procedure (String) to application role app_instance_role;
grant usage on procedure app_instance_schema.stop_app_procedure () to application role app_instance_role;
grant usage on procedure app_instance_schema.resume_app_procedure () to application role app_instance_role;
