INSERT INTO departments (name)
VALUES 
("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES
("Sales Lead"), 
("Salesperson"), 
("Lead Engineer"), 
("Software Engineer"), 
("Accountant"), 
("Legal Team Lead"), 
("Lawyer"), 
("Software Engineer");

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
("John", "Doe", 1, 3),
("Mike", "Chan", 2, 1),
("Ashley", "Rodriguez", 3, null),
("Kevin", "Tupik", 4, 3),
("Malia", "Brown", 5, null),
("Sarah", "Lourd", 6, null),
("Tom", "Allen", 7, 6),
("Tammer", "Galal", 7, 4);