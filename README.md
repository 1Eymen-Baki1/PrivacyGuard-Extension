# PrivacyGuard — Automatic Privacy Policy Risk Scanner

PrivacyGuard is a browser extension that scans the privacy policy / terms of service of the page you're currently on and instantly tells you how risky it is — no more blindly clicking "I Agree".

This started as a manual CLI tool ([original PrivacyGuard project](https://github.com/1Eymen-Baki1/PrivacyGuard)) where you had to copy-paste the policy text into the script by hand. This version automates that: open any policy page, click the extension icon, and get an instant analysis.

## Features
- 🎯 **Risk Score (1-10)** with a color indicator (🟢 Safe / 🟡 Caution / 🔴 Danger)
- 📝 **3-point TL;DR summary** of the most critical clauses
- 🔒 Your Gemini API key stays local (`chrome.storage.local`), never hardcoded in the code
- Works on any web page — privacy policies, terms of service, cookie policies, etc.

## ⚠️ How the Risk Score Is Actually Calculated

**Important — read this before you trust the score.** The risk score is **not** computed by a fixed formula, checklist, or rule-based algorithm in this codebase. There is no code that counts "data sharing clauses" or assigns fixed point values to specific terms.

Instead, the extension sends the page's text to Google's **Gemini AI model** with a prompt (see `utils/gemini-api.js`) instructing it to act as a data privacy expert and produce:
1. A risk score from 1–10, based on its own judgment of the text
2. The 3 most critical points it finds

This means:
- The score is a **language model's subjective interpretation**, not a deterministic calculation.
- The same policy text analyzed twice may yield slightly different scores or wording.
- Quality depends entirely on the underlying AI model (`gemini-2.5-flash`) and the prompt — there is no independent verification layer.

Treat the output as a **helpful first-pass summary**, not a certified legal or security audit.

## Installation
1. Clone or download this repository.
2. Open `chrome://extensions/` in Chrome (or `edge://extensions/` in Edge).
3. Enable **Developer mode** (top right toggle).
4. Click **Load unpacked** and select the `PrivacyGuard-Extension` folder.

## Getting an API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and generate a free Gemini API key.
2. Right-click the extension icon → **Options** (or click "⚙️ Settings" inside the popup).
3. Paste your key and click **Save**. It is stored only in your browser's local extension storage — never sent anywhere except directly to Google's Gemini API.

## Usage
1. Open the privacy policy / terms of service page you want to check.
2. Click the PrivacyGuard icon in your toolbar.
3. Click **"Analyze This Page"**.
4. Within a few seconds you'll see the risk score and a 3-point summary.

## Project Structure
```
PrivacyGuard-Extension/
├── manifest.json          # Manifest V3 config (permissions, popup, service worker)
├── background.js          # Service worker — orchestrates the analysis request
├── popup.html/js/css      # Popup UI shown when you click the extension icon
├── options.html/js/css    # Settings page for the Gemini API key
├── utils/
│   └── gemini-api.js      # Builds the prompt and calls the Gemini API
└── icons/                 # Extension icons
```

## Mobile Note
Extension-capable mobile browsers (e.g. Kiwi Browser on Android) can load this extension the same way as desktop Chrome. Native OS-level interception of the consent screen shown during an app's install flow (Play Store / App Store) is not possible for third-party code — this extension instead targets the web version of a policy/terms page, which covers the vast majority of real-world use cases.

## Tech Stack
- Manifest V3 browser extension (vanilla HTML/CSS/JS, no build step)
- Google Gemini API (`gemini-2.5-flash`)

## License
MIT
