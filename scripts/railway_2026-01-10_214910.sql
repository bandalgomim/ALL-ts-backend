-- MySQL dump 10.13  Distrib 9.5.0, for macos26.0 (arm64)
--
-- Host: switchback.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `affiliation`
--

DROP TABLE IF EXISTS `affiliation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `affiliation` (
  `league_id` int NOT NULL,
  `team_id` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`league_id`,`team_id`),
  KEY `fk_league_has_team_team1_idx` (`team_id`),
  KEY `fk_league_has_team_league2_idx` (`league_id`),
  CONSTRAINT `fk_league_has_team_league3` FOREIGN KEY (`league_id`) REFERENCES `league` (`league_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_league_has_team_team1` FOREIGN KEY (`team_id`) REFERENCES `team` (`team_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `country`
--

DROP TABLE IF EXISTS `country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `country` (
  `country_id` varchar(10) NOT NULL,
  `country_name` varchar(45) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`country_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `icon`
--

DROP TABLE IF EXISTS `icon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `icon` (
  `user_id` varchar(191) NOT NULL,
  `type` enum('league','team') NOT NULL,
  `id` int NOT NULL,
  `icon` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`user_id`,`type`,`id`),
  KEY `fk_icon_user1_idx` (`user_id`),
  KEY `idx_icon_user_id` (`user_id`),
  CONSTRAINT `fk_icon_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `league`
--

DROP TABLE IF EXISTS `league`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `league` (
  `league_id` int NOT NULL,
  `league_name` varchar(45) NOT NULL,
  `league_initial` varchar(10) DEFAULT NULL,
  `league_type` enum('regular','cup') DEFAULT NULL,
  `sport_id` int NOT NULL,
  `country_id` varchar(10) DEFAULT NULL,
  `season_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `league_logo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`league_id`),
  KEY `fk_league_sport1_idx` (`sport_id`),
  KEY `fk_league_country1_idx` (`country_id`),
  KEY `fk_league_season1_idx` (`season_id`),
  CONSTRAINT `fk_league_country1` FOREIGN KEY (`country_id`) REFERENCES `country` (`country_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_league_season1` FOREIGN KEY (`season_id`) REFERENCES `season` (`season_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_league_sport1` FOREIGN KEY (`sport_id`) REFERENCES `sport` (`sport_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `league_list`
--

DROP TABLE IF EXISTS `league_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `league_list` (
  `league_id` int NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `index` int DEFAULT NULL,
  `is_selected` tinyint NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`league_id`,`user_id`),
  KEY `fk_user_has_league_league1_idx` (`league_id`),
  KEY `fk_user_has_league_user1_idx` (`user_id`),
  KEY `idx_league_user_id` (`user_id`),
  CONSTRAINT `fk_user_has_league_league1` FOREIGN KEY (`league_id`) REFERENCES `league` (`league_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_has_league_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `before_insert_league_list` BEFORE INSERT ON `league_list` FOR EACH ROW BEGIN
  
  SET NEW.`index` = COALESCE(
    (SELECT MAX(`index`) FROM (
      SELECT `index` FROM `team_list` WHERE `user_id` = NEW.`user_id` AND `is_selected` = 1
      UNION ALL
      SELECT `index` FROM `league_list` WHERE `user_id` = NEW.`user_id` AND `is_selected` = 1
    ) AS merged_indexes), 0
  ) + 1;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `before_update_league_list_is_selected` BEFORE UPDATE ON `league_list` FOR EACH ROW BEGIN
    
    IF NEW.is_selected = 1 AND OLD.is_selected != 1 THEN
        
        SET NEW.`index` = COALESCE(
            (SELECT MAX(`index`) FROM (
                SELECT `index` FROM `team_list` WHERE `user_id` = NEW.`user_id` AND `is_selected` = 1
                UNION ALL
                SELECT `index` FROM `league_list` WHERE `user_id` = NEW.`user_id` AND `is_selected` = 1
            ) AS merged_indexes), 0
        ) + 1;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `league_platform`
--

DROP TABLE IF EXISTS `league_platform`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `league_platform` (
  `league_id` int NOT NULL,
  `platform_id` int NOT NULL,
  `url` varchar(255) NOT NULL,
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`league_id`,`platform_id`),
  KEY `fk_league_has_platform_platform1_idx` (`platform_id`),
  KEY `fk_league_has_platform_league1_idx` (`league_id`),
  CONSTRAINT `fk_league_has_platform_league1` FOREIGN KEY (`league_id`) REFERENCES `league` (`league_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_league_has_platform_platform1` FOREIGN KEY (`platform_id`) REFERENCES `platform` (`platform_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `league_tag`
--

DROP TABLE IF EXISTS `league_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `league_tag` (
  `league_id` int NOT NULL,
  `tag` varchar(45) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`league_id`,`tag`),
  KEY `fk_league_tag_league1_idx` (`league_id`),
  CONSTRAINT `fk_league_tag_league10` FOREIGN KEY (`league_id`) REFERENCES `league` (`league_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `match_info`
--

DROP TABLE IF EXISTS `match_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `match_info` (
  `match_id` varchar(30) NOT NULL,
  `league_id` int NOT NULL,
  `home_team_id` varchar(255) NOT NULL,
  `away_team_id` varchar(255) NOT NULL,
  `match_date` char(10) NOT NULL,
  `double_header` int DEFAULT NULL,
  `match_state` enum('end','live','next','off') NOT NULL DEFAULT 'next',
  `home_team_score` int NOT NULL DEFAULT '0',
  `away_team_score` int NOT NULL DEFAULT '0',
  `season_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `match_time` time DEFAULT NULL,
  `alarm` tinyint DEFAULT '0',
  PRIMARY KEY (`match_id`),
  KEY `fk_match_team_idx` (`home_team_id`),
  KEY `fk_match_team1_idx` (`away_team_id`),
  KEY `fk_match_info_league1_idx` (`league_id`),
  KEY `match_date` (`match_date`) /*!80000 INVISIBLE */,
  KEY `created_at` (`created_at`),
  CONSTRAINT `fk_match_info_league1` FOREIGN KEY (`league_id`) REFERENCES `league` (`league_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_match_team` FOREIGN KEY (`home_team_id`) REFERENCES `team` (`team_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_match_team1` FOREIGN KEY (`away_team_id`) REFERENCES `team` (`team_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `match_list`
--

DROP TABLE IF EXISTS `match_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `match_list` (
  `user_id` varchar(191) NOT NULL,
  `match_id` varchar(30) NOT NULL,
  `is_selected` tinyint NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`match_id`),
  KEY `fk_user_has_match_match1_idx` (`match_id`) /*!80000 INVISIBLE */,
  KEY `fk_user_has_match_user1_idx` (`user_id`),
  KEY `idx_match_user_id` (`user_id`),
  CONSTRAINT `fk_user_has_match_match1` FOREIGN KEY (`match_id`) REFERENCES `match_info` (`match_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_has_match_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `match_url`
--

DROP TABLE IF EXISTS `match_url`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `match_url` (
  `match_id` varchar(30) NOT NULL,
  `platform_id` int NOT NULL,
  `type` enum('replay','highlight') NOT NULL,
  `url` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`match_id`,`platform_id`,`type`),
  KEY `fk_match_info_has_platform_platform1_idx` (`platform_id`),
  KEY `fk_match_info_has_platform_match_info1_idx` (`match_id`),
  CONSTRAINT `fk_match_info_has_platform_platform1` FOREIGN KEY (`platform_id`) REFERENCES `platform` (`platform_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_has_match_match1_url` FOREIGN KEY (`match_id`) REFERENCES `match_info` (`match_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `platform`
--

DROP TABLE IF EXISTS `platform`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `platform` (
  `platform_id` int NOT NULL,
  `platform_name` varchar(45) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`platform_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `season`
--

DROP TABLE IF EXISTS `season`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `season` (
  `season_id` int NOT NULL,
  `league_id` int NOT NULL,
  `season_name` varchar(45) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`season_id`,`league_id`),
  UNIQUE KEY `season_id_UNIQUE` (`season_id`),
  KEY `fk_league_has_team_league1_idx` (`league_id`),
  CONSTRAINT `fk_league_has_team_league1` FOREIGN KEY (`league_id`) REFERENCES `league` (`league_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `season_team_record`
--

DROP TABLE IF EXISTS `season_team_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `season_team_record` (
  `season_id` int NOT NULL,
  `league_id` int NOT NULL,
  `team_id` varchar(255) NOT NULL,
  `rank` varchar(4) DEFAULT '-',
  `win` varchar(4) DEFAULT '-',
  `draw` varchar(4) DEFAULT '-',
  `lose` varchar(4) DEFAULT '-',
  `point` varchar(4) DEFAULT '-',
  `section` varchar(45) DEFAULT '-',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `section_idx` int DEFAULT NULL,
  PRIMARY KEY (`season_id`,`league_id`,`team_id`),
  KEY `fk_season_has_team_team1_idx` (`team_id`),
  KEY `fk_season_has_team_season1_idx` (`season_id`,`league_id`),
  CONSTRAINT `fk_season_has_team_season1` FOREIGN KEY (`season_id`, `league_id`) REFERENCES `season` (`season_id`, `league_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_season_has_team_team1` FOREIGN KEY (`team_id`) REFERENCES `team` (`team_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sport`
--

DROP TABLE IF EXISTS `sport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport` (
  `sport_id` int NOT NULL,
  `sport_name` varchar(45) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`sport_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team` (
  `team_id` varchar(255) NOT NULL,
  `team_name` varchar(45) NOT NULL,
  `sport_id` int NOT NULL,
  `country_id` varchar(10) DEFAULT NULL,
  `is_remained` tinyint NOT NULL DEFAULT '1',
  `team_initial` varchar(45) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `team_logo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`team_id`),
  KEY `fk_team_sport1_idx` (`sport_id`),
  KEY `fk_team_country1_idx` (`country_id`),
  CONSTRAINT `fk_team_country1` FOREIGN KEY (`country_id`) REFERENCES `country` (`country_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_team_sport1` FOREIGN KEY (`sport_id`) REFERENCES `sport` (`sport_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `team_list`
--

DROP TABLE IF EXISTS `team_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_list` (
  `user_id` varchar(191) NOT NULL,
  `team_id` varchar(255) NOT NULL,
  `is_selected` tinyint NOT NULL DEFAULT '1',
  `index` int DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`team_id`),
  KEY `fk_user_has_team_team1_idx` (`team_id`),
  KEY `fk_user_has_team_user1_idx` (`user_id`),
  KEY `idx_team_user_id` (`user_id`),
  CONSTRAINT `fk_user_has_team_team1` FOREIGN KEY (`team_id`) REFERENCES `team` (`team_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_has_team_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `before_insert_team_list` BEFORE INSERT ON `team_list` FOR EACH ROW BEGIN
    
    SET NEW.`index` = COALESCE(
        (SELECT MAX(`index`) FROM (
            SELECT `index` FROM `team_list` WHERE `user_id` = NEW.`user_id` AND `is_selected` = 1
            UNION ALL
            SELECT `index` FROM `league_list` WHERE `user_id` = NEW.`user_id` AND `is_selected` = 1
        ) AS merged_indexes), 0
    ) + 1;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `team_selection_to_match_list` AFTER INSERT ON `team_list` FOR EACH ROW BEGIN
    
    
    INSERT INTO match_list (user_id, match_id, is_selected)
    SELECT NEW.user_id, m.match_id, 1
    FROM match_info m
    WHERE (m.home_team_id = NEW.team_id OR m.away_team_id = NEW.team_id)
    ON DUPLICATE KEY UPDATE is_selected = 1;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `before_update_team_list_is_selected` BEFORE UPDATE ON `team_list` FOR EACH ROW BEGIN
    
    IF NEW.is_selected = 1 AND OLD.is_selected != 1 THEN
        
        SET NEW.`index` = COALESCE(
            (SELECT MAX(`index`) FROM (
                SELECT `index` FROM `team_list` WHERE `user_id` = NEW.`user_id` AND `is_selected` = 1
                UNION ALL
                SELECT `index` FROM `league_list` WHERE `user_id` = NEW.`user_id` AND `is_selected` = 1
            ) AS merged_indexes), 0
        ) + 1;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `team_update_to_match_list` AFTER UPDATE ON `team_list` FOR EACH ROW BEGIN
    
    IF NEW.is_selected = 1 AND OLD.is_selected = 0 THEN
        
        
        INSERT INTO match_list (user_id, match_id, is_selected)
        SELECT NEW.user_id, m.match_id, 1
        FROM match_info m
        WHERE (m.home_team_id = NEW.team_id OR m.away_team_id = NEW.team_id)
        ON DUPLICATE KEY UPDATE is_selected = 1;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `update_match_after_team_deselection` AFTER UPDATE ON `team_list` FOR EACH ROW BEGIN
    
    IF NEW.is_selected = 0 AND OLD.is_selected = 1 THEN
        
        UPDATE match_list ml
        JOIN match_info m ON ml.match_id = m.match_id
        SET ml.is_selected = (
            
            SELECT COALESCE(MAX(tl.is_selected), 0)
            FROM team_list tl
            WHERE tl.user_id = NEW.user_id AND tl.is_selected = 1 AND
                  (tl.team_id = m.home_team_id OR tl.team_id = m.away_team_id)
        )
        WHERE ml.user_id = NEW.user_id
        AND (m.home_team_id = NEW.team_id OR m.away_team_id = NEW.team_id);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `team_tag`
--

DROP TABLE IF EXISTS `team_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_tag` (
  `team_id` varchar(255) NOT NULL,
  `league_id` int NOT NULL,
  `tag` varchar(45) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`league_id`,`team_id`,`tag`),
  KEY `fk_team_tag_affiliation1_idx` (`league_id`,`team_id`),
  CONSTRAINT `fk_team_tag_affiliation10` FOREIGN KEY (`league_id`, `team_id`) REFERENCES `affiliation` (`league_id`, `team_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` varchar(191) NOT NULL,
  `email` varchar(45) NOT NULL,
  `fcm_token` varchar(255) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'railway'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-10 22:08:49
