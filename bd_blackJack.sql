CREATE DATABASE IF NOT EXISTS bd_blackjack;
USE bd_blackjack;

DROP TABLE IF EXISTS Hand;
DROP TABLE IF EXISTS Game;
DROP TABLE IF EXISTS Session;
DROP TABLE IF EXISTS user;

-- Table User
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mail VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(50) NOT NULL,
    solde DECIMAL(10,2) DEFAULT 1000.00,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isAdmin boolean DEFAULT false
) ENGINE=InnoDB;

-- Table Session
CREATE TABLE Session (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    startSolde DECIMAL(10,2) NOT NULL,
    endSolde DECIMAL(10,2) NULL,
    startTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    endTime TIMESTAMP NULL,
    FOREIGN KEY (id_user) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table Game
CREATE TABLE Game (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_session INT NOT NULL,
    dealerScore INT NOT NULL,
    gameStatus ENUM('ongoing', 'finished') DEFAULT 'finished',
    createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_session) REFERENCES Session(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table Hand (uniquement les résultats)
CREATE TABLE Hand (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_game INT NOT NULL,
    playerType ENUM('player', 'dealer') NOT NULL,
    handIndex INT DEFAULT 0,
    bet DECIMAL(10,2) DEFAULT 0,
    status ENUM('start', 'win', 'loose', 'push', 'stop') DEFAULT 'start',
    finalScore INT NOT NULL,
    FOREIGN KEY (id_game) REFERENCES Game(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- PROCÉDURES STOCKÉES - USER
-- ============================================

DELIMITER $$

DROP PROCEDURE IF EXISTS LoginUser$$
CREATE PROCEDURE LoginUser(IN p_mail VARCHAR(255))
BEGIN
    SELECT id, mail, username, password, solde,isAdmin
    FROM user 
    WHERE mail = p_mail;
END$$

DROP PROCEDURE IF EXISTS InsertUser$$
CREATE PROCEDURE InsertUser(
    IN p_mail VARCHAR(255), 
    IN p_password VARCHAR(255), 
    IN p_username VARCHAR(50)
)
BEGIN
    DECLARE v_count INT;

    SELECT COUNT(*) INTO v_count
    FROM user
    WHERE mail = p_mail;

    IF v_count > 0 THEN
        SELECT TRUE AS error, 'Cet email est déjà utilisé' AS message;
    ELSE
        INSERT INTO user(mail, password, username) 
        VALUES(p_mail, p_password, p_username);
        
        SELECT id, mail, username, solde, isAdmin, FALSE AS error
        FROM user 
        WHERE mail = p_mail;
    END IF;
END$$

-- ============================================
-- PROCÉDURES STOCKÉES - SESSION
-- ============================================

DROP PROCEDURE IF EXISTS CreateSession$$
CREATE PROCEDURE CreateSession(IN p_id_user INT)
BEGIN
    DECLARE v_startSolde DECIMAL(10,2);
    
    SELECT solde INTO v_startSolde
    FROM user
    WHERE id = p_id_user;
    
    INSERT INTO Session(id_user, startSolde)
    VALUES(p_id_user, v_startSolde);
    
    SELECT LAST_INSERT_ID() AS sessionId, v_startSolde AS startSolde;
END$$

DROP PROCEDURE IF EXISTS EndSession$$
CREATE PROCEDURE EndSession(IN p_id_session INT,IN p_endSolde DECIMAL(10,2))
BEGIN
    DECLARE v_id_user INT;
    
    UPDATE Session 
    SET endSolde = p_endSolde, endTime = NOW()
    WHERE id = p_id_session;
    
    SELECT id_user INTO v_id_user
    FROM Session
    WHERE id = p_id_session;
    
    UPDATE user
    SET solde = p_endSolde
    WHERE id = v_id_user;
    
    SELECT 'Session terminée' AS message;
END$$


-- ============================================
-- PROCÉDURES STOCKÉES - GAME
-- ============================================

DROP PROCEDURE IF EXISTS SaveGame$$
CREATE PROCEDURE SaveGame(
    IN p_id_session INT,
    IN p_dealerScore INT,
    IN p_hands JSON
)
BEGIN
    DECLARE v_gameId INT;
    DECLARE i INT DEFAULT 0;
    DECLARE v_hand JSON;
    DECLARE v_handCount INT;
    
    -- Créer la partie
    INSERT INTO Game(id_session, dealerScore, gameStatus)
    VALUES(p_id_session, p_dealerScore, 'finished');
    
    SET v_gameId = LAST_INSERT_ID();
    
    -- Nombre de mains
    SET v_handCount = JSON_LENGTH(p_hands);
    
    -- Boucle sur chaque main
    WHILE i < v_handCount DO
        SET v_hand = JSON_EXTRACT(p_hands, CONCAT('$[', i, ']'));
        
        -- Insérer la main 
        INSERT INTO Hand(id_game, playerType, handIndex, bet, status, finalScore)
        VALUES(
            v_gameId,
            JSON_UNQUOTE(JSON_EXTRACT(v_hand, '$.playerType')),
            JSON_EXTRACT(v_hand, '$.index'),
            JSON_EXTRACT(v_hand, '$.bet'),
            JSON_UNQUOTE(JSON_EXTRACT(v_hand, '$.status')),
            JSON_EXTRACT(v_hand, '$.score')
        );
        
        SET i = i + 1;
    END WHILE;
    
    SELECT v_gameId AS gameId, 'Partie sauvegardée' AS message;
END$$
DELIMITER ;

-- ============================================
-- PROCÉDURES STOCKÉES - GetUserStats
-- ============================================
DELIMITER $$

DROP PROCEDURE IF EXISTS GetUserStats$$

CREATE PROCEDURE GetUserStats(IN p_userId INT)
BEGIN	
    -- Une seule requête pour récupérer toutes les infos d'un coup
    SELECT 
        COUNT(CASE WHEN h.status = 'win' and h.playerType = "player" THEN 1 END) AS totalWins,
        COUNT(CASE WHEN h.playerType = 'player' THEN 1 END) AS totalGames
    FROM Hand h
    INNER JOIN Game g ON h.id_game = g.id
    INNER JOIN Session s ON g.id_session = s.id
    WHERE s.id_user = p_userId;
END$$

DELIMITER ;

-- ============================================
-- PROCÉDURES STOCKÉES - GetLeaderboard
-- ============================================

DELIMITER $$

DROP PROCEDURE IF EXISTS GetLeaderboard$$

CREATE PROCEDURE GetLeaderboard()
BEGIN
    SELECT username,solde from user order by solde desc
    limit 10;
END$$

DELIMITER ;

-- ============================================
-- PROCÉDURES STOCKÉES - GetAllUsers
-- ============================================

DELIMITER $$

DROP PROCEDURE IF EXISTS GetAllUsers$$

CREATE PROCEDURE GetAllUsers()
BEGIN
    SELECT username,solde,mail,id from user order by id ;
END$$

DELIMITER ;

-- Insertion de fake user pour le classement 
INSERT INTO user (mail, password, username, solde, isAdmin) VALUES
('ace_king@blackjack.com', 'hashed_pwd_1', 'AceHigh', 5400.00, false),
('lucky_clover@test.fr', 'hashed_pwd_2', 'Lucky', 1250.50, false),
('dealer_buster@gmail.com', 'hashed_pwd_3', 'BustMaster', 890.00, false),
('queen_hearts@casino.com', 'hashed_pwd_4', 'QueenOfHearts', 12400.75, false),
('shadow_player@outlook.com', 'hashed_pwd_5', 'ShadowBet', 450.00, false),
('gold_miner@test.com', 'hashed_pwd_6', 'GoldDigger', 3200.20, false),
('all_in_tom@yahoo.com', 'hashed_pwd_7', 'AllInTom', 10.00, false),
('pro_gambler@club.com', 'hashed_pwd_8', 'VegasPro', 15600.00, false),
('beginner_lane@test.fr', 'hashed_pwd_9', 'NewbieMike', 1000.00, false),
('shark_cards@ocean.com', 'hashed_pwd_10', 'CardShark', 7800.40, false),
('chip_stacker@poker.com', 'hashed_pwd_11', 'ChipStacker', 2100.00, false),
('risky_business@live.com', 'hashed_pwd_12', 'RiskyBiz', 65.25, false),
('diamond_hand@crypto.fr', 'hashed_pwd_13', 'DiamondPlayer', 9200.00, false),
('joker_wild@fun.com', 'hashed_pwd_14', 'WildJoker', 1340.10, false),
('blackjack_pro@master.com', 'hashed_pwd_15', 'BJ_Master', 4450.00, false),
('a@a.com',"$2b$10$FT5epQj0VD3yL4axNCTMOuTiZJupqR6m3rbw8cF0zjOHuuFbuWCHC",'test',1000.00, false),
('admin@a.com',"$2b$10$3HKCnM/PJbdQPkQneUqeKuFMsiOOvuHbGQ7.uAnez5qW5btaYqyue",'Admin',1000.00, true);

