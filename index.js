const express = require("express");
const db = require("./mysql");
const { PORT } = require("./config");
const { router: widgetsRouter } = require("./routes/widgets");

const app = express();

app.use("/api/widgets", widgetsRouter);

// handle a 404 error
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Custom Error Handler
app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// run the server
const runServer = async (port = PORT) => {
  try {
    const server = await app.listen(port);
    console.info(`App listening on port ${server.address().port}`);
  } catch (error) {
    console.error("Express failed to start");
    console.error(err);
  }
};

if (require.main === module) {
  db.connect();
  runServer();
}

module.exports = {
  app,
};
