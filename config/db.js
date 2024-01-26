// connecting to database
const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

const connetion = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});
connetion.connect((error) => {
  if (error) throw error;
  console.log("connection successful");
});

module.exports = connetion;
