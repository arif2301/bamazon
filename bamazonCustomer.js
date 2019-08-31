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
    start();
  });

function showProducts() {
console.log("Here are the watches you can buy...\n");
connection.query("SELECT product_name, department_name, price FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    
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
        }
        else{
          connection.end();
        }
      });
  }

