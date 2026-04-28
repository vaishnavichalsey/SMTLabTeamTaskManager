import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { getUsers, createUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware, getUsers);
router.post('/', authMiddleware, roleMiddleware, createUser);

export default router;
