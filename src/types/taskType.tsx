export interface Task {
    _id: number;
    taskName: string;
    description: string;
    priorityLevel: string;
    startDate: Date | null;
    endDate: Date | null;
    status: string;
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
};