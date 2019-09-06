
require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var keys = require("./key.js");
var fs = require("fs");


console.log (keys)
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
// used gitignore and .env to hide my user password
//  password: keys.password,
  password: "",
  database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
    // to ensure connection is completed, take the // out of the next line of code
    // console.log("connected as id " + connection.threadId + "\n");
    start();
  });

function showProducts() {
    console.log("Here are the watches you can buy...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // this function displays the products available to purchase
        for (var i = 0; i < res.length; i++) {
            console.log ("ID: " + res[i].item_id + ", Name: " + res[i].product_name + ", Type: " +res[i].department_name + ", Price: $" + res[i].price)
        }
    });
}

function start() {
    // this is the main function working as the skeleton of the application
    inquirer
      .prompt({
        name: "buy",
        type: "list",
        message: "Buy some watches or exit?",
        choices: ["BUY", "EXIT"]
      })
      .then(function(answer) {
        // based on their answer, exit or buy
        if (answer.buy === "BUY") {
            showProducts();
            shop();
        }
        else{
          connection.end();
        }
      });
  }

function shop() {
// this function checks inventory and processes the purchase
    connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
  
    inquirer
        .prompt([
        {
            name: "id",
            type: "input",
            message: "Please enter the ID of the watch you want to buy."
        },
        {
            name: "amount",
            type: "input",
            message: "How many of these watches do you want to buy?"
        },   
        ])
        
        .then(function(answer) {
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                //find the product chosen
              if (results[i].item_id === parseInt(answer.id)) {
                chosenItem = results[i];
              }
            }
            // determine if we have enough stock
            if (chosenItem.stock_quantity >= parseInt(answer.amount) ) {
                var watchesOrdered = parseInt(answer.amount);
                var remaining = chosenItem.stock_quantity - watchesOrdered;     
                // updates the inventory
                connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                    stock_quantity: remaining
                    },
                    {
                    item_id: chosenItem.item_id
                    }
                ],
                function(error) {
                    if (error) throw err;                   
                },
                );
                // to confirm purchase and total
                var totalPrice = chosenItem.price * watchesOrdered;
                console.log ("your order has gone through successfully" );
                console.log ("your total is : $"+ totalPrice);
                // back to main menu
                start();               
            }
            else {
                // if items not in inventory
                console.log("Insufficient quantity!");
                start();
            }
        })          
    });
}  
