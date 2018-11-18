create table bugs
(
	id int not null
		primary key,
	title text null,
	details text null,
	test_case_id int null,
	tester_id int null,
	execution_time_stamp text null,
	execution_id int null,
	execution_status int null,
	report_count int null,
	web_url int null
)
;

create table bugs_to_be_tested
(
	id int not null
		primary key,
	test_case_id int null,
	execution_status text null,
	last_execution_time_stamp text null,
	test_plan_id int null,
	report_count int null
)
;

create table builds
(
	id int not null
		primary key,
	tl_build_id int null,
	test_plan_id int null,
	name text null
)
;

create table projects
(
	id int not null
		primary key,
	tl_project_id int null,
	name text null
)
;

create table req_specs
(
	id int not null
		primary key,
	tl_req_spec_id int null,
	parent_id int null,
	name text null,
	scope text null
)
;

create table requirements
(
	id int not null
		primary key,
	tl_requirement_id int null,
	name text null,
	scope text null,
	req_spec_id int null
)
;

create table test_plans
(
	id int not null
		primary key,
	tl_tplan_id int null,
	project_id int null,
	name text null
)
;

