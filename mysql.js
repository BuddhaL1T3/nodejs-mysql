const mysql = require("mysql");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = require("./config");

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});

const create = async () => {
  try {
    const query = `SELECT schema_name FROM information_schema.schemata WHERE schema_name = '${DB_DATABASE}'`;
    // Check to see if desired DB already exisits
    const check = await db.query(query);
    // if it does not, then create it
    if (check.length === 0) {
      //create db
      await db.query(`CREATE DATABASE '${DB_DATABASE}'`);
      return "Database created";
    } else return `Database ${DB_DATABASE} Connected.`;
  } catch (error) {
    throw error;
  }
};

const connect = async () => {
  try {
    // connect to MySQL
    await db.connect();
    console.log("MySQL Connected...");
    // create the database if needed
    await create();
  } catch (error) {
    console.log("MySQL Couldn't Connect...");
    throw error;
  }
};
module.exports = {
  connect,
  create,
};
