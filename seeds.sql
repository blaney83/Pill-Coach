USE proj_2;

CREATE TABLE pills (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    rx_name VARCHAR(50) NOT NULL,
    dosage INT(5) NOT NULL, 
    quantity INT(5) NOT NULL, 
    frequency INT(5) NOT NULL, 
    d_w_m ENUM ("daily", "weekly", "monthly"),
    image VARCHAR(1000)
);

INSERT INTO pills (rx_name, dosage, quantity, frequency, d_w_m) VALUES ("Lipitor", 10, 30, 2,"daily"), ("Dralzine", 25, 60, 2,"daily"), ("Vicodin", 5, 30, 1,"weekly");