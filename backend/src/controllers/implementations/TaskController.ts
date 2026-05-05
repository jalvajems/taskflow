import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../utils/types';
import { ITaskService } from '../../services/interfaces/ITaskService';
import { ITaskController } from '../interfaces/ITaskController';
import { AuthRequest } from '../../middleware/authMiddleware';
import { STATUS_CODE } from '../../constants/StatusCode';

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
                res.status(STATUS_CODE.UNAUTHORIZED).json({ message: "Unauthorized" });
                return;
            }
            const taskData = { ...req.body, userId };
            const task = await this.taskService.createTask(taskData);
            res.status(STATUS_CODE.CREATED).json(task);
        } catch (error: unknown) {
            res.status(STATUS_CODE.BAD_REQUEST).json({ message: error instanceof Error ? error.message : "An unknown error occurred" });
        }
    }

    async getTasks(req: Request, res: Response): Promise<void> {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.user?.id;
            if (!userId) {
                res.status(STATUS_CODE.UNAUTHORIZED).json({ message: "Unauthorized" });
                return;
            }

            const status = req.query.status as string | undefined;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await this.taskService.getTasksByUser(userId, status, page, limit);
            res.status(STATUS_CODE.SUCCESS).json(result);
        } catch (error: unknown) {
            res.status(STATUS_CODE.BAD_REQUEST).json({ message: error instanceof Error ? error.message : "An unknown error occurred" });
        }
    }

    async updateTask(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const task = await this.taskService.updateTask(id, req.body);
            res.status(STATUS_CODE.SUCCESS).json(task);
        } catch (error: unknown) {
            res.status(STATUS_CODE.BAD_REQUEST).json({ message: error instanceof Error ? error.message : "An unknown error occurred" });
        }
    }

    async deleteTask(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            await this.taskService.deleteTask(id);
            res.status(STATUS_CODE.SUCCESS).json({ message: "Task deleted successfully" });
        } catch (error: unknown) {
            res.status(STATUS_CODE.BAD_REQUEST).json({ message: error instanceof Error ? error.message : "An unknown error occurred" });
        }
    }

    async getStats(req: Request, res: Response): Promise<void> {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.user?.id;
            if (!userId) {
                res.status(STATUS_CODE.UNAUTHORIZED).json({ message: "Unauthorized" });
                return;
            }
            const stats = await this.taskService.getTaskStats(userId);
            res.status(STATUS_CODE.SUCCESS).json(stats);
        } catch (error: unknown) {
            res.status(STATUS_CODE.BAD_REQUEST).json({ message: error instanceof Error ? error.message : "An unknown error occurred" });
        }
    }
}
