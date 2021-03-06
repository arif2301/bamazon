-- sql commands to create database of inventory of watches available for purchase

DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;

USE bamazonDB;


CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price INT(10) NOT NULL,
  stock_quantity INT(10) NOT NULL
);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
	("CHRONOGRAPH STEEL", "RACING", 20000, 10),
    ("CHRONOGRAPH GOLD", "RACING", 23000, 10),
    ("DIVER", "MARINE", 5000, 20),
    ("DIVER EXTREME", "MARINE", 5000, 10),
    ("GMT", "CASUAL", 6000, 10),
    ("CALENDER", "CASUAL", 2000, 20),
    ("PERPETUAL CALENDER", "DRESS", 30000, 5),
    ("PERPETUAL CALENDER PLATINUM", "DRESS", 50000, 5),
    ("TIME ONLY STEEL", "DRESS", 1500, 30),
    ("TIME ONLY GOLD", "DRESS", 10000, 20);

-- run below command if you want to see the table    
-- SELECT * FROM products;
    