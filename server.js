//Setting up express server ie. importing express from npm establishing port variable
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
//connecting to db
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

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//express routes
//test route
app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

//db querys using query method ie. db.query()
/*query() method runs the SQL query and executes the callback with all the resulting rows that match the query. It returns an array of objects, with each object representing a row of the candidates table.*/
// GET a single candidate
db.query(`SELECT * FROM candidates WHERE id = 2`, (err, row) => {
  if (err) {
    console.log(err);
  }
  console.log(row);
});
/* Delete a candidate 
The DELETE statement has a question mark (?) that denotes a placeholder, making this a prepared statement. A prepared statement can execute the same SQL statements repeatedly using different values in place of the placeholder. 
An additional param argument following the prepared statement provides values to use in place of the prepared statement's placeholders. Here, we're hardcoding 1 temporarily to demonstrate how prepared statements work. So this would be the same as saying DELETE FROM candidates WHERE id = 1.*/
db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
  if (err) {
    console.log(err);
  }
  console.log(result);
});
/* Create a candidate 
The SQL command and the SQL parameters were assigned to the sql and params variables respectively to improve the legibility for the call function to the database.
n the SQL command we use the INSERT INTO command for the candidates table to add the values that are assigned to params. The four placeholders must match the four values in params, so we must use an array. Because the candidates table includes four columns—id, first_name, last_name, and industry_connected—we need four placeholders (?) for those four values. The values in the params array must match the order of those placeholders.*/
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
              VALUES (?,?,?,?)`;
const params = [1, "Ronald", "Firbank", 1];

db.query(sql, params, (err, result) => {
  if (err) {
    console.log(err);
  }
  console.log(result);
});

// Default response for any other request (Not Found) this route is always the last route listed
app.use((req, res) => {
  res.status(404).end();
});

//start the Express.js server on port 3001.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
