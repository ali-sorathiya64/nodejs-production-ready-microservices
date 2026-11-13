export type Summary = {
    id: string;
    task_id: string;
    requested_by: string;
    output: string;
    model: string;
    created_at: Date;
};

export type TaskRow = {
    id: string;
    title: string;
    status: string;
    created_by: string;
    created_at: Date;
};

export type TimelineRow = {
    event_type: string;
    message: string;
    created_at: Date;
};