-- Purpose: Create the schema for the employee tracker


-- Create the department table
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- Create the role table
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Create the employee table
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

-- Create the project table
CREATE TABLE project (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

-- Create the employee_project table to establish many-to-many relationship
CREATE TABLE employee_project (
    employee_id INT NOT NULL,
    project_id INT NOT NULL,
    PRIMARY KEY (employee_id, project_id),
    FOREIGN KEY (employee_id) REFERENCES employee(id),
    FOREIGN KEY (project_id) REFERENCES project(id)
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

-- Insert sample projects
INSERT INTO project (name, start_date, end_date)
VALUES ('Project Alpha', '2023-01-01', '2023-06-30'),
       ('Project Beta', '2023-07-01', '2023-12-31');

-- Insert sample employee_project relationships
INSERT INTO employee_project (employee_id, project_id)
VALUES (1, 1),
       (2, 1),
       (3, 2),
       (4, 2);

-- Query the database
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;