"use strict";

const express = require("express");
const db = require("../mysql");

const router = express.Router();

router.use(async (req, res, next) => {
  console.log("in route");
  await db.checkTable("widgets", {
    id: "widget_id",
    name: "widget_name",
    desc: "widget_desctiption",
  });
  next();
});

/* === GET (fetch-all) ============================= */
router.get("/", async (req, res, next) => {
  console.log("got in");
});

/* === GET (fetch-one) ============================= */
router.get("/id", async (req, res, next) => {});

/* === POST (create) =============================== */
router.post("/", async (req, res, next) => {});

/* === PUT (update) ================================ */
router.put("/:id", async (req, res, next) => {});

/* === DELETE (remove) ============================= */
router.delete("/:id", async (req, res, next) => {});

module.exports = { router };
