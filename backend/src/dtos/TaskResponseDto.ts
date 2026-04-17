import { Status } from "../constants/Status";

export interface TaskResponseDto {
    id: string;
    title: string;
    description: string;
    status: Status.PENDING | Status.COMPLETED;
    dueDate: Date;
    createdAt: Date;
}
