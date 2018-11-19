CREATE DATABASE proj_2;

USE proj_2;

CREATE TABLE pills (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    rx_name VARCHAR(50) NOT NULL,
    dosage INT(5) NOT NULL, 
    quantity INT(5) NOT NULL, 
    frequency INT(5) NOT NULL, 
    d_w_m ENUM ("daily", "weekly", "monthly"),
    image VARCHAR(1000)
)