//Setting up express server ie. importing express from npm establishing port variable
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
//importing utility function check inputs
const inputCheck = require("./utils/inputCheck");
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
// Get all candidates
app.get("/api/candidates", (req, res) => {
  const sql = `SELECT * FROM candidates`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});
/**
This above route is designated with the endpoint /api/candidates. Remember, the api in the URL signifies that this is an API endpoint. We'll wrap the get() method around the database call. The SQL statement SELECT * FROM candidates is assigned to the sql variable.
ead of logging the error, we'll send a status code of 500 and place the error message within a JSON object. This will all be handled within the error-handling conditional. The 500 status code indicates a server error—different than a 404, which indicates a user request error. The return statement will exit the database call once an error is encountered If there was no error, then err is null and the response is sent back using the following statement:

res.json({
  message: 'success',
  data: rows
});
 */

// Get a single candidate
app.get("/api/candidate/:id", (req, res) => {
  const sql = `SELECT * FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});
/**
 In the database call above we're using the get() route method again. This time, the endpoint has a route parameter that will hold the value of the id to specify which candidate we'll select from the database. we'll assign the captured value populated in the req.params object with the key id to params. The database call will then query the candidates table with this id and retrieve the row specified. Because params can be accepted in the database call as an array, params is assigned as an array with a single element, req.params.id.
 The error status code was changed to 400 to notify the client that their request wasn't accepted and to try a different request. In the route response, we'll send the row back to the client in a JSON object.
 */

// Delete a candidate
app.delete("/api/candidate/:id", (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: "Candidate not found",
      });
    } else {
      res.json({
        message: "deleted",
        changes: result.affectedRows,
        id: req.params.id,
      });
    }
  });
});
/**
 * To delete we must use the HTTP request method delete().The endpoint used here also includes a route parameter to uniquely identify the candidate to remove. Again, we're using a prepared SQL statement with a placeholder. We'll assign the req.params.id to params, as we did in the last route.
 The JSON object route response will be the message "deleted", with the changes property set to result.affectedRows. Again, this will verify whether any rows were changed.
 The else if statement comes in if there are no affectedRows as a result of the delete query, that means that there was no candidate by that id. Therefore, we should return an appropriate message to the client, such as "Candidate not found".
 */

// Create a candidate
app.post("/api/candidate", ({ body }, res) => {
  const errors = inputCheck(
    body,
    "first_name",
    "last_name",
    "industry_connected"
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
  VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.industry_connected];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: body,
    });
  });
});
/**
 we use the HTTP request method post() to insert a candidate into the candidates table. We'll use the endpoint /api/candidate. In the callback function, we'll use the object req.body to populate the candidate's data. Notice that we're using object destructuring to pull the body property out of the request object. Until now, we've been passing the entire request object to the routes in the req parameter. In the callback function block, we assign errors to receive the return from the inputCheck function.
 If the inputCheck() function returns an error, an error message is returned to the client as a 400 status code, to prompt for a different user request with a JSON object that contains the reasons for the errors.
In order to use this function, we must import the module first. line 6 above
the database call here uses a prepared statement that's a bit different than the one we used previously in the lesson. This is because there is no column for the id. MySQL will autogenerate the id and relieve us of the responsibility to know which id is available to populate.

The params assignment contains three elements in its array that contains the user data collected in req.body.

The database call logic is the same as what we previously built to create a candidate. Using the query() method, we can execute the prepared SQL statement. We send the response using the res.json() method with a success message and the user data that was used to create the new data entry.
 */

// Default response for any other request (Not Found) this route is always the last route listed
app.use((req, res) => {
  res.status(404).end();
});

//start the Express.js server on port 3001.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
