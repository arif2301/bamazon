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
            name: "choice",
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
       
            console.log("good choice");
            // re-prompt the user for if they want to bid or post
            start();
        })          
    });
}  
