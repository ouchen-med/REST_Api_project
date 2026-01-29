CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    number VARCHAR(20)
);

INSERT INTO students (name, email, number)
VALUES 
('Mohamed Ouchen', 'm.ouchen@example.com', '123456789'),
('Sara Bennis', 's.bennis@example.com', '987654321'),
('Youssef Amrani', 'y.amrani@example.com', '555555555');

SELECT * FROM students;