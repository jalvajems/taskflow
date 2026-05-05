import { Model, Document } from 'mongoose';
import { IBaseRepository } from '../interfaces/IBaseRepository';
import { injectable, unmanaged } from 'inversify';

@injectable()
export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
    protected model: Model<T>;

    constructor(@unmanaged() model: Model<T>) { 
        this.model = model;
    }


    async create(data: Partial<T>): Promise<T> {
        return await this.model.create(data);
    }

    async findById(id: string): Promise<T | null> {
        return await this.model.findById(id).exec();
    }

    async findAll(filter: object = {}): Promise<T[]> {
        return await this.model.find(filter).exec();
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id).exec();
        return !!result;
    }
}
