const inquirer = require('inquirer');

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
        "Add Department"
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
    }
  });
}

// Function to view all employees
function viewAllEmployees() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", 
    function(err, res) {
        if (err) throw err;
        console.table(res);
        startPrompt();
    });
}

// Function to view all roles
function viewAllRoles() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;", 
    function(err, res) {
        if (err) throw err;
        console.table(res);
        startPrompt();
    });
}

// Function to view all departments
function viewAllDepartments() {
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id GROUP BY department.id;", 
    function(err, res) {
        if (err) throw err;
        console.table(res);
        startPrompt();
    });
}

//Select Role Quieries Role Title for Add Employee Prompt
var roleArr = [];
function selectRole() {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
        }
    })
    return roleArr;
}

//Select Role Quieries The Managers for Add Employee Prompt
var managersArr = [];
function selectManager() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            managersArr.push(res[i].first_name);
        }
    })
    return managersArr;
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
        connection.query("SELECT role.id, role.title FROM role", function(err, res) {
            if (err) throw err;
            const roles = res.map(({ id, title }) => ({ name: title, value: id }));
            inquirer.prompt([
                {
                    type: "list",
                    name: "role",
                    message: "What is their role? ",
                    choices: roles
                }
            ]).then(function(val) {
                var roleId = val.role;
                connection.query("SELECT * FROM employee", function(err, res) {
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "manager",
                            message: "Who is their manager? ",
                            choices: res.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }))
                        }
                    ]).then(function(val) {
                        var managerId = val.manager;
                        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [firstName, lastName, roleId, managerId], function(err, res) {
                            if (err) throw err;
                            console.table(res);
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
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function(err, res) {
        if (err) throw err;
        console.table(res);
        inquirer.prompt([
            {
                type: "input",
                message: "Enter the employee ID you would like to update",
                name: "id"
            }
        ]).then(function(val) {
            var employeeId = val.id;
            connection.query("SELECT * FROM role", function(err, res) {
                inquirer.prompt([
                    {
                        type: "list",
                        message: "Select the employee's new role",
                        choices: res.map(({ id, title }) => ({ name: title, value: id })),
                        name: "roleId"
                    }
                ]).then(function(val) {
                    var roleId = val.roleId;
                    connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [roleId, employeeId], function(err, res) {
                        if (err) throw err;
                        console.table(res);
                        startPrompt();
                    });
                });
            });
        });
    });
}

// Function to add employee role

function addRole() {
    connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role", function(err, res) {
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
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: res.Title,
                    salary: res.Salary,
                },
                function(err) {
                    if (err) throw err;
                    console.table(res);
                    startPrompt();
                }
            )
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
        var query = connection.query(
            "INSERT INTO department SET ? ",
            {
                name: res.name
            },
            function(err) {
                if (err) throw err;
                console.table(res);
                startPrompt();
            }
        )
    })
}
