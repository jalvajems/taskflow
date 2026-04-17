import { Request, Response } from "express";

export interface ITaskController {
    createTask(req: Request, res: Response): Promise<void>;
    getTasks(req: Request, res: Response): Promise<void>;
    updateTask(req: Request, res: Response): Promise<void>;
    deleteTask(req: Request, res: Response): Promise<void>;
    getStats(req: Request, res: Response): Promise<void>;
}
