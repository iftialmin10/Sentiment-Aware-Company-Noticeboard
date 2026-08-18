BEGIN;

ALTER TABLE notices
  ADD COLUMN mood TEXT NOT NULL DEFAULT 'normal',
  ADD COLUMN urgency TEXT NOT NULL DEFAULT 'no rush';

ALTER TABLE notices
  ADD CONSTRAINT notices_mood_check
    CHECK (mood IN ('bad', 'normal', 'good')),
  ADD CONSTRAINT notices_urgency_check
    CHECK (urgency IN ('no rush', 'urgent', 'emergency'));

COMMIT;
