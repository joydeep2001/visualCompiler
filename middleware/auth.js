const config = require("config");
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  console.log(req.cookies);
  if (!req.cookies && !req.cookies.authToken) {
    res.status(400).send("invalid token");
    return;
  }
  const token = req.cookies.authToken;
  console.log(token);

  if (!token) return res.status(401).send("Access Denied. No token found");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    console.log(ex);
    res.status(400).send("invalid token");
  }
}

module.exports = auth;
