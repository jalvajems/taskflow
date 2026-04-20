import { injectable } from 'inversify';
import { BaseRepository } from './BaseRepository';
import { IOtpRepository } from '../interfaces/IOtpRepository';
import { IOTP } from '../../interfaces/IOtp';
import Otp from '../../models/Otp';

@injectable()
export class OtpRepository extends BaseRepository<IOTP> implements IOtpRepository {
    constructor() {
        super(Otp);
    }

    async findLatestByEmail(email: string): Promise<IOTP | null> {
        return await this.model.findOne({ email }).sort({ createdAt: -1 }).exec();
    }

    async deleteByEmail(email: string): Promise<boolean> {
        const result = await this.model.deleteMany({ email }).exec();
        return result.acknowledged;
    }
}
