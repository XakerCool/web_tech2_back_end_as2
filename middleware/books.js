const jwt = require("jsonwebtoken");

exports.isAuthenticated = (req, res, next) => {
  const jwtToken = req.cookies.jwt_token;
  if (!jwtToken) {
    return res.status(401).json({ message: "User is not authorized" });
  }

  try {
    const decodedToken = jwt.verify(jwtToken, "SECRET");
    const userData = decodedToken;
    if (userData) {
      if (req.url.includes("delete")) {
        if (userData.role !== "admin") {
          if (userData.role === "admin") {
            next();
          }
        }
      } else {
        if (userData.role === "admin" || userData.role === "manager") next();
        else res.status(401).json({ message: "User doesn't have permission" });
      }
      next();
    } else {
      res.status(401).json({ message: "User is not authorized" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
