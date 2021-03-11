const inquirer = require("inquirer")
const mysql = require("mysql")
const cTable = require('console.table');

const connection = mysql.createConnection({
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
            case "View All Employee's By Roles??":
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

