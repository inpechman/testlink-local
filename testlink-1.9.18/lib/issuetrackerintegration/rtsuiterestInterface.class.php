<?php
/**
 * Created by PhpStorm.
 * User: stu
 * Date: 10/25/2018
 * Time: 1:40 PM
 */
class rtsuiterestInterface extends issueTrackerInterface
{

    function connect()
    {
        $processCatch = false;
        $this->connected = true;
        return;
        try
        {
            // CRITIC NOTICE for developers
            // $this->cfg is a simpleXML Object, then seems very conservative and safe
            // to cast properties BEFORE using it.
            $redUrl = (string)trim($this->cfg->uribase);
            $redAK = (string)trim($this->cfg->apikey);
//            $projectId = (string)trim($this->cfg->projectidentifier); //TODO: check integer value
            $pxy = new stdClass();
//            $pxy->proxy = config_get('proxy');
//            $this->APIClient = new gitlab($redUrl,$redAK,$projectId, $pxy);
            // to undestand if connection is OK, I will ask for projects.
            // I've tried to ask for users but get always ERROR from gitlab (not able to understand why).
            try
            {
                $items = $this->APIClient->getProjects();
                $this->connected = count($items) > 0 ? true : false;
                unset($items);
            }
            catch(Exception $e)
            {
                $processCatch = true;
            }
        }
        catch(Exception $e)
        {
            $processCatch = true;
        }

        if($processCatch)
        {
            $logDetails = '';
            foreach(array('uribase','apikey') as $v)
            {
                $logDetails .= "$v={$this->cfg->$v} / ";
            }
            $logDetails = trim($logDetails,'/ ');
            $this->connected = false;
            tLog(__METHOD__ . " [$logDetails] " . $e->getMessage(), 'ERROR');
        }
    }


    public function addIssue($summary,$description,$opt){
        error_log('sdbg');
//        $req = new Zend_Http_Client('http://localhost:3333');
//        try {
//            $req->setRawData(json_encode(array('userid'=>$opt->tag)));
//            $req->request('POST');
//        } catch (Zend_Http_Client_Exception $e) {
//        }
    }

    public function getIssue($issueId){
        return "bla bla";
    }


    public static function getCfgTemplate()
    {
        $tpl = "<!-- Template " . __CLASS__ . " -->\n" .
            "<issuetracker>\n" .
            "<apikey>RTSUITE API KEY</apikey>\n" .
            "<uribase>http://localhost:3333/</uribase>\n" .
            "</issuetracker>\n";
        return $tpl;
    }

}