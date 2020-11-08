import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

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
      token: null,
    });
  } else {
    res.status(401);
    throw new Error(`Invalid email or password`);
  }
});

export { authUser };
