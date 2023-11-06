const express = require("express");
const router = express.Router();

const tea_controller = require("../controllers/teaController");

router.get("/create", tea_controller.tea_create_get);
router.post("/create", tea_controller.tea_create_post);
router.get("/delete/:tea", tea_controller.tea_delete_get);
router.post("/delete/:tea", tea_controller.tea_delete_post);
router.get("/update/:tea", tea_controller.tea_update_get);
router.post("/update/:tea", tea_controller.tea_update_post);
router.get("/:tea", tea_controller.tea_detail);
router.get("/", tea_controller.tea_list);

module.exports = router;
