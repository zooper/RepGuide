CREATE TABLE IF NOT EXISTS workout_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exercise TEXT NOT NULL,
  date TEXT NOT NULL,
  weight REAL NOT NULL CHECK (weight >= 0),
  unit TEXT NOT NULL DEFAULT 'kg' CHECK (unit IN ('kg', 'lb')),
  reps INTEGER NOT NULL CHECK (reps > 0),
  sets INTEGER NOT NULL DEFAULT 1 CHECK (sets > 0),
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS workout_logs_exercise_date
  ON workout_logs (exercise, date DESC, id DESC);
