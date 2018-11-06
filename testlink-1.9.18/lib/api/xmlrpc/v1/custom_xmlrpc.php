<?php
/**
 * Created by PhpStorm.
 * User: stu
 * Date: 10/16/2018
 * Time: 3:17 PM
 */

require_once('xmlrpc.class.php');
require_once('customAPIErrors.php');
require_once('email_api.php');

class CustomXMLRPCServer extends TestlinkXMLRPCServer
{
    public static $reqSpecDocIDParamName = 'reqspecdocid';
    public static $reqSpecTypeParamName = 'reqspectype';
    public static $requirementTypeParamName='requirementtype';
    public static $expectedCoverageParamName='expectedcoverage';
    public static $testerIdParamName='testerid';
    public static $testCasesParamName='testcases';

    /**
     * CustomXMLRPCServer constructor.
     */
    public function __construct()
    {
        $callbacks = array(
            'tl.getReqById' => 'this:getReqById',
            'tl.addReqSpec' => 'this:addReqSpec',
            'tl.addRequirement' => 'this:addRequirement',
            'tl.editRequirement' => 'this:editRequirement',
            'tl.getReqSpecByDocId' => 'this:getReqSpecByDocId',
            'tl.sendEmailToTester' => 'this:sendEmailToTester',
            'tl.getTestCaseByExecutionId' => 'this:getTestCaseByExecutionId',

        );
        parent::__construct($callbacks);
    }

    /**
     * Gets a requirements info
     * @param struct $args
     * @param string $args ["devKey"]
     * @param string $args ["requirementid"]
     * @return mixed $resultInfo
     * @access public
     */


    public function getReqById($args)
    {
        $msg_prefix = " (" . __FUNCTION__ . ") - ";

        $this->_setArgs($args);
        $checkFunctions = array('authenticate');
        $status_ok = $this->_runChecks($checkFunctions, $msg_prefix);

        if ($status_ok) {
            $itemSet = $this->reqMgr->get_by_id($args[self::$requirementIDParamName]);
            return $itemSet;
        } else {
            return $this->errors;
        }
    }


    /**
     * @param array $args
     * @param string $args ['devKey']: used to check if operation can be done.
     *                                 if devKey is not valid => abort.
     * @param int $args ['testprojectid']: prject id
     * @param int $args ['parentid']: parent id
     * @param string $args ['reqspecdocid']: requirement specification id
     * @param string $args ['title']: title
     * @param string $args ['scope']: scope
     * @param int $args ['reqspectype']: optional
     *                                  1: (default) Section
     *                                  2: User Requirement Specification
     *                                  3: System Requirement Specification
     *
     * @return array $resultInfo with keys:
     *                                  boolean 'status_ok'
     *                                  string 'msg'
     *                                  int 'id'
     *                                  int 'revision_id'
     */
    public function addReqSpec($args)
    {
        $msg_prefix = " (" . __FUNCTION__ . ") - ";
        $this->_setArgs($args);
        $checkFunctions = array('authenticate');
        $status_ok = $this->_runChecks($checkFunctions, $msg_prefix) && $this->_isParamPresent(self::$parentIDParamName, $msg_prefix,true);

        if ($status_ok) {
            $resultInfo = $this->reqSpecMgr->create($args[self::$testProjectIDParamName],
                $this->args[self::$parentIDParamName],
                $this->args[self::$reqSpecDocIDParamName],
                $this->args[self::$titleParamName],
                $this->args[self::$scopeParamName],
                0,
                /*$this->args[self::$userIDParamName]*/
                $this->userID,
                isset($this->args[self::$reqSpecTypeParamName]) ? $this->args[self::$reqSpecTypeParamName] : 1

            );
        } else {

        }
        return $status_ok ? $resultInfo : $this->errors;
    }

    /**
     * @param $args ['devKey']
     * @param $args ['testprojectid']
     * @param $args ['reqspecdocid']
     * @return array
     */
    public function getReqSpecByDocId($args)
    {
        $msg_prefix = " (" . __FUNCTION__ . ") - ";
        $this->_setArgs($args);
        $checkFunctions = array('authenticate', 'checkTestProjectID');
        $status_ok = $this->_runChecks($checkFunctions, $msg_prefix);

        if ($status_ok) {
            $itemSet = $this->reqSpecMgr->getByDocID($this->args[self::$reqSpecDocIDParamName],
                $this->args[self::$testProjectIDParamName]);
            if (!$itemSet) {
                $msg = sprintf(REQSPEC_DOC_ID_NOT_EXISTS_STR, $this->args[self::$reqSpecDocIDParamName]);
                $this->errors[] = new IXR_Error(REQSPEC_DOC_ID_NOT_EXISTS, $msg);
                $status_ok = false;
            }
        }
        return $status_ok ? array_values($itemSet)[0] : array("id" => -1, "errors" => $this->errors);
    }

    /**
     * @param $args['devKey']
     * @param $args['reqSpecid']
     * @param $args['requirementDocID']
     * @param $args['title']
     * @param $args['scope']
     * @param $args['userid']
     * @param $argsOption['status']
     * @param $argsOption['requirementType']
     * @param $argsOption['expectedCoverage']
     * todo: validate inputs
     */
    public function addRequirement($args)
    {
        $msg_prefix = " (" . __FUNCTION__ . ") - ";
        $this->_setArgs($args);
        $checkFunctions = array('authenticate');
        $status_ok = $this->_runChecks($checkFunctions, $msg_prefix);

        if ($status_ok) {
            $resultInfo = $this->reqMgr->create($this->args[self::$reqSpecIDParamName],
                $this->args[self::$requirementDocIDParamName],
                $this->args[self::$titleParamName],
                $this->args[self::$scopeParamName],
                $this->args[self::$userIDParamName],
                isset($this->args[self::$statusParamName])?$this->args[self::$statusParamName]: TL_REQ_STATUS_VALID,
                isset($this->args[self::$requirementTypeParamName])?$this->args[self::$requirementTypeParamName]:TL_REQ_TYPE_INFO,
                isset($this->args[self::$expectedCoverageParamName])?$this->args[self::$expectedCoverageParamName]:1
                );
        }
        return $resultInfo;
    }


    /**
     * @param $args['devKey']
     * @param $args['testerid']
     * @param $args['testpalid']
     * @param $args['testcases']: array('testcaseid',...)
     */
    public function sendEmailToTester($args){
        $msg_prefix = " (" . __FUNCTION__ . ") - ";
        $this->_setArgs($args);
        $checkFunctions = array('authenticate');
        $status_ok = $this->_runChecks($checkFunctions, $msg_prefix);

        if ($status_ok){
            $resultInfo = $this->_send_mail_to_tester($this->args[self::$testerIdParamName],
                $this->args[self::$testProjectIDParamName],
                $this->args[self::$testPlanIDParamName],
                $this->args[self::$testCasesParamName]);
        }

        return array('status_ok'=>true, 'sent_to'=>$resultInfo);
    }

    public function getTestCaseByExecutionId($args)
    {
        $msg_prefix = " (" . __FUNCTION__ . ") - ";
        $this->_setArgs($args);
        $checkFunctions = array('authenticate');
        $status_ok = $this->_runChecks($checkFunctions, $msg_prefix);
        if ($status_ok){
            $itemSet = $this->_get_test_case_by_execution_id($this->args[self::$executionIDParamName]);
        }
        return $itemSet;
    }

    private function _send_mail_to_tester($testerId, $testProjectID, $testPlanID, $testCases)
    {
        $tester = tlUser::getByID($this->dbObj,$testerId);
        $testerEmail = $tester->emailAddress;
        $innerBody = $this->_generate_email_body_by_tcids($testCases);
        $tprojectName = $this->tprojectMgr->get_by_id($testProjectID)['name'];
        $testPlanName = $this->tplanMgr->get_by_id($testPlanID)['name'];
        $emailBody =
"<h3>test project: ".$tprojectName."</h3><br>
<h3>test plan: ".$testPlanName."</h3>
<h3>the following test cases whore assigned to you ".$tester->firstName." ".$tester->lastName." by testlink administrator</h3>".
$innerBody;
        email_send('admin@testlink.local',$testerEmail,'new test assignments',$emailBody,null,null,null,true);
        return $testerEmail;
    }

    private function _generate_email_body_by_tcids($testCasesIds){
        $testCases = $this->tcaseMgr->get_by_id($testCasesIds,null);
        $emailBody = implode(/*"<br/>",*/array_map(array($this,'_generate_single_tc_html'),$testCases));
        $emailBodyHtml = sprintf("<table dir='ltr'><thead>
<tr><th>test case title</th><th>summary</th><th>direct link</th></tr>
</thead>
<tbody>%s</tbody>
</table>",$emailBody);
        
        return $emailBodyHtml;
    }

    private function _generate_single_tc_html($testCase){
        $_SERVER->HTTP_HOST;
        $baseHref = sprintf("%s://%s/",isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',$_SERVER['SERVER_NAME']);
        $directLink = $this->tcaseMgr->buildDirectWebLink($baseHref,$testCase['testcase_id']);
        $testCaseHtml = sprintf("<tr><td>%s</td><td>%s</td><td>%s</td></tr>",$testCase['name'],$testCase['summary'],$directLink);
        return $testCaseHtml;

    }

    private function _get_test_case_by_execution_id($exeID)
    {
        $sql = "SELECT EXE.id, NH.parent_id FROM ".$this->tables['executions']." AS EXE JOIN ".$this->tables['nodes_hierarchy']." AS NH ON NH.id = EXE.tcversion_id WHERE EXE.id = ". intval($exeID);

    }



    /*    public function editRequirement($args){
            $msg_prefix = " (" . __FUNCTION__ . ") - ";
            $this->_setArgs($args);
            $checkFunctions = array('authenticate');
            $status_ok = $this->_runChecks($checkFunctions, $msg_prefix);

            if ($status_ok){
                $resultInfo = $this->reqMgr->
            }
        }*/



}

$XMLRPCServer = new CustomXMLRPCServer();
