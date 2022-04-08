-- This will drop/delete the tables every time you run the schema.sql file, ensuring that you start with a clean slate.
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS parties;
-- the order of table creation is vital due to the dependency of the candidates table on the existence of a parties.id. In the same regard, the candidates table must be dropped before the parties table due to the foreign key constraint that requires the parties table to exist.

CREATE TABLE parties (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT
);

-- we used a TEXT data type for description instead of VARCHAR. A party's description has the potential to be anywhere from one to several sentences long, but the VARCHAR data type must declare a limit on the length. TEXT, on the other hand, can store much longer strings of varying length.


CREATE TABLE candidates (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  party_id INTEGER,
  industry_connected BOOLEAN NOT NULL,
  CONSTRAINT fk_party FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE SET NULL
);
-- constraint. This allows us to flag the party_id field as an official foreign key and tells SQL which table and field it references. In this case, it references the id field in the parties table. This ensures that no id can be inserted into the candidates table if it doesn't also exist in the parties table. MySQL will return an error for any operation that would violate a constraint. Because this constraint relies on the parties table, the parties table MUST be defined first before the candidates table. Make sure to order your tables in schema.sql correctly. Because we've established a strict rule that no candidate can be a member of a party that doesn't exist, we should also consider what should happen if a party is deleted. In this case, we added ON DELETE SET NULL to tell SQL to set a candidate's party_id field to NULL if the corresponding row in parties is ever deleted.