export const TYPES = {
    // Repositories
    UserRepository: Symbol.for("UserRepository"),
    TaskRepository: Symbol.for("TaskRepository"),

    // Services
    AuthService: Symbol.for("AuthService"),
    TaskService: Symbol.for("TaskService"),

    // Controllers
    AuthController: Symbol.for("AuthController"),
    TaskController: Symbol.for("TaskController"),
};
