import { BaseRepository } from './BaseRepository';
import { ITaskRepository } from '../interfaces/ITaskRepository';
import Task from '../../models/Task';
import { ITask } from '../../interfaces/ITask';
import { injectable } from 'inversify';
import { FilterQuery } from 'mongoose';

@injectable()
export class TaskRepository extends BaseRepository<ITask> implements ITaskRepository {
    constructor() {
        super(Task);
    }

    async findByUserId(userId: string): Promise<ITask[]> {
        return await this.model.find({ userId }).exec();
    }

    async findPaginatedByUserId(userId: string, filterStatus?: string, page: number = 1, limit: number = 10): Promise<{ tasks: ITask[], total: number }> {
        const query: FilterQuery<ITask> = { userId };
        if (filterStatus && filterStatus !== 'All') {
            query.status = filterStatus;
        }

        const skip = (page - 1) * limit;
        
        const [tasks, total] = await Promise.all([
            this.model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
            this.model.countDocuments(query).exec()
        ]);

        return { tasks, total };
    }
}
