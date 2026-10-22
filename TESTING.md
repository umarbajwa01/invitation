# Verification report — 22 October 2026

## Passed

- TypeScript strict compilation (`npm run check`).
- Production build (`npm run build`, Vite).
- Ten automated configuration and server-rendered content checks (`npm test`):
  1. Empty and whitespace text overrides retain approved wording.
  2. Missing event information stays explicitly unconfigured.
  3. A valid leap-day date retains its calendar day across extreme timezone offsets.
  4. Invalid dates, times and timezones have readable fallbacks.
  5. The actual date is Saturday, 24 October 2026; time is confirmed as 5:00 PM and location is At home.
  6. There are exactly four content scenes in the required order.
  7. The rendered scenes contain no RSVP, form, audio or countdown controls.
  8. Names are escaped consistently in both names and closing scenes.
  9. CSS contains reduced-motion support and no photographic/wallpaper background URL.
  10. Main, secondary, bronze and burgundy text colors exceed 4.5:1 contrast on both paper surfaces.
- Floral asset has an alpha channel; a transparent master is retained. Optimized WebP is approximately 261 KiB.
- Fonts are included in the production assets, with no external font network dependency.

## Implemented; browser verification pending

- Seal mouse/touch/Enter/Space activation.
- 250 ms seal response; simultaneous 1.5 second envelope panels; invitation message reveal.
- Repeated-click guard, opening fallback, replay and timeline cleanup.
- First scene is the personal invitation; final scene is thank you.
- Natural scrolling, scene buttons, return to beginning and focus movement.
- Reduced-motion instant opening and nonanimated navigation.
- Fluid names and text, portrait canvas capped at 440 px, safe-area padding, and 44 px controls.
- Decorative artwork load failure does not remove the invitation text.

These are source-level implementation observations, **not** browser test passes.

## Unverified / unavailable

The supported local browser preview service failed both startup and status with an unavailable supervisor mailbox. Under the Sites workflow, an alternative server/browser was not substituted. As a result:

| Check | Result |
| --- | --- |
| 320 × 568 | Unverified |
| 360 × 800 | Unverified |
| 375 × 667 | Unverified |
| 390 × 844 | Unverified |
| 430 × 932 | Unverified |
| Desktop and tablet visual layout | Unverified |
| Long-name wrapping and flower/text overlap in actual rendering | Unverified |
| Actual panel motion, replay, scrolling and reduced motion | Unverified |
| Browser console and resource requests | Unverified |
| Android Chrome, iOS Safari, WhatsApp in-app browser | Unverified |
| Closed-cover and four-scene screenshots | Not captured |
| Original video fidelity | Reference video not attached |
| Reuse/comparison of older implementation | Older HTML not attached |
| Separate venue scene | Removed; At home is shown with date/time |
| Public guest access / Vercel deployment | Not performed |

## Manual acceptance pass

1. Open the local or deployed page at each viewport size above; confirm the cover waits for activation.
2. Open with pointer, Enter, then Space on separate runs. Click rapidly; confirm one opening and readable first scene.
3. Read all four scenes; check text wrapping, corner flowers, dates, and absence of horizontal overflow.
4. Use Scroll Down, each scene button, Back to Beginning and Replay. Verify focus returns appropriately.
5. Enable the OS reduced-motion setting and repeat opening/replay.
6. Check the supplied names, Saturday date and home location; confirm the displayed time is 5:00 PM.
7. Test offline after a complete first load, and with the flower image blocked; the text should remain accessible when decorative artwork fails.
8. Inspect the browser console and network panel, then review iOS Safari and WhatsApp before sharing.

The live Site is supplied for review with these limitations; no claim of completed visual QA is made.

## Readability revision

Body text is now 18–20 px at 1.6 line height; small labels and navigation text are 12 px. Text colors were darkened and the text region has the same opaque paper color as its scene to prevent flowers showing through the words. Foreground/paper contrast is measured by the automated checks; rendered mobile readability remains unverified because the preview service is still unavailable.

## Opaque foreground flowers

The previous paper gradient has been removed. Each scene now uses an opaque page surface, full-opacity floral cutouts above that surface, and independent text items above the flowers. Corner artwork is positioned within reserved header/footer space. The supported preview supervisor still reports an unavailable mailbox, so actual browser layout remains unverified. The separate downloadable HTML is an embedded export of the production bundle, not a browser screenshot.

## Background music verification

TypeScript/build and existing content/contrast checks pass. Simulated Web Audio tests confirm synchronous context unlock from the gesture entrypoint, the two-second ramp to 20%, one looping source across repeated opening/Replay, mute/unmute without playhead reset, hidden-tab suspension/eligible resume, and graceful playback/network failures. PCM analysis confirms no padded loop silence or abnormal sample jump at the loop boundary. The offline export embeds the actual WAV bytes.

Not performed: actual seal clicks and audible playback in Chrome/Safari/WhatsApp, subjective listening quality, audible repeated-loop transitions, actual OS/browser autoplay and tab-visibility policies, and rendered placement of the new mute button. The supported preview supervisor remains unavailable. These automated checks do not substitute for browser/device listening.
