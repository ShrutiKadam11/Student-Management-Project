
CREATE DATABASE IF NOT EXISTS students_db;
USE students_db;

CREATE TABLE IF NOT EXISTS students (
    
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    name VARCHAR(100) NOT NULL,
    
    email VARCHAR(100) NOT NULL UNIQUE,
    
    course VARCHAR(50) NOT NULL
);
