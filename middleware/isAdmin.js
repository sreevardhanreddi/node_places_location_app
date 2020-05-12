const isAdmin = (req, res, next) => {
  const user = req.user;
  if (user && user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Admin access required" });
  }
};
module.exports = isAdmin;
