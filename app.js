const express = require('express');
const inquirer = require('inquirer');
const pg = require('pg');


const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '207275',
  database: 'employee_trackerDB'
});

client.connect((err) => {
  if (err) throw err;
  console.log('Connected to the PostgreSQL database.');
  startPrompt();
});

// Function to start the prompt
function startPrompt() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        "View All Employees", 
        "View All Employees By Roles",
        "View All Employees By Departments", 
        "Update Employee",
        "Add Employee",
        "Add Role",
        "Add Department",
        "View All Projects",
        "Assign Employee to Project"
      ]
    }
  ]).then(function(val) {
    switch (val.action) {
      case "View All Employees":
        viewAllEmployees();
        break;
      case "View All Employees By Roles":
        viewAllRoles();
        break;
      case "View All Employees By Departments":
        viewAllDepartments();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Update Employee":
        updateEmployee();
        break;
      case "Add Role":
        addRole();
        break;
      case "Add Department":
        addDepartment();
        break;
      case "View All Projects":
        viewAllProjects();
        break;
      case "Assign Employee to Project":
        assignEmployeeToProject();
        break;
    }
  });
}

// Function to view all employees
function viewAllEmployees() {
  client.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", 
  (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    startPrompt();
  });
}

// Function to view all roles
function viewAllRoles() {
  client.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;", 
  (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    startPrompt();
  });
}

// Function to view all departments
function viewAllDepartments() {
  client.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id GROUP BY department.id;", 
  (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    startPrompt();
  });
}

// Function to add an employee
function addEmployee() {
  inquirer.prompt([
    {
      name: "firstname",
      type: "input",
      message: "Enter their first name "
    },
    {
      name: "lastname",
      type: "input",
      message: "Enter their last name "
    }
  ]).then(function(val) {
    var firstName = val.firstname;
    var lastName = val.lastname;
    client.query("SELECT role.id, role.title FROM role", (err, res) => {
      if (err) throw err;
      const roles = res.rows.map(({ id, title }) => ({ name: title, value: id }));
      inquirer.prompt([
        {
          type: "list",
          name: "role",
          message: "What is their role? ",
          choices: roles
        }
      ]).then(function(val) {
        var roleId = val.role;
        client.query("SELECT * FROM employee", (err, res) => {
          if (err) throw err;
          inquirer.prompt([
            {
              type: "list",
              name: "manager",
              message: "Who is their manager? ",
              choices: res.rows.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }))
            }
          ]).then(function(val) {
            var managerId = val.manager;
            client.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)", [firstName, lastName, roleId, managerId], (err, res) => {
              if (err) throw err;
              console.table(res.rows);
              startPrompt();
            });
          });
        });
      });
    });
  });
}

// Function to update employee
function updateEmployee() {
  client.query("SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    inquirer.prompt([
      {
        type: "input",
        message: "Enter the employee ID you would like to update",
        name: "id"
      }
    ]).then(function(val) {
      var employeeId = val.id;
      client.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        inquirer.prompt([
          {
            type: "list",
            message: "Select the employee's new role",
            choices: res.rows.map(({ id, title }) => ({ name: title, value: id })),
            name: "roleId"
          }
        ]).then(function(val) {
          var roleId = val.roleId;
          client.query("UPDATE employee SET role_id = $1 WHERE id = $2", [roleId, employeeId], (err, res) => {
            if (err) throw err;
            console.table(res.rows);
            startPrompt();
          });
        });
      });
    });
  });
}

// Function to add employee role
function addRole() {
  client.query("SELECT role.title AS Title, role.salary AS Salary FROM role", (err, res) => {
    if (err) throw err;
    inquirer.prompt([
      {
        name: "Title",
        type: "input",
        message: "What is the role title?"
      },
      {
        name: "Salary",
        type: "input",
        message: "What is the salary?"
      }
    ]).then(function(res) {
      client.query(
        "INSERT INTO role (title, salary) VALUES ($1, $2)",
        [res.Title, res.Salary],
        (err) => {
          if (err) throw err;
          console.table(res.rows);
          startPrompt();
        }
      );
    });
  });
}

// Function to add department
function addDepartment() {
  inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "What Department would you like to add?"
    }
  ]).then(function(res) {
    client.query(
      "INSERT INTO department (name) VALUES ($1)",
      [res.name],
      (err) => {
        if (err) throw err;
        console.table(res.rows);
        startPrompt();
      }
    );
  });
}

// Function to view all projects
function viewAllProjects() {
  client.query("SELECT * FROM project;", (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    startPrompt();
  });
}

// Function to assign an employee to a project
function assignEmployeeToProject() {
  client.query("SELECT * FROM employee;", (err, res) => {
    if (err) throw err;
    const employees = res.rows.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
    inquirer.prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Select an employee:",
        choices: employees
      }
    ]).then(function(val) {
      const employeeId = val.employeeId;
      client.query("SELECT * FROM project;", (err, res) => {
        if (err) throw err;
        const projects = res.rows.map(({ id, name }) => ({ name, value: id }));
        inquirer.prompt([
          {
            type: "list",
            name: "projectId",
            message: "Select a project:",
            choices: projects
          }
        ]).then(function(val) {
          const projectId = val.projectId;
          client.query("INSERT INTO employee_project (employee_id, project_id) VALUES ($1, $2)", [employeeId, projectId], (err, res) => {
            if (err) throw err;
            console.log("Employee assigned to project successfully.");
            startPrompt();
          });
        });
      });
    });
  });
}