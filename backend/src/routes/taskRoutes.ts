import express from 'express';
import { container } from '../config/inversify.config';
import { TYPES } from '../utils/types';
import { ITaskController } from '../controllers/interfaces/ITaskController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { createTaskSchema, updateTaskSchema, taskIdSchema } from '../utils/schemas';

const router = express.Router();
const taskController = container.get<ITaskController>(TYPES.TaskController);

router.use(authMiddleware);

router.post('/', validate(createTaskSchema), taskController.createTask.bind(taskController));
router.get('/', taskController.getTasks.bind(taskController));
router.put('/:id', validate(updateTaskSchema), taskController.updateTask.bind(taskController));
router.delete('/:id', validate(taskIdSchema), taskController.deleteTask.bind(taskController));
router.get('/stats', taskController.getStats.bind(taskController));

export default router;
