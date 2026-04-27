import "reflect-metadata";
import { Container } from "inversify";

// Repositories
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { UserRepository } from "../repositories/implementations/UserRepository";
import { ITaskRepository } from "../repositories/interfaces/ITaskRepository";
import { TaskRepository } from "../repositories/implementations/TaskRepository";
import { TYPES } from "../utils/types";
import { IAuthService } from "../services/interfaces/IAuthService";
import { AuthService } from "../services/implementations/AuthService";
import { IOtpRepository } from "../repositories/interfaces/IOtpRepository";
import { OtpRepository } from "../repositories/implementations/OtpRepository";
import { IAuthController } from "../controllers/interfaces/IAuthController";
import { AuthController } from "../controllers/implementations/AuthController";
import { ITaskController } from "../controllers/interfaces/ITaskController";
import { TaskController } from "../controllers/implementations/TaskController";

const container = new Container();

// Bind Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container.bind<ITaskRepository>(TYPES.TaskRepository).to(TaskRepository).inSingletonScope();
container.bind<IOtpRepository>(TYPES.OtpRepository).to(OtpRepository).inSingletonScope();

// Bind Services
container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
import { ITaskService } from "../services/interfaces/ITaskService";
import { TaskService } from "../services/implementations/TaskService";
container.bind<ITaskService>(TYPES.TaskService).to(TaskService).inSingletonScope();

// Bind Controllers
container.bind<IAuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
container.bind<ITaskController>(TYPES.TaskController).to(TaskController).inSingletonScope();


// (We will add Services and Controllers here as we build them)

export { container };
