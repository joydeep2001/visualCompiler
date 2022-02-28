const { ThreeDModel } = require("../models/threeDModels");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    let threeDModels = await ThreeDModel.find();
    console.log(threeDModels);
    res.status(200).send(threeDModels);
  } catch (err) {
    console.log("error", err);
    res.status(500).send("Cant fetch the models");
  }
});

module.exports = router;
