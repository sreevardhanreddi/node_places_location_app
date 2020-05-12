require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("./../models/user");

const SECRET = process.env.SECRET || "serversecret";
const REFRESH_TOKEN_KEY =
  process.env.REFRESH_TOKEN_KEY || "serversecretforrefershtoken";

exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422);
    return res.json({ error: true, errors });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(400);
      return res.json({ message: "Email is taken" });
    }
    userData = {
      username: email,
      email: email,
      password: await bcrypt.hash(password, 12),
    };
    const data = await User.create(userData);
    res.status(201);
    res.json({ message: "created user", data });
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422);
    return res.json({ error: true, ...errors });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const accessToken = jwt.sign(
          { email: user.email, userId: user.id },
          SECRET,
          { expiresIn: "7d" }
        );
        const refreshToken = jwt.sign(
          { email: user.email, userId: user.id },
          REFRESH_TOKEN_KEY,
          { expiresIn: "7d" }
        );
        res.status(200);
        return res.json({ access: accessToken, refresh: refreshToken });
      } else {
        res.status(400);
        return res.json({ message: "Invalid username or password" });
      }
    }
    res.status(500);
    return res.json({ message: "Invalid username or password" });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
};

exports.tokenVerify = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422);
    return res.json({ error: true, ...errors });
  }
  try {
    const { token } = req.body;
    // decode is used directly decode the payload without any secrets
    // const { email, userId } = jwt.decode(token);
    const { email, userId } = jwt.verify(token, REFRESH_TOKEN_KEY);
    const user = await User.findById(userId);
    console.log(user);
    const accessToken = jwt.sign(
      { email: user.email, userId: user.id },
      SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { email: user.email, userId: user.id },
      REFRESH_TOKEN_KEY,
      { expiresIn: "7d" }
    );
    res.status(200);
    return res.json({ access: accessToken, refresh: refreshToken });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(400);
      return res.json({ message: "invalid token" });
    }
    console.log(err);
    res.status(500).end();
  }
};
