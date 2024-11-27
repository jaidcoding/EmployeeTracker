# Employee Tracker

Employee Tracker is a command-line application that allows you to manage a company's employee database using Node.js, Inquirer, and PostgreSQL.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [Features](#features)
- [Dependencies](#dependencies)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/EmployeeTracker.git
    cd EmployeeTracker
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Set up the PostgreSQL database:
    - Ensure PostgreSQL is installed and running on your machine.
    - Create a database named `employee_tracker`.
    - Run the schema file to create the necessary tables and insert sample data:
      ```sh
      psql -U postgres -d employee_tracker -f schema.sql
      ```

4. Start the application:
    ```sh
    npm start
    ```

## Usage

Upon starting the application, you will be presented with a list of actions you can perform:
- View All Employees
- View All Employees By Roles
- View All Employees By Departments
- Update Employee
- Add Employee
- Add Role
- Add Department
- View All Projects
- Assign Employee to Project

Use the arrow keys to navigate the menu and press `Enter` to select an action.

## Database Schema

The database schema consists of the following tables:
- `department`: Stores department information.
- `role`: Stores role information.
- `employee`: Stores employee information.
- `project`: Stores project information.
- `employee_project`: Establishes a many-to-many relationship between employees and projects.

## Features

- View all employees, roles, departments, and projects.
- Add new employees, roles, and departments.
- Update employee roles.
- Assign employees to projects.

## Dependencies

- [express](https://www.npmjs.com/package/express)
- [inquirer](https://www.npmjs.com/package/inquirer)
- [pg](https://www.npmjs.com/package/pg)
- [console.table](https://www.npmjs.com/package/console.table)

## License

This project is licensed under the MIT License.
