"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskMapper = void 0;
class TaskMapper {
    static toResponseDto(task) {
        return {
            id: task._id.toString(),
            title: task.title,
            description: task.description,
            status: task.status,
            dueDate: task.dueDate,
            createdAt: task.createdAt
        };
    }
    static toResponseDtoArray(tasks) {
        return tasks.map(task => this.toResponseDto(task));
    }
}
exports.TaskMapper = TaskMapper;
