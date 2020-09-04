const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { SECRET } = require("../config");

// to register the user (ADMIN, SUPER_ADMIN , USER)

const userRegister = async (userDets, role, res) => {
  try {
    //Validate the username
    let usernameNotTaken = await validateUsername(userDets.username);

    if (!usernameNotTaken) {
      return res.status(400).json({
        message: `Username is already taken`,
        success: false,
      });
    }

    //Validate the email
    let emailNotRegistered = await validateEmail(userDets.email);

    if (!emailNotRegistered) {
      return res.status(400).json({
        message: `Email is already register`,
        success: false,
      });
    }
    //Get the hashed password
    const password = await bcrypt.hash(userDets.password, 12);
    //create a new user
    const newUser = new User({
      ...userDets,
      password,
      role,
    });
    await newUser.save();
    return res.status(201).json({
      message: "Registeration successful",
      success: true,
    });
  } catch (err) {
    //Implement logger function(winston)
    return res.status(500).json({
      message: "cannot create account",
      success: false,
    });
  }
};

// to login the user (ADMIN, SUPER_ADMIN , USER)
const userLogin = async (userCreds, role, res) => {
  let { username, password } = userCreds;
  //check username is in the database
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({
      message: "Invalid  login username",
      success: false,
    });
  }
  // check the role
  if (user.role !== role) {
    return res.status(403).json({
      message: "your role is not match",
      success: false,
    });
  }
  //check the password
  let isMatch = await bcrypt.compare(password, user.password);
  //assign token to user
  if (isMatch) {
    let token = jwt.sign(
      {
        user_id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
      },
      SECRET,
      { expiresIn: "7days" }
    );
    let result = {
      username: user.username,
      role: user.role,
      email: user.email,
      token: `Bearer ${token}`,
      expiresIn: 168,
    };
    return res.status(200).json({
      ...result,
      message: "Now you are logged in",
      success: true,
    });
  } else {
    return res.status(403).json({
      message: "incorrect password",
      success: false,
    });
  }
};

const validateUsername = async (username) => {
  let user = await User.findOne({ username });
  return user ? false : true;
};

const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  return user ? false : true;
};
// passport middleware
const userAuth = passport.authenticate("jwt", { session: false });

//check role middleware
const checkRole = (roles) => {
  return (req, res, next) => {
      !roles.includes(req.user.role)
        ? res.status(401).json("Unauthorized")
        : next();
  }
}

const serializeUser = (user) => {
  return {
    username: user.username,
    email: user.email,
    name: user.name,
    _id: user.id,
    role:user.role,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt,
  };
};

module.exports = {
  checkRole,
  serializeUser,
  userAuth,
  userRegister,
  userLogin,
};
