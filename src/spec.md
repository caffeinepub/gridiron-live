# Specification

## Summary
**Goal:** Make broadcaster microphone audio reliably included in the live stream, and add an in-stream mic on/off toggle that defaults to ON.

**Planned changes:**
- Ensure the broadcaster outgoing stream includes a microphone audio track when mic permission is granted and mic is enabled.
- Add a mic toggle control on the broadcaster live view (visible while streaming) with English labels and default state set to “Mic On” at broadcast start.
- Implement mic-specific permission/error handling and UI messaging (blocked/unavailable/unsupported), including a retry path, while keeping camera/video streaming functional even without mic.

**User-visible outcome:** Viewers can reliably hear the broadcaster during live sessions when mic is enabled, and the broadcaster can turn mic on/off during the stream without stopping video; if mic access fails, the UI explains why and offers a retry while video continues.
