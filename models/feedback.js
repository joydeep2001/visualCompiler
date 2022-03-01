const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  feedback: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 2000,
  },
});

const Feedback = mongoose.model("feedback", feedbackSchema);

exports.Feedback = Feedback;
