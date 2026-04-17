import { Status } from "../constants/Status";

export interface TaskResponseDto {
    id: string;
    title: string;
    description: string;
    status: "pending" | "completed";
    dueDate: Date;
    createdAt: Date;
}
