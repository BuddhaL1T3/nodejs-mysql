const mysql = require("mysql");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = require("./config");

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});

const create = async () => {
  const checkQuery = `SELECT COUNT(*) AS count FROM information_schema.schemata WHERE schema_name = '${DB_DATABASE}'`;
  // Check to see if desired DB already exisits
  await db.query(checkQuery, async (err, rows) => {
    if (err) {
      console.log(`Error checking for database '${DB_DATABASE}'`);
      console.log(`Error: ${JSON.stringify(err, null, 2)}`);
    } else if (rows.length === 0) {
      // if it does not exist, create it
      const createQuery = `CREATE DATABASE '${DB_DATABASE}'`;
      await db.query(createQuery, err => {
        if (err) {
          console.log(`Error creating database '${DB_DATABASE}'`);
          console.log(`Error: ${JSON.stringify(err, null, 2)}`);
        } else {
          console.log(`Database '${DB_DATABASE}' created`);
        }
      });
    } else {
      console.log(`Connected to MySQL: '${DB_DATABASE}'`);
    }
  });
};

const connect = async () => {
  // connect to MySQL
  await db.connect(err => {
    if (err) {
      console.log(`Error connecting to MySQL`);
      console.log(`Error: ${JSON.stringify(err, null, 2)}`);
    }
  });
  // create the database if needed
  await create();
};

const checkTable = (name, columns, callback) => {
  const checkQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = '${DB_DATABASE}' AND table_name = '${name}'`;
  // Check to see if desired table already exisits
  db.query(checkQuery, (err, rows) => {
    if (err) {
      console.log(`Error checking for table '${name}'`);
      console.log(`Error: ${JSON.stringify(err, null, 2)}`);
    } else if (rows[0].count === 0) {
      // If it does not exist, create it

      // Start query
      let createQuery = `CREATE TABLE ${name} (`;

      // Total number of columns for table
      const numOfCols = columns.length - 1;

      // Format each column and scructure the query
      columns.forEach((c, i) => {
        const { name, dataType, PK, NN, AI } = c;
        const type = dataType ? `${dataType} ` : "";
        const pk = PK ? "PRIMARY KEY " : "";
        const nn = NN ? "NOT NULL " : "";
        const ai = AI ? "AUTO_INCREMENT " : "";
        const col = `${name} ${type}${nn}${ai}${pk}${
          i === numOfCols ? ")" : ","
        } `;
        createQuery = createQuery.concat(col);
      });

      // Make query to create table
      db.query(createQuery, err => {
        if (err) {
          console.log(`Error creating table '${name}'`);
          console.log(`Error: ${JSON.stringify(err, null, 2)}`);
        } else {
          console.log(`Table '${name}' created`);
          return callback(true);
        }
      });
    } else {
      console.log(`Table '${name}' confirmed`);
      return callback(true);
    }
  });
};

const makeQuery = (query, callback) => {
  db.query(query, (err, result) => {
    if (err) {
      console.log(`Error executing query '${query}'`);
      console.log(`Error: ${JSON.stringify(err, null, 2)}`);
    } else {
      return callback(result);
    }
  });
};

module.exports = {
  connect,
  checkTable,
  makeQuery,
};
