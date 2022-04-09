const { User } = require("../models/user");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let users = await User.find();
    console.log(users);
    const responseData = users.map(user =>
      _.pick(user, ["name", "email", "username"])
    );
    console.log(responseData);
    res.status(200).send(responseData);
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Cant fetch the the users");
  }
});

module.exports = router;
