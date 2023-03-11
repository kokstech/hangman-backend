const express = require("express");
const app = express();
const { validationResult } = require("express-validator");

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array()[0] });
  } else {
    next();
  }
};

module.exports = validationMiddleware;
