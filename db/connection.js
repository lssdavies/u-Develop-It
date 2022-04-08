const mysql = require("mysql2");
// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // Your MySQL username,
    user: "root",
    // Your MySQL password
    password: "Laradav!980",
    database: "election",
  },
  console.log("Connected to the election database.")
);

//file is its own module, you'll need to export it and then import it into server.js ie. add const db = require('./db/connection'); to the top of server.js
module.exports = db;