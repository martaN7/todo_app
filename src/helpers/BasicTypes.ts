export interface TaskStatus {
    status: 'open' | 'closed';
}
export interface Task extends TaskStatus {
    name: string;
    description: string;
    addedDate: Date;
    id: number;
    operations: Operation[];
}

export interface OperationTime {
    spentTime: number;
}

export interface Operation extends OperationTime {
    id: number;
    description: string;
    addedDate: Date;
    taskId: number;
}
