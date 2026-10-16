const express = require("express");
const router = express.Router();

const {
  registerUserController,
  logInController,
} = require("./users.controller");

//api/register with body of {username,password,email}
router.post("/register", registerUserController);
router.post("/login", logInController);

module.exports = router;
