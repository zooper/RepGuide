# RepGuide

Personal, static training companion for the September 30-day program.

## How it works

- GitHub Pages serves the static site.
- `data/schedule.json` mirrors the Garmin Connect calendar.
- `data/exercises.json` is the canonical exercise mapping.
- The UI selects today's workout from the local date.
- Completion state is stored only in the browser's localStorage.

There is no Garmin authentication, backend, database, or token in this site. ChatGPT updates the schedule when the Garmin plan changes.

## Development

Open the repository through a local HTTP server; opening `index.html` directly will block JSON fetches in most browsers.

Exercise animations currently use the verified upstream exercise-library GIF URLs. They can be vendored into `assets/gifs/` later without changing the UI—only the mapping paths need to change.
