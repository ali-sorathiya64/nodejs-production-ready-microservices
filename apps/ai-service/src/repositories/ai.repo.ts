import { getPool } from "shared";
import { Summary, TaskRow, TimelineRow } from "../types/types";

export const findTask = async (taskId: string): Promise<TaskRow | null> => {
    const result = await getPool().query<TaskRow>(
        `SELECT id, title, status, created_by, created_at FROM tasks WHERE id = $1`,
        [taskId]
    );
    return result.rows[0] ?? null;
};

export const getTimeline = async (taskId: string): Promise<TimelineRow[]> => {
    const result = await getPool().query<TimelineRow>(
        `SELECT event_type, message, created_at
         FROM task_workflows WHERE task_id = $1
         ORDER BY created_at ASC`,
        [taskId]
    );
    return result.rows;
};

export const saveSummary = async (input: {
    taskId: string;
    requestedBy: string;
    output: string;
    model: string;
}): Promise<Summary> => {
    const result = await getPool().query<Summary>(
        `INSERT INTO ai_summaries(task_id, requested_by, output, model)
         VALUES ($1, $2, $3, $4)
         RETURNING id, task_id, requested_by, output, model, created_at`,
        [input.taskId, input.requestedBy, input.output, input.model]
    );
    return result.rows[0];
};

export const listSummaries = async (taskId: string): Promise<Summary[]> => {
    const result = await getPool().query<Summary>(
        
        `SELECT id, task_id, requested_by, output, model, created_at
         FROM ai_summaries WHERE task_id = $1

         ORDER BY created_at DESC`,
        [taskId]
    );
    return result.rows;
};