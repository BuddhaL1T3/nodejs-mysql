"use strict";

/** EXTERNAL IMPORTS **/
const express = require("express");

/** LOCAL IMPORTS **/
const db = require("../mysql");
const { given, asyncCatcher } = require("../utils");

// Establish router
const router = express.Router();

// Create table lables
const table = "widgets";
const columnId = "widget_id";
const columnName = "widget_name";
const columnDesc = "widget_desc";
const columnInventor = "inventor_id";

// Confirm that table exists in db
router.use(
  asyncCatcher(async (req, res, next) => {
    db.checkTable(
      table,
      [
        {
          name: columnId,
          dataType: "INT(11)",
          PK: true,
          NN: true,
          AI: true,
        },
        { name: columnName, dataType: "VARCHAR(50)", NN: true },
        { name: columnDesc, dataType: "VARCHAR(50)" },
        { name: columnInventor, dataType: "INT(11)", NN: true },
      ],
      result => {
        if (result) next();
      }
    );
  })
);

/* === GET (fetch-all) ============================= */
router.get(
  "/",
  asyncCatcher(async (req, res, next) => {
    // MySQL query
    const gatAllQuery = `SELECT * FROM ${table}`;

    // Make query
    db.makeQuery(gatAllQuery, result => {
      // Return request status with payload
      res.status(200).json(result);
    });
  })
);

/* === GET (fetch-one) ============================= */
router.get(
  "/:id",
  asyncCatcher(async (req, res, next) => {
    // Establish inputs
    const { id } = req.params;

    // Verify existance of required inputs
    if (!given(id, "Item ID")) return;

    // MySQL query
    const getQuery = `SELECT * FROM ${table} WHERE ${columnId} = ${id}`;

    // Make query
    db.makeQuery(getQuery, result => {
      // Return request status with payload
      res.status(200).json(result);
    });
  })
);

/* === POST (create) =============================== */
router.post(
  "/",
  asyncCatcher(async (req, res, next) => {
    // Establish inputs
    const {
      [columnName]: name,
      [columnDesc]: desc,
      [columnInventor]: inventor,
    } = req.body;

    // Verify existance of required inputs
    if (!given(name, `Item Name for column: ${columnName}`)) return;
    if (!given(inventor, `Item Inventor for column: ${columnInventor}`)) return;

    // MySQL query
    const createQuery = `INSERT INTO ${table} (${columnName}, ${columnDesc}, ${columnInventor}) VALUES ('${name}', '${
      desc ? desc : "NULL"
    }', ${inventor})`;

    // Make query
    await db.makeQuery(createQuery, result => {
      // Return request status with payload
      res.status(200).json(result);
    });
  })
);

/* === PUT (update) ================================ */
router.put(
  "/:id",
  asyncCatcher(async (req, res, next) => {
    // Establish inputs
    const { id } = req.params;
    const {
      [columnName]: name,
      [columnDesc]: desc,
      [columnInventor]: inventor,
    } = req.body;

    // Verify existance of required inputs
    const hasContent = name || desc || inventor;
    if (!given(id, "Item ID")) return;
    if (
      !given(
        hasContent,
        "Item Name, Item Description, or Item Inventor. Must provide content to update."
      )
    )
      return;

    // Fromat inputs for query
    let updatedFields = "";
    if (name) {
      updatedFields = updatedFields.concat(`${columnName} = '${name}'`);
    }
    if (desc) {
      const notFirst = updatedFields.length > 0;
      updatedFields = updatedFields.concat(
        `${notFirst ? ", " : ""}${columnDesc} = '${desc}'`
      );
    }
    if (inventor) {
      const notFirst = updatedFields.length > 0;
      updatedFields = updatedFields.concat(
        `${notFirst ? ", " : ""}${columnInventor} = '${inventor}'`
      );
    }

    // MySQL query
    const updateQuery = `UPDATE ${table} SET ${updatedFields}  WHERE ${columnId} = '${id}'`;

    // Make query
    await db.makeQuery(updateQuery, result => {
      // Return request status with payload
      res.status(200).json(result);
    });
  })
);

/* === DELETE (remove) ============================= */
router.delete(
  "/:id",
  asyncCatcher(async (req, res, next) => {
    // Establish inputs
    const { id } = req.params;

    // Verify existance of required inputs
    if (!given(id, "Item ID")) return;

    // MySQL query
    const deleteQuery = `DELETE FROM ${table} WHERE ${columnId} = ${id}`;

    // Make query
    db.makeQuery(deleteQuery, result => {
      // Return request status with payload
      res.status(200).json(result);
    });
  })
);

module.exports = { router };
