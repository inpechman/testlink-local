<?php
/**
 * Created by PhpStorm.
 * User: stu
 * Date: 10/16/2018
 * Time: 3:17 PM
 */

require_once('xmlrpc.class.php');
require_once('customAPIErrors.php');

class CustomXMLRPCServer extends TestlinkXMLRPCServer
{
    public static $reqSpecDocIDParamName = 'reqspecdocid';
    public static $reqSpecTypeParamName = 'reqspectype';
    public static $requirementTypeParamName='requirementtype';
    public static $expectedCoverageParamName='expectedcoverage';

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
