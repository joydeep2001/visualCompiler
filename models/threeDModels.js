const mongoose = require("mongoose");

const threeDModelSchema = new mongoose.Schema({
  coursename: { type: String, required: true, minlength: 3, maxlength: 255 },
  image: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  link: { type: String },
});

const ThreeDModel = mongoose.model("threeDModels", threeDModelSchema);

exports.ThreeDModel = ThreeDModel;
