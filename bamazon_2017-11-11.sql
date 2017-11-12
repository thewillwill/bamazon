# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.19)
# Database: bamazon
# Generation Time: 2017-11-12 00:32:14 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table departments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `departments`;

CREATE TABLE `departments` (
  `department_id` int(11) NOT NULL AUTO_INCREMENT,
  `department_name` varchar(100) DEFAULT NULL,
  `over_head_costs` decimal(10,2) NOT NULL,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;

INSERT INTO `departments` (`department_id`, `department_name`, `over_head_costs`)
VALUES
	(1,'Video Games',80.00),
	(2,'Food and Drink',120.00),
	(3,'Apparel',60.00),
	(4,'Camping',50.00),
	(5,'Board Games',100.00),
	(6,'Films',120.00),
	(7,'Kitchen',90.00),
	(8,'Sports',75.00);

/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table products
# ------------------------------------------------------------

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(100) NOT NULL DEFAULT '',
  `department_id` int(100) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int(10) NOT NULL,
  `product_sales` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `Departments` (`department_id`),
  CONSTRAINT `Departments` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;

INSERT INTO `products` (`id`, `product_name`, `department_id`, `price`, `stock_quantity`, `product_sales`)
VALUES
	(1,'Uncharted 4',1,49.95,6,10),
	(2,'Doom',1,59.99,1100,10),
	(3,'Crate of Spam',2,24.50,11,10),
	(4,'Banana',2,1.20,6,10),
	(9,'Sunglasses',3,90.00,10,10),
	(10,'Jeans',3,69.00,59,10),
	(11,'Tent',4,179.00,5,10),
	(12,'Sleeping Bag',4,119.00,19,10),
	(13,'Mad Max: Fury Road',6,22.50,25,10),
	(14,'The Matrix',6,22.50,33,10),
	(15,'Ticket To Ride',5,49.50,15,10),
	(16,'Monopoly',5,38.90,112,10),
	(17,'Flash Light',4,29.00,80,10),
	(18,'Chocolate',2,2.00,53,16),
	(20,'Apple',2,0.50,76,0),
	(21,'Coffee',2,4.50,786,0),
	(22,'Potato',2,0.75,756,33),
	(23,'Duke Nukem',1,9.96,3,0),
	(25,'Hat',3,29.00,26,116),
	(26,'Pizza',2,27.50,9,0),
	(27,'Scrabble',5,32.00,16,96),
	(28,'Frozen',6,16.00,144,0);

/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
