import express from 'express';
const router = express.Router();
import { authUser } from '../controllers/userController.js';

router.post('/login', authUser); //we use post because we are only posting, so we don't have to user router.route().post. we use /login because it's being hooked to api/users.

export default router;
