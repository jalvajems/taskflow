import { IOTP } from '../../interfaces/IOtp';
import { IBaseRepository } from './IBaseRepository';

export interface IOtpRepository extends IBaseRepository<IOTP> {
    findLatestByEmail(email: string): Promise<IOTP | null>;
    deleteByEmail(email: string): Promise<boolean>;
}
