# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.13)
# Database: selfreflect
# Generation Time: 2016-12-24 13:07:59 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table password_recovery_token
# ------------------------------------------------------------

DROP TABLE IF EXISTS `password_recovery_token`;

CREATE TABLE `password_recovery_token` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `token` varchar(256) NOT NULL,
  `date_expires` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table swemwbs_conversion
# ------------------------------------------------------------

DROP TABLE IF EXISTS `swemwbs_conversion`;

CREATE TABLE `swemwbs_conversion` (
  `raw_score` int(11) unsigned NOT NULL,
  `metric_score` float unsigned NOT NULL,
  PRIMARY KEY (`raw_score`),
  UNIQUE KEY `metric_score` (`metric_score`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `swemwbs_conversion` WRITE;
/*!40000 ALTER TABLE `swemwbs_conversion` DISABLE KEYS */;

INSERT INTO `swemwbs_conversion` (`raw_score`, `metric_score`)
VALUES
	(7,7),
	(8,9.51),
	(9,11.25),
	(10,12.4),
	(11,13.33),
	(12,14.08),
	(13,14.75),
	(14,15.32),
	(15,15.84),
	(16,16.36),
	(17,16.88),
	(18,17.43),
	(19,17.98),
	(20,18.59),
	(21,19.25),
	(22,19.98),
	(23,20.73),
	(24,21.54),
	(25,22.35),
	(26,23.21),
	(27,24.11),
	(28,25.03),
	(29,26.02),
	(30,27.03),
	(31,28.13),
	(32,29.31),
	(33,30.7),
	(34,32.55),
	(35,35);

/*!40000 ALTER TABLE `swemwbs_conversion` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(254) NOT NULL DEFAULT '',
  `password` char(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `email_password` (`email`,`password`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table wellbeing
# ------------------------------------------------------------

DROP TABLE IF EXISTS `wellbeing`;

CREATE TABLE `wellbeing` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `wellbeing` int(11) unsigned NOT NULL,
  `date_recorded` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `wellbeing` (`wellbeing`),
  CONSTRAINT `wellbeing_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wellbeing_ibfk_2` FOREIGN KEY (`wellbeing`) REFERENCES `swemwbs_conversion` (`raw_score`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
