import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

//because it's a route we can just chain get and put requests, which are only activated when called
//to implement middleware we just add them as the first arguments to the request (function comes last)
router.route('/').post(registerUser).get(protect, admin, getUsers); // this is a '/' because user routes is added to the server as /app/users, so if we are trying to post to users we are already there, at root.
router.post('/login', authUser); //we use post because we are only posting, so we don't have to user router.route().post. we use /login because it's being hooked to api/users.
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route('/:id').delete(protect, admin, deleteUser);

export default router;
