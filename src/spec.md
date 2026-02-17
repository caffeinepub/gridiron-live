# Specification

## Summary
**Goal:** Fix the broadcaster live UI so pre-live Team A/Team B selections are correctly recognized after going live, and the Game Controls (Flag) dialog uses the current scoreboard-backed team names/state.

**Planned changes:**
- Update the broadcaster live page to rely on the fetched scoreboard state after the session starts, clearing any “teams must be selected” messaging once scoreboard data is available.
- Ensure the Game Controls (Flag) panel/dialog receives and uses the current scoreboard data (including mapped team names from team icons) rather than missing/undefined props or generic placeholders.
- Add/adjust loading/disabled handling so controls are temporarily disabled only while scoreboard data is loading, then automatically enable once the scoreboard query resolves (no refresh or re-selection needed).

**User-visible outcome:** After selecting teams on the start screen and going live, the broadcaster live page no longer insists teams must be selected; the Flag controls show the correct team names and become usable automatically as soon as the scoreboard finishes loading.
