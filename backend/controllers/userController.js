import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

/*We are retrieving products in accordance with the schema set out in userModel*/
//@desc     Auth user and get token
//@route    POST/api/users/login
//@access   Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body; //req.body gives us data sent in the body, so we can get req.body.email and req.body.password
  const user = await User.findOne({ email }); //find one document and find it by email
  //we need to match the password. we could do that here but it's better to put a method in the model. so go to userModel.
  //we are sending plain text password but password in the server is encrypted.
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error(`Invalid email or password`);
  }
});

//@desc     Register a new user
//@route    POST/api/users
//@access   Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    //takes the User model and the create method creates a new user based on the Model using the information added.
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      //we send back exactly what we sent with authenticate because we want to authenticate right after we register
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

//@desc     Get user profile
//@route    GET/api/users/profile
//@access   Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('Invalid email or password');
  }
});

export { authUser, registerUser, getUserProfile };
