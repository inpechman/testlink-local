CREATE TABLE projects
(
  id            int PRIMARY KEY,
  tl_project_id int,
  name          text
);
CREATE TABLE req_specs
(
  id             int PRIMARY KEY,
  tl_req_spec_id int,
  parent_id      int,
  name           text,
  scope          text
);
CREATE TABLE requirements
(
  id                INT PRIMARY KEY,
  tl_requirement_id INT,
  name              TEXT,
  scope             TEXT,
  req_spec_id       INT
);
CREATE TABLE test_plans
(
  id          int PRIMARY KEY,
  tl_tplan_id int,
  project_id  int,
  name        text
);
CREATE TABLE builds
(
  id           int PRIMARY KEY,
  tl_build_id  int,
  test_plan_id int,
  name         text
);
CREATE TABLE bugs
(
  id                   int PRIMARY KEY,
  title                text,
  details              text,
  test_case_id         int,
  tester_id            int,
  execution_time_stamp text,
  execution_id         int,
  execution_status     int,
  report_count         int,
  web_url              int
);
CREATE TABLE bugs_to_be_tested
(
  id                        int PRIMARY KEY,
  test_case_id              int,
  execution_status          text,
  last_execution_time_stamp text,
  test_plan_id              int,
  report_count              int
);

