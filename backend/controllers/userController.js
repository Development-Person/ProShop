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

//@desc     Update user profile
//@route    PUT/api/users/profile
//@access   Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password; //this is encrypted automatically because we added the encryption middleware in the model
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//@desc     Get all users
//@route    GET/api/users
//@access   Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

//@desc     Delete a user
//@route    DELETE /api/users/:id
//@access   Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//@desc     Get user by id
//@route    GET/api/users/:id
//@access   Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//@desc     Update user
//@route    PUT/api/users/:id
//@access   Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id); //not req.user._id because that's the logged in user
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin =
      req.body.isAdmin === undefined ? user.isAdmin : req.body.isAdmin;
    /* If req.body.isAdmin is undefined, we fall back to user.isAdmin. 
      We want req.body.isAdmin to be true or false, so checking req.body.isAdmin === undefined as opposed to just req.body.isAdmin allows req.body.isAdmin to equal false if need be.
      
      1. You can't use user.isAdmin = req.body.isAdmin because this will throw an error if you don't pass a value to isAdmin on every request. 
      The problem is that if we don't pass a value for isAdmin in our body, req.body.isAdmin won't be defined.
      Since it's not defined, and user.isAdmin wasn't given a fallback value (like user.name and user.email), 
      an error will get thrown that req.body.isAdmin is a required value we have to send each time we call the userUpdate function.

      2. You can't use user.isAdmin = req.body.isAdmin || user.isAdmin because this won't allow an admin to change an admin to not an admin. 
      If an amin wants to remove admin priveleges, req.body.isAdmin will be false.  Now, if req.body.isAdmin is false, the bad code will just default to user.isAdmin.  
      user.isAdmin is going to be able to get assigned the value in req.body.isAdmin only if req.body.isAdmin is true.
      However, if an admin wants to take away another user's admin rights, they'd be making req.body.isAdmin false, 
      but when the code above is reached, user.isAdmin will stay true!*/

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
