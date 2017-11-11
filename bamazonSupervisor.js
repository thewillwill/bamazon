var mysql = require("mysql");
var inquirer = require("inquirer");

//for printing table
var Table = require('tty-table')
var chalk = require('chalk');


// ------------------------------
//  GLOBAL VARIABLES
// ------------------------------

//formatting for the header of the table that gets console logged
var departmentsHeader = [{
        value: "Dept ID",
        headerColor: "cyan",
        color: "white",
        align: "left",
        paddingLeft: 3,
        width: 15
    },
    {
        value: "Department Name",
        headerColor: "cyan",
        color: "white",
        align: "left",
        paddingLeft: 3,
        width: 22
    },
    {
        value: "over_head_costs",
        headerColor: "cyan",
        color: "white",
        align: "left",
        paddingLeft: 3,
        width: 25
    }, {
        value: "product_sales",
        headerColor: "cyan",
        color: "white",
        align: "left",
        paddingLeft: 3,
        width: 22
    },
    {
        value: "total_profit",
        headerColor: "cyan",
        color: "white",
        align: "left",
        paddingLeft: 3,
        width: 20
    }
]


// ------------------------------
//  MYSQL Connection
// ------------------------------

//set up a mysql connection with the bamazon database
var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

// connect to the database
connection.connect(function(err) {
    if (err) throw err;
    supervisorStart();
    //  connection.end();
});


// ------------------------------
//  MY FUNCTIONS
// ------------------------------

// Display prompt with list of 'Manager' options
//-----------------------------
function supervisorStart() {

    inquirer.prompt({
        type: 'list',
        name: 'mode',
        message: 'Welcome Supervisor, Choose an Option:',
        choices: ["View Product Sales by Department", "Create New Department"]

    }).then(function(answer) {
        switch (answer.mode) {
            case 'View Product Sales by Department':
                viewSalesByDepartment();
                break;
            case 'Create New Department':
                createNewDepartment();
                break;
            default:
                supervisorStart();
        }
    });
}

// function to handle posting new items up for auction
function viewSalesByDepartment() {

    var query = "SELECT products.department_id, departments.department_name, departments.over_head_costs, sum(product_sales) as total_sales, (sum(product_sales) - departments.over_head_costs) as total_profit  ";
    query += "FROM products INNER JOIN departments ON (products.department_id = departments.department_id) ";
    query += "GROUP BY products.department_id";

    connection.query(query, function(err, result) {
        console.log(result);
        var rows = [];
        for (var i = 0; i < result.length; i++) {
            var row = [];
            console.log(result[i]);
            row.push(result[i].department_id);
            row.push(result[i].department_name);
            row.push("$" + result[i].over_head_costs);
            1 row.push("$" + result[i].total_sales);
            row.push("$" + result[i].total_profit);
            rows.push(row);
        }

        var t1 = Table(departmentsHeader, rows, {
            borderStyle: 1,
            borderColor: "blue",
            paddingBottom: 0,
            headerAlign: "center",
            align: "center",
            color: "white",
            truncate: "..."
        });

        //render the  tty table
        var str1 = t1.render();
        //print table to console
        console.log(str1);
        supervisorStart();
    });
}


function createNewDepartment() {

   
}



// END OF FILE