import { generateToken } from "../helpers/common.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }
    if (password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be minimum 6 characters long",
      });
    }

    const user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .send({ success: false, message: "User already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(200).send({
        success: true,
        message: "User Created Succesfully",
        data: {
          id: newUser._id,
        },
      });
    } else {
      res.status(400).send({
        success: false,
        massage: "invalid user data",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
      data: null,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "Invalid Credentials", data: null });
    let isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(404).send({
        success: false,
        message: "Invalid Credentials",
        data: null,
      });
    generateToken(user._id, res);
    res.status(200).send({
      success: true,
      message: "user found",
      data: { userId: user._id, fullName: user.fullName },
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Something Went Wrong", data: null });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).send({ success: true, message: "logged out successfully" });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error in logout api" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profiePic } = req.body;
    if (!profiePic)
      return res
        .status(400)
        .send({
          success: false,
          message: "profilePic not provided",
          data: null,
        });

    const userId = req.user._id;
    const uploadResponse = await cloudinary.uploader.upload(profiePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "User updated successfully",
      data: { userId: updatedUser._id, name: updatedUser.fullName },
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Something went wrong", data: null });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).send({ success: true, message: "success", data: req.user });
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
