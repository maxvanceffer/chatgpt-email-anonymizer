# Prompt Monitoring Extension (Chrome MV3)

Monitors ChatGPT prompts. Detects emails via regex, anonymizes them to [EMAIL_ADDRESS], shows alert modal (Issues Found), and persists History in storage. Dismiss per email for 24h.

Tech: React + TypeScript + Context API + Tailwind CSS. Chrome only.

## Features
- Intercept fetch in content script; background scans and anonymizes.
- Modal with tabs: Issues Found / History / Dissmissed.
- Persists History in chrome.storage.local.
- Dismiss email for 24h (no alerts during period).

## Build
1. Node.js 18+
2. Install deps:
   ```
   npm install
   ```
3. Build:
   ```
   npm run build
   ```
   Output: `build/` and `build.zip` (if you run `npm run zip`).

## Load in Chrome
1. Open chrome://extensions
2. Enable “Developer mode”
3. Click “Load unpacked”
4. Select the `build/` folder

## Use
- Navigate to chat.openai.com (or chatgpt.com).
- When you send a message that includes one or more email addresses:
    - The request payload is scanned in background.
    - Non-dismissed emails are anonymized to `[EMAIL_ADDRESS]` before sending.
    - A modal opens showing “Issues Found”.
    - History tab lists all detections and shows dismissed indicators.

## Dismiss
- In the Issues tab, click “Dismiss 24h” per email.
- During the dismissal window, the email won’t trigger alerts.

## Notes
- Only Chrome MV3 targeted.
- Regex is RFC5322-lite, deduplicated, case-insensitive.
- UI is rendered in a shadow root to avoid style clashes.

## Dev
- `npm run dev` for Vite dev server (UI preview).
- Content/background rely on Chrome APIs; test full flow via packed extension.

## Packaging
- `npm run zip` builds and creates `build.zip` at project root.
