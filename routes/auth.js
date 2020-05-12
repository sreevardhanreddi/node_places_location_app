const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const authRoutes = require("./../controllers/auth");

router.post(
  "/sign-up/",
  [
    body("username").trim().isLength({ min: 5 }),
    body("email").trim().isLength({ min: 5 }),
    body("password").trim().isLength({ min: 8 }),
  ],
  authRoutes.signUp
);

router.post(
  "/login/",
  [
    body("email").trim().isLength({ min: 5 }),
    body("password").trim().isLength({ min: 8 }),
  ],
  authRoutes.login
);

router.post(
  "/verify",
  [body("token").trim().isLength({ min: 5 })],
  authRoutes.tokenVerify
);

module.exports = router;
