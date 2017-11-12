var mysql = require("mysql");
var inquirer = require("inquirer");

//for printing table
var Table = require('tty-table')
var chalk = require('chalk');


// ------------------------------
//  GLOBAL VARIABLES
// ------------------------------

//formatting for the header of the table that gets console logged
var itemsHeader = [{
        value: "ID",
        headerColor: "cyan",
        color: "white",
        align: "left",
        paddingLeft: 5,
        width: 15
    },
    {
        value: "Name",
        headerColor: "cyan",
        color: "white",
        align: "left",
        paddingLeft: 5,
        width: 30
    }, {
        value: "Price",
        headerColor: "cyan",
        color: "white",
        align: "left",
        paddingLeft: 5,
        width: 20
    }, {
        value: "Stock",
        headerColor: "cyan",
        color: "white",
        align: "left",
        paddingLeft: 5,
        width: 18
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
    //go to welcome screen/user prompt
    managerStart();
});


// ------------------------------
//  MY FUNCTIONS
// ------------------------------

// Display prompt with list of 'Manager' options
//-----------------------------
function managerStart() {
    inquirer.prompt({
        type: 'list',
        name: 'mode',
        message: 'Welcome Manager, Choose an Option:',
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]

    }).then(function(answer) {
        switch (answer.mode) {
            case 'View Products for Sale':
                displayProducts();
                break;
            case 'View Low Inventory':
                displayLowInventory();
                break;
            case 'Add to Inventory':
                addInventory();
                break;
            case 'Add New Product':
                addProduct();
                break;
            default:
                //go to welcome screen/user prompt
                managerStart();
        }
    });
}

// Display a table of prodcts with list of 'Manager' options
//-----------------------------
function displayProducts() {
    connection.query("SELECT * FROM products", function(err, result) {
        if (err) {
            throw err;
        }
        var rows = [];
        for (var i = 0; i < result.length; i++) {
            var row = [];
            row.push(result[i].id);
            row.push(result[i].product_name);
            row.push("$" + result[i].price);
            row.push(result[i].stock_quantity);
            rows.push(row);
        }

        var t1 = Table(itemsHeader, rows, {
            borderStyle: 1,
            borderColor: "blue",
            paddingBottom: 0,
            headerAlign: "center",
            align: "center",
            color: "white",
            truncate: "..."
        });

        str1 = t1.render();
        console.log(str1);
        //go to welcome screen/user prompt
        managerStart();
    });

}

// Display prompt with list of 'Manager' options
//-----------------------------
function displayLowInventory() {

    // prompt for info about the item being added
    inquirer
        .prompt({
            name: "stockAmount",
            type: "input",
            message: "You will be shown all products with stock lower than (enter number):"
        }).then(function(item) {
            connection.query("SELECT * FROM products Where stock_quantity < ?", item.stockAmount, function(err, result) {
                if (err) {
                    throw err;
                }
                var rows = [];
                for (var i = 0; i < result.length; i++) {
                    var row = [];
                    row.push(result[i].id);
                    row.push(result[i].product_name);
                    row.push("$" + result[i].price);
                    row.push(result[i].stock_quantity);
                    rows.push(row);
                }

                var t1 = Table(itemsHeader, rows, {
                    borderStyle: 1,
                    borderColor: "red",
                    paddingBottom: 0,
                    headerAlign: "center",
                    align: "center",
                    color: "white",
                    truncate: "..."
                });

                var str1 = t1.render();
                console.log(str1);
                //go to welcome screen/user prompt
                managerStart();
            });

        });

}


// function to handle posting new items up for auction
function addProduct() {

    //TODO GET THE DEPARTMENT CHOICES FROM THE DEPARTMENT TABLE

    var deptChoices = [];
    var deptLookup = [];

    connection.query("SELECT department_id, department_name FROM departments", function(err, result) {
        if (err) {
            throw err;
        }
        for (var i = 0; i < result.length; i++) {
            var deptRow = [];
            deptRow.push(result[i].department_id);
            deptRow.push(result[i].department_name);
            deptLookup.push(deptRow);
            deptChoices.push(result[i].department_name);
        }

    });

    // prompt for info about the item being added
    inquirer
        .prompt([{
                name: "name",
                type: "input",
                message: "What is the item name?"
            },
            {
                name: "department",
                type: "list",
                message: "What department would you like to place your item in?",
                choices: deptChoices
            },
            {
                name: "price",
                type: "input",
                message: "What would you like the price to be set at",
            },
            {
                name: "stockQuantity",
                type: "input",
                message: "What is the stock quantity?",
            }
        ])
        .then(function(item) {

            var deptID;
            var deptFound = false;

            //lookup the department ID that matches the department name selected
            for (var i = 0; i < deptLookup.length; i++) {
                if (item.department === deptLookup[i][1]) {
                    deptID = deptLookup[i][0];
                    deptFound = true;
                }
            }
            //display an error in the extremely unlikely event a department is not found
            if (!deptFound) {
                console.log("No Department Found, Try Again");
                managerStart();
            }

            //add the product to the table with the department ID found from above
            connection.query("INSERT INTO products SET product_name=?,  department_id=?, price=?, stock_quantity=?", [item.name, deptID, item.price, item.stockQuantity], function(err) {
                if (err) throw err;
                console.log("Item Added");
                managerStart();
            });
        });
}

function addInventory() {
    connection.query("SELECT * FROM products", function(err, result) {
            if (err) {
                throw err;
            }
            var rows = [];
            for (var i = 0; i < result.length; i++) {
                var row = [];
                row.push(result[i].id);
                row.push(result[i].product_name);
                row.push("$" + result[i].price);
                row.push(result[i].stock_quantity);
                rows.push(row);
            }

            var t1 = Table(itemsHeader, rows, {
                borderStyle: 1,
                borderColor: "blue",
                paddingBottom: 0,
                headerAlign: "center",
                align: "center",
                color: "white",
                truncate: "..."
            });

            var str1 = t1.render();
            console.log(str1);

            var maxID; //get the last ID number


            connection.query("SELECT id FROM products ORDER BY id DESC LIMIT 1", function(err, result) {
                if (err) {
                    throw err;
                }
                maxID = result[0].id;

            });

            // prompt for info about the item  to add inventory to
            inquirer.prompt([{
                name: "id",
                type: "input",
                message: "What is the item ID?",
                //check for a valid item number
                validate: function(value) {
                    //check for a valid ID
                    if (value > 0 && value <= maxID) {
                        return true;
                    }
                    return false;
                }
            }, {
                name: "stockQuantity",
                type: "input",
                message: "What is the amount of stock you want to add?",
            }])
        .then(function(item) {

            var newStock;

            //check the stock
            connection.query("SELECT stock_quantity FROM products WHERE ?", { id: item.id }, function(err, result) {
                if (err) {
                    throw err;
                }

                //add the current stock from database to the newly added amount
                var newStock = parseInt(result[0].stock_quantity) + parseInt(item.stockQuantity);

                //put the new total stock into the database
                connection.query("UPDATE products SET stock_quantity=? WHERE id=?", [newStock, item.id], function(err) {
                    if (err) throw err;
                    console.log("Item Added");
                    //go to welcome screen/user prompt
                    managerStart();
                });
            });
        });
    });
}



// END OF FILE