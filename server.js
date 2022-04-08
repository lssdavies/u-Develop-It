//Setting up express server ie. importing express from npm establishing port variable
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
//importing utility function check inputs
const inputCheck = require("./utils/inputCheck");
//connecting to db importing connection.js
const db = require("./db/connection");
//importing routes from index.js in route folder, dont need to add /index to directory path cause file name is index and node.js will use by default
const apiRoutes = require("./routes/apiRoutes");


// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api", apiRoutes); //By adding the /api prefix here, we can remove it from the individual route expressions

// Default response for any other request (Not Found) this route is always the last route listed
app.use((req, res) => {
  res.status(404).end();
});

//start the Express.js server on port 3001.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
