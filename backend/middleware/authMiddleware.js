import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET); //jwt.verify takes in a token and the secret and decodes the information in the token
      //console.log(decoded); //this logs the decoded information (which includes the user ID but no other user information, as that's all we put in when we generated the token using generateToken.js)
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorised, token failed');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorised, no token');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorised as an admin');
  }
};

export { protect, admin };
