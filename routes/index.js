const express = require("express");
const router = express.Router();

const tea_controller = require("../controllers/teaController");

/* GET home page. */
router.get("/", tea_controller.index);

module.exports = router;
