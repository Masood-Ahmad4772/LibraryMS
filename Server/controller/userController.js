const {
  validateUserUpdate,
  validateLogin,
  validateSignup,
  validateUsertype,
  validatePassword,
} = require("../validators/userValidation");
const { Signup, userType } = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { Cart } = require("../models/cartModels");
require("dotenv").config();

const generateToken = (userId, secret, expiresIn) => {
  return jwt.sign({ userId }, secret, { expiresIn });
};
const addUserType = async (req, res) => {
  const { error } = validateUsertype(req.body);
  if (error) return res.status(400).send("Error:" + error);
  try {
    const newUserType = new userType({
      name: req.body.name,
    });
    await newUserType.save();
    res.status(201).send("User Type Added Successfully");
  } catch (err) {
    res.status(500).send("Error:" + err);
  }
};

const getAllUserTypes = async (req, res) => {
  try {
    const userTypes = await userType.find();
    return res.status(200).send(userTypes);
  } catch (err) {
    res.status(500).send("Error:" + err);
  }
};
const getAllActiveTypes = async (req, res) => {
  try {
    const userTypes = await userType.find({ validFlag: true });
    return res.status(200).send(userTypes);
  } catch (err) {
    res.status(500).send("Error:" + err);
  }
};
const updateUserType = async (req, res) => {
  if (!req.params.id) return res.status(400).send("Error: id required");
  const { error } = validateUsertype(req.body);
  if (error) return res.status(400).send("Error:" + error);
  try {
    const updatedUserType = await userType.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedUserType) {
      return res.status(404).send("Error: User Type Not Found");
    }
    res.status(200).send("User Type Updated Successfully");
  } catch (err) {
    res.status(500).send("Error:" + err);
  }
};
const ActivateUser = async (req, res) => {
  if (!req.params.id) return res.status(400).send("Error: id required");
  try {
    const userStatus = await Signup.findByIdAndUpdate(req.params.id, {
      validFlag: true,
    });
    if (!userStatus) {
      res.status(404).send("Error: User  Not Found");
    }
    res.status(200).json("User is Activated");
  } catch (err) {
    res.status(500).json("Error:" + err);
  }
};

const DeactivateUser = async (req, res) => {
  // console.log("reqParams", req.params.id)
  if (!req.params.id) return res.status(400).send("Error: id required");
  try {
    const userStatus = await Signup.findByIdAndUpdate(req.params.id, {
      validFlag: false,
    });
    if (!userStatus) {
      res.status(404).send("Error: User Not Found");
    }
    res.status(200).json("User Deactivated");
  } catch (err) {
    res.status(500).json("Error:" + err);
  }
};
const ActivateUserType = async (req, res) => {
  if (!req.params.id) return res.status(400).send("Error: id required");
  try {
    const userTypeStatus = await userType.findByIdAndUpdate(req.params.id, {
      validFlag: true,
    });
    if (!userTypeStatus) {
      res.status(404).send("Error: User Type Not Found");
    }
    res.status(200).send("User Type Activated");
  } catch (err) {
    res.status(500).send("Error:" + err);
  }
};
const DeactivateUserType = async (req, res) => {
  if (!req.params.id) return res.status(400).send("Error: id required");
  try {
    const userTypeStatus = await userType.findByIdAndUpdate(req.params.id, {
      validFlag: false,
    });
    if (!userTypeStatus) {
      res.status(404).send("Error: User Type Not Found");
    }
    res.status(200).send("User Type Deactivated");
  } catch (err) {
    res.status(500).send("Error:" + err);
  }
};
const userLogin = async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send("Error: " + error);
  try {
    const checkUser = await Signup.findOne({
      userName: req.body.userName,
      validFlag: true,
    }).populate("userType", "name");
    if (!checkUser) {
      return res.status(404).send("Error: UserName not found");
    }
    const passwordMatched = await bcrypt.compare(
      req.body.password,
      checkUser.password
    );
    if (!passwordMatched) {
      return res.status(401).send("Error: Password is not Correct");
    }
    const userTypeName = checkUser.userType.name;
    const userDetails = {
      id: checkUser._id,
      userName: checkUser.userName,
      name: checkUser.name,
    };
    const accessToken = generateToken(
      checkUser._id,
      process.env.JWT_SECRET,
      "1h"
    );
    const refreshToken = generateToken(
      checkUser._id,
      process.env.JWT_REFRESH_SECRET,
      "7d"
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    checkUser.lastActive = new Date();
    await checkUser.save();
    const guestId = req.cookies.guestId;
    let guestCart = null;
    if (guestId) {
      guestCart = await Cart.findOne({ guestId });
    }
    const userCart = await Cart.findOne({ userId: checkUser._id });
    if (guestCart) {
      if (!userCart) {
        guestCart.userId = checkUser._id;
        guestCart.guestId = null;
        await guestCart.save();
      } else {
        guestCart.item.forEach((item) => {
          const index = userCart.item.findIndex((i) =>
            i.book.equals(item.book)
          );
          if (index > -1) {
            userCart.item[index].quantity += item.quantity;
          } else {
            userCart.item.push(item);
          }
        });
        await userCart.save();
        await guestCart.deleteOne();
      }
    }
    res.json({ accessToken, userTypeName, userDetails });
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};
const logoutUser = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.json({ message: "Logged out successfully" });
};

const userSignup = async (req, res) => {
  const { error } = validateSignup(req.body);
  if (error) return res.status(400).send("Error: " + error);
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const userTypeDoc = await userType.findOne({ name: "User" });
    const newUser = new Signup({
      name: req.body.name,
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword,
      userType: userTypeDoc._id,
    });
    const accessToken = generateToken(
      newUser._id,
      process.env.JWT_SECRET,
      "1h"
    );
    const refreshToken = generateToken(
      newUser._id,
      process.env.JWT_REFRESH_SECRET,
      "7d"
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    await newUser.save();
    res.status(201).json({
      msg: "User Created Successfully",
      accessToken,
      newUser: {
        id: newUser._id,
        name: newUser.name,
        userName: newUser.userName,
      },
      userTypeName: userTypeDoc.name,
    });
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};
const adminSignup = async (req, res) => {
  const { error } = validateSignup(req.body);
  if (error) return res.status(400).send("Error: " + error);
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const adminTypeDoc = await userType.findOne({ name: "Admin" });
    const newUser = new Signup({
      name: req.body.name,
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword,
      userType: adminTypeDoc._id,
    });
    await newUser.save();
    res.status(201).json("User Created Successfully");
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};
const getUserById = async (req, res) => {
  if (!req.params.id) return res.status(400).send("Id is Required");
  try {
    const user = await Signup.findById(req.params.id);
    if (!user) {
      return res.status(404).send("Error: User Not Found");
    }
    const userDetails = {
      id: user._id,
      name: user.name,
      userName: user.userName,
      email: user.email,
    };

    res.status(200).send(userDetails);
  } catch (err) {
    res.status(500).send("Error:" + err);
  }
};
const userUpdate = async (req, res) => {
  if (!req.params.id) return res.status(400).send("Error: id required");
  const { error } = validateUserUpdate(req.body);
  if (error) return res.status(400).send("Error: " + error);
  try {
    const newUser = await Signup.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!newUser) {
      return res.status(404).send("Error: User Type Not Found");
    }
    res.status(200).json({msg:"User Updated Successfully", newUser});
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};
const changePassword = async (req, res) => {
  const { error } = validatePassword(req.body);
  if (error) return res.status(400).send("Error: " + error);
  try {
    const user = await Signup.findOne({ userName: req.body.userName });
    if (!user) {
      return res.status(404).send("Error: User Not Found");
    }
    const passwordMatch = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );
    if (!passwordMatch) {
      return res.status(401).send("Error: Old Password is not Correct");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.newPassword, salt);
    const updatedPassword = await Signup.findOneAndUpdate(
      { userName: req.body.userName },
      { password: hashedpassword },
      { new: true }
    );
    if (!updatedPassword) {
      return res.status(400).send("Error: Password not updated");
    }
    res.status(200).send("Password Updated Successfully");
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};
const getAllUsers = async (req, res) => {
  const type = req.query.type;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const userTypeDoc = await userType.findOne({
      name: type.charAt(0).toUpperCase() + type.slice(1),
    });
    if (!userTypeDoc) return res.status(404).send("User type not found");
    const users = await Signup.find({ userType: userTypeDoc._id })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("userType", "name");
    const totalRecords = await Signup.countDocuments({
      userType: userTypeDoc._id,
    });
    const userNames = users.map((user) => ({
      id: user._id,
      name: user.name,
      userName: user.userName,
      email: user.email,
      validFlag:user.validFlag,
    }));
    res.status(200).json({
      totalRecords: totalRecords,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      userNames,
    });
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

module.exports = {
  logoutUser,
  adminSignup,
  changePassword,
  userUpdate,
  userLogin,
  userSignup,
  getAllUsers,
  addUserType,
  updateUserType,
  getAllUserTypes,
  getAllActiveTypes,
  ActivateUserType,
  DeactivateUserType,
  ActivateUser,
  DeactivateUser,
  getUserById,
};
