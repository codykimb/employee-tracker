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
    selectEmployee();
    inquirer.prompt([
        {
        type: "list",
        message: "What would you like to do?",
        name: "selection",
        choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees", 
            "View All Employees By Role",
            "View all Employees By Department", 
            "Add Department",
            "Add Role",
            "Add Employee",
            "Update Employee Role",
            ]
        }
    ]).then(function(choice) {
        switch(choice.selection) {
            case "View All Departments":
                viewAllDept();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "View All Employees":
                viewAllEmployees();
                break;
            case "View All Employees By Role":
                viewByRoles();
                break;
            case "View all Employees By Department":
                viewByDept();
                break;
            case "Add Department":
                addDept();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Update Employee Role":
                updateEmployee();
                break;
        }
    })
}

// VIEW ALL DEPARTMENTS
function viewAllDept() {
    connection.query("SELECT departments.id AS Dept_ID, departments.name AS Department_Name FROM departments;",  
    function(err, res) {
      if (err) throw err
      console.table(res)
      startPrompt()
  })
    }

// VIEW ALL ROLES
function viewAllRoles() {
    connection.query("SELECT roles.id AS Role_ID, roles.title As Job_Title, roles.salary as Salary, departments.name AS Department FROM roles INNER JOIN departments on departments.id = roles.department_id;",  
    function(err, res) {
      if (err) throw err
      console.table(res)
      startPrompt()
  })
    }

// VIEW ALL EMPLOYEES
function viewAllEmployees() {
    connection.query("SELECT employees.id AS ID, employees.first_name AS First_Name, employees.last_name AS Last_Name, roles.title AS Job_Title, roles.salary as Salary, departments.name as Department, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employees INNER JOIN roles on roles.id = employees.role_id INNER JOIN departments on departments.id = roles.department_id LEFT JOIN employees e on employees.manager_id = e.id;",  
    function(err, res) {
      if (err) throw err
      console.table(res)
      startPrompt()
  })
    }

// VIEW EMPLOYEES BY ROLE
function viewByRoles() {
    connection.query("SELECT employees.first_name AS First_Name, employees.last_name AS Last_Name, roles.title AS Title FROM employees JOIN roles ON employees.role_id = roles.id;", 
    function(err, res) {
    if (err) throw err
    console.table(res)
    startPrompt()
    })
  }
// VIEW EMPLOYEES BY DEPARTMENT
function viewByDept() {
    connection.query("SELECT employees.first_name AS First_Name, employees.last_name AS Last_Name, departments.name AS Department FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id ORDER BY employees.id;", 
    function(err, res) {
      if (err) throw err
      console.table(res)
      startPrompt()
    })
  }

// SELECT EMPLOYEE
var employeesArray = [];
function selectEmployee() {
    connection.query("SELECT * FROM employees",
    function(err, res) {
        if (err) throw err
        for (i=0; i < res.length; i++) {
            employeesArray.push(res[i].first_name + " " + res[i].last_name);
        }
        
    })
    return employeesArray;
}
// SELECT ROLE
var rolesArray = [];
function selectRole() {
    connection.query("SELECT * FROM roles",
    function(err, res) {
        if (err) throw err
        for (i=0; i < res.length; i++) {
            rolesArray.push(res[i].title);
        }
    })
    return rolesArray;
}

// SELECT MANAGERS
var managersArray = []
function selectManager() {
    connection.query("SELECT first_name, last_name FROM employees WHERE manager_id IS NULL",
    function(err, res) {
        if (err) throw err
        for (i=0; i < res.length; i++) {
            managersArray.push(res[i].first_name + " " + res[i].last_name);
        }
    })
    return managersArray;
}

// SELECT DEPARTMENTS
var deptArray = []
function selectDept() {
    connection.query("SELECT * FROM departments",
    function(err, res) {
        if (err) throw err
        for (i=0; i < res.length; i++) {
            deptArray.push(res[i].name);
        }
    })
    return deptArray;
}

// ADD EMPLOYEE
function addEmployee() {
    inquirer.prompt([
        {
            name: "firstname",
            type: "input",
            message: "Enter employee's first name: "
        },
        {
            name: "lastname",
            type: "input",
            message: "Enter employee's last name: "
        },
        {
            name: "role",
            type: "list",
            message: "What is employee's role? ",
            choices: selectRole()
        },
        {
            name: "manager",
            type: "list",
            message: "Who is employee's manager? ",
            choices: selectManager()
        },
    ]).then(function(res) {
        var roleId = selectRole().indexOf(res.role) + 1
        var managerId = selectManager().indexOf(res.manager) + 1
        connection.query("INSERT INTO employees SET ?",
        {
            first_name: res.firstname,
            last_name: res.lastname,
            manager_id: managerId,
            role_id: roleId
        }, function(err) {
            if (err) throw err
            console.table(res)
            startPrompt()
        }
        )
    })
}

// ADD ROLE
function addRole() { 
      inquirer.prompt([
          {
            name: "roletitle",
            type: "input",
            message: "What is the roles Title?"
          },
          {
            name: "rolesalary",
            type: "input",
            message: "What is the Salary?"
          },
          {
            name: "roledept",
            type: "list",
            message: "What is the Department?",
            choices: selectDept()
          } 
      ]).then(function(res) {
        var deptId = selectDept().indexOf(res.roledept) + 1
          connection.query(
              "INSERT INTO roles SET ?",
              {
                title: res.roletitle,
                salary: res.rolesalary,
                department_id: deptId
              },
              function(err) {
                  if (err) throw err
                  console.table(res);
                  startPrompt();
              }
          )
      });
    }

// ADD DEPARTMENT
function addDept() { 

    inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "What Department would you like to add?"
        }
    ]).then(function(res) {
        connection.query(
            "INSERT INTO departments SET ? ",
            {
              name: res.name
            },
            function(err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            }
        )
    })
  }

// UPDATE EMPLOYEE ROLE
function updateEmployee() {
    inquirer.prompt([
        {
            name: "name",
            type: "list",
            message: "Which employee would you like to update? ",
            choices: employeesArray
        },
        {
            name: "role",
            type: "list",
            message: "What is the Employees new role? ",
            choices: selectRole()
          }
    ]).then(function(res) {
        var roleId = selectRole().indexOf(res.role) + 1
        var eId = selectEmployee().indexOf(res.name) + 1
        console.log(roleId)
        console.log(eId)
        connection.query(
            "UPDATE employees SET ? WHERE ?",
            [{
                role_id: roleId 
            },
            {
                id: eId
            }], 
            function(err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            }
        )
    })
}
