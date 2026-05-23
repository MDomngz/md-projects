import React, { useState } from 'react';
import { BookOpen, Heart, Share2, Printer, Plus, Settings, Home, LogOut, Search, Filter } from 'lucide-react';

const TeacherAIPromptLibrary = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const promptLibrary = [
    // LESSON PLANNING
    {
      id: 1,
      title: 'Create a Differentiated Lesson Plan',
      category: 'Lesson Planning',
      prompt: 'Create a lesson plan for [GRADE/SUBJECT] on [TOPIC] using this structure:\n\nOBJECTIVE: Students will be able to [specific skill]. Make it student-friendly.\n\nOPENING (5 min): Hook + prior knowledge connection\nMINI-LESSON (10-15 min): I do / We do model with think-aloud\nGUIDED PRACTICE (10-15 min): We do together with supports\nINDEPENDENT/COLLABORATIVE PRACTICE (15-20 min): Three tiers—\n  • Tier 1 (Struggling): Concrete, heavily scaffolded\n  • Tier 2 (On level): Standard complexity\n  • Tier 3 (Advanced): Extension or application\n\nCLOSING (5 min): Reflection + quick formative check\n\nFor ELL/multilingual learners: Include sentence frames, visuals, and vocabulary pre-teaching.\nFor students experiencing stress/trauma: Build in predictability, movement, and success.',
      emoji: '📝',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      title: 'Design a Project-Based Learning Unit',
      category: 'Lesson Planning',
      prompt: 'Help me design a 2-3 week PBL unit for [GRADE/SUBJECT]. Include:\n- Driving question (real-world, meaningful)\n- Daily learning progressions (small steps, not one big jump)\n- How I\'ll check understanding along the way (formative checks)\n- Tiered tasks (so students at different levels can engage)\n- Roles for collaboration (clear responsibilities)\n- Authentic product/presentation\n\nConsider:\n- Students experiencing housing instability or trauma may miss days—build in catch-up time\n- Low-cost or free materials only\n- Incorporate student interests: [WHAT YOUR STUDENTS CARE ABOUT]\n\nMake sure every student can contribute meaningfully, not just advanced readers.',
      emoji: '🚀',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 3,
      title: 'Build Morning Routines & Predictable Openings',
      category: 'Lesson Planning',
      prompt: 'Design a predictable 10-15 minute opening routine for [GRADE]. Same every day. Include:\n- Warm greeting for every child (by name, genuine)\n- A calming activity or movement (not rushed)\n- Review of day\'s schedule (write it out, visual)\n- Quick prior knowledge check (low-stakes: hand signals, partner chat)\n\nWhy: Students experiencing stress/trauma need predictability and safety. Same routine = lower anxiety.\n\nExample rhythm: Greeting → Breakfast/water (if available) → Morning meeting/calendar → Quick review → Lesson preview.\n\nKeep it simple. No materials needed.',
      emoji: '🔔',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 4,
      title: 'Create Centers or Station Activities (Low-Prep)',
      category: 'Lesson Planning',
      prompt: 'Design 3-4 learning stations for [GRADE/SUBJECT] on [TOPIC] using what you have:\n\nEach station needs:\n- Clear, visual instructions (pictures + words)\n- One task at 2-3 difficulty levels\n- A way to show learning (drawing, writing, moving)\n- 10-15 minutes max\n- Works with NO teacher supervision\n\nStation ideas:\n  1. [Skill] with manipulatives or visuals\n  2. [Skill] with reading or writing\n  3. [Skill] with partner talk/collaboration\n  4. [Skill] with movement or building\n\nRotation tip: Use a timer. Same order every day (reduces confusion).\n\nI have [NUMBER] students. How often will I rotate groups?',
      emoji: '🎯',
      color: 'from-green-500 to-green-600'
    },

    // GRADING & ASSESSMENT
    {
      id: 5,
      title: 'Write Specific, Growth-Focused Feedback',
      category: 'Grading & Assessment',
      prompt: 'Write 3 pieces of feedback for a student who [DESCRIBE PERFORMANCE].\n\nEach should:\n- Name what they did well (be specific: "You used a complete sentence..." not "Good job")\n- Identify ONE area to grow (not five things)\n- Show what growth looks like: "Next time, try..." or "I noticed you could..."\n- Feel encouraging, not punitive\n\nRemember:\n- Students experiencing trauma may interpret criticism as shame\n- Focus on effort and growth, not just correctness\n- Write or say feedback soon after, while work is fresh\n\nStudent context: [If relevant: "struggles to focus," "learning English," "deals with a lot at home," etc.]',
      emoji: '✍️',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 6,
      title: 'Create a Student-Friendly Rubric',
      category: 'Grading & Assessment',
      prompt: 'Create a 4-level rubric for [ASSIGNMENT] in [GRADE/SUBJECT]:\n\nWORDS YOUR STUDENTS USE (not edu-jargon):\n- 4 - Wow! Shows deep learning: [specific example]\n- 3 - Great! Shows what we taught: [specific example]\n- 2 - Getting there. Getting close: [specific example]\n- 1 - We\'ll try again soon: [specific example]\n\nFocus on [KEY SKILLS/STANDARDS].\n\nTips:\n- Use pictures or icons for non-readers\n- Show examples at each level (what does a "2" actually look like?)\n- Kids should understand the difference between levels\n- This rubric helps YOU assess quickly AND helps kids know what to aim for',
      emoji: '📊',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 7,
      title: 'Design Quick Formative Checks (No Tests Needed)',
      category: 'Grading & Assessment',
      prompt: 'Design 5-6 quick checks for understanding about [LESSON TOPIC]:\n\nQuick check ideas (use a mix):\n- Thumbs up/sideways/down (assess in 10 seconds)\n- "Show me with your fingers: how many?" (non-verbal)\n- Whiteboard quick write (1 sentence)\n- Partner turn-and-talk (you listen in)\n- Exit ticket (1-2 questions, student draws or writes)\n- Hand signal: "Do you get it?" (fist to five)\n\nWrite the questions/prompts:\n- Question 1 (check prior knowledge): [prompt]\n- Question 2-4 (check during practice): [prompts]\n- Question 5-6 (check at end): [prompts]\n\nWhy: Real-time data tells you who needs reteaching TODAY, not after a test.',
      emoji: '📤',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 8,
      title: 'Use Data to Plan Small-Group Reteaching',
      category: 'Grading & Assessment',
      prompt: 'You gave a quick check or quiz on [SKILL]. Results:\n[PASTE DATA: e.g., "8 got it, 10 need support, 3 ready for extension"]\n\nHelp me:\n1. Identify the misconception: What are the 10 students confused about?\n2. Plan a 10-minute reteach for that group using concrete examples\n3. Suggest 2-3 practice activities they can do\n4. Plan an extension for the 3 who got it\n\nRemember: Reteaching is NOT punishment. It\'s how learning works. Frame it positively: "Our focus group is getting even smarter!"',
      emoji: '📈',
      color: 'from-teal-500 to-teal-600'
    },

    // BEHAVIOR MANAGEMENT
    {
      id: 9,
      title: 'Build Classroom Expectations (Trauma-Informed)',
      category: 'Behavior Management',
      prompt: 'Co-create 4-5 classroom expectations with your [GRADE] class. Frame them positively—what TO DO, not what NOT to do:\n\nExample framework:\n- RESPECTFUL: We listen to each other. What does that look like? (draw or list: eyes on speaker, mouth quiet, etc.)\n- SAFE: We help everyone feel okay. What does that look like? (use kind words, space for feelings, tell a grown-up if scared, etc.)\n- RESPONSIBLE: We try our best and ask for help. What does that look like? (try first, raise hand, speak up when stuck, etc.)\n\nMake it visual:\n- Draw or find pictures for each expectation\n- Post them where kids can see\n- Use kid language ("We listen" not "Active listening")\n\nRemember: Kids are less likely to follow rules that feel punitive. Frame expectations as how we take care of each other.',
      emoji: '⭐',
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 10,
      title: 'Respond to Behavior as Communication',
      category: 'Behavior Management',
      prompt: 'A student [DESCRIBE BEHAVIOR: aggression, shutdown, lying, not trying, etc.]\n\nBefore consequences, think:\n- What does this behavior tell me? (Is the work too hard? Do they need movement? Food? Sleep? Connection?)\n- What survival strategy might this be? (Kids experiencing stress use survival behaviors that worked at home)\n\nCreate a conversation script:\n1. Calm the situation: "I notice you\'re having a hard time. Let\'s take a breath."\n2. Ask with curiosity (not anger): "What happened? What do you need right now?"\n3. Set a boundary: "In our classroom, we [expectation]. What can we try instead?"\n4. Offer a next step: "Let\'s try again. I believe in you."\n\nContext: [Student age, what you know about them]\n\nRemember: Punishment alone doesn\'t work. Connection + boundaries = change.',
      emoji: '🤝',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      id: 11,
      title: 'Create a Strengths-Based Incentive System',
      category: 'Behavior Management',
      prompt: 'Design a positive incentive system for [GRADE] that motivates [SPECIFIC BEHAVIORS].\n\nMake sure it:\n- Celebrates EFFORT & GROWTH (not just perfect behavior)\n- Works for kids with different preferences (not everyone wants the same reward)\n- Is LOW-COST or FREE\n- Is trackable in < 5 min/week\n- Never shames kids who struggle\n- Includes students in designing it\n\nIdea: Use a mix of rewards—some kids want praise, some want free time, some want a note home, some want to pick an activity.\n\nRemember:\n- Kids experiencing trauma may have learned that trust = danger. Build it slowly.\n- Celebrate small steps. A kid who raised their hand once = big win if that\'s new for them.\n\nI have [NUMBER] students. Budget: [if any].',
      emoji: '🎁',
      color: 'from-lime-500 to-lime-600'
    },
    {
      id: 12,
      title: 'Write a Calming/Regulation Script',
      category: 'Behavior Management',
      prompt: 'Write a 3-5 minute guided calm-down script for [GRADE] to use when:\n- Energy is too high or class is dysregulated\n- A student is overwhelmed or stressed\n- We need a reset\n\nInclude:\n- Simple breathing (in for 4, hold for 4, out for 4)\n- Body awareness (notice where you feel calm)\n- Positive phrases ("I am safe," "I can try again")\n- Movement (stretch, shake, walk slowly)\n- Grounding (5 things you see, 4 you hear, 3 you feel)\n\nKeep it:\n- Age-appropriate language\n- Calm, slow pace (don\'t rush)\n- INCLUSIVE (no pressure to participate the "right way")\n- No special materials needed\n\nTip: Practice it daily, not just when kids are upset. It\'s a skill, like reading.',
      emoji: '🧘',
      color: 'from-violet-500 to-violet-600'
    },

    // STUDENT ENGAGEMENT & DIFFERENTIATION
    {
      id: 13,
      title: 'Create Discussion Questions (All Learners Welcome)',
      category: 'Student Engagement',
      prompt: 'Create 10 discussion questions about [TEXT/TOPIC] for [GRADE]. Mix question types:\n\n- RECALL (easy start): "Who was...? What happened when...?"\n- INFERENCE: "Why do you think...? What might happen next?"\n- ANALYSIS: "How is [thing A] different from [thing B]? Why did...?"\n- PERSONAL: "Has this ever happened to you? How did it feel?"\n- CREATIVE: "What if...? How would you...?"\n\nMake them accessible:\n- First questions = easy (everyone can answer)\n- Use sentence frames: "I think _____ because _____"\n- Allow partner talk before whole-class (less intimidating)\n- Accept drawings, gestures, or simple answers\n- Give wait time: 5-10 seconds before expecting answers\n- Celebrate risk-taking: "I love how you took a chance with that answer!"\n\nContext: Students learning English? Include visuals. Students experiencing stress? Start with fun, low-stakes questions.',
      emoji: '💬',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 14,
      title: 'Design Anchor Activities (No Prep, No Judgment)',
      category: 'Student Engagement',
      prompt: 'Create 5 anchor activities (things students do independently while you work with small groups):\n\nFor [GRADE/SUBJECT], students can:\n1. [Skill-building]: [Concrete activity—reading, math practice, writing]\n2. [Exploration]: [Open-ended—drawing, building, investigating]\n3. [Choice/Interest]: [Something they love—art, games, books]\n4. [Review]: [Practice from past lessons]\n5. [Creation]: [Make something—poster, writing, model]\n\nMake sure each:\n- Has clear, visual instructions\n- Requires NO adult help\n- Takes 15-30 min (not 5)\n- Feels worthwhile, not busywork\n- Works for mixed abilities\n- No judgment if someone isn\'t "done"\n\nRotate them so they stay fresh. Post instructions with pictures. Let kids help organize materials.\n\nContext: My class loves: [INTERESTS]',
      emoji: '⚓',
      color: 'from-sky-500 to-sky-600'
    },
    {
      id: 15,
      title: 'Plan Tiered Instruction for Mixed Abilities',
      category: 'Student Engagement',
      prompt: 'I\'m teaching [LESSON/SKILL]. My students range from [DESCRIBE RANGE: e.g., "non-readers to fluent readers"].\n\nHelp me create 3 entry points to the same skill:\n\nTIER 1 (Concrete, heavy support): \n- Manipulatives or visuals\n- Shorter task\n- More adult/peer support\n- Success = trying and engaging\n\nTIER 2 (Grade-level):\n- Standard complexity\n- Guided practice included\n- Can work with some independence\n\nTIER 3 (Advanced/Extension):\n- More complex version\n- Open-ended\n- Problem-solving, creativity\n\nFor each tier, include:\n- What the task is\n- What materials/supports you\'ll provide\n- How students show learning\n\nRemember: "Tier 1" isn\'t lower intelligence—it\'s meeting kids where they are. Celebrate everyone\'s growth.',
      emoji: '🎨',
      color: 'from-rose-500 to-rose-600'
    },
    {
      id: 16,
      title: 'Design Low-Cost Engagement Activities & Games',
      category: 'Student Engagement',
      prompt: 'Design 3 classroom games or activities for [GRADE/SUBJECT] to practice [SKILL]:\n\nEach should:\n- Use NO materials or only paper/pencils/items you have\n- Take 15-20 minutes\n- Include everyone (even struggling learners can contribute)\n- Be FUN (not hiding learning)\n- Have simple, clear rules kids can explain to each other\n\nGame ideas:\n1. [Movement-based game about [skill]]\n2. [Partner or team game]\n3. [Whole-group game]\n\nFor each, include:\n- How you explain the rules\n- What success looks like (celebrate effort & strategy, not just winning)\n- Variation for different ability levels\n\nTip: Games are powerful for engagement AND community. Everyone has a role. Everyone gets to be good at something.\n\nMy class loves: [INTERESTS]',
      emoji: '🎮',
      color: 'from-fuchsia-500 to-fuchsia-600'
    },

    // SPECIAL SITUATIONS
    {
      id: 17,
      title: 'Build Family Connections (Joyful, Not Judgment)',
      category: 'Communication',
      prompt: 'Draft a [WEEKLY/MONTHLY] family update for [GRADE] that:\n- CELEBRATES what kids are learning (make families proud)\n- Shows what kids are DOING, not just facts they learned\n- Includes "You can help at home" tips (doable, no cost, honors all families)\n- Asks ONE question that families can answer together\n- Uses simple language (not education jargon)\n- Acknowledges that families are busy/stressed\n\nStructure:\nHi families,\n\nThis week/month we\'re learning about [TOPIC] because it matters for [why].\n\nYou\'ll notice your child can now [concrete skill]. You can practice this at home by [easy activity].\n\nWe\'re proud of [specific celebration—try, kindness, curiosity].\n\n[One fun question to answer & send back]\n\nWarm regards,\n[Your name]\n\nTip: Send GOOD news, not just problems. Families need to feel their child\'s teacher likes them.',
      emoji: '💌',
      color: 'from-amber-500 to-amber-600'
    },
    {
      id: 18,
      title: 'Prepare for Conversations About Struggle',
      category: 'Communication',
      prompt: 'You need to talk to a family about [TOPIC: behavior, learning, attendance, etc.].\n\nPrepare:\n1. SPECIFIC DATA (not "he\'s struggling"): "Adán has missed 12 days. That makes it hard for him to catch up. I want to help."\n2. What you\'ve tried: "Here\'s what I\'ve done to support him..."\n3. Their perspective: "What\'s going on at home? How can we work together?"\n4. Next steps: "Here\'s what I can do. What can you do? Let\'s try..."\n5. Warmth: "Adán is smart and capable. I believe in him. We\'re a team."\n\nDuring the conversation:\n- Listen more than you talk\n- Assume good intent (families care, even if it doesn\'t always look like it)\n- No blame or judgment\n- Offer practical support: "What resources might help?"\n- End with hope\n\nStudent: [NAME]. Context: [SITUATION]',
      emoji: '🎙️',
      color: 'from-orange-400 to-orange-500'
    },
    {
      id: 19,
      title: 'Build Classroom Community & Belonging',
      category: 'Community Building',
      prompt: 'Design 3-4 daily or weekly rituals for [GRADE] that build belonging:\n\nThey should:\n- Take 5-10 minutes max\n- Happen the SAME time every day or week (predictability matters)\n- Include EVERY student (no one left out)\n- Celebrate who kids are (names, interests, identities)\n- Be joyful, not forced\n\nIdea starters:\n1. Morning greeting ritual: Everyone gets greeted by name, by you\n2. Story circle: Kids share something (could be drawing, could be 1 word)\n3. Community celebration: Shout-outs for effort, kindness, trying\n4. Closing ritual: Reflection or song or wave\n\nFor each:\n- What happens\n- When/how often\n- How kids participate\n- Why it builds belonging\n\nTip: Kids experiencing trauma especially need to know they belong. Rituals show "you matter, you\'re safe, we\'re a family."',
      emoji: '🎉',
      color: 'from-red-400 to-red-500'
    },
    {
      id: 20,
      title: 'Support Multilingual & ELL Students',
      category: 'Lesson Planning',
      prompt: 'I\'m teaching [LESSON/SKILL] and have [NUMBER] students learning English (or learning [LANGUAGE]).\n\nCreate a support plan with:\n\n1. VOCABULARY: Key words they\'ll need. Create a word wall with pictures + words.\n2. SENTENCE FRAMES: Sentence starters they can use: "I think _____ because _____"\n3. PRE-TEACHING: Before the lesson, introduce key words + visuals (5 min)\n4. DURING: Pair them with English-proficient peers. Use gestures, show visuals. Slow down & pause.\n5. RESPONSE OPTIONS: Let them answer with gestures, drawings, or one-word answers first\n6. HOME CONNECTION: Send a note home in their language (if possible) with key words & how to support\n\nRemember:\n- Bilingualism is an asset, not a problem\n- Their home language helps them learn English\n- Silent period is NORMAL—don\'t force talking\n- Give 5-10 second wait time before expecting answers\n- Assess language separately from content (they might GET it but not say it fluently yet)',
      emoji: '🌟',
      color: 'from-yellow-400 to-yellow-500'
    }
  ];

  const categories = ['all', ...new Set(promptLibrary.map(p => p.category))];

  const handleCreateProfile = (name) => {
    setUserProfile({ name, joinDate: new Date().toLocaleDateString() });
    setIsLoggedIn(true);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
    setSavedPrompts([]);
    setCurrentView('home');
  };

  const toggleSavePrompt = (promptId) => {
    setSavedPrompts(prev =>
      prev.includes(promptId) ? prev.filter(id => id !== promptId) : [...prev, promptId]
    );
  };

  const filteredPrompts = promptLibrary.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const savedPromptsList = promptLibrary.filter(p => savedPrompts.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setCurrentView('home'); setSearchTerm(''); }}>
            <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-2 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">TeacherAI Prompts</h1>
              <p className="text-xs text-slate-400">Daily AI ideas for teachers</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <div className="text-right text-sm">
                  <p className="font-semibold">{userProfile.name}</p>
                  <p className="text-slate-400">{savedPrompts.length} saved</p>
                </div>
                <button
                  onClick={() => setCurrentView('saved')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentView === 'saved'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  <Heart className="w-4 h-4 inline mr-2" />
                  Saved
                </button>
                <button onClick={handleLogout} className="p-2 hover:bg-slate-800 rounded-lg transition-all">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all font-semibold"
              >
                Create Profile
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Login View */}
      {currentView === 'login' && !isLoggedIn && (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full border border-slate-700">
            <h2 className="text-3xl font-bold mb-6">Welcome, Teacher! 👋</h2>
            <p className="text-slate-300 mb-6">Create a profile to save your favorite prompts and build your personalized library.</p>
            <input
              type="text"
              placeholder="What's your name?"
              maxLength="30"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleCreateProfile(e.target.value.trim());
                }
              }}
              autoFocus
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg mb-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              onClick={(e) => {
                const input = e.target.previousSibling;
                if (input.value.trim()) {
                  handleCreateProfile(input.value.trim());
                }
              }}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all"
            >
              Get Started →
            </button>
            <button
              onClick={() => {
                setCurrentView('home');
                setUserProfile({ name: 'Guest', joinDate: new Date().toLocaleDateString() });
                setIsLoggedIn(false);
              }}
              className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold transition-all mt-3"
            >
              Browse as Guest
            </button>
          </div>
        </div>
      )}

      {/* Home/Browse View */}
      {currentView === 'home' && (
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-3">Your AI Idea Toolkit 🚀</h2>
            <p className="text-xl text-slate-300 max-w-2xl">
              Discover 20+ ready-to-use AI prompts designed to save you time and spark creativity in your classroom. Every idea is tested, encouraging, and practical for K-12 teachers.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search prompts by title or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-slate-400 flex items-center gap-2 mr-2">
                <Filter className="w-4 h-4" /> Categories:
              </span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full transition-all font-medium text-sm ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  {cat !== 'all' && ` (${promptLibrary.filter(p => p.category === cat).length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <p className="text-slate-400 mb-6">Showing {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''}</p>

          {/* Prompt Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map(prompt => (
              <div
                key={prompt.id}
                className="group bg-slate-900 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 flex flex-col print:break-inside-avoid print:page-break-inside-avoid"
              >
                {/* Card Header with Color Gradient */}
                <div className={`bg-gradient-to-r ${prompt.color} p-4`}>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-4xl">{prompt.emoji}</span>
                    {isLoggedIn && (
                      <button
                        onClick={() => toggleSavePrompt(prompt.id)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            savedPrompts.includes(prompt.id)
                              ? 'fill-white'
                              : 'text-white'
                          }`}
                        />
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wide">
                    {prompt.category}
                  </p>
                  <h3 className="text-lg font-bold mb-3 leading-snug">{prompt.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-4 line-clamp-4">
                    {prompt.prompt.replace(/\[.*?\]/g, '[...]')}
                  </p>

                  {/* Card Footer */}
                  <div className="flex gap-2 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => {
                        const text = `${prompt.title}\n\n${prompt.prompt}`;
                        navigator.clipboard.writeText(text);
                      }}
                      className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Copy
                    </button>
                    <button
                      className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-all flex items-center justify-center gap-2 print:hidden"
                      onClick={() => window.print()}
                    >
                      <Printer className="w-4 h-4" />
                      Print
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPrompts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No prompts found matching your search. Try different keywords!</p>
            </div>
          )}
        </main>
      )}

      {/* Saved Prompts View */}
      {currentView === 'saved' && isLoggedIn && (
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-2">Your Saved Prompts ❤️</h2>
            <p className="text-slate-400">
              {savedPromptsList.length === 0
                ? "You haven't saved any prompts yet. Browse the library and click the heart to save!"
                : `You have ${savedPromptsList.length} prompt${savedPromptsList.length !== 1 ? 's' : ''} saved.`}
            </p>
          </div>

          {savedPromptsList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPromptsList.map(prompt => (
                <div
                  key={prompt.id}
                  className="group bg-slate-900 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-all duration-300 flex flex-col"
                >
                  <div className={`bg-gradient-to-r ${prompt.color} p-4`}>
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-4xl">{prompt.emoji}</span>
                      <button
                        onClick={() => toggleSavePrompt(prompt.id)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                      >
                        <Heart className="w-5 h-5 fill-white text-white" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wide">
                      {prompt.category}
                    </p>
                    <h3 className="text-lg font-bold mb-3 leading-snug">{prompt.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-4">
                      {prompt.prompt}
                    </p>

                    <div className="flex gap-2 pt-4 border-t border-slate-800">
                      <button
                        onClick={() => {
                          const text = `${prompt.title}\n\n${prompt.prompt}`;
                          navigator.clipboard.writeText(text);
                        }}
                        className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Copy
                      </button>
                      <button
                        className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                        onClick={() => window.print()}
                      >
                        <Printer className="w-4 h-4" />
                        Print
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {savedPromptsList.length === 0 && (
            <button
              onClick={() => setCurrentView('home')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all"
            >
              Browse Prompts →
            </button>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
          <p className="mb-2">Made with ❤️ to support teachers</p>
          <p className="text-sm">All prompts are designed to be encouraging, practical, and K-12 focused</p>
        </div>
      </footer>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background-color: white;
            color: black;
          }
          .print\\:hidden {
            display: none;
          }
          .print\\:break-inside-avoid {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherAIPromptLibrary;