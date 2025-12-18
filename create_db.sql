# Create database script for Fitness App

# Create the database
CREATE DATABASE IF NOT EXISTS fitness_app;
USE fitness_app;

# Create the tables
CREATE TABLE IF NOT EXISTS achievements (
    id     INT AUTO_INCREMENT,
    username  VARCHAR(255),
    distrun   INT(50),
    speed     TIME(6),
    PRIMARY KEY(id));

CREATE TABLE IF NOT EXISTS register (
    id     INT AUTO_INCREMENT,
    username  VARCHAR(255),
    firstName VARCHAR(255),
    lastName  VARCHAR(255),
    email     VARCHAR(255),
    hashedPassword VARCHAR(255),
    PRIMARY KEY(id));

INSERT INTO register (username, firstName, lastName, email, hashedPassword)
    VALUES ('gold', 'Gold', 'Smiths', 'gold@smiths.com', 'smiths');

# Create the application user
CREATE USER IF NOT EXISTS 'fitness_app_user'@'localhost' IDENTIFIED BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON fitness_app.* TO 'fitness_app_user'@'localhost';