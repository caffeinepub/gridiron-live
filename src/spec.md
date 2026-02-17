# Specification

## Summary
**Goal:** Make viewer live-stream playback work (video + audio) and move captions/subtitles to the top of the video on both broadcaster and viewer pages.

**Planned changes:**
- Replace the viewer “Stream Unavailable” placeholder flow with real connection/playback logic that attaches the broadcaster’s live stream when the session lifecycle state is "live".
- Remove the simulated failure/timeout path that forces an error state; ensure “Retry Connection” performs a real reconnection attempt without a full page reload.
- Implement/complete the end-to-end broadcaster-to-viewer streaming pipeline (including any session-code-scoped signaling/state in the Motoko backend as needed) so viewers can join a live session and late-join successfully without third-party providers.
- Fix audio track handling so broadcaster mic ON sends an enabled audio track, viewer playback is not muted, and mic toggling OFF/ON reliably stops/restores viewer audio without refresh (while remaining compatible with mobile playback constraints such as playsInline).
- Move captions/subtitles overlay to render near the top inside the video container for both broadcaster preview and viewer watch view, keeping readability and avoiding overlap with the bottom scoreboard overlay.

**User-visible outcome:** Viewers who enter a valid live session code can reliably see and hear the broadcaster in real time (including late-joining), can retry and recover from transient disconnects, and captions display at the top of the video without covering the scoreboard.
