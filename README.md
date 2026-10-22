# A Beautiful Beginning

A frontend-only engagement invitation made with React, TypeScript, Vite, GSAP and ScrollTrigger. It uses blush stationery, champagne linework, local serif fonts, and a transparent burgundy floral derivative of the supplied artwork.

The sequence is fixed: closed cover → personal invitation → couple names → date, time and home location → thank you.

## Run in VS Code

Use Node.js 22 or newer. Extract the ZIP, open the `floral-invitation` folder in VS Code, and open its terminal.

```bash
npm install
npm run dev
```

Open `http://localhost:4173` in your browser. Click or tap the oval seal, or focus it with Tab and press Enter or Space. The page does not open automatically. Scroll naturally or use the four small navigation controls. Replay closes the invitation again so you can reopen the seal.

If your terminal is in the directory above the project, run `cd floral-invitation` first. Stop the development server with Ctrl+C.

## Personalize

Edit **`src/invitation.config.json`**. The invitation is configured for **Sundas Fatima & Waleed Abdullah**, **Saturday, 24 October 2026**, **5:00 PM**, **At home**. The user confirmed PM; the stored local event time is `17:00` in `Asia/Karachi`. The separate venue scene has been removed; location appears below the time. The seal uses S & W.

| Setting | Format |
| --- | --- |
| `person1.name`, `person2.name` | Actual names, displayed consistently in the names scene and closing signature |
| `person1.initial`, `person2.initial` | Initials for the seal and production favicon |
| `event.date` | `YYYY-MM-DD`, in the event's local calendar |
| `event.time` | Optional `HH:mm`, 24-hour local event time when AM/PM is confirmed |
| `event.timeLabel` | Literal display when time is ambiguous; currently empty because PM is confirmed |
| `event.timezone` | IANA timezone; defaults to `Asia/Karachi` |
| `event.location` | Location displayed in the date scene; currently `At home` |
| `content.invitationMessage` | Optional replacement text; `\n\n` separates paragraphs |
| `content.thankYouMessage` | Optional replacement text; blank uses the exact approved wording |
| `sharing.siteUrl` | Real deployed HTTPS origin |
| `sharing.description` | Description for link previews |

An empty or whitespace message override preserves the approved default. Invalid or missing dates remain placeholders; they are never replaced by today's date. The calendar date stays on the day you enter, regardless of timezone offset. Times are shown as local event times, with a timezone label; there is no viewer timezone conversion or countdown.

Theme variables are at the start of `src/styles.css`. The future custom background field stays inactive. No additional background image or music is loaded.

## Build and verify

```bash
npm test
npm run build
npm run preview
```

`npm test` covers configuration fallback, date/time handling, event details, scene order, text escaping and excluded controls. It does not replace browser testing. `npm run build` runs TypeScript validation, builds the static frontend into `dist/`, and creates metadata and the monogram favicon from the configuration.

`dist/` is also included in the downloadable project. Serve it with a static web server; opening its `index.html` directly as a `file://` URL is not supported by the module bundle.

## Vercel

The included `vercel.json` uses `npm run build` and serves `dist/`. Import the project into Vercel as a Vite app, or deploy it using your usual Vercel workflow. No backend, database, API keys or environment secrets are needed.

Set `VITE_SITE_URL` to the real Vercel origin before the production build, or replace `sharing.siteUrl` in the configuration. The environment value overrides the configuration. This keeps canonical and Open Graph URLs correct. The project includes an `.env.example`.

An optional `public/social-preview.png` will be included in Open Graph metadata automatically on the next build. No social preview screenshot is included in this build because browser capture was unavailable. Hosted private pages may require sign-in and should not be treated as public guest links. This task did not deploy to Vercel or change the Site to public access.

## Artwork and fonts

- `artwork/burgundy-botanical-master.png`: transparent edited master derived from the supplied floral image.
- `public/assets/burgundy-botanical.webp`: optimized 261 KiB delivery asset; all floral placements reuse this cached file.
- Cormorant Garamond and EB Garamond are bundled locally via Fontsource; visitors do not need a Google Fonts connection.
- Simple ornamental arches, linework, and rings are SVG/CSS.

The missing reference video and older HTML were not inspected. This is an implementation of the supplied written brief and floral reference, not a verified pixel-exact reconstruction of the unavailable video.

## Verification limits

See `TESTING.md`. TypeScript, production build, and ten automated checks passed. Actual browser screenshots, opening motion, responsive layouts, touch operation, Safari and WhatsApp were **not verified** because the managed preview service was unavailable.

Body copy is 18–20 px with 1.6 line height; small labels are 12 px. Darker text and matching opaque paper behind each text block protect readability from floral overlap.

### Foreground floral revision

The paper is fully opaque. On every inner scene the flower cutouts paint above the page surface at full opacity; the text paints above the floral layer. The content wrapper deliberately has no stacking context that could trap the lettering below the flowers. Top and bottom breathing room keeps petals outside the reading area. No fade, transparency effect, or gradient is applied to the flowers or paper.

The downloadable export includes a separate `OPEN-INVITATION.html` at its root. This self-contained version embeds its scripts, fonts, and floral artwork and can be opened directly without a server. The source project's `dist/index.html` still requires a static server.

### Background music

The first seal interaction unlocks one persistent Web Audio player. The bundled original 32-second piano/strings WAV loops sample-accurately at 20% gain with a two-second fade-in. Scrolling and Replay preserve the source and playhead. The single top-right button mutes/unmutes without restarting the track. Hidden tabs suspend playback; visible tabs resume prior playback when permitted. Blocked playback stays silent and can be retried from the same mute button.

The audio asset and its CC0 dedication are in `public/audio/`; `scripts/compose-music.py` contains the original synthesis and composition. No remote audio service is used. After `npm run build`, run `node scripts/export-offline.mjs` to export a self-contained HTML with the actual audio embedded. Browser autoplay policies and audible output have not been checked on devices because the preview supervisor is unavailable; automated Web Audio lifecycle tests run with `npm test`.

Before sending the invitation to guests, review the live page on phones and desktop. The source includes reduced-motion support, keyboard controls, visible focus states, a duplicate-click guard, a three-second opening fallback, timeline cleanup, a replay control and natural scrolling; those interaction claims describe the implementation, not completed browser QA.
