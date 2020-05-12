const express = require("express");
const { body, query } = require("express-validator");

const router = express.Router();

const commonControllers = require("./../controllers/common");

router.get(
  "/places/list/",
  [
    query("name").trim().optional(),
    query("lat").trim().optional().isFloat().toFloat(),
    query("long").trim().optional().isFloat().toFloat(),
    query("distance").trim().optional().isFloat().toFloat(),
  ],
  commonControllers.allPlaces
);

router.get("/category/list/", [], commonControllers.allCategories);

module.exports = router;
