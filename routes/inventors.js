"use strict";

/** EXTERNAL IMPORTS **/
const express = require("express");

/** LOCAL IMPORTS **/
const db = require("../mysql");
const { given, asyncCatcher } = require("../utils");

// Establish router
const router = express.Router();

// Create table lables
const table = "inventors";
const columnId = "inventor_id";
const columnFirst = "first_name";
const columnLast = "last_name";

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
        { name: columnFirst, dataType: "VARCHAR(50)", NN: true },
        { name: columnLast, dataType: "VARCHAR(50)" },
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
    const { [columnFirst]: firstName, [columnLast]: lastName } = req.body;

    // Verify existance of required inputs
    if (!given(firstName, `Inventor First Name for column: ${columnFirst}`))
      return;

    // MySQL query
    const createQuery = `INSERT INTO ${table} (${columnFirst}, ${columnLast}) VALUES ('${firstName}', '${
      lastName ? lastName : "NULL"
    }')`;

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
    const { [columnFirst]: firstName, [columnLast]: lastName } = req.body;

    const hasContent = firstName || lastName;
    // Verify existance of required inputs
    if (!given(id, "Item ID")) return;
    if (
      !given(
        hasContent,
        "Inventor First Name or Last Name. Must provide content to update."
      )
    )
      return;

    // Fromat inputs for query
    let updatedFields = "";
    if (firstName) {
      updatedFields = updatedFields.concat(`${columnFirst} = '${firstName}'`);
    }
    if (lastName) {
      updatedFields = updatedFields.concat(
        `${updatedFields.length > 0 ? ", " : ""}${columnLast} = '${lastName}'`
      );
    }

    // MySQL query
    const updateQuery = `UPDATE ${table} SET ${updatedFields}  WHERE ${columnId} = ${id}`;

    console.log(updateQuery);
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
