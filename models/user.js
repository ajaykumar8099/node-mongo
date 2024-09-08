const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
      minlength: [4, "Name should have atleast 4 characters"],
      maxlength: [12, "Name should have maximum 12 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is Requried"],
      unique: [true, "Email Should be Unique"],
      lowercase: true,
      validate: [validator.isEmail, "Please Enter Valid Email Id"],
    },
    contactNumber: {
      type: String,
      required: [true, "Contact Number is Required"],
      unique: [true, "Contact Number shouldb be unique"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: "Contact Number Should be 10 Characters",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    otp: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model("Users", userSchema);

module.exports = User;
