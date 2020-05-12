const express = require("express");
const { body, query } = require("express-validator");

const router = express.Router();

const adminControllers = require("./../controllers/admin");

const isAuth = require("./../middleware/isAuth");
const isAdmin = require("./../middleware/isAdmin");

router.post(
  "/add/place/",
  isAuth,
  isAdmin,
  [
    body("name").trim().isLength({ min: 5 }),
    body("description").trim().isLength({ min: 10 }),
    body("acceptsCash").trim().isLength({ min: 10 }),
    body("acceptsCard").trim().isLength({ min: 10 }),
    body("acceptsUpi").trim().isLength({ min: 10 }),
    body("workingDays").trim().isLength({ min: 10 }),
    body("workingHours").trim().isLength({ min: 10 }),
    body("tags").trim().isArray({ max: 3 }),
    body("lat").trim().isFloat().toFloat(),
    body("long").trim().isFloat().toFloat(),
    body("category").trim().isMongoId(),
  ],
  adminControllers.addPlace
);

router.post(
  "/add/category/",
  isAuth,
  isAdmin,
  [
    body("name").trim().isLength({ min: 5 }),
    body("description").trim().isLength({ min: 10 }),
  ],
  adminControllers.addCategory
);
module.exports = router;
