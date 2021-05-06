// Dependencies
const password = require('./dbpassword.json'); //Importing DB Connection Info from Ignored File
const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');


                    /*

BREAK BETWEEN SECTIONS

                    */  


// Other Stuff
let existingRoles = new Array;

let existingManagers = new Array;

let existingEmployees = new Array;

let existingDepartments = new Array;


                    /*

BREAK BETWEEN SECTIONS

                    */      


// Inquirer Prompts
const initalPrompt = {
    type: 'list',
    name: 'firstResponse',
    message: 'What Would You Like To Do?',
    choices: ['View All Employees',
            'View Employees By Department',
            'View Employees By Manager',
            'Add an Employee',
            'Remove an Employee',
            'Add a Role',
            'Remove a Role',
            'Add a Department',
            'Remove a Department',
            `Update an Employee's Role`,
            `Update an Employee's Manager`,
            'Exit']
};

const addEmployeeNamePrompts = [
    {
        type: 'input',
        name: 'firstName',
        message: 'What Is Their First Name?'
    },
    {
        type: 'input',
        name: 'lastName',
        message: 'What Is Their Last Name?'
    }
];

const newRolePrompt = [
    {
        type: 'input',
        name: 'newRole',
        message: `What is the New Role?`
    },
    {
        type: 'number',
        name: 'salary',
        message: `What is the Salary?`
    },
    {
        type: 'Input',
        name: 'departmentID',
        message: 'What is the Department?'
    }
]

const existingRolePrompt = {
    type: 'list',
    name: 'existingRole',
    message: `What Is This Employee's Role`,
    choices: existingRoles
}

const removedEmployeePrompt = {
    type: 'list',
    name: 'removedEmployee',
    message: 'Select the Employee to Remove',
    choices: existingEmployees
}

const selectedDepartmentPrompt = {
    type: 'list',
    name: 'selectedDepartment',
    message: 'Which Department Do You Want to View?',
    choices: existingDepartments
}

const addDepartmentPrompt = {
    type: 'input',
    name: 'addDepartment',
    message: 'What is the Name of the New Department?'
}

const removeRolePrompt = {
    type: 'list',
    name: 'removedRole',
    message: 'Which Role Do You Want to Remove?',
    choices: existingRoles
}

const removeDepartmentPrompt = {
    type: 'list', 
    name: 'removedDepartment',
    message: 'Which Department do you Want to Remove?',
    choices: existingDepartments
}

const updatePrompt = [
    {
        type: 'list',
        name: 'employee',
        message: `Which Employee do you Want to Update?`,
        choices: existingEmployees
    },
    {
        type: 'list',
        name: 'update',
        message: `What is the Employee's New Role?`,
        choices: existingRoles
    }
]

const selectManagerPrompt = {
    type: 'list',
    name: 'selectedManager',
    message: `Who is this Employee's Manager?`,
    choices: existingManagers
}


                    /*

BREAK BETWEEN SECTIONS

                    */


// DB Connection
const connection = mysql.createConnection({
    host: 'localhost',

    // Local Host Port
    port: 3306,

    // Username: Username is Hidden in Ignored JSON
    user: password.user,

    // Password: Password is Hidden in Ignored JSON
    password: password.password,
    
    // Database: Database Name is Hidden in Ignored JSON
    database: password.database
});

// Connect to the DB
connection.connect((err) => {
    err ? console.error(err) : console.log('Connected to Database');
    init();  
});


                    /*

BREAK BETWEEN SECTIONS

                    */


// Functions
const endConnection = () => {
    connection.end();
};

const init = () => {
    inquirer
        .prompt(initalPrompt)
        .then((initalPrompt) => {
            switchCases(initalPrompt.firstResponse);
        })
}

const switchCases = (responses) => {
    switch(responses) {
        case 'View All Employees':
            viewAllEmployees();
            break;
        case 'View Employees By Department':
            viewByDepartment();
            break;
        case 'View Employees By Manager':
            viewByManager();
            break;
        case 'Add an Employee':
            addEmployeeName();
            break;
        case 'Remove an Employee':
            removeEmployee();
            break;
        case 'Add a Role':
            addRole();
            break;
        case 'Remove a Role':
            removeRole();
            break;
        case 'Add a Department':
            addDepartment();
            break;
        case 'Remove a Department':
            removeDepartment();
            break;
        case `Update an Employee's Role`:
            updateEmployee();
            break;
        case `Update an Emplyoee's Manager`:
            console.log(`Update an Employee's Manager`);
            break;
        case `Exit`:
            endConnection();
            break;
    };
};

const viewAllEmployees = () => {
    // This probably needs a join, currently doesn't give all of the desired information
    connection.query(
        `SELECT Employees.Employee_ID, Employees.First_Name, Employees.Last_Name, Managers.First_Name AS Manager_First_Name,
        Managers.Last_Name AS Manager_Last_Name, Roles.Title AS Role, Departments.Department_Name AS Department
        FROM Employees LEFT JOIN Managers ON Employees.Manager_ID = Managers.Manager_ID JOIN Roles ON Employees.Role_ID = Roles.Role_ID JOIN Departments ON Departments.Department_ID = Roles.Department_ID;`,
        (err, res) => {
            err ? console.error(err) : console.table(res);
        return init();
        }
    );
};

const viewByDepartment = () => {
    // Also needs a join, just testing function calls and DB queries for now
    connection.query(
        `SELECT Department_Name FROM Departments`,
        (err, res) => {
            if (err) {
                console.error(err);
            }
            for (let i = 0; i < res.length; i++) {
                if (existingDepartments.includes(`${res[i].Department_Name}`)) {
                    continue;
                }
                else {
                    existingDepartments.push(`${res[i].Department_Name}`);
                }
            }
        selectViewByDepartment();
        }
    );
};

const selectViewByDepartment = () => {
    inquirer 
        .prompt(selectedDepartmentPrompt)
        .then((selectedDepartmentPrompt) => {
            connection.query(
                `SELECT Employees.Employee_ID, Employees.First_Name, Employees.Last_Name, Managers.First_Name AS Manager_First_Name,
                Managers.Last_Name AS Manager_Last_Name, Roles.Title AS Role, Departments.Department_Name AS Department
                FROM Employees 
                LEFT JOIN Managers ON Employees.Manager_ID = Managers.Manager_ID JOIN Roles ON Employees.Role_ID = Roles.Role_ID 
                JOIN Departments ON Departments.Department_ID = Roles.Department_ID AND Department_Name = "${selectedDepartmentPrompt.selectedDepartment}"`,
            (err, res) => {
                if (err) {
                    console.error(err);
                }
                else {
                    console.table(res);
                }
                return init();
            }
            )
        }
    )
}

const viewByManager = () => {
    // NEEDS JOIN
    connection.query(
        `SELECT * FROM Employees WHERE ?`,
        {
            Manager_ID: 1 || 2
        },
        (err,res) => {
            err ? console.error(err) : console.table(res);
        return init();
        }
    )
}

const addEmployeeName = () => {
    inquirer
        .prompt(addEmployeeNamePrompts)
        .then((addEmployeeNamePrompts) => {
            addEmployeeRole(addEmployeeNamePrompts.firstName, addEmployeeNamePrompts.lastName);
        }
    )
}

const addEmployeeRole = (firstName, lastName) => {
    connection.query(
        // Get Existing Roles from DB
        `SELECT Title FROM Roles`,
        (err, res) => {
            if (err) {
                console.error(err);
            };
            // For Loop to Populate Existing Roles from DB
            for (let i = 0; i < res.length; i++) {
                if (existingRoles.includes(res[i].Title)) {
                    continue;
                }
                else {
                    existingRoles.push(res[i].Title);
                }
            }
            existingRole(firstName, lastName);
        }
    )
}

const existingRole = (firstName, lastName) => {
    inquirer
        .prompt(existingRolePrompt)
        .then((existingRolePrompt) => {
            confirmDepartment(firstName, lastName, existingRolePrompt.existingRole);
        })
}

const confirmDepartment = (firstName, lastName, selectedRole) => {
    connection.query(
        `SELECT Department_ID FROM Roles WHERE Title = '${selectedRole}'`,
        (err, res) => {
            if (err) {
                console.error(err);
            };
            let currentDepartment = res[0].Department_ID;
            console.log(currentDepartment);
            addEmployeeManager(firstName, lastName, selectedRole, currentDepartment);
        }
    )
}

const addEmployeeManager = (firstName, lastName, selectedRole, currentDepartment) => {
    connection.query(
        `SELECT First_Name, Last_Name FROM Managers WHERE Department_ID = ${currentDepartment}`,
        (err, res) => {
            if (err) {
                console.error(err);
            };
            for (let i = 0; i < res.length; i++) {
                if (existingManagers.includes(res[i].First_Name && res[i].Last_Name)) {
                    continue;
                }
                else {
                    existingManagers.push(`${First_Name} ${Last_Name}`)
                    inquirer
                        .prompt(selectManagerPrompt)
                        .then((selectManagerPrompt) => {
                            determineRoleID(firstName, lastName, selectedRole, selectManagerPrompt.selectedManager);
                        }
                    )
                }
            }
        }
    )
}

const determineRoleID = (firstName, lastName, selectedRole, selectedManager) => {
    connection.query(
        `SELECT Role_ID FROM Roles WHERE Title = '${selectedRole}'`,
        (err, res) => {
            if (err) {
                console.error(err);
            }
            let currentRoleID = res[0].Role_ID;
            determineManagerID(firstName, lastName, currentRoleID, selectedManager);
        }
    )
}

const determineManagerID = (firstName, lastName, currentRoleID, selectedManager) => {
    const currentManager = selectedManager.split(' ');
    connection.query(
        `SELECT Manager_ID FROM Managers WHERE First_Name = '${currentManager[0]}' AND Last_Name = '${currentManager[1]}'`,
        (err, res) => {
            if (err) {
                console.error(err);
            };
            let currentManagerID = res[0].Manager_ID;
            completeEmployeeAdd(firstName, lastName, currentRoleID, currentManagerID);
        }
    )
}

const completeEmployeeAdd = (firstName, lastName, currentRoleID, currentManagerID) => {
    connection.query(
        `INSERT INTO Employees(First_Name, Last_Name, Role_ID, Manager_ID) VALUES ('${firstName}', '${lastName}', ${currentRoleID}, ${currentManagerID})`,
        (err, res) => {
            if (err) {
                console.error (err);
            };
            return init();
        }
    )
}

const removeEmployee = () => {
    connection.query(
        `SELECT First_Name, Last_Name FROM Employees`,
        (err,res) => {
            if (err) {
                console.error(err);
            };
            for (let i = 0; i < res.length; i++) {
                if (existingEmployees.includes(`${res[i].First_Name} ${res[i].Last_Name}`)) {
                    continue;
                }
                else {
                    existingEmployees.push(`${res[i].First_Name} ${res[i].Last_Name}`);
                }
            }
            selectRemovedEmployee();
        }
    )
}

const selectRemovedEmployee = () => {
    inquirer
        .prompt(removedEmployeePrompt)
        .then((removedEmployeePrompt) => {
            console.log(removedEmployeePrompt.removedEmployee);
            let firstLast = removedEmployeePrompt.removedEmployee.split(' ');
            connection.query(
                `DELETE FROM Employees WHERE First_Name = '${firstLast[0]}' AND Last_Name = '${firstLast[1]}'`,
                (err ,res) => {
                    if (err) {
                        console.error(err);
                    }
                    existingEmployees.pop(removedEmployeePrompt.removedEmployee);
                }
            )
            return init();
        }
    )
}

const addRole = () => {
    inquirer
        .prompt(newRolePrompt)
        .then((newRolePrompt) => {
            connection.query(
                `INSERT INTO Roles SET ?`,
                {
                    Title: `${newRolePrompt.newRole}`,
                    Salary: parseInt(`${newRolePrompt.salary}`),
                    Department_ID: parseInt(`${newRolePrompt.departmentID}`)
                },
                (err, res) => {
                    if (err) {
                        console.error(err);
                    }
                }
            )
            return init();
        }
    )
}
    
const removeRole = () => {
    connection.query(
        `SELECT Title FROM Roles`,
        (err, res) => {
            if (err) {
                console.error(err);
            };
            // For Loop to Populate Existing Roles from DB
            for (let i = 0; i < res.length; i++) {
                if (existingRoles.includes(res[i].Title)) {
                    continue;
                }
                else {
                    existingRoles.push(res[i].Title);
                }
            }
            selectRemovedRole();
        }
    )
}

const selectRemovedRole = () => {
    inquirer
        .prompt(removeRolePrompt)
        .then((removeRolePrompt) => {
            connection.query(
                `DELETE FROM Roles WHERE Title = '${removeRolePrompt.removedRole}'`,
                (err, res) => {
                    if (err) {
                        console.error(err);
                    };
                    existingRoles.pop(removeRolePrompt.removedRole);
                }
            )
            return init();
        }
    )
}

const addDepartment = () => {
    inquirer   
        .prompt(addDepartmentPrompt)
        .then((addDepartmentPrompt) => {
            connection.query(
                `INSERT INTO Departments SET Department_Name = '${addDepartmentPrompt.addDepartment}'`,
                (err, res) => {
                    if (err) {
                        console.error(err);
                    };
                }
            )
            return init();
        }
    )
}

const removeDepartment = () => {
    connection.query(
        `SELECT Department_Name FROM Departments`,
        (err, res) => {
            if (err) {
                console.error(err);
            }
            for (let i = 0; i < res.length; i++) {
                if (existingDepartments.includes(res[i].Department_Name)) {
                    continue;
                }
                else {
                    existingDepartments.push(res[i].Department_Name);
                }
            }
            selectRemovedDepartment();
        }
    )
}

const selectRemovedDepartment = () => {
    inquirer
        .prompt(removeDepartmentPrompt)
        .then((removeDepartmentPrompt) => {
            connection.query(
                `DELETE FROM Departments WHERE Department_Name = '${removeDepartmentPrompt.removedDepartment}'`,
                (err, res) => {
                    if (err) {
                        console.error(err);
                    };
                }
            )
            existingDepartments.pop(removeDepartmentPrompt.removedDepartment);
            return init();
        }
    )
}



const updateEmployeeRole = () => {
    connection.query(
        `SELECT Title FROM Roles`,
        (err, res) => {
            if (err) {
                console.error(err);
            }
            // For Loop to Populate Existing Roles from DB
            // for (let i = 0; i < res.length; i++) {
            //     if (existingRoles.includes(res[i].Title)) {
            //         continue;
            //     }
            //     else {
            //         existingRoles.push(res[i].Title);
            //     }
            // }
            inquirer
                .prompt(updatePrompt)
                .then((updatePrompt) => {
                    console.log(updatePrompt.employee, updatePrompt.update);
                    // let firstLast = removedEmployeePrompt.removedEmployee.split(' ');
                    // connection.query(
                    //     `UPDATE Employees WHERE First_Name = '${firstLast[0]}' AND Last_Name = '${firstLast[1]} SET ?`,
                    //     {

                    //     }
                    // )

                }
            )
        }
    )
}

const updateEmployee = () => {
    connection.query(
        `SELECT First_Name, Last_Name FROM Employees`,
        (err,res) => {
            if (err) {
                console.error(err);
            };
            for (let i = 0; i < res.length; i++) {
                if (existingEmployees.includes(`${res[i].First_Name} ${res[i].Last_Name}`)) {
                    continue;
                }
                else {
                    existingEmployees.push(`${res[i].First_Name} ${res[i].Last_Name}`);
                }
            }
            updateEmployeeRole();
        }
    )
}