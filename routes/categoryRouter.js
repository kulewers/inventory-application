const express = require("express");
const router = express.Router();

const category_controller = require("../controllers/categoryController");

router.get("/create", category_controller.category_create_get);
router.post("/create", category_controller.category_create_post);
router.get("/delete/:category", category_controller.category_delete_get);
router.post("/delete/:category", category_controller.category_delete_post);
router.get("/update/:category", category_controller.category_update_get);
router.post("/update/:category", category_controller.category_update_post);
router.get("/:category", category_controller.category_detail);
router.get("/", category_controller.category_list);

module.exports = router;
