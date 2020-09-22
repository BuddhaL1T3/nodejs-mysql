"use strict";

require("dotenv").config();

module.exports = {
  DB_DATABASE: process.env.DB_DATABASE || "my_db",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PASSWORD: process.env.DB_PASSWORD || "secret",
  DB_USER: process.env.DB_USER || "me",
  PORT: process.env.PORT || "3000",
  HOST: process.env.HOST || "localhost",
};
