const express = require("express");
const app = express();
const { validationResult } = require("express-validator");

const validationMiddleware = (req, res, next) => {
  console.log(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array()[0]);
    return res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};

module.exports = validationMiddleware;
