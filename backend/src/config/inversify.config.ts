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

const container = new Container();

// Bind Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container.bind<ITaskRepository>(TYPES.TaskRepository).to(TaskRepository).inSingletonScope();
container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();

// (We will add Services and Controllers here as we build them)

export { container };
