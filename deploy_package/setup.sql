-- ==========================================
-- This script runs when the app is installed 
-- ==========================================

-- Create Application Role and Schema
create application role if not exists app_instance_role;
create schema if not exists app_instance_schema;

create procedure app_instance_schema.start_app_procedure(compute_pool String)
returns varchar
language SQL
as $$
declare
query varchar;
begin
    query := (select 'create service if not exists app_instance_schema.app_service in compute pool ' || :compute_pool || ' spec=snowday.yaml');
    execute immediate :query;
    grant usage on schema app_instance_schema to application role app_instance_role;
    grant usage on service app_instance_schema.app_service to application role app_instance_role;
    grant monitor on service app_instance_schema.app_service to application role app_instance_role;
end;
$$;

-- Grant usage and permissions on objects
grant usage on schema app_instance_schema to application role app_instance_role;
grant usage on procedure app_instance_schema.start_app_procedure (String) to application role app_instance_role;