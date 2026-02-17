# Specification

## Summary
**Goal:** Fix the go-live/start broadcast flow so sessions persist correctly in the backend and the broadcaster UI transitions to LIVE without a page refresh, with clear error feedback when start fails.

**Planned changes:**
- Persist newly created sessions in the backend session store during `startSession` so subsequent calls (e.g., `setTeamIcons`, `getSessionMetadata`) can immediately find the session.
- Update backend session update logic for events/flag events/captions to avoid in-place mutation of immutable session fields and instead write an updated Session back to the sessions store.
- Update the frontend “Start Broadcast” action to prevent full page reload, show a disabled/loading state while starting, and transition into the LIVE broadcaster UI when backend calls succeed.
- Add user-facing English error messaging on the broadcaster start card when `startSession` or `setTeamIcons` fails, keeping the user on the start screen and re-enabling the button after failure.

**User-visible outcome:** Clicking “Start Broadcast” no longer refreshes the page; successful starts reliably enter the LIVE broadcaster UI with a session code shown, and failures display a clear English error message with the ability to retry.
