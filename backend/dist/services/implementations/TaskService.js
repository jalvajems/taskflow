"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../utils/types");
const server_1 = require("../../server"); // Import the socket instance
const TaskMapper_1 = require("../../mappers/TaskMapper");
let TaskService = class TaskService {
    taskRepository;
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async createTask(data) {
        const task = await this.taskRepository.create(data);
        // Real-time update
        server_1.io.to(data.userId.toString()).emit('task_created', task);
        return TaskMapper_1.TaskMapper.toResponseDto(task);
    }
    async getTasksByUser(userId) {
        const tasks = await this.taskRepository.findByUserId(userId);
        return TaskMapper_1.TaskMapper.toResponseDtoArray(tasks);
    }
    async updateTask(id, data) {
        const task = await this.taskRepository.update(id, data);
        if (task) {
            server_1.io.to(task.userId.toString()).emit('task_updated', task);
            return TaskMapper_1.TaskMapper.toResponseDto(task);
        }
        return null;
    }
    async deleteTask(id) {
        const task = await this.taskRepository.findById(id);
        if (task) {
            const success = await this.taskRepository.delete(id);
            if (success) {
                server_1.io.to(task.userId.toString()).emit('task_deleted', id);
            }
            return success;
        }
        return false;
    }
    async getTaskStats(userId) {
        const tasks = await this.taskRepository.findByUserId(userId);
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const pending = total - completed;
        const overdue = tasks.filter(t => t.status === 'pending' && t.dueDate < new Date()).length;
        return { total, completed, pending, overdue };
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.TaskRepository)),
    __metadata("design:paramtypes", [Object])
], TaskService);
