import { IUser } from "../../interfaces/IUser";
import { IBaseRepository } from "../interfaces/IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
}
