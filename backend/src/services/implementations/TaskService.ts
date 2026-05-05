import { injectable, inject } from 'inversify';
import { TYPES } from '../../utils/types';
import { ITaskRepository } from '../../repositories/interfaces/ITaskRepository';
import { ITaskService } from '../interfaces/ITaskService';
import { io } from '../../server';
import { ITask } from '../../interfaces/ITask';
import { TaskResponseDto } from '../../dtos/TaskResponseDto';
import { TaskMapper } from '../../mappers/TaskMapper';

@injectable()
export class TaskService implements ITaskService {
    private taskRepository: ITaskRepository;

    constructor(
        @inject(TYPES.TaskRepository) taskRepository: ITaskRepository
    ) {
        this.taskRepository = taskRepository;
    }

    async createTask(data: Partial<ITask>): Promise<TaskResponseDto> {
        const task = await this.taskRepository.create(data);
        
        io.to(data.userId!.toString()).emit('task_created', task);
        
        return TaskMapper.toResponseDto(task);
    }

    async getTasksByUser(userId: string, filterStatus?: string, page: number = 1, limit: number = 10): Promise<{ tasks: TaskResponseDto[], total: number }> {
        const { tasks, total } = await this.taskRepository.findPaginatedByUserId(userId, filterStatus, page, limit);
        return {
            tasks: TaskMapper.toResponseDtoArray(tasks),
            total
        };
    }

    async updateTask(id: string, data: Partial<ITask>): Promise<TaskResponseDto | null> {
        const task = await this.taskRepository.update(id, data);
        if (task) {
            io.to(task.userId.toString()).emit('task_updated', task);
            return TaskMapper.toResponseDto(task);
        }
        return null;
    }

    async deleteTask(id: string): Promise<boolean> {
        const task = await this.taskRepository.findById(id);
        if (task) {
            const success = await this.taskRepository.delete(id);
            if (success) {
                io.to(task.userId.toString()).emit('task_deleted', id);
            }
            return success;
        }
        return false;
    }

    async getTaskStats(userId: string): Promise<any> {
        const tasks = await this.taskRepository.findByUserId(userId);
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const pending = total - completed;
        const overdue = tasks.filter(t => t.status === 'pending' && t.dueDate < new Date()).length;

        return { total, completed, pending, overdue };
    }
}
