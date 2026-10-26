CREATE TABLE IF NOT EXISTS tasks(
    id  UUID PRIMARY KEY  DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN('OPEN','IN_PROGRESS','RESOLVED','CLOSED')),
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ not null DEFAULT NOW(),
    updated_at TIMESTAMPTZ not null DEFAULT NOW()
);

create INDEX IF NOT EXISTS idx_task_created_by ON tasks (created_by);
