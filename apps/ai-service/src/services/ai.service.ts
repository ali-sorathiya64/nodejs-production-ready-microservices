import { AppError } from "shared";
import * as aiRepo from "../repositories/ai.repo";
import { generateText, MODEL } from "../utils/llm";
import { convertSummaryFormat } from "../utils/ai.util";

const SYSTEM_PROMPT =
    "You are an assistant inside a support-ticket tool. Summarize the task and its " +
    "event timeline in 3-5 short sentences. Mention current status and what happened " +
    "so far. Do not invent facts that are not in the data.";

async function assertTaskAccess(taskId: string, userId: string, role: string) {
    const task = await aiRepo.findTask(taskId);
    if (!task) throw new AppError(404, "Task not found");
    if (role !== "ADMIN" && task.created_by !== userId) {
        throw new AppError(403, "Forbidden");
    }
    return task;
}

export async function summarizeTask(input: { taskId: string; userId: string; role: string }) {
    const task = await assertTaskAccess(input.taskId, input.userId, input.role);
    const timeline = await aiRepo.getTimeline(input.taskId);

    const timelineText = timeline.length
        ? timeline.map((e) => `- ${e.created_at.toISOString()} [${e.event_type}] ${e.message}`).join("\n")
        : "(no events yet)";

    const prompt =
        `Task title: ${task.title}\nStatus: ${task.status}\n` +
        `Created at: ${task.created_at.toISOString()}\n\nTimeline:\n${timelineText}`;

    const output = await generateText(SYSTEM_PROMPT, prompt);

    const saved = await aiRepo.saveSummary({
        taskId: input.taskId,
        requestedBy: input.userId,
        output,
        model: MODEL,
    });

    return convertSummaryFormat(saved);
}

export async function listSummaries(input: { taskId: string; userId: string; role: string }) {
    await assertTaskAccess(input.taskId, input.userId, input.role);
    const rows = await aiRepo.listSummaries(input.taskId);
    return rows.map(convertSummaryFormat);
}