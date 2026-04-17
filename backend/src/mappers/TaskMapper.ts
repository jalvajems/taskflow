import { TaskResponseDto } from '../dtos/TaskResponseDto';
import { ITask } from '../interfaces/ITask';

export class TaskMapper {
    static toResponseDto(task: ITask): TaskResponseDto {
        return {
            id: task._id.toString(),
            title: task.title,
            description: task.description,
            status: task.status,
            dueDate: task.dueDate,
            createdAt: task.createdAt
        };
    }

    static toResponseDtoArray(tasks: ITask[]): TaskResponseDto[] {
        return tasks.map(task => this.toResponseDto(task));
    }
}
