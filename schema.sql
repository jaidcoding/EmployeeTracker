-- Purpose: Create the database for the employee tracker
DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

-- Connect to the newly created database
\connect employee_trackerDB;

-- Create the department table
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30)
);

-- Create the role table
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL(10, 2),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Create the employee table
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

-- Insert the departments
INSERT INTO department (name)
VALUES ('Engineering'), ('Sales'), ('Finance'), ('Legal');

-- Insert the roles
INSERT INTO role (title, salary, department_id)
VALUES ('Software Engineer', 100000, 1),
       ('Sales Lead', 80000, 2),
       ('Accountant', 70000, 3),
       ('Lawyer', 120000, 4);

-- Insert the employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
       ('Mike', 'Chan', 2, 1),
       ('Ashley', 'Rodriguez', 3, NULL),
       ('Kevin', 'Tupik', 4, 3),
       ('Kunal', 'Singh', 1, 1),
       ('Malia', 'Brown', 2, 1),
       ('Tom', 'Allen', 3, 3),
       ('Tina', 'Lee', 4, 3);

-- Query the database
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;