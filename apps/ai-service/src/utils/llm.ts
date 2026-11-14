import { AppError, logger } from "shared";

export const MODEL = process.env.AI_MODEL || "openrouter/free";

export async function generateText(system: string, prompt: string): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: MODEL,
                max_tokens: 600,
                messages: [
                    { role: "system", content: system },
                    { role: "user", content: prompt },
                ],
            }),
            signal: AbortSignal.timeout(30_000),
        });

        if (!res.ok) {
            const body = await res.text();
            logger.error({ status: res.status, body }, "OpenRouter error");
            throw new Error(`OpenRouter ${res.status}`);
        }

        const data = (await res.json()) as {
            choices?: { message?: { content?: string } }[];
        };

        const text = data.choices?.[0]?.message?.content?.trim();
        if (!text) throw new Error("Empty LLM response");
        return text;
    } catch (err) {
        logger.error({ err }, "LLM call failed");
        throw new AppError(502, "AI provider failed, try again later");
    }
}