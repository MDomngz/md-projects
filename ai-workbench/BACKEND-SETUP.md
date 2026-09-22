# AI Workbench — backend setup (Vercel)

Sign-in against an access list you manage by hand, per-user profile (kanban board + starred prompts), and a feedback form that writes to a Google Sheet.

Opened without the backend (as a local file or on GitHub Pages), the page still works and saves to that browser only.

## Stack
| Piece | Service | Why |
|---|---|---|
| Hosting + API | Vercel (`api/*.js` serverless functions) | Already your host. No framework or build step. |
| Database | **Upstash Redis** (Vercel Marketplace, free tier) | Each profile is one small JSON document (`profile:<email>`). No schema or migrations. The free tier is far more than 6 users need. |
| Feedback | Google Apps Script web app → Google Sheet | One row per submission, ready for analysis. |

There are no npm dependencies. Redis and Apps Script are both called over `fetch`.

## 1. Vercel project
1. Import the repo in Vercel. Set **Root Directory** to `ai-workbench`. Framework preset: **Other**.
   The folder name must not contain spaces. Vercel names each function after its path in the repo, and a space in that path fails the build.
2. `vercel.json` rewrites `/` to `ai-workbench-poc.html`.

## 2. Database
Vercel dashboard → **Storage → Marketplace → Upstash Redis** → create and connect it to the project. This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_*`). The code accepts both.

## 3. Feedback sheet
Follow the header comment in `google-apps-script/feedback.gs`: create the Sheet, paste the script in, add the `FEEDBACK_SECRET` script property, and deploy it as a web app. Copy the `/exec` URL.

## 4. Environment variables (Vercel → Settings → Environment Variables)
| Name | Value |
|---|---|
| `ALLOWED_EMAILS` | Comma-separated list of the pilot designers' emails |
| `SESSION_SECRET` | Random string, 32+ chars (`openssl rand -base64 48`) |
| `ACCESS_CODE` | *Optional.* A team code everyone must also enter. Leave it unset to sign in with email only |
| `FEEDBACK_SCRIPT_URL` | Apps Script `/exec` URL |
| `FEEDBACK_SECRET` | Same value as the script property |

Redeploy after you set them.

## Managing access
The access list is the `ALLOWED_EMAILS` variable. It isn't stored in the repo, because the repo is public.

- **Add someone:** add their email to the list, redeploy, and send them the link.
- **Remove someone:** delete their email and redeploy. Their access ends right away, even if they're still signed in.
- **Change the team code:** update `ACCESS_CODE` and redeploy. People who are already signed in stay signed in.

Emails aren't verified. Anyone who knows an address on the list can sign in as that person. Setting `ACCESS_CODE` means they would also need the team code. After 10 failed sign-in attempts, an IP address is blocked for 15 minutes.

## API
| Route | Purpose |
|---|---|
| `POST /api/auth/login` `{ email, code }` | If the email is on the list (and the code matches, when `ACCESS_CODE` is set), sets a 30-day signed session cookie |
| `POST /api/auth/logout` | Clears the cookie |
| `GET /api/me` | `{ email }`, or 401 with `{ needsCode }` |
| `GET / PUT /api/profile` | `{ board: { cards }, favorites }` |
| `POST /api/feedback` | `{ rating, type, message, view, promptId }` → appended to the Sheet with the signed-in email |

## Known POC limits
- Last write wins. If the same person edits in two tabs at once, the later save overwrites the earlier one.
- Setup-checklist progress, theme, and collapsed sidebar sections are still saved per browser only.
