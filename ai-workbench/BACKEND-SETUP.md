# AI Workbench — backend setup (Vercel)

Sign-in by emailed one-time link, per-user profile (kanban board + starred prompts), and a feedback form that writes to a Google Sheet.

Opened without the backend (as a local file or on GitHub Pages), the page still works and saves to that browser only.

## Stack
| Piece | Service | Why |
|---|---|---|
| Hosting + API | Vercel (`api/*.js` serverless functions) | Already your host. No framework or build step. |
| Database | **Upstash Redis** (Vercel Marketplace, free tier) | Each profile is one small JSON document (`profile:<email>`). No schema or migrations. The free tier is far more than 6 users need. |
| Sign-in email | Resend (free tier) | Sends the magic link. |
| Feedback | Google Apps Script web app → Google Sheet | One row per submission, ready for analysis. |

There are no npm dependencies. Redis, Resend, and Apps Script are all called over `fetch`.

## 1. Vercel project
1. Import the repo in Vercel. Set **Root Directory** to `ai-workbench`. Framework preset: **Other**.
   The folder name must not contain spaces. Vercel names each function after its path in the repo, and a space in that path fails the build.
2. `vercel.json` rewrites `/` to `ai-workbench-poc.html`.

## 2. Database
Vercel dashboard → **Storage → Marketplace → Upstash Redis** → create and connect it to the project. This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_*`). The code accepts both.

## 3. Email (Resend)
1. Create a Resend account and an API key.
2. Verify a sending domain you control, then set `EMAIL_FROM`, e.g. `AI Workbench <workbench@yourdomain.com>`.
   Without a verified domain, Resend's test sender (`onboarding@resend.dev`) can only send to the email on your own Resend account. That's enough to test yourself, but not the team.

## 4. Feedback sheet
Follow the header comment in `google-apps-script/feedback.gs`: create the Sheet, paste the script in, add the `FEEDBACK_SECRET` script property, and deploy it as a web app. Copy the `/exec` URL.

## 5. Environment variables (Vercel → Settings → Environment Variables)
| Name | Value |
|---|---|
| `ALLOWED_EMAILS` | Comma-separated list of the pilot designers' emails |
| `SESSION_SECRET` | Random string, 32+ chars (`openssl rand -base64 48`) |
| `RESEND_API_KEY` | From Resend |
| `EMAIL_FROM` | Verified sender |
| `APP_URL` | e.g. `https://ai-workbench.vercel.app` (used in the email link) |
| `FEEDBACK_SCRIPT_URL` | Apps Script `/exec` URL |
| `FEEDBACK_SECRET` | Same value as the script property |

Redeploy after you set them.

## Managing access
Edit `ALLOWED_EMAILS` and redeploy. Removing an email revokes that person's access right away, even if their session cookie is still valid.

## API
| Route | Purpose |
|---|---|
| `POST /api/auth/request` `{ email }` | Emails a 15-minute, single-use sign-in link (allowlisted emails only) |
| `GET /api/auth/verify?token=` | Sets a 30-day signed session cookie |
| `POST /api/auth/logout` | Clears the cookie |
| `GET /api/me` | `{ email }` or 401 |
| `GET / PUT /api/profile` | `{ board: { cards }, favorites }` |
| `POST /api/feedback` | `{ rating, type, message, view, promptId }` → appended to the Sheet with the signed-in email |

## Known POC limits
- Last write wins. If the same person edits in two tabs at once, the later save overwrites the earlier one.
- Setup-checklist progress, theme, and collapsed sidebar sections are still saved per browser only.
