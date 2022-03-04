const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.mongoConnectionString)
  .then(() => console.log("connected to mongodb"))
  .catch(err => console.log("couldnot connect"));
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
    minlength: 3,
    maxlength: 16,
  },
  password: { type: String, required: true, minlength: 5, maxlength: 1024 },
  googleLoginId: String,
  isActivated: { type: Boolean, default: true },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
  return token;
};

const User = mongoose.model("User", userSchema);
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    username: Joi.string().min(3).max(16).required(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
