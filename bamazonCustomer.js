var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // do .gitignore for this prior submitting
  password: "tarifA1+",
  database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    //showProducts();
    start();
  });

function showProducts() {
    console.log("Here are the watches you can buy...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        for (var i = 0; i < res.length; i++) {
            console.log ("ID: " + res[i].item_id + ", Name: " + res[i].product_name + ", Type: " +res[i].department_name + ", Price: $" + res[i].price)
        }
    });
}



function start() {
    
    inquirer
      .prompt({
        name: "buy",
        type: "list",
        message: "Buy some watches or exit?",
        choices: ["BUY", "EXIT"]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
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
// prompt for info about the item being put up for auction
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
            //message: "How many " + answer.id + "s do you want to buy?"
            message: "How many of these watches do you want to buy?"
        },   
        ])
        
        .then(function(answer) {
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
              if (results[i].item_id === parseInt(answer.id)) {
                chosenItem = results[i];

                console.log ( " chosen item " + chosenItem )
              }
            }
            // determine if bid was high enough
            if (chosenItem.stock_quantity >= parseInt(answer.amount) ) {
                var watchesOrdered = parseInt(answer.amount);
                var remaining = chosenItem.stock_quantity - watchesOrdered;
                
                console.log("remaining   " + remaining)

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
                var totalPrice = chosenItem.price * watchesOrdered;
                console.log ("your order has gone through successfully" );
                console.log ("your total is : $"+ totalPrice);

                connection.query("SELECT * FROM products", function(err, res) {
                    if (err) throw err;
                    for (var i = 0; i < res.length; i++) {
                        console.log ("ID: " + res[i].item_id + ", Name: " + res[i].product_name + ", remaing: " + res[i].stock_quantity)
                    }
                })
                start();
                
            }
            else {
                // bid wasn't high enough, so apologize and start over
                console.log("Insufficient quantity!");
                start();
            }
        })          
    });
}  
