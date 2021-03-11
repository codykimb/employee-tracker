DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS employee;


CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY ,
  name VARCHAR(30) NOT NULL,
);

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

