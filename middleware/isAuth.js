const jwt = require("jsonwebtoken");
const User = require("./../models/user");

const SECRET = process.env.SECRET || "serversecret";

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token =
      authHeader != null || authHeader != undefined
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
      return res.status(401).end();
    }
    const data = jwt.verify(token, SECRET);
    const user = await User.findById(data.userId);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).end();
  }
};

module.exports = isAuthenticated;
