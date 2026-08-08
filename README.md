# AI Prompt Vault

A production-oriented, static Telegram Mini App built with HTML5, CSS3, and Vanilla JavaScript ES6.

## Architecture

- No Firebase
- No Supabase
- No MongoDB
- No MySQL/PostgreSQL
- No Node.js backend
- No PHP
- No Express
- No authentication server
- Browser LocalStorage only
- Telegram WebApp SDK for Telegram context
- GitHub + Cloudflare Pages compatible

## Important security limitation

Because this project has no trusted backend and all state is stored in LocalStorage, premium unlocks cannot be cryptographically enforced. A user can clear or edit browser storage. The unlock flow is therefore a client-side UX/access-control mechanism, not a server-verifiable entitlement system.

The rewarded-ad integration is deliberately provider-neutral. Configure a real rewarded-ad SDK in `js/unlock.js` through the documented adapter. Never pretend that a simulated reward is a real ad view.

## Run locally

Open `index.html` with a static server or deploy the repository to Cloudflare Pages.

## Telegram

Set the Mini App URL in BotFather. The app reads Telegram WebApp user information when available and gracefully falls back to a guest profile in a normal browser.

## Deployment

1. Push the repository to GitHub.
2. Create a Cloudflare Pages project from the repository.
3. Build command: none.
4. Build output directory: `/`.
5. Deploy.

## Files

The project is intentionally split into HTML components, page templates, CSS modules, and focused ES6 modules.
