-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 10, 2018 at 11:44 AM
-- Server version: 5.7.23
-- PHP Version: 5.6.38

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rtsuitetestlinksync`
--
CREATE DATABASE IF NOT EXISTS `rtsuitetestlinksync` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `rtsuitetestlinksync`;

-- --------------------------------------------------------

--
-- Table structure for table `bugs`
--

DROP TABLE IF EXISTS `bugs`;
CREATE TABLE IF NOT EXISTS `bugs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) DEFAULT NULL,
  `title` text,
  `details` text,
  `tester_id` int(11) DEFAULT NULL,
  `execution_time_stamp` text,
  `execution_id` int(11) DEFAULT NULL,
  `execution_status` text,
  `report_count` int(11) DEFAULT NULL,
  `web_url` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=50 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bugs`
--


-- --------------------------------------------------------

--
-- Table structure for table `bugs_to_be_tested`
--

DROP TABLE IF EXISTS `bugs_to_be_tested`;
CREATE TABLE IF NOT EXISTS `bugs_to_be_tested` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bug_id` int(11) DEFAULT NULL,
  `execution_status` text,
  `last_execution_time_stamp` text,
  `test_plan_id` int(11) DEFAULT NULL,
  `report_count` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bugs_to_be_tested`
--


-- --------------------------------------------------------

--
-- Table structure for table `builds`
--

DROP TABLE IF EXISTS `builds`;
CREATE TABLE IF NOT EXISTS `builds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tl_build_id` int(11) DEFAULT NULL,
  `test_plan_id` int(11) DEFAULT NULL,
  `name` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=65 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `builds`
--

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
CREATE TABLE IF NOT EXISTS `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tl_project_id` int(11) DEFAULT NULL,
  `name` text,
  `tl_project_pre` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=135 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `projects`
--


-- --------------------------------------------------------

--
-- Table structure for table `requirements`
--

DROP TABLE IF EXISTS `requirements`;
CREATE TABLE IF NOT EXISTS `requirements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tl_requirement_id` int(11) DEFAULT NULL,
  `name` text,
  `scope` text,
  `req_spec_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=45 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `requirements`
--

-- --------------------------------------------------------

--
-- Table structure for table `req_specs`
--

DROP TABLE IF EXISTS `req_specs`;
CREATE TABLE IF NOT EXISTS `req_specs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tl_req_spec_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `name` text,
  `scope` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=54 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `req_specs`
--

-- --------------------------------------------------------

--
-- Table structure for table `test_plans`
--

DROP TABLE IF EXISTS `test_plans`;
CREATE TABLE IF NOT EXISTS `test_plans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tl_tplan_id` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `name` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=72 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `test_plans`
--

--
