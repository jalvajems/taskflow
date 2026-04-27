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
exports.TaskController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../utils/types");
let TaskController = class TaskController {
    taskService;
    constructor(taskService) {
        this.taskService = taskService;
    }
    async createTask(req, res) {
        try {
            const authReq = req;
            const userId = authReq.user?.id;
            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const taskData = { ...req.body, userId };
            const task = await this.taskService.createTask(taskData);
            res.status(201).json(task);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getTasks(req, res) {
        try {
            const authReq = req;
            const userId = authReq.user?.id;
            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const tasks = await this.taskService.getTasksByUser(userId);
            res.status(200).json(tasks);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async updateTask(req, res) {
        try {
            const id = req.params.id;
            // Additional auth check could be done to ensure this task belongs to userId
            // but for now we follow simple logic
            const task = await this.taskService.updateTask(id, req.body);
            res.status(200).json(task);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async deleteTask(req, res) {
        try {
            const id = req.params.id;
            await this.taskService.deleteTask(id);
            res.status(200).json({ message: "Task deleted successfully" });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getStats(req, res) {
        try {
            const authReq = req;
            const userId = authReq.user?.id;
            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const stats = await this.taskService.getTaskStats(userId);
            res.status(200).json(stats);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};
exports.TaskController = TaskController;
exports.TaskController = TaskController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.TaskService)),
    __metadata("design:paramtypes", [Object])
], TaskController);
