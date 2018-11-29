code for integrating RT-Suite with TestLink

the integration is done by adding code to both TestLink installation and RT-Suite

the code in server_side_node is to be added RT-Suite Ap, it should run on the RT-Suite server.

the code in testlink-1.9.18 is an altered version of the TestLink App witch is suitable to work with the node.js server side code

the altered files are as follows:\
{TestLink root}\lib\api\xmlrpc\v1\custom_xmlrpc.php
{TestLink root}\lib\api\xmlrpc\v1\customAPIErrors.php
{TestLink root}/lib/issuetrackerintegration/rtsuiterestInterface.class.php
{TestLink root}/third_party/rtsuite-api-client/rt_suite_api_client.php
{TestLink root}/lib/functions/tlIssueTracker.class.php only added line 55