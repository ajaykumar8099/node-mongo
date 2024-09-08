const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const optGenrator = require("otp-generator");

const User = require("../models/user");
const SendEmail = require("../utils/emailVerification");

const SignUp = async (req, res) => {
  try {
    const { name, email, password, contactNumber } = req.body;
    if (!name || !email || !password || !contactNumber) {
      return res.status(401).json({ msg: "Please Enter All required Fields" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      if (userExists.isVerified) {
        return res
          .status(401)
          .json({ msg: "User Already Exists, Please Login" });
      } else {
        const otp = optGenrator.generate(6);
        const sentOtpToEmail = await SendEmail(email, otp);
        if (!sentOtpToEmail) {
          return res
            .status(401)
            .json({ msg: "Failed to Send Email, please try again" });
        }
        userExists.otp = otp;
        await userExists.save();
        return res
          .status(201)
          .json({ msg: "OTP sent to Your Email Address", userExists });
      }
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const otp = optGenrator.generate(6);
    const user = new User({
      name,
      email,
      contactNumber,
      password: hashedPass,
      otp,
    });
    const sentToEmail = await SendEmail(email, otp);
    console.log(sentToEmail, "emil test");
    if(!sentToEmail){
        return res.status(401).json({msg:"Failed to Sent otp, Please try again"})
    }
    await user.save();
    res.status(201).json({ msg: "Otp sent to Your email Address", user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

const EmailOtpVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;
    const user = await User.findById(id);
    if (user.isVerified) {
      return res.status(201).json({
        msg: "Email Already Verfied and You've Successfully Registered",
      });
    }
    if (user.otp === otp) {
      user.otp = null;
      user.isVerified = true;
      await user.save();
      return res.status(201).json({ msg: "Registered Successfully" });
    }
    res.status(401).json({ msg: "Invalid Otp, try Again" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

const SignIn = async (req, res) => {
  try {
    const { password, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "User not found, please register" });
    }
    if (!user.isVerified) {
      return res.status(401).json({
        msg: "User Email is not Verified, Plese try again Signup process",
      });
    }

    const comparepass = await bcrypt.compare(password, user.password);
    if (!comparepass) {
      return res.status(401).json({ msg: "Invalid Password" });
    }

    const payload = { email };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "2d",
    });
    res.status(201).json({ msg: "Login Succesfully", token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

const GetAllUsers = async (req, res) => {
  try {
    const { searchQuery = "", page = 1, size = 5 } = req.query;
    const filterQuery = {};

    if (searchQuery) {
      filterQuery.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
        { contactNumber: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const currentPage = parseInt(page);
    const limit = parseInt(size);
    const skip = (currentPage - 1) * limit;

    const users = await User.find(filterQuery).limit(limit).skip(skip).exec();
    const totalDocuments = await User.countDocuments(filterQuery);

    const totalPages = Math.ceil(totalDocuments / limit);
    const length = users.length;

    res.status(201).json({
      msg: "success",
      totalDocuments,
      currentPage,
      totalPages,
      length,
      users,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

const GetSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }
    res.status(201).json({ msg: "success", user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

const UpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, contactNumber } = req.body;

    const updateQuery = {};

    if (name) {
      updateQuery.name = name;
    }
    if (email) {
      updateQuery.email = email;
    }
    if (contactNumber) {
      updateQuery.contactNumber = contactNumber;
    }
    if (password) {
      const hashedPass = await bcrypt.hash(password, 10);
      updateQuery.password = hashedPass;
    }

    const updateUser = await User.findByIdAndUpdate(id, updateQuery, {
      new: true,
      runValidators:true
    });
    if (!updateUser) {
      return res.status(401).json({ msg: "user not found" });
    }
    res.status(201).json({ msg: "User updated Successfully", updateUser });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

const DeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await User.findByIdAndDelete(id);
    if (!deleteUser) {
      return res.status(401).json({ msg: "user not found" });
    }
    res.status(201).json({ msg: "User Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  SignUp,
  EmailOtpVerification,
  SignIn,
  GetAllUsers,
  GetSingleUser,
  UpdateUser,
  DeleteUser,
};
