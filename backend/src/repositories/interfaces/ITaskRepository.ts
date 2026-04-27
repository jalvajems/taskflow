import { ITask } from '../../interfaces/ITask';
import { IBaseRepository } from './IBaseRepository';

export interface ITaskRepository extends IBaseRepository<ITask> {
    findByUserId(userId: string): Promise<ITask[]>;
    findPaginatedByUserId(userId: string, filterStatus?: string, page?: number, limit?: number): Promise<{ tasks: ITask[], total: number }>;
}
