import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(registerUser).get(protect, admin, getUsers); // this is a '/' because user routes is added to the server as /app/users, so if we are trying to post to users we are already there, at root.
router.post('/login', authUser); //we use post because we are only posting, so we don't have to user router.route().post. we use /login because it's being hooked to api/users.
router
  .route('/profile')
  .get(protect, getUserProfile) //to implement middleware we just add it as the first argument to the request (protect is the middleware)
  .put(protect, updateUserProfile); //because it's a route we can just chain get and put requests, which are only activated when called

export default router;
