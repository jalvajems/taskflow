import { BaseRepository } from './BaseRepository';
import { ITaskRepository } from '../interfaces/ITaskRepository';
import Task from '../../models/Task';
import { ITask } from '../../interfaces/ITask';
import { injectable } from 'inversify';

@injectable()
export class TaskRepository extends BaseRepository<ITask> implements ITaskRepository {
    constructor() {
        super(Task);
    }

    async findByUserId(userId: string): Promise<ITask[]> {
        return await this.model.find({ userId }).exec();
    }
}
