# WorkMate Recording Demo Mode

## What This Adds

The app now has a local recording mode for TikTok/Reels capture.

- `?demo=1`: loads realistic demo jobs, staff, DMs, saved jobs, and employer applications.
- `?demo=1&tour=1`: automatically moves through the recording flow.

No Supabase writes happen in demo mode.

## Suggested Recording URL

```text
http://localhost:5173/?demo=1&tour=1
```

If the app is hosted somewhere else, add the same query string:

```text
https://your-workmate-url/?demo=1&tour=1
```

## Recommended Recording Flow

1. Open the app in a narrow mobile-sized browser window or on a phone.
2. Start screen recording.
3. Use `?demo=1&tour=1` for automatic movement:
   - Home dashboard
   - Filter search for barista jobs
   - Search results
   - Job detail
   - Staff profiles
   - DM conversation
   - Employer dashboard
4. Bring the recording into CapCut.
5. Add captions, zoom cuts, and music there.

## Best Tool Choice

Use CapCut for the final TikTok edit. It is better than pure AI video generation for this case because the core value is the real UI interaction. Runway/Pika can make cinematic backgrounds, but they are not reliable for exact app text, buttons, filters, and search results.

## How To Remove This Later

Remove:

- `demoData.js`
- `ads/tiktok/recording-demo.md`
- Demo-mode imports and `isDemo` branches in `main.jsx`
- `.demo-rec-bar` CSS in `style.css`

The app's production data model is not changed by demo mode.
