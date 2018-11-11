<?php
/**
 * Created by PhpStorm.
 * User: stu
 * Date: 10/25/2018
 * Time: 1:40 PM
 */
//require_once ('../../third_party/Zend/Http/Client.php');
//require_once(TL_ABS_PATH . "/third_party/gitlab-php-api/lib/gitlab-rest-api.php");
$req = TL_ABS_PATH . "/third_party/rtsuite-api-client/rt_suite_api_client.php";
require_once($req);
//class rtsuiterestInterface extends gitlabrestInterface
//{
//    private $customAPIClient;
////    public function __construct(str $type, $config, $name)
////    {
////        $this->APIClient = new RtSuiteApiClient();
////        parent::__construct($type, $config, $name);
////    }
//    function connect()
//    {
//        $this->customAPIClient = new RtSuiteApiClient($this->getAPIClient()->url,$this->getAPIClient()->apiKey,$this->getAPIClient()->projectId,$this->getAPIClient()->cfg);
//        parent::connect(); // TODO: Change the autogenerated stub
//    }
//
//
//    public function addIssue($summary, $description, $opt = null)
//    {
//        $testerId = $opt;
//        $exeId = $opt;
//        try
//        {
//            $op = $this->customAPIClient->addIssueWithInfo($summary, $description,$testerId,$exeId);
//            if(is_null($op)){
//                throw new Exception("Error creating issue", 1);
//            }
//            $ret = array('status_ok' => true, 'id' => (string)$op->iid,
//                'msg' => sprintf(lang_get('gitlab_bug_created'),
//                    $summary, $this->customAPIClient->projectId));
//        }
//        catch (Exception $e)
//        {
//            $msg = "Create GITLAB Ticket FAILURE => " . $e->getMessage();
//            tLog($msg, 'WARNING');
//            $ret = array('status_ok' => false, 'id' => -1, 'msg' => $msg . ' - serialized issue:' . serialize($issue));
//        }
//        return $ret;
//    }
//
//
//
//
//
//
////    function connect()
////    {
////        $processCatch = false;
////        $this->connected = true;
//////        return;
////        try
////        {
////            // CRITIC NOTICE for developers
////            // $this->cfg is a simpleXML Object, then seems very conservative and safe
////            // to cast properties BEFORE using it.
////            $redUrl = (string)trim($this->cfg->uribase);
////            $redAK = (string)trim($this->cfg->apikey);
////            $projectId = (string)trim($this->cfg->projectidentifier); //TODO: check integer value
////            $pxy = new stdClass();
//////            $pxy->proxy = config_get('proxy');
////            $this->APIClient = new RtSuiteApiClient($redUrl,$redAK,$projectId/*, $pxy*/);
////            // to undestand if connection is OK, I will ask for projects.
////            // I've tried to ask for users but get always ERROR from gitlab (not able to understand why).
////            try
////            {
////                $items = $this->APIClient->getProjects();
////                $this->connected = count($items) > 0 ? true : false;
////                unset($items);
////            }
////            catch(Exception $e)
////            {
////                $processCatch = true;
////            }
////        }
////        catch(Exception $e)
////        {
////            $processCatch = true;
////        }
////
////        if($processCatch)
////        {
////            $logDetails = '';
////            foreach(array('uribase','apikey') as $v)
////            {
////                $logDetails .= "$v={$this->cfg->$v} / ";
////            }
////            $logDetails = trim($logDetails,'/ ');
////            $this->connected = false;
////            tLog(__METHOD__ . " [$logDetails] " . $e->getMessage(), 'ERROR');
////        }
////    }
////
////
////    public function addIssue($summary,$description,$opt){
////        error_log('sdbg');
////        $this->connect();
////        $this->APIClient->addIssue($summary,$description,$opt->value[1],$opt->value[0]);
//////        $request = new Zend_Http_Client('localhost:3333');
//////        $req = new Zend_Http_Client('http://localhost:3333');
//////        try {
//////            $req->setRawData(json_encode(array('userid'=>$opt->tag)));
//////            $req->request('POST');
//////        } catch (Zend_Http_Client_Exception $e) {
//////        }
////    }
////
////    public function getIssue($issueId){
////        return "bla bla";
////    }
////
////
////    public static function getCfgTemplate()
////    {
////        $tpl = "<!-- Template " . __CLASS__ . " -->\n" .
////            "<issuetracker>\n" .
////            "<apikey>RTSUITE API KEY</apikey>\n" .
////            "<uribase>rt suite base url</uribase>\n" .
////            "<projectidentifier>rt suite project id</projectidentifier>".
////            "</issuetracker>\n";
////        return $tpl;
////    }
//
//}

class rtsuiterestInterface extends issueTrackerInterface
{
    private $APIClient;
    private $issueDefaults;
    private $issueOtherAttr = null; // see
    private $translate = null;
    private $dbObj = null;

    var $defaultResolvedStatus;

    /**
     * Construct and connect to BTS.
     *
     * @param str $type (see tlIssueTracker.class.php $systems property)
     * @param xml $cfg
     **/
    function __construct($type, $config, $name)
    {
        error_log("11112221111", 0, TL_ABS_PATH . "/testlink_logs/clog.log");

        $this->name = $name;
        $this->interfaceViaDB = false;
        $this->methodOpt['buildViewBugLink'] = array('addSummary' => true, 'colorByStatus' => false);

        $this->defaultResolvedStatus = array();
        $this->defaultResolvedStatus[] = array('code' => 3, 'verbose' => 'resolved');
        $this->defaultResolvedStatus[] = array('code' => 5, 'verbose' => 'closed');

        if (!$this->setCfg($config)) {
            return false;
        }

        // http://www.gitlab.org/issues/6843
        // "Target version" is the new display name for this property,
        // but it's still named fixed_version internally and thus in the API.
        // $issueXmlObj->addChild('fixed_version_id', (string)2);
        $this->translate['targetversion'] = 'fixed_version_id';

        $this->completeCfg();
        $this->setResolvedStatusCfg();
        $this->connect();
    }


    /**
     *
     * check for configuration attributes than can be provided on
     * user configuration, but that can be considered standard.
     * If they are MISSING we will use 'these carved on the stone values'
     * in order    to simplify configuration.
     *
     *
     **/
    function completeCfg()
    {
        $base = trim($this->cfg->uribase, "/") . '/'; // be sure no double // at end
        if (property_exists($this->cfg, 'attributes')) {
            $attr = get_object_vars($this->cfg->attributes);
            foreach ($attr as $name => $elem) {
                $name = (string)$name;
                if (is_object($elem)) {
                    $elem = get_object_vars($elem);
                    $cc = current($elem);
                    $kk = key($elem);
                    foreach ($cc as $value) {
                        $this->issueOtherAttr[$name][] = array($kk => (string)$value);
                    }
                } else {
                    $this->issueOtherAttr[$name] = (string)$elem;
                }
            }
        }

        // All attributes that I do not consider mandatory
        // are managed through the issueAdditionalAttributes
        //
        // On Redmine 1 seems to be standard for Issues/Bugs
        $this->issueDefaults = array('trackerid' => 1);
        foreach ($this->issueDefaults as $prop => $default) {
            if (!isset($this->issueAttr[$prop])) {
                $this->issueAttr[$prop] = $default;
            }
        }

        if (property_exists($this->cfg, 'custom_fields')) {
            $cf = $this->cfg->custom_fields;
            $this->cfg->custom_fields = (string)$cf->asXML();
        }
    }

    /**
     * useful for testing
     *
     *
     **/
    function getAPIClient()
    {
        return $this->APIClient;
    }

    /**
     * checks id for validity
     *
     * @param string issueID
     *
     * @return bool returns true if the bugid has the right format, false else
     **/
    function checkBugIDSyntax($issueID)
    {
        return $this->checkBugIDSyntaxNumeric($issueID);
    }

    /**
     * establishes connection to the bugtracking system
     *
     * @return bool
     *
     **/
    function connect()
    {
        error_log("11112221111", 0, TL_ABS_PATH . "/testlink_logs/clog.log");
        $processCatch = false;

        try {
            // CRITIC NOTICE for developers
            // $this->cfg is a simpleXML Object, then seems very conservative and safe
            // to cast properties BEFORE using it.
            $redUrl = (string)trim($this->cfg->uribase);
            $redAK = (string)trim($this->cfg->apikey);
            $projectId = (string)trim($this->cfg->projectidentifier); //TODO: check integer value
            $pxy = new stdClass();
            $pxy->proxy = config_get('proxy');
            $this->APIClient = new rtsuite($redUrl, $redAK, $projectId, $pxy);



//            if (!$this->dbConnection2) {
//                $this->dbConnection2 = new database(DB_TYPE);
//                $result = $this->dbConnection2->connect(false, DB_HOST, DB_USER,
//                    DB_PASS, DB_NAME);
//            }

            // to undestand if connection is OK, I will ask for projects.
            // I've tried to ask for users but get always ERROR from gitlab (not able to understand why).
            try {
                $items = $this->APIClient->getProjects();
                $this->connected = count($items) > 0 ? true : false;
                unset($items);
            } catch (Exception $e) {
                $processCatch = true;
            }
        } catch (Exception $e) {
            $processCatch = true;
        }

        if ($processCatch) {
            $logDetails = '';
            foreach (array('uribase', 'apikey') as $v) {
                $logDetails .= "$v={$this->cfg->$v} / ";
            }
            $logDetails = trim($logDetails, '/ ');
            $this->connected = false;
            tLog(__METHOD__ . " [$logDetails] " . $e->getMessage(), 'ERROR');
        }
    }

    /**
     *
     *
     **/
    function isConnected()
    {
        return $this->connected;
    }

    function buildViewBugURL($issueID)
    {
//        $this->connected = false;
//        $this->connect();
        if (!$this->isConnected()) {
            tLog(__METHOD__ . '/Not Connected ', 'ERROR');
            return false;
        }
        return $this->APIClient->getIssueURL($issueID);
    }

    /**
     *
     *
     **/
    public function getIssue($issueID)
    {
        if (!$this->isConnected()) {
            tLog(__METHOD__ . '/Not Connected ', 'ERROR');
            return false;
        }

        $issue = null;
        try {
            $jsonObj = $this->APIClient->getIssue((int)$issueID);

            if (!is_null($jsonObj) && is_object($jsonObj)) {
                $issue = new stdClass();
                $issue->IDHTMLString = "<b>{$issueID} : </b>";
                $issue->statusCode = (string)$jsonObj->iid;
                $issue->statusVerbose = (string)$jsonObj->state;
                $issue->statusHTMLString = "[$issue->statusVerbose] ";
                $issue->summary = $issue->summaryHTMLString = (string)$jsonObj->title;
                $issue->gitlabProject = array('name' => (string)$jsonObj->project_id,
                    'id' => (int)$jsonObj->project_id);

                $issue->isResolved = isset($this->state);
            }
        } catch (Exception $e) {
            tLog(__METHOD__ . '/' . $e->getMessage(), 'ERROR');
            $issue = null;
        }
        return $issue;
    }


    /**
     * Returns status for issueID
     *
     * @param string issueID
     *
     * @return
     **/
    function getIssueStatusCode($issueID)
    {
        $issue = $this->getIssue($issueID);
        return !is_null($issue) ? $issue->statusCode : false;
    }

    /**
     * Returns status in a readable form (HTML context) for the bug with the given id
     *
     * @param string issueID
     *
     * @return string
     *
     **/
    function getIssueStatusVerbose($issueID)
    {
        return $this->getIssueStatusCode($issueID);
    }

    /**
     *
     * @param string issueID
     *
     * @return string
     *
     **/
    function getIssueSummaryHTMLString($issueID)
    {
        $issue = $this->getIssue($issueID);
        return $issue->summaryHTMLString;
    }

    /**
     * @param string issueID
     *
     * @return bool true if issue exists on BTS
     **/
    function checkBugIDExistence($issueID)
    {
        if (($status_ok = $this->checkBugIDSyntax($issueID))) {
            $issue = $this->getIssue($issueID);
            $status_ok = is_object($issue) && !is_null($issue);
        }
        return $status_ok;
    }

    public function addIssue($summary, $description, $opt = null)
    {
        $this->dbObj = new database(DB_TYPE);
        $this->dbObj->db->SetFetchMode(ADODB_FETCH_ASSOC);
        $this->_connectToDB();
        $testerId = /*'ffff'*/tlUser::doesUserExist($this->dbObj, $opt->tagValue->value[1]);
        $exeId = $opt->tagValue->value[0];
        $tPlan = $opt->tagValue->value[2];
        try {
            $op = $this->APIClient->addIssueWithInfo($summary, $description, $testerId, $exeId, $tPlan);
            if (is_null($op)) {
                throw new Exception("Error creating issue", 1);
            }
            $ret = array('status_ok' => true, 'id' => (string)$op->iid,
                'msg' => sprintf(lang_get('gitlab_bug_created'),
                    $summary, $this->APIClient->projectId));
        } catch (Exception $e) {
            $msg = "Create GITLAB Ticket FAILURE => " . $e->getMessage();
            tLog($msg, 'WARNING');
            $ret = array('status_ok' => false, 'id' => -1, 'msg' => $msg . ' - serialized issue:' . serialize($issue));
        }
        return $ret;
    }


    /**
     *
     */
    public function addNote($issueID, $noteText, $opt = null)
    {
        $op = $this->APIClient->addNote($issueID, $noteText);
        if (is_null($op)) {
            throw new Exception("Error setting note", 1);
        }
        $ret = array('status_ok' => true, 'id' => (string)$op->iid,
            'msg' => sprintf(lang_get('gitlab_bug_comment'), $op->body, $this->APIClient->projectId));
        return $ret;
    }


    /**
     *
     * @author francisco.mancardi@gmail.com>
     **/
    public static function getCfgTemplate()
    {
        $tpl = "<!-- Template " . __CLASS__ . " -->\n" .
            "<issuetracker>\n" .
            "<apikey>GITLAB API KEY</apikey>\n" .
            "<uribase>https://gitlab.mydomain.com</uribase>\n" .
            "<projectidentifier>GITLAB PROJECT NUMERIC IDENTIFIER</projectidentifier>\n" .
            "</issuetracker>\n";
        return $tpl;
    }

    /**
     *
     **/
    function canCreateViaAPI()
    {
        return true;
    }

    protected function _connectToDB()
    {
        if(true == $this->testMode)
        {
            $this->dbObj->connect(TEST_DSN, TEST_DB_HOST, TEST_DB_USER, TEST_DB_PASS, TEST_DB_NAME);
        }
        else
        {
            $this->dbObj->connect(DSN, DB_HOST, DB_USER, DB_PASS, DB_NAME);
        }
        // asimon - BUGID 3644 & 2607 - $charSet was undefined here
        $charSet = config_get('charset');
        if((DB_TYPE == 'mysql') && ($charSet == 'UTF-8'))
        {
            $this->dbObj->exec_query("SET CHARACTER SET utf8");
            $this->dbObj->exec_query("SET collation_connection = 'utf8_general_ci'");
        }
    }



}
