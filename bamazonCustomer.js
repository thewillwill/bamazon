var mysql = require("mysql");
var inquirer = require("inquirer");

//for printing table
var Table = require('tty-table')
var chalk = require('chalk');


// ------------------------------
//  GLOBAL VARIABLES
// ------------------------------

//formatting for the header of the items table that gets console logged
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
    }
]

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
    displayAllItems();
});

//return user to welcome/start prompt function 
function customerStart() {
    var maxID; //get the last ID number

    var chosenID; //store the user selected product ID

    connection.query("SELECT id FROM products ORDER BY id DESC LIMIT 1", function(err, result) {
        if (err) {
            throw err;
        }
        maxID = result[0].id;

    });

    inquirer.prompt({
        type: 'input',
        name: 'productID',
        message: 'What is the ID of the product you would like to buy? (press q to Quit)',
        validate: function(value) {
            //check for a valid ID
            if (value > 0 && value <= maxID || value === 'q') {
                return true;
            }
            return false;
        }

    }).then(function(answer) {

        if (answer.productID == 'q') {
             connection.end();
             return;
        }

        //record the ID of the product to pass to function outside of this scope
        chosenID = answer.productID;

        inquirer.prompt({
            type: 'input',
            name: 'quantity',
            message: 'How Many Units would you like to buy?',
            validate: function(value) {
                //check for a number
                if (!isNaN(value)) {
                    return true;
                }
                return false;
            }
        }).then(function(answer) {
            placeOrder(chosenID, answer.quantity);
        });
    });
}


// ------------------------------
//  FUNCTIONS
// ------------------------------

// Get all products from database and display in a table in console
//-----------------------------
function displayAllItems() {

    connection.query("SELECT * FROM products", function(err, result) {
        if (err) {
            throw err;
        }
        var rows = [];
        //go through the results and store them in an array of arrays (to display in Table)
        for (var i = 0; i < result.length; i++) {
            var row = [];
            row.push(result[i].id);
            row.push(result[i].product_name);
            row.push("$" + result[i].price);
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
        //render the table
        var str1 = t1.render();
        //display table
        console.log(str1);
        //return user to welcome/start prompt
        customerStart();
    });

}

// Check if enough stock to place order
//-----------------------------
function placeOrder(chosenID, quantityOrdered) {
    var currentStock = 0;
    //check the stock
    connection.query("SELECT stock_quantity FROM products WHERE ?", { id: chosenID }, function(err, result) {
        if (err) {
            throw err;
        }

        //record the current stock level to a local variable
        currentStock = result[0].stock_quantity;

        //check if enough stock
        if (quantityOrdered > currentStock) {
            console.log("Not Enough Stock, We only have", currentStock, "in warehouse");
            //return user to welcome/start prompt
            customerStart();
        }
        //if enough go ahead with order
        else {
            //update database to reflect the remaining quantity
            adjustStock(chosenID, quantityOrdered, currentStock);
        }
    });
}

// adjust the stock remaining in database
//-----------------------------
function adjustStock(chosenID, quantityOrdered, currentStock) {
    var remainingStock = parseInt(currentStock) - parseInt(quantityOrdered);
    connection.query("UPDATE products SET stock_quantity=? WHERE id=?", [remainingStock, chosenID], function(err) {
        if (err) throw err;
        console.log("Stock Updated");
    });
    //Once the update goes through, show the customer the total cost of their purchase
    calculateOrderTotal(chosenID, quantityOrdered);
}


// Calculate the total price of the order
//-----------------------------
function calculateOrderTotal(chosenID, quantityOrdered) {
    //get the orice from the database
    connection.query("SELECT price FROM products WHERE ?", { id: chosenID }, function(err, result) {
        if (err) throw err;
        //calculate the total price
        var totalPrice = result[0].price * quantityOrdered;
        console.log("Total Cost of Purchase: $" + totalPrice);

        //get the current total sales value from DB
        connection.query("SELECT product_sales FROM products WHERE ?", { id: chosenID }, function(err, result) {
            if (err) throw err;
            var currentSales = result[0].product_sales;

            //store the new sales total in the database
            connection.query("UPDATE products SET product_sales=? WHERE id=?", [currentSales + totalPrice, chosenID], function(err) {
                if (err) throw err;
                //return user to welcome/start prompt
                customerStart();
            });

        });
    });

}