CREATE TABLE IF NOT EXISTS notices (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  mood TEXT NOT NULL DEFAULT 'normal',
  urgency TEXT NOT NULL DEFAULT 'no rush',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT notices_mood_check CHECK (mood IN ('bad', 'normal', 'good')),
  CONSTRAINT notices_urgency_check CHECK (
    urgency IN ('no rush', 'urgent', 'emergency')
  )
);
