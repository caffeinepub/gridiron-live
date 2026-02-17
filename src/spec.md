# Specification

## Summary
**Goal:** Move score and event/flag announcements onto the video (on-camera overlays), simplify broadcaster scoring to manual entry, and remove the point button.

**Planned changes:**
- Replace the viewer Watch page fixed/sticky bottom scorebar with an on-video scoreboard overlay anchored to the bottom of the video frame and kept in sync with backend score updates.
- Add the text label "VillanSpoon" in the left corner of the on-camera scoreboard overlay in both the broadcaster camera preview and viewer stream view.
- Change broadcaster score editing to manual numeric entry for Team A/Team B (no +/- controls), persisting updates via the existing scoreboard update flow and preventing invalid/negative values.
- Remove the "Score" / point button from broadcaster game controls so no point event can be emitted from that UI path.
- Update broadcaster Flag control to require selecting the team (Team A/Team B) and entering a reason, then publish the flag so it appears as an on-camera overlay over the video for both broadcaster preview and viewers (and continues to use the existing backend event mechanism).
- Render the viewer “latest event” presentation as a temporary on-video overlay within the video container instead of a card below the video.

**User-visible outcome:** Viewers see the scoreboard and latest events (especially flags) directly overlaid on the video, broadcasters see the same overlays in their preview, broadcasters enter scores manually, and the point button is no longer available.
