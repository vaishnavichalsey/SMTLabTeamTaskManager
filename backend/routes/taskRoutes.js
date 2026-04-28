import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { getTasks, createTask, updateTask } from '../controllers/taskController.js';

const router = express.Router();

router.get('/', authMiddleware, getTasks);
router.post('/', authMiddleware, roleMiddleware, createTask);
router.put('/:id', authMiddleware, updateTask);

export default router;
