export interface Task {
    _id?: number;
    taskName: string;
    description: string;
    priorityLevel: string;
    timeFocus: string;
    startDate: Date | string | null;
    endDate: Date | string | null;
    status: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
};