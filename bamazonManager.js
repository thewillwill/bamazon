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
    managerStart();
    //  connection.end();
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
                managerStart();
        }
    });
}


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
        managerStart();
    });

}

function displayLowInventory() {
    connection.query("SELECT * FROM products Where stock_quantity < '10'", function(err, result) {
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
        managerStart();
    });
}


// function to handle posting new items up for auction
function addProduct() {

    //GET THE DEPARTMENT CHOICES FROM THE DEPARTMENT TABLE


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
                choices: ["video Games", "Food and Drink", "Apparel", "Camping"]
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

            connection.query("INSERT INTO products SET product_name=?,  department_name=?, price=?, stock_quantity=?", [item.name, item.department, item.price, item.stockQuantity], function(err) {
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


        // prompt for info about the item  to add inventory to
        inquirer.prompt([{
                    name: "id",
                    type: "input",
                    message: "What is the item ID?"
                },
                {
                    name: "stockQuantity",
                    type: "input",
                    message: "What is amount of stock to add quantity?",
                }
            ])
            .then(function(item) {

                var newStock;
                //check the stock
                connection.query("SELECT stock_quantity FROM products WHERE ?", { id: item.id }, function(err, result) {
                    if (err) {
                        throw err;
                    }

                    //record the current stock level to a local variable
                    var newStock = parseInt(result[0].stock_quantity) + parseInt(item.stockQuantity);

                    connection.query("UPDATE products SET stock_quantity=? WHERE id=?", [newStock, item.id], function(err) {
                        if (err) throw err;
                        console.log("Item Added");
                        managerStart();
                    });
                });
            });
    });
}







// // Check if enough stock to place order
// //-----------------------------
// function placeOrder(chosenID, quantityOrdered) {
//     var currentStock = 0;
//     //check the stock
//     connection.query("SELECT stock_quantity FROM products WHERE ?", { id: chosenID }, function(err, result) {
//         if (err) {
//             throw err;
//         }

//         //record the current stock level to a local variable
//         currentStock = result[0].stock_quantity;

//         //check if enough stock
//         if (quantityOrdered > currentStock) {
//             console.log("Not Enough Stock, We only have", currentStock, "in warehouse");
//             managerStart();
//         }
//         //if enough go ahead with order
//         else {
//             //update database to reflect the remaining quantity
//             adjustStock(chosenID, quantityOrdered, currentStock);
//         }
//     });
// }

// // adjust the stock remaining in database
// //-----------------------------
// function adjustStock(chosenID, quantityOrdered, currentStock) {
//     var remainingStock = (currentStock - quantityOrdered);
//     connection.query("UPDATE products SET stock_quantity=? WHERE id=?", [remainingStock, chosenID], function(err) {
//         if (err) throw err;
//         console.log("Stock Updated");
//     });
//     //Once the update goes through, show the customer the total cost of their purchase
//     calculateOrderTotal(chosenID, quantityOrdered);
// }


// // Calculate the total price of the order
// //-----------------------------
// function calculateOrderTotal(chosenID, quantityOrdered) {
//     console.log('calculateOrderTotal');
//     connection.query("SELECT price FROM products WHERE ?", { id: chosenID }, function(err, result) {
//         if (err) throw err;
//         var totalPrice = result[0].price * quantityOrdered;
//         console.log("Total Cost of Purchase: $" + totalPrice)
//         managerStart();
//     });

// }



// END OF FILE