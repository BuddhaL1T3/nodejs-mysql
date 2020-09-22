/**
 * Determines if the value exists and is not null or undefined.
 * Sends fail message on lack of existence.
 *
 * @param {*} val The value to check
 * @param {*} res The HTTP response object
 * @param {string} name The name of the required variable
 *
 * @returns True if the value is given
 */
const given = (givenVal, expectedVal) => {
  const isMissing = givenVal === null || givenVal === undefined;

  if (isMissing) {
    const err = new Error();
    err.code = 400;
    err.message = `Missing required field of ${expectedVal}`;
    err.reason = "Bad Request";
    throw err;
  }

  return !isMissing;
};

/**
 * Catches all uncaught errors on an async endpoint. Wrap async endpoints in
 * this function to avoid try/catches in each one.
 *
 * @param {*} fn
 */
const asyncCatcher = fn => (req, res, next) =>
  fn(req, res, next).catch(err => {
    if (err) {
      console.log("Error", JSON.stringify(err, null, 2));
      return res.status(err.code).json(err);
    }
    next();
  });

module.exports = {
  given,
  asyncCatcher,
};
