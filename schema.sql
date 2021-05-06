DROP DATABASE IF EXISTS All_Employees_DB;

CREATE DATABASE All_Employees_DB;

USE All_Employees_DB;

CREATE TABLE Departments (
    Department_ID INTEGER NOT NULL AUTO_INCREMENT,
    Department_Name VARCHAR(30),
    PRIMARY KEY (Department_ID)
);

CREATE TABLE Roles (
    Role_ID INTEGER NOT NULL AUTO_INCREMENT,
    Title VARCHAR(30) NOT NULL,
    Salary DECIMAL(12,2) NOT NULL, 
    Department_ID INTEGER NOT NULL,
    CONSTRAINT fk_Department_ID FOREIGN KEY (Department_ID) REFERENCES Departments(Department_ID),
    PRIMARY KEY (Role_ID)
);

CREATE TABLE Managers (
    Manager_ID INTEGER NOT NULL AUTO_INCREMENT,
    First_Name VARCHAR(30) NOT NULL, 
    Last_Name VARCHAR(30) NOT NULL, 
    Role_ID INTEGER NOT NULL, 
    CONSTRAINT fk_Manager_Role_ID FOREIGN KEY (Role_ID) REFERENCES Roles(Role_ID),
    Department_ID INTEGER NOT NULL,
    CONSTRAINT fkManager_Department_ID FOREIGN KEY (Department_ID) REFERENCES Departments(Department_ID),
    PRIMARY KEY (Manager_ID)
);

CREATE TABLE Employees (
    Employee_ID INTEGER NOT NULL AUTO_INCREMENT,
    First_Name VARCHAR(30),
    Last_Name VARCHAR(30),
    Role_ID INTEGER NOT NULL, 
    CONSTRAINT fk_Employee_Role_ID FOREIGN KEY (Role_ID) REFERENCES Roles(Role_ID),
    Manager_ID INTEGER,
    CONSTRAINT fk_Manager_ID FOREIGN KEY (Manager_ID) REFERENCES Managers(Manager_ID),
    PRIMARY KEY (Employee_ID)
);