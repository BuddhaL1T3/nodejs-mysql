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

const checkTable = async (name, columns) => {
  const checkQuery = `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '${DB_DATABASE}' AND table_name = '${name}'`;
  // Check to see if desired table already exisits
  await db.query(checkQuery, async (err, rows) => {
    if (err) {
      console.log(`Error checking for table '${name}'`);
      console.log(`Error: ${JSON.stringify(err, null, 2)}`);
    } else if (rows.length === 0) {
      // if it does not exist, create it
      const createQuery = `CREATE TABLE ${name}(${columns.id} int NOT NULL AUTO_INCREMENT, ${columns.name} VARCHAR(50) NOT NULL, ${columns.desc} VARCHAR(50)), PRIAMRY KEY(${columns.id})`;
      await db.query(createQuery, err => {
        if (err) {
          console.log(`Error creating table '${name}'`);
          console.log(`Error: ${JSON.stringify(err, null, 2)}`);
        } else {
          console.log(`Table '${name}' created`);
        }
      });
    } else {
      console.log(`Table '${name}' confirmed`);
    }
  });
  return;
};
module.exports = {
  connect,
  checkTable,
};
