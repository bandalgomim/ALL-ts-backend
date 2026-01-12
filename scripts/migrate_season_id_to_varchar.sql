-- Migration: Change season_id from INT to VARCHAR
-- This script removes foreign keys, changes the data type, and recreates the foreign keys

-- Step 1: Disable foreign key checks for this session
SET FOREIGN_KEY_CHECKS=0;

-- Step 2: Drop foreign keys that reference season table
ALTER TABLE `league` DROP FOREIGN KEY `fk_league_season1`;
ALTER TABLE `season_team_record` DROP FOREIGN KEY `fk_season_has_team_season1`;

-- Step 3: Change season_id from INT to VARCHAR(45) in season table
ALTER TABLE `season` 
MODIFY `season_id` varchar(45) NOT NULL;

-- Step 4: Change season_id from INT to VARCHAR(45) in league table
ALTER TABLE `league` 
MODIFY `season_id` varchar(45) NULL;

-- Step 5: Change season_id from INT to VARCHAR(45) in season_team_record table
ALTER TABLE `season_team_record` 
MODIFY `season_id` varchar(45) NOT NULL;

-- Step 6: Recreate foreign keys with the new data type
ALTER TABLE `league` 
ADD CONSTRAINT `fk_league_season1` 
FOREIGN KEY (`season_id`) REFERENCES `season` (`season_id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `season_team_record` 
ADD CONSTRAINT `fk_season_has_team_season1` 
FOREIGN KEY (`season_id`, `league_id`) REFERENCES `season` (`season_id`, `league_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 7: Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS=1;

-- Verification: Show table structures to confirm changes
SHOW CREATE TABLE `season`;
SHOW CREATE TABLE `league`;
SHOW CREATE TABLE `season_team_record`;
