import { Model } from 'mongoose';
import { BaseRepository } from './BaseRepository';
import { IUserRepository } from '../interfaces/IUserRepository';
import { IUser } from '../../interfaces/IUser';
import User from '../../models/User';
import { injectable } from 'inversify';

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
    constructor() {
        super(User);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await this.model.findOne({ email }).exec();
    }
}
