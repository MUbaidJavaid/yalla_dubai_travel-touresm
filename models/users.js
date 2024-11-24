const mongoose = require("mongoose");
const validator = require("validator");

const loginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Invalid email format"],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
});

const collection = new mongoose.model("users", loginSchema);
module.exports = {
  collection,
};
