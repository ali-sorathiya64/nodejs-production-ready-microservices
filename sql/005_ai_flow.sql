CREATE TABLE IF NOT EXISTS ai_summaries(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL,
    requested_by UUID NOT NULL,
    output TEXT NOT NULL,
    model TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_summaries_task_id ON ai_summaries(task_id);