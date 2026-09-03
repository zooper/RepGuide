function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const exercise = url.searchParams.get("exercise");
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 100), 1), 500);
  let query = "SELECT id, exercise, date, weight, unit, reps, sets, notes, created_at FROM workout_logs";
  const bindings = [];

  if (exercise) {
    query += " WHERE exercise = ?";
    bindings.push(exercise);
  }

  query += " ORDER BY date DESC, id DESC LIMIT ?";
  bindings.push(limit);
  const { results } = await env.DB.prepare(query).bind(...bindings).all();
  return json(results);
}

export async function onRequestPost({ env, request }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Ogiltig JSON" }, 400);
  }

  const exercise = String(body.exercise || "").trim();
  const date = String(body.date || "").trim();
  const weight = Number(body.weight);
  const reps = Number(body.reps);
  const sets = Number(body.sets || 1);
  const unit = body.unit === "lb" ? "lb" : "kg";
  const notes = String(body.notes || "").trim().slice(0, 500);

  if (!exercise || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(weight) || weight < 0 ||
      !Number.isInteger(reps) || reps < 1 || !Number.isInteger(sets) || sets < 1) {
    return json({ error: "Fyll i övning, datum, vikt, reps och set korrekt" }, 400);
  }

  const result = await env.DB.prepare(
    "INSERT INTO workout_logs (exercise, date, weight, unit, reps, sets, notes) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(exercise, date, weight, unit, reps, sets, notes).run();

  return json({ id: result.meta.last_row_id }, 201);
}
