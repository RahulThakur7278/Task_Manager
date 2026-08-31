import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
  getAnalytics,
  getRecentTasks,
  createTaskSchema,
  updateTaskSchema,
  reorderSchema,
  getTaskById,
} from '../controllers/taskController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// All task routes require authentication
router.use(authMiddleware);

router.get('/analytics', getAnalytics);
router.get('/recent-tasks', getRecentTasks);
router.get('/', getTasks);
router.post('/', validate(createTaskSchema), createTask);
router.put('/reorder', validate(reorderSchema), reorderTasks);
router.get('/:id', getTaskById);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
