USE proj_2;

CREATE TABLE pills (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    rx_name VARCHAR(50) NOT NULL,
    dosage INT(5) NOT NULL, 
    quantity INT(5) NOT NULL, 
    frequency_amount INT(5) NOT NULL,
    frequency_time INT(5) NOT NULL,
    frequency_interval ENUM ("HOUR", "DAY", "WEEK", "MONTH"),
    initial_time VARCHAR(10) NOT NULL,
    initial_date VARCHAR(10) NOT NULL
);

INSERT INTO pills (rx_name, dosage, quantity, frequency_amount, frequency_time, frequency_interval, initial_time, initial_date) VALUES ("Lipitor", 10, 30, 2, 1, "DAY", "2018-11-24", "T12:40:00"), ("Dralzine", 25, 60, 1, 1, "DAY", "2018-11-20", "T12:52:00"), ("Vicodin", 5, 30, 1, 6, "HOUR", "2018-11-25", "T12:52:00");