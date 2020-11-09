import express from 'express';
const router = express.Router();
import { authUser, getUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/login', authUser); //we use post because we are only posting, so we don't have to user router.route().post. we use /login because it's being hooked to api/users.
router.route('/profile').get(protect, getUserProfile); //to implement middleware we just add it as the first argument to the request (protect is the middleware)

export default router;
