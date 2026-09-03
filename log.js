const $ = (selector) => document.querySelector(selector);
const state = { exercises: {}, logs: [] };
const escapeHTML = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);

const today = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

async function loadExercises() {
  state.exercises = await fetch("data/exercises.json").then((response) => response.json());
  const options = Object.entries(state.exercises).map(([id, exercise]) => `<option value="${id}">${exercise.name}</option>`).join("");
  $("#exercise").innerHTML = options;
  $("#historyExercise").insertAdjacentHTML("beforeend", options);
}

async function loadLogs() {
  const exercise = $("#historyExercise").value;
  const query = exercise ? `?exercise=${encodeURIComponent(exercise)}` : "";
  state.logs = await fetch(`/api/logs/${query}`).then((response) => response.json());
  $("#history").innerHTML = state.logs.length ? state.logs.map((log) => `
    <article class="history-row">
      <strong>${escapeHTML(state.exercises[log.exercise]?.name || log.exercise)}</strong>
      <small>${escapeHTML(log.date)} · ${escapeHTML(log.sets)} set · ${escapeHTML(log.reps)} reps${log.notes ? ` · ${escapeHTML(log.notes)}` : ""}</small>
      <span>${escapeHTML(log.weight)} ${escapeHTML(log.unit)}</span>
    </article>`).join("") : '<p class="empty">Ingen logg ännu.</p>';
}

$("#logForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = $("#formMessage");
  const response = await fetch("/api/logs/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      exercise: $("#exercise").value,
      date: $("#date").value,
      weight: $("#weight").value,
      unit: $("#unit").value,
      reps: $("#reps").value,
      sets: $("#sets").value,
      notes: $("#notes").value,
    }),
  });
  message.textContent = response.ok ? "Sparat." : (await response.json()).error || "Kunde inte spara.";
  if (response.ok) { $("#notes").value = ""; await loadLogs(); }
});

$("#historyExercise").addEventListener("change", loadLogs);
$("#date").value = today();
loadExercises().then(loadLogs).catch(() => { $("#history").innerHTML = '<p class="empty">Kunde inte läsa träningsloggen.</p>'; });
