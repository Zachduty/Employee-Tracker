USE All_Employees_DB;

INSERT INTO Departments(Department_Name)
VALUES ('Test Department');

INSERT INTO Departments(Department_Name)
VALUES ('Test Department 2');

INSERT INTO Roles(Title, Salary, Department_ID)
VALUES ('Drone', 20000, 1);

INSERT INTO Roles(Title, Salary, Department_ID)
VALUES ('Drone Manager', 60000, 2);

INSERT INTO Managers(First_Name, Last_Name, Role_ID, Department_ID)
VALUES('Droney', 'McDroneface', 2, 1);

INSERT INTO Employees(First_Name, Last_Name, Role_ID)
VALUES ('Droney', 'McDroneface', 2);

INSERT INTO Employees(First_Name, Last_Name, Role_ID, Manager_ID)
VALUES ('Smitty', 'Werbenjagermanjensen', 1, 1);

-- SELECT * FROM Departments;
-- SELECT * FROM Employees;
-- SELECT * FROM Roles;