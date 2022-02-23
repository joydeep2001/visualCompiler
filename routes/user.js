const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne().or([
    { username: req.body.username },
    { email: req.body.email },
  ]);

  if (user)
    return res.status(400).send("Username or email already registered..");

  user = new User(_.pick(req.body, ["name", "email", "username", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  res.status(200).send(_.pick(user, ["name", "email"]));
});

module.exports = router;
