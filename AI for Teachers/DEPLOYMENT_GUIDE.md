# TeacherAI Prompt Library - Deployment Guide

A complete platform for K-5 teachers with 40+ trauma-informed, evidence-based AI prompts. Features user profiles, prompt saving, feedback collection (emailed to admin), and printable/shareable cards.

---

## Quick Start

### Prerequisites
- Node.js 14+
- npm or yarn
- Gmail account (for email feedback)
- React environment

### Local Development Setup

#### 1. Backend Setup

```bash
# Navigate to backend directory
cd teacherai-backend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Add your credentials to .env:
# - EMAIL_USER: your Gmail address
# - EMAIL_PASSWORD: Gmail app password (not your regular password)
# - JWT_SECRET: a random long string (e.g., generate with: openssl rand -hex 32)
# - ADMIN_EMAIL: marisa.dominguez@oddball.io (or your email)

# Start backend (development mode with auto-reload)
npm run dev
# OR production mode:
npm start
```

Backend will run on `http://localhost:5000`

#### 2. Gmail App Password Setup

1. Go to https://myaccount.google.com/
2. Click "Security" in left menu
3. Enable "2-Step Verification" (if not already enabled)
4. Go back to Security → App passwords
5. Select "Mail" and "Windows Computer" (or your device)
6. Generate and copy the app password
7. Paste into `.env` as `EMAIL_PASSWORD`

#### 3. Frontend Setup

```bash
# Using Create React App or Vite
npm install

# Start dev server
npm start
# Frontend runs on http://localhost:3000
```

#### 4. Test Everything

- **Register:** Click "Create Profile," sign up with email/password
- **Save Prompts:** Browse library, click heart to save
- **Send Feedback:** Click message icon, fill form, submit
- **Check Email:** Feedback should arrive at admin email within seconds

---

## Features

### For Teachers
- 📚 **40+ Evidence-Based Prompts** - Trauma-informed, differentiation-focused, inclusive
- ❤️ **Save & Organize** - Create profile, save favorite prompts
- 📋 **Printable Cards** - Each prompt is formatted for printing/sharing
- 📌 **Copy & Paste** - One-click copy to use in ChatGPT, Claude, etc.
- 🏷️ **Filter & Search** - Find prompts by category, keywords, or tags

### For You (Admin)
- 💬 **Feedback Collection** - Teachers submit feedback → emailed to admin
- 👤 **User Profiles** - Track engagement (saved prompts, activity)
- 🔐 **JWT Authentication** - Secure user sessions
- 🚀 **Scalable Backend** - Ready for database integration

---

## Architecture

```
teacherai/
├── frontend/
│   ├── TeacherAI-Enhanced.jsx     # React component (40+ prompts)
│   ├── package.json
│   └── index.html
│
├── backend/
│   ├── backend-server.js          # Express server
│   ├── package.json
│   ├── .env.example               # Environment template
│   └── .env                        # Your secrets (not in git)
│
└── docs/
    ├── DEPLOYMENT_GUIDE.md        # This file
    ├── API_DOCUMENTATION.md       # API endpoints
    └── PROMPT_LIBRARY.md          # Detailed prompt list
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user

### Profile
- `GET /api/profile` - Get user profile (requires JWT)
- `POST /api/profile/save-prompt` - Save prompt ID (requires JWT)
- `POST /api/profile/remove-prompt` - Remove saved prompt (requires JWT)

### Feedback
- `POST /api/feedback` - Submit feedback (emails to admin)

### Utility
- `GET /api/health` - Health check

---

## Deployment Options

### Option 1: Heroku (Easiest)

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login to Heroku
heroku login

# Create app
heroku create teacherai-backend

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key_here
heroku config:set EMAIL_USER=your_email@gmail.com
heroku config:set EMAIL_PASSWORD=your_app_password
heroku config:set ADMIN_EMAIL=marisa.dominguez@oddball.io

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Option 2: Railway

```bash
# Sign up at railway.app
# Connect GitHub repo
# Set environment variables in Railway dashboard
# Auto-deploys on every push to main
```

### Option 3: Vercel (Frontend) + Any Backend

1. Deploy frontend to Vercel:
```bash
npm install -g vercel
vercel
# Follow prompts
```

2. Deploy backend to Heroku/Railway (above)

3. Update frontend `.env`:
```
REACT_APP_API_URL=https://your-backend-url.com
```

### Option 4: AWS (Advanced)

- Use Lambda for backend + RDS for database
- CloudFront for frontend CDN
- SES for email (instead of Gmail)

---

## Production Checklist

- [ ] Use a real database (PostgreSQL recommended) instead of in-memory storage
- [ ] Implement rate limiting on feedback endpoint
- [ ] Add email verification for new accounts
- [ ] Use hashed passwords (bcryptjs already in place)
- [ ] Set JWT_SECRET to a strong random string
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS everywhere
- [ ] Add monitoring/error tracking (Sentry)
- [ ] Set up automated backups
- [ ] Create admin dashboard for viewing feedback
- [ ] Add analytics to track usage
- [ ] Regular security audits

---

## Monitoring & Debugging

### Check Backend Health
```bash
curl http://localhost:5000/api/health
# Should return: { "status": "TeacherAI Backend is running" }
```

### View Email Logs
In `backend-server.js`, emails are sent via nodemailer. Check:
- Console logs for errors
- Gmail account "Activity" section
- Spam folder (sometimes emails go there)

### Database Debugging (When Migrating to Real DB)
```bash
# Example with PostgreSQL
psql -U postgres -d teacherai
SELECT * FROM users;
SELECT * FROM saved_prompts;
```

---

## Customization

### Add More Prompts
Edit `TeacherAI-Enhanced.jsx`, add to `expandedPromptLibrary` array:
```javascript
{
  id: 41,
  title: 'Your Prompt Title',
  category: 'Category Name',
  prompt: 'Your prompt template with [PLACEHOLDERS]',
  emoji: '🎯',
  color: 'from-color-500 to-color-600',
  tags: ['tag1', 'tag2']
}
```

### Change Admin Email
Edit `.env`:
```
ADMIN_EMAIL=your_email@example.com
```

### Customize Styling
The app uses Tailwind CSS. Edit Tailwind config in React project or modify className attributes.

### Rebrand
- Update app name in header
- Change logo/favicon
- Modify colors in gradient CSS classes

---

## Support & Troubleshooting

### "Failed to send feedback"
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Verify Gmail App Password (not regular password)
- Check that 2-Step Verification is enabled
- Gmail might block "Less Secure Apps" - use App Password instead

### "CORS error"
- Ensure backend CORS is configured for frontend URL
- In `backend-server.js`: `app.use(cors())`
- For production, update to: `app.use(cors({ origin: 'https://your-frontend.com' }))`

### "JWT token invalid"
- Clear localStorage in browser
- Log out and log back in
- Check JWT_SECRET matches between token creation and verification

### "Email not arriving"
- Check spam/promotions folder
- Verify recipient email address
- Check nodemailer logs for errors
- Test with a different email service if needed

---

## Future Enhancements

- 🗄️ Database integration (PostgreSQL)
- 📊 Analytics dashboard (prompt usage, popular topics)
- 🔄 Community sharing (teachers share custom prompts)
- 📱 Mobile app (React Native)
- 🌐 Multi-language support
- 🎓 Certification for prompt mastery
- 💾 Export prompts as PDF
- 📧 Weekly prompt digest emails
- 🤝 Peer review system for new prompts
- 🧪 A/B testing for prompt effectiveness

---

## Questions?

Contact: marisa.dominguez@oddball.io

Good luck bringing this to teachers! 🚀
