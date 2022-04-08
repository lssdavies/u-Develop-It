const express = require("express");
const router = express.Router();
const db = require("../../db/connection");
const inputCheck = require("../../utils/inputCheck");

/**\
 Before we build the POST route, take a moment to think about how it will be used. The front end will need to send us IDs for the voter and candidate. Both fields are required, meaning we should probably use our friend's inputCheck() function again. We also want to avoid malicious SQL injection, which warrants using prepared statements.
 */
router.post("/vote", ({ body }, res) => {
  // Data validation
  const errors = inputCheck(body, "voter_id", "candidate_id");
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `INSERT INTO votes (voter_id, candidate_id) VALUES (?,?)`;
  const params = [body.voter_id, body.candidate_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: body,
      changes: result.affectedRows,
    });
  });
});

//get votes count route
router.get("/votes", (req, res) => {
  const sql = `SELECT candidates.*, parties.name AS party_name, COUNT(candidate_id) AS count
    FROM votes
    LEFT JOIN candidates ON votes.candidate_id = candidates.id
    LEFT JOIN parties ON candidates.party_id = parties.id
    GROUP BY candidate_id ORDER BY count DESC`;
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

module.exports = router;

// SQL provides a number of aggregate functions that can perform various math-related logic on your data. In the case of COUNT(), it will count how many times a certain field value appears.

// Other useful aggregate functions in SQL include:

// AVG() to return the average value within a group

// SUM() to add up all of the values in a group

// MIN() to return the minimum value of a group

// When you run the SELECT COUNT(candidate_id) statement as-is, however, it simply counts up how many rows there are in the table, which isn't all that helpful. We want to count votes per candidate, not total votes cast.

// This is where the GROUP BY clause comes into play. GROUP BY can consolidate several rows of data, grouping by a shared value (e.g., candidate_id). The nice thing about GROUP BY is that you can then run an aggregate function to retrieve an average, sum, or minimum value from the group.

// The candidate_id field is a foreign key, so we can still join this table with the candidates table. While we're at it, we can also join the candidates table with the parties table to pull in their party affiliation.

// By the looks of it, the JS Juggernauts Party is on fire! This data is essentially what we want, but there are a few more adjustments we can make. For one, we should rename the dynamic COUNT() field to something easier for the front-end team to use. Second, we might as well order these results by vote count so it's easier to see the winner at a glance.

// Update the SQL query to look like this:

// SELECT candidates.*, parties.name AS party_name, COUNT(candidate_id) AS count
// FROM votes
// LEFT JOIN candidates ON votes.candidate_id = candidates.id
// LEFT JOIN parties ON candidates.party_id = parties.id
// GROUP BY candidate_id ORDER BY count DESC;
