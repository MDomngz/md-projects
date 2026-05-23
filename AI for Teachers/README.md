# TeacherAI Prompts - Complete Platform

A comprehensive web application providing **40+ evidence-based, trauma-informed AI prompts** designed specifically for K-5 teachers in under-resourced schools.

**Status:** ✅ MVP Complete | Ready for Beta Testing | 🚀 Production Deployment Ready

---

## What's Included

### 📦 Deliverables (Phase 1-5 Complete)

✅ **Phase 1: Enhanced React App (40+ Prompts)**
- `TeacherAI-Enhanced.jsx` - Full-featured frontend
- 40 prompts across 6 categories
- User profiles with saved prompts
- Integrated feedback form with email forwarding
- Dark mode, printable cards, shareable content

✅ **Phase 2: Node.js Backend with Auth & Email**
- `backend-server.js` - Express server
- User authentication (JWT)
- Profile management
- Email-to-admin feedback system
- No database storage of feedback (privacy-focused)

✅ **Phase 3: Documentation**
- `DEPLOYMENT_GUIDE.md` - Complete setup instructions
- `API_DOCUMENTATION.md` - Full API reference
- `.env.example` - Environment configuration template
- `package.json` - Dependencies and scripts

✅ **Phase 4: Prompt Library Expanded**
- ✋ Lesson Planning (8 prompts)
- 📊 Grading & Assessment (8 prompts)
- ⭐ Behavior Management (8 prompts)
- 💬 Student Engagement (8 prompts)
- 💌 Communication (4 prompts)
- 🧠 Special Support (4 prompts)

✅ **Phase 5: Deployment Ready**
- Heroku deployment guide included
- Railway/Vercel support documented
- Security checklist provided
- Scalable architecture ready for database integration

---

## 📚 40+ Prompts Categories

### Lesson Planning (8)
- Differentiated lesson plans
- Project-based learning units
- Morning routines & predictability
- Learning centers/stations
- Thematic units
- Multi-sensory activities
- Literacy integration
- Low-pressure assessments

### Grading & Assessment (8)
- Growth-focused feedback
- Student-friendly rubrics
- Quick formative checks
- Data-driven reteaching
- Progress tracking systems
- Report card comments
- Portfolios & showcases
- IEP/504 adaptations

### Behavior Management (8)
- Trauma-informed expectations
- Behavior as communication
- Strength-based incentives
- Calming/regulation scripts
- Trauma & big feelings support
- Conflict resolution
- Parent conversations
- Prevention strategies

### Student Engagement (8)
- Discussion questions
- Anchor activities
- Tiered instruction
- Low-cost games
- Student choice & agency
- Gifted learner support
- Reflection & metacognition
- Community building

### Communication (4)
- Joyful family updates
- Difficult conversations
- Language barrier navigation
- Inclusive classroom culture

### Special Support (4)
- ELL/Multilingual students
- Autism/ADHD strategies
- Food insecurity & housing instability
- Grief & loss support

---

## 🚀 Quick Start

### 1. Backend Setup (5 minutes)

```bash
# Install dependencies
npm install

# Create .env from template
cp .env.example .env

# Add your Gmail credentials to .env
# (See DEPLOYMENT_GUIDE.md for Gmail App Password setup)

# Start server
npm run dev
# Runs on http://localhost:5000
```

### 2. Frontend Setup

```bash
# React/Vite project
npm install
npm start
# Runs on http://localhost:3000
```

### 3. Test Features

- ✅ Register account
- ✅ Save prompts
- ✅ Submit feedback (check email)
- ✅ Print/share cards

---

## 📁 File Structure

```
TeacherAI/
├── TeacherAI-Enhanced.jsx         # React component (40+ prompts)
├── backend-server.js              # Express backend
├── package.json                   # Dependencies
├── .env.example                   # Config template
├── DEPLOYMENT_GUIDE.md            # Setup & deployment
├── API_DOCUMENTATION.md           # API reference
├── README.md                      # This file
└── [Additional files in /MelDawg folder]
```

---

## 🔑 Key Features

### For Teachers
- 📖 **40+ Ready-to-Use Prompts** - Copy/paste into ChatGPT, Claude, etc.
- ❤️ **Save & Organize** - Create profile, save favorites
- 📄 **Printable Cards** - Share with colleagues
- 🔍 **Search & Filter** - Find prompts by category or keyword
- 🌙 **Dark Mode** - Easy on the eyes
- 📧 **No Data Storage** - Privacy-focused (feedback emailed only)

### For You (Admin)
- 👥 **User Management** - Track engagement
- 💬 **Feedback Collection** - Teachers email feedback directly
- 🔐 **Secure Authentication** - JWT tokens
- 📊 **Ready for Analytics** - Backend structured for data
- 🌱 **Scalable** - Easy to add database, more users, features

---

## 🔧 Technology Stack

- **Frontend:** React + Tailwind CSS + Lucide Icons
- **Backend:** Node.js + Express.js
- **Auth:** JWT + bcryptjs
- **Email:** Nodemailer (Gmail SMTP)
- **Deployment:** Heroku, Railway, Vercel (see guide)

---

## 🎯 Prompts are Evidence-Based

Each prompt reflects:
- ✅ Trauma-informed teaching principles
- ✅ Scaffolding for multilingual learners
- ✅ Differentiation for mixed abilities
- ✅ Inclusive design practices
- ✅ Low-cost, doable strategies
- ✅ Real K-5 classroom context
- ✅ Built for under-resourced schools

---

## 🔐 Security & Privacy

- ✅ Passwords hashed with bcryptjs
- ✅ JWT token-based auth (7-day expiry)
- ✅ Feedback NOT stored (emailed only)
- ✅ No tracking or analytics (unless added)
- ✅ CORS configured for production
- ✅ Environment variables for secrets

**Production Security Checklist:**
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Implement rate limiting on feedback
- [ ] Set up error monitoring (Sentry)
- [ ] Regular security audits
- [ ] Backup system for emails
- [ ] GDPR compliance review

---

## 📊 Deployment Options

### Option 1: Heroku (Recommended for Beginners)
```bash
heroku create teacherai-backend
heroku config:set JWT_SECRET=...
git push heroku main
```

### Option 2: Railway
- Sign up at railway.app
- Connect GitHub
- Auto-deploys on push

### Option 3: Vercel (Frontend) + Custom Backend
- `vercel` deploys frontend
- Deploy backend separately
- Update frontend .env

See **DEPLOYMENT_GUIDE.md** for detailed instructions.

---

## 📈 Usage Analytics (Future)

Currently, the backend is structured to add:
- 📊 Track which prompts teachers use most
- 📈 Monitor feature requests by category
- 👥 Track teacher adoption over time
- 💡 Identify which prompts work best by grade level

Add these later without changing core functionality.

---

## 💬 Feedback System

### How It Works
1. Teacher clicks feedback icon
2. Submits message (optional name/email)
3. Email sent to: `marisa.dominguez@oddball.io`
4. **Zero database storage** (privacy-first)

### Email Configuration
Uses Gmail SMTP. Setup in 2 minutes:
1. Enable 2-Step Verification on Gmail
2. Generate App Password
3. Add to `.env`
4. Done!

---

## 🛠️ Customization

### Add More Prompts
Edit `TeacherAI-Enhanced.jsx`, add to array:
```javascript
{
  id: 41,
  title: "Your Prompt",
  category: "Category",
  prompt: "Template with [PLACEHOLDERS]",
  emoji: "🎯",
  color: "from-color-500 to-color-600",
  tags: ["tag1", "tag2"]
}
```

### Change Styling
Uses Tailwind CSS. Edit:
- Color gradients (from-X-500 to-Y-600)
- Spacing (px-, py-, mb-, etc.)
- Typography (text-xl, font-bold, etc.)

### Change Admin Email
Edit `.env`:
```
ADMIN_EMAIL=your_email@example.com
```

---

## 🧪 Testing Checklist

- [ ] Backend health check: `curl http://localhost:5000/api/health`
- [ ] Register new user
- [ ] Login with credentials
- [ ] Save a prompt
- [ ] Remove a saved prompt
- [ ] Get profile (should show saved prompts)
- [ ] Submit feedback (should receive email)
- [ ] Print prompt card
- [ ] Copy prompt text
- [ ] Search/filter prompts
- [ ] Guest browsing (no account)

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check `npm install`, port 5000 free, .env exists |
| Email not sending | Verify EMAIL_USER, EMAIL_PASSWORD, 2-Step enabled |
| CORS error | Check frontend URL in backend CORS config |
| Login fails | Verify password correct, user exists in .env or database |
| Token invalid | Clear localStorage, login again |

See **DEPLOYMENT_GUIDE.md** for more troubleshooting.

---

## 🚀 Next Steps

### Now:
1. ✅ Test locally
2. ✅ Get feedback from teachers
3. ✅ Deploy to staging

### Phase 2 Ideas:
- Database integration (PostgreSQL)
- Analytics dashboard
- Community prompt sharing
- PDF export
- Weekly digest emails
- Mobile app
- Multi-language UI

---

## 📖 Documentation

- **DEPLOYMENT_GUIDE.md** - Full setup & deployment guide
- **API_DOCUMENTATION.md** - Complete API reference
- **.env.example** - Configuration template

---

## ✉️ Contact

Questions or suggestions?  
**marisa.dominguez@oddball.io**

---

## 📄 License

MIT License - Feel free to use, modify, and share with other educators.

---

## 🎉 Thank You!

This platform was built with ❤️ for teachers serving students in under-resourced schools. Every prompt reflects real classroom realities and trauma-informed practices.

**Your feedback makes this better. Please submit ideas!** 💬

---

## Deployment Readiness Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend | ✅ Complete | 40+ prompts, user profiles, feedback form |
| Backend | ✅ Complete | Auth, email, extensible for database |
| Documentation | ✅ Complete | Setup, API, deployment guides |
| Testing | ✅ Ready | Test locally before deploying |
| Security | ✅ Configured | JWT, bcryptjs, CORS ready |
| Deployment | ✅ Ready | Heroku, Railway, Vercel supported |

**Ready to deploy? See DEPLOYMENT_GUIDE.md** 🚀
