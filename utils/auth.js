const bcrypt = require("bcryptjs");
const User = require("../models/User");

// to register the user (ADMIN, SUPER_ADMIN , USER)

const userRegister = async (userDets, role, res) => {
  try {
    //Validate the username
    let usernameNotTaken = await validateUsername(userDets.username);
    
    if (!usernameNotTaken) {
      return res.status(400).json({
        message: `Username is already taken`,
        success: false
      });
    }

    //Validate the email
    let emailNotRegistered = await validateEmail(userDets.email);
    
    if (!emailNotRegistered) {
      return res.status(400).json({
        message: `Email is already register`,
        success: false
      });
    }
    //Get the hashed password
    const password = await bcrypt.hash(userDets.password, 12);
    //create a new user
    const newUser = new User({
      ...userDets,
      password,
      role
    });
    await newUser.save();
    return res.status(201).json({
      message: "Registeration successful",
      success:true
    });
  } catch (err) {
    //Implement logger function(winston)
    return res.status(500).json({
      message: "cannot create account",
      success: false
    });
  }
};

const validateUsername = async (username) => {
  let user = await User.findOne({ username });
  return user ? false : true;
};

const validateEmail = async (email) => {
  let user = await User.fineOne({ email });
  return user ? false : true;
};

module.exports ={
  userRegister
} ;
