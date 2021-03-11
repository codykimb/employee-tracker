// DEPENDENCIES
const inquirer = require("inquirer")
const mysql2 = require("mysql2")
const cTable = require('console.table');

const connection = mysql2.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_trackerDB"
  });

connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId + '\n');
    startPrompt();
  });

// INQUIRER
function startPrompt() {
    inquirer.prompt([
        {
        type: "list",
        message: "What would you like to do?",
        name: "choice",
        choices: [
            "View All Employees?", 
            "View All Employee's By Roles?",
            "View all Employees By Departments", 
            "Update Employee",
            "Add Employee?",
            "Add Role?",
            "Add Department?"
            ]
        }
    ]).then(function(val) {
        switch(val.choice) {
            case "View All Employees?":
                viewAllEmployees();
                break;
            case "View All Employee's By Roles?":
                viewByRoles();
                break;
            case "View all Employees By Departments":
                viewByDept();
                break;
            case "Update Employee":
                updateEmployee();
                break;
            case "Add Role?":
                addRole();
                break;
            case "Add Department?":
                addDept();
                break;
        }
    })
}

//VIEW ALL EMPLOYEES
function viewAllEmployees() {
    connection.query("SELECT employees.first_name AS First_Name, employees.last_name AS Last_Name, roles.title AS Title, roles.salary as Salary, departments.name as Dept_Name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employees INNER JOIN roles on roles.id = employees.role_id INNER JOIN departments on departments.id = roles.department_id LEFT JOIN employees e on employees.manager_id = e.id;",  
    function(err, res) {
      if (err) throw err
      console.table(res)
      startPrompt()
  })
    }

// VIEW EMPLOYEES BY ROLES
function viewByRoles() {
    connection.query("SELECT employees.first_name AS First_Name, employees.last_name AS Last_Name, roles.title AS Title FROM employees JOIN roles ON employees.role_id = roles.id;", 
    function(err, res) {
    if (err) throw err
    console.table(res)
    startPrompt()
    })
  }
// VIEW EMPLOYEES BY DEPARTMENTS
function viewByDept() {
    connection.query("SELECT employees.first_name AS First_Name, employees.last_name AS Last_Name, departments.name AS Department FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id ORDER BY employees.id;", 
    function(err, res) {
      if (err) throw err
      console.table(res)
      startPrompt()
    })
  }

//

