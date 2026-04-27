import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../utils/types';
import { ITaskService } from '../../services/interfaces/ITaskService';
import { ITaskController } from '../interfaces/ITaskController';
import { AuthRequest } from '../../middleware/authMiddleware';

@injectable()
export class TaskController implements ITaskController {
    constructor(
        @inject(TYPES.TaskService) private taskService: ITaskService
    ) { }

    async createTask(req: Request, res: Response): Promise<void> {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.user?.id;
            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const taskData = { ...req.body, userId };
            const task = await this.taskService.createTask(taskData);
            res.status(201).json(task);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getTasks(req: Request, res: Response): Promise<void> {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.user?.id;
            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const status = req.query.status as string | undefined;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await this.taskService.getTasksByUser(userId, status, page, limit);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateTask(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            // Additional auth check could be done to ensure this task belongs to userId
            // but for now we follow simple logic
            const task = await this.taskService.updateTask(id, req.body);
            res.status(200).json(task);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteTask(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            await this.taskService.deleteTask(id);
            res.status(200).json({ message: "Task deleted successfully" });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getStats(req: Request, res: Response): Promise<void> {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.user?.id;
            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const stats = await this.taskService.getTaskStats(userId);
            res.status(200).json(stats);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
