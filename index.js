/** EXTERNAL IMPORTS **/
const express = require("express");
const db = require("./mysql");

/** LOCAL IMPORTS **/
const { PORT, HOST } = require("./config");
const { router: widgetsRouter } = require("./routes/widgets");
const { router: inventorsRouter } = require("./routes/inventors");

// Create express app
const app = express();

// Use body parser from express
app.use(express.json());

// Connect to widgets Router
app.use("/api/widgets", widgetsRouter);
app.use("/api/inventors", inventorsRouter);

// handle a 404 error
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Custom Error Handler
app.use((err, req, res, next) => {
  console.log("XXXXXXXXXXXXXXXXx", err);
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    console.error(JSON.stringify(err, null, 2));
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// run the server
const runServer = (port = PORT, host = HOST) => {
  // try {
  const server = app
    .listen(port, host, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on("error", err => {
      console.error("Server failed to start");
      console.error(JSON.stringify(err, null, 2));
    });

  // }
  //  catch (error) {
  //   console.error("Express failed to start");
  //   console.error(JSON.stringify(err, null, 2));
  // }
};

// If this file (index.js) is run, connect to the database and run the server.
if (require.main === module) {
  db.connect();
  runServer();
}

module.exports = {
  app,
};
