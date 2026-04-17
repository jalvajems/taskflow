import express from 'express';
import { container } from '../config/inversify.config';
import { TYPES } from '../utils/types';
import { ITaskController } from '../controllers/interfaces/ITaskController';

const router = express.Router();
const taskController = container.get<ITaskController>(TYPES.TaskController);

router.post('/', taskController.createTask.bind(taskController));
router.get('/:userId', taskController.getTasks.bind(taskController));
router.put('/:id', taskController.updateTask.bind(taskController));
router.delete('/:id', taskController.deleteTask.bind(taskController));
router.get('/stats/:userId', taskController.getStats.bind(taskController));

export default router;
