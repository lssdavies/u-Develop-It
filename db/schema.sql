CREATE TABLE parties (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT
);
/*
we used a TEXT data type for description instead of VARCHAR. A party's description has the potential to be anywhere from one to several sentences long, but the VARCHAR data type must declare a limit on the length. TEXT, on the other hand, can store much longer strings of varying length.
*/


CREATE TABLE candidates (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  industry_connected BOOLEAN NOT NULL
);