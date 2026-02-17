# Specification

## Summary
**Goal:** Fix Viewer Watch playback so viewers reliably see and hear the broadcaster live stream, and update subtitles to reflect the broadcaster’s speech via backend-delivered captions.

**Planned changes:**
- Update Viewer Watch to always render a real video element during live sessions and attempt playback of the incoming stream; add an in-player English error state when playback/negotiation fails while keeping overlays functional.
- Fix broadcaster audio delivery so the broadcast stream includes an enabled microphone audio track when mic is ON; ensure new viewers can hear without requiring a session restart; ensure mic toggle reliably stops/starts audio without restarting the broadcast.
- Move subtitle generation to the broadcaster: capture captions from the broadcaster microphone using browser SpeechRecognition when available; show clear English “subtitles unavailable” messaging on unsupported/error cases without interrupting video/audio.
- Add backend canister methods for broadcaster caption publishing (with timestamp) and viewer querying of the latest caption by session code; reject publishing for non-existent or ended sessions with clear trapped English errors.
- Update Viewer Watch subtitles UI to poll (React Query) for broadcaster-published captions only when subtitles are enabled; stop polling when disabled; continue using the existing in-video caption overlay styling and correct any misleading “browser not supported” messaging.

**User-visible outcome:** Viewers can watch the broadcaster’s live video (not a black screen), hear the broadcaster when the mic is enabled, and see subtitles that match the broadcaster’s speech (with clear error states when captions aren’t available).
