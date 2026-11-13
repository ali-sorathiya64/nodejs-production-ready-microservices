import { Summary } from "../types/types";

export const convertSummaryFormat = (summary: Summary) => ({
    id: summary.id,
    taskId: summary.task_id,
    requestedBy: summary.requested_by,
    output: summary.output,
    model: summary.model,
    createdAt: summary.created_at,
});