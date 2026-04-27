import { TaskResponseDto } from "../../dtos/TaskResponseDto";
import { ITask } from "../../interfaces/ITask";

export interface ITaskService {
    createTask(data: Partial<ITask>): Promise<TaskResponseDto>;
    getTasksByUser(userId: string, filterStatus?: string, page?: number, limit?: number): Promise<{ tasks: TaskResponseDto[], total: number }>;
    updateTask(id: string, data: Partial<ITask>): Promise<TaskResponseDto | null>;
    deleteTask(id: string): Promise<boolean>;
    getTaskStats(userId: string): Promise<any>;
}
