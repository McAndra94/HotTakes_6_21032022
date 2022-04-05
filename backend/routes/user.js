const express = require("express");
const router = express.Router();
const userController = require("../controllers/user")

router.post("/signup",userController.userSignUp)

module.exports = router;