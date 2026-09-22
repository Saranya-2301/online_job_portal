CREATE DATABASE job_portal;

USE job_portal;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL
);

CREATE TABLE skills (
    skill_id INT PRIMARY KEY AUTO_INCREMENT,
    skill_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE candidate_skills (
    user_id INT,
    skill_id INT,
    PRIMARY KEY(user_id, skill_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(skill_id) REFERENCES skills(skill_id)
);

CREATE TABLE jobs (
    job_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    company VARCHAR(150) NOT NULL,
    location VARCHAR(100),
    description TEXT
);

CREATE TABLE job_skills (
    job_id INT,
    skill_id INT,
    PRIMARY KEY(job_id, skill_id),
    FOREIGN KEY(job_id) REFERENCES jobs(job_id),
    FOREIGN KEY(skill_id) REFERENCES skills(skill_id)
);

CREATE TABLE applications (
    application_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    job_id INT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Applied',
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(job_id) REFERENCES jobs(job_id)
);

INSERT INTO skills(skill_name) VALUES
('Java'),
('Python'),
('C++'),
('SQL'),
('HTML'),
('CSS'),
('JavaScript'),
('React'),
('Node.js'),
('Spring Boot'),
('Machine Learning'),
('Data Structures'),
('Git'),
('MongoDB');

INSERT INTO users(name,email,password,role) VALUES
('Saranya','saranya@gmail.com','1234','candidate'),
('Rahul','rahul@gmail.com','1234','candidate'),
('Admin','admin@gmail.com','admin123','recruiter');

INSERT INTO candidate_skills(user_id,skill_id) VALUES
(1,1),
(1,4),
(1,5),
(1,6),
(1,7),
(1,8);

INSERT INTO candidate_skills(user_id,skill_id) VALUES
(2,2),
(2,4),
(2,11),
(2,14);

INSERT INTO jobs(title,company,location,description) VALUES
('Java Developer','TCS','Hyderabad','Develop Java applications'),
('Frontend Developer','Infosys','Bangalore','Develop responsive web applications'),
('Data Analyst','Deloitte','Hyderabad','Analyze business data'),
('Full Stack Developer','Accenture','Pune','Develop frontend and backend applications'),
('Machine Learning Engineer','Amazon','Bangalore','Build machine learning models');

INSERT INTO job_skills VALUES
(1,1),
(1,4),
(1,10),
(1,13);

INSERT INTO job_skills VALUES
(2,5),
(2,6),
(2,7),
(2,8);

INSERT INTO job_skills VALUES
(3,2),
(3,4),
(3,11);

INSERT INTO job_skills VALUES
(4,5),
(4,6),
(4,7),
(4,8),
(4,9),
(4,4);

INSERT INTO job_skills VALUES
(5,2),
(5,4),
(5,11),
(5,12);