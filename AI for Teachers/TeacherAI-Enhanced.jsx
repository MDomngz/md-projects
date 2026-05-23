import React, { useState } from 'react';
import { BookOpen, Heart, Share2, Printer, Plus, LogOut, Search, Filter, MessageCircle, X, Mail, CheckCircle } from 'lucide-react';

const TeacherAIPromptLibrary = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ name: '', email: '', message: '' });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const expandedPromptLibrary = [
    // LESSON PLANNING (8 prompts)
    {
      id: 1,
      title: 'Create a Differentiated Lesson Plan',
      category: 'Lesson Planning',
      prompt: 'Create a lesson plan for [GRADE/SUBJECT] on [TOPIC] using this structure:\n\nOBJECTIVE: Students will be able to [specific skill]. Make it student-friendly.\n\nOPENING (5 min): Hook + prior knowledge connection\nMINI-LESSON (10-15 min): I do / We do model with think-aloud\nGUIDED PRACTICE (10-15 min): We do together with supports\nINDEPENDENT/COLLABORATIVE PRACTICE (15-20 min): Three tiers—\n  • Tier 1 (Struggling): Concrete, heavily scaffolded\n  • Tier 2 (On level): Standard complexity\n  • Tier 3 (Advanced): Extension or application\n\nCLOSING (5 min): Reflection + quick formative check\n\nFor ELL/multilingual learners: Include sentence frames, visuals, and vocabulary pre-teaching.\nFor students experiencing stress/trauma: Build in predictability, movement, and success.',
      emoji: '📝',
      color: 'from-blue-500 to-blue-600',
      tags: ['differentiation', 'structure', 'all-grades']
    },
    {
      id: 2,
      title: 'Design a Project-Based Learning Unit',
      category: 'Lesson Planning',
      prompt: 'Help me design a 2-3 week PBL unit for [GRADE/SUBJECT]. Include:\n- Driving question (real-world, meaningful)\n- Daily learning progressions (small steps, not one big jump)\n- How I\'ll check understanding along the way (formative checks)\n- Tiered tasks (so students at different levels can engage)\n- Roles for collaboration (clear responsibilities)\n- Authentic product/presentation\n\nConsider:\n- Students experiencing housing instability or trauma may miss days—build in catch-up time\n- Low-cost or free materials only\n- Incorporate student interests: [WHAT YOUR STUDENTS CARE ABOUT]\n\nMake sure every student can contribute meaningfully, not just advanced readers.',
      emoji: '🚀',
      color: 'from-purple-500 to-purple-600',
      tags: ['project-based', 'engagement', 'real-world']
    },
    {
      id: 3,
      title: 'Build Morning Routines & Predictable Openings',
      category: 'Lesson Planning',
      prompt: 'Design a predictable 10-15 minute opening routine for [GRADE]. Same every day. Include:\n- Warm greeting for every child (by name, genuine)\n- A calming activity or movement (not rushed)\n- Review of day\'s schedule (write it out, visual)\n- Quick prior knowledge check (low-stakes: hand signals, partner chat)\n\nWhy: Students experiencing stress/trauma need predictability and safety. Same routine = lower anxiety.\n\nExample rhythm: Greeting → Breakfast/water (if available) → Morning meeting/calendar → Quick review → Lesson preview.\n\nKeep it simple. No materials needed.',
      emoji: '🔔',
      color: 'from-yellow-500 to-yellow-600',
      tags: ['routines', 'trauma-informed', 'community']
    },
    {
      id: 4,
      title: 'Create Centers or Station Activities (Low-Prep)',
      category: 'Lesson Planning',
      prompt: 'Design 3-4 learning stations for [GRADE/SUBJECT] on [TOPIC] using what you have:\n\nEach station needs:\n- Clear, visual instructions (pictures + words)\n- One task at 2-3 difficulty levels\n- A way to show learning (drawing, writing, moving)\n- 10-15 minutes max\n- Works with NO teacher supervision\n\nStation ideas:\n  1. [Skill] with manipulatives or visuals\n  2. [Skill] with reading or writing\n  3. [Skill] with partner talk/collaboration\n  4. [Skill] with movement or building\n\nRotation tip: Use a timer. Same order every day (reduces confusion).',
      emoji: '🎯',
      color: 'from-green-500 to-green-600',
      tags: ['centers', 'low-cost', 'independent-work']
    },
    {
      id: 5,
      title: 'Get Ideas for a Thematic Unit',
      category: 'Lesson Planning',
      prompt: 'Help me brainstorm a thematic unit for [GRADE/SUBJECT] around [TOPIC/THEME].\n\nInclude:\n- 3-4 key learning standards I can address\n- Possible texts, resources, or materials (FREE or low-cost)\n- Real-world connections\n- Hands-on activities\n- A culminating project idea\n- Ways to differentiate\n\nMy students are interested in: [INTERESTS]',
      emoji: '🌟',
      color: 'from-yellow-400 to-yellow-500',
      tags: ['thematic', 'integration', 'standards']
    },
    {
      id: 6,
      title: 'Create Multi-Sensory Learning Activities',
      category: 'Lesson Planning',
      prompt: 'Design 3 ways to teach [CONCEPT] in [GRADE/SUBJECT] using different senses:\n\n1. VISUAL: How can students SEE this? (chart, diagram, picture, color-code)\n2. KINESTHETIC: How can students MOVE or BUILD it? (manipulatives, movement, hands-on)\n3. AUDITORY: How can students HEAR or SAY it? (chant, song, partner talk, repetition)\n\nFor each:\n- What materials/setup needed\n- How it works\n- How students show learning\n- How to differentiate\n\nRemember: Different kids learn differently. If some kids "get it" with visuals, others need movement. All three make concepts stick.',
      emoji: '🎨',
      color: 'from-pink-500 to-pink-600',
      tags: ['learning-styles', 'multisensory', 'accessibility']
    },
    {
      id: 7,
      title: 'Build Literacy Into Any Subject',
      category: 'Lesson Planning',
      prompt: 'I\'m teaching [SUBJECT: math, science, social studies] on [TOPIC]. Help me weave in reading & writing:\n\nREADING:\n- What could students read to learn this? (grade-level text, simplified text, visuals with labels)\n- Pre-teach words they\'ll encounter\n\nWRITING:\n- How can they write about this? (labels, sentences, explanations, creative)\n- What scaffolds do they need?\n\nSPEAKING:\n- Partner talk prompts\n- Sentence frames\n\nLISTENING:\n- Read-aloud to engage\n- Peer explanations\n\nFor [NUMBER] ELL students, include vocabulary visuals and sentence frames.',
      emoji: '📚',
      color: 'from-indigo-500 to-indigo-600',
      tags: ['literacy', 'integration', 'ell-support']
    },
    {
      id: 8,
      title: 'Plan Flexible, Low-Pressure Assessments',
      category: 'Lesson Planning',
      prompt: 'Help me assess [SKILL/CONCEPT] for [GRADE] in low-stress ways:\n\nOffer multiple ways to show learning:\n- Drawing/labeling\n- Writing (1 sentence, paragraph, journal)\n- Speaking (partner chat, small group)\n- Demonstrating (showing with manipulatives, movement)\n- Creating (poster, model, presentation)\n\nFor each option:\n- What it is\n- How to score it (rubric)\n- How it\'s fair to all learners\n\nRemember: Timed tests + high stakes = panic for trauma-affected kids. Low-pressure assessment = more honest picture of what they know.',
      emoji: '✅',
      color: 'from-green-400 to-green-500',
      tags: ['assessment', 'inclusive', 'low-stress']
    },

    // GRADING & ASSESSMENT (8 prompts)
    {
      id: 9,
      title: 'Write Specific, Growth-Focused Feedback',
      category: 'Grading & Assessment',
      prompt: 'Write 3 pieces of feedback for a student who [DESCRIBE PERFORMANCE].\n\nEach should:\n- Name what they did well (be specific: "You used a complete sentence..." not "Good job")\n- Identify ONE area to grow (not five things)\n- Show what growth looks like: "Next time, try..." or "I noticed you could..."\n- Feel encouraging, not punitive\n\nRemember:\n- Students experiencing trauma may interpret criticism as shame\n- Focus on effort and growth, not just correctness\n- Write or say feedback soon after, while work is fresh\n\nStudent context: [If relevant: "struggles to focus," "learning English," "deals with a lot at home," etc.]',
      emoji: '✍️',
      color: 'from-red-500 to-red-600',
      tags: ['feedback', 'growth', 'positive']
    },
    {
      id: 10,
      title: 'Create a Student-Friendly Rubric',
      category: 'Grading & Assessment',
      prompt: 'Create a 4-level rubric for [ASSIGNMENT] in [GRADE/SUBJECT]:\n\nWORDS YOUR STUDENTS USE (not edu-jargon):\n- 4 - Wow! Shows deep learning: [specific example]\n- 3 - Great! Shows what we taught: [specific example]\n- 2 - Getting there. Getting close: [specific example]\n- 1 - We\'ll try again soon: [specific example]\n\nFocus on [KEY SKILLS/STANDARDS].\n\nTips:\n- Use pictures or icons for non-readers\n- Show examples at each level (what does a "2" actually look like?)\n- Kids should understand the difference between levels\n- This rubric helps YOU assess quickly AND helps kids know what to aim for',
      emoji: '📊',
      color: 'from-orange-500 to-orange-600',
      tags: ['rubric', 'standards', 'student-friendly']
    },
    {
      id: 11,
      title: 'Design Quick Formative Checks (No Tests)',
      category: 'Grading & Assessment',
      prompt: 'Design 5-6 quick checks for understanding about [LESSON TOPIC]:\n\nQuick check ideas (use a mix):\n- Thumbs up/sideways/down (assess in 10 seconds)\n- "Show me with your fingers: how many?" (non-verbal)\n- Whiteboard quick write (1 sentence)\n- Partner turn-and-talk (you listen in)\n- Exit ticket (1-2 questions, student draws or writes)\n- Hand signal: "Do you get it?" (fist to five)\n\nWrite the questions/prompts:\n- Question 1 (check prior knowledge): [prompt]\n- Question 2-4 (check during practice): [prompts]\n- Question 5-6 (check at end): [prompts]\n\nWhy: Real-time data tells you who needs reteaching TODAY, not after a test.',
      emoji: '📤',
      color: 'from-indigo-500 to-indigo-600',
      tags: ['formative-assessment', 'quick-checks', 'no-stress']
    },
    {
      id: 12,
      title: 'Use Data to Plan Small-Group Reteaching',
      category: 'Grading & Assessment',
      prompt: 'You gave a quick check or quiz on [SKILL]. Results:\n[PASTE DATA: e.g., "8 got it, 10 need support, 3 ready for extension"]\n\nHelp me:\n1. Identify the misconception: What are the 10 students confused about?\n2. Plan a 10-minute reteach for that group using concrete examples\n3. Suggest 2-3 practice activities they can do\n4. Plan an extension for the 3 who got it\n\nRemember: Reteaching is NOT punishment. It\'s how learning works. Frame it positively: "Our focus group is getting even smarter!"',
      emoji: '📈',
      color: 'from-teal-500 to-teal-600',
      tags: ['data', 'reteaching', 'flexible-groups']
    },
    {
      id: 13,
      title: 'Track Progress Without Drowning in Data',
      category: 'Grading & Assessment',
      prompt: 'Help me set up a simple way to track student progress on [SKILL/STANDARD]:\n\nOPTION 1 (Notebook): One page per student, tallies/notes\nOPTION 2 (Simple spreadsheet): Student names + 3-4 checkpoints\nOPTION 3 (Checklist): Skills on one axis, students on other\n\nTrack:\n- Date of check\n- What they can do\n- What they\'re working on\n- Who needs intervention\n- Who\'s ready to move on\n\nKeep it SIMPLE:\n- Takes < 5 minutes to update\n- Helps YOU make decisions\n- Shared with families (shows growth, not just grades)\n\nI teach [GRADE]. I have [NUMBER] students. I check understanding [HOW OFTEN?]',
      emoji: '📋',
      color: 'from-cyan-500 to-cyan-600',
      tags: ['tracking', 'data-management', 'low-prep']
    },
    {
      id: 14,
      title: 'Create a Strengths-Based Report Card Comment',
      category: 'Grading & Assessment',
      prompt: 'Write 3-4 report card comments for [STUDENT] in [GRADE]:\n\nEach comment should:\n- Celebrate something specific they\'re good at (strength)\n- Name one area of growth\n- Show progress over time ("At the start of the year... now...")\n- End with encouragement\n- Be readable for families (not jargony)\n\nInclude:\n- Academic: "Reads with fluency and expression..."\n- Social-emotional: "Works well with partners... is learning to..."\n- Effort/growth mindset: "Tries new strategies when stuck..."\n\nStudent context: [Strengths, challenges, personality]\n\nTone: Warm, honest, hopeful. Families should see their child celebrated.',
      emoji: '📃',
      color: 'from-blue-400 to-blue-500',
      tags: ['report-cards', 'strengths-based', 'communication']
    },
    {
      id: 15,
      title: 'Design a Portfolio or Work Showcase',
      category: 'Grading & Assessment',
      prompt: 'Help me create a way to show growth over time for [GRADE/SUBJECT]:\n\nOPTION 1 (Physical): Folder with selected work samples + student reflections\nOPTION 2 (Digital): Google Folder or slideshow with photos of work\nOPTION 3 (Hybrid): Both—selected pieces + photos/videos\n\nInclude:\n- Work from early [UNIT/YEAR]\n- Work from middle\n- Recent work\n- Student reflection: "I chose this because..." and "I\'ve grown by..."\n- Standards covered\n\nShare with:\n- Families (shows learning journey)\n- Next teacher (shows what this student can do)\n- Student (celebrates growth, builds confidence)\n\nRemember: Portfolio is about GROWTH, not perfection.',
      emoji: '🎬',
      color: 'from-purple-400 to-purple-500',
      tags: ['portfolio', 'evidence', 'showcase']
    },
    {
      id: 16,
      title: 'Adapt Assessments for Students with IEPs/504s',
      category: 'Grading & Assessment',
      prompt: 'Student [NAME] has an IEP/504 with accommodations: [LIST].\n\nHow do I assess [SKILL] while honoring their IEP?\n\nConsider:\n- SETTING: Small group? Separate room? With peer support?\n- FORMAT: Written test? Oral? Drawing? Project?\n- TIME: Extra time? Breaks?\n- TOOLS: Calculator, word processor, manipulatives, notes?\n- EXPECTATIONS: Same skill, but different way to show it\n\nExample: Student who can\'t write quickly can explain to you + you scribe, or draw their answer, or record audio.\n\nRemember: Accommodations are NOT lowering standards. They\'re removing barriers so students can show what they KNOW.',
      emoji: '♿',
      color: 'from-emerald-500 to-emerald-600',
      tags: ['iep', '504', 'accommodations']
    },

    // BEHAVIOR MANAGEMENT (8 prompts)
    {
      id: 17,
      title: 'Build Classroom Expectations (Trauma-Informed)',
      category: 'Behavior Management',
      prompt: 'Co-create 4-5 classroom expectations with your [GRADE] class. Frame them positively—what TO DO, not what NOT to do:\n\nExample framework:\n- RESPECTFUL: We listen to each other. What does that look like? (draw or list: eyes on speaker, mouth quiet, etc.)\n- SAFE: We help everyone feel okay. What does that look like? (use kind words, space for feelings, tell a grown-up if scared, etc.)\n- RESPONSIBLE: We try our best and ask for help. What does that look like? (try first, raise hand, speak up when stuck, etc.)\n\nMake it visual:\n- Draw or find pictures for each expectation\n- Post them where kids can see\n- Use kid language ("We listen" not "Active listening")\n\nRemember: Kids are less likely to follow rules that feel punitive. Frame expectations as how we take care of each other.',
      emoji: '⭐',
      color: 'from-pink-500 to-pink-600',
      tags: ['expectations', 'community', 'positive']
    },
    {
      id: 18,
      title: 'Respond to Behavior as Communication',
      category: 'Behavior Management',
      prompt: 'A student [DESCRIBE BEHAVIOR: aggression, shutdown, lying, not trying, etc.]\n\nBefore consequences, think:\n- What does this behavior tell me? (Is the work too hard? Do they need movement? Food? Sleep? Connection?)\n- What survival strategy might this be? (Kids experiencing stress use survival behaviors that worked at home)\n\nCreate a conversation script:\n1. Calm the situation: "I notice you\'re having a hard time. Let\'s take a breath."\n2. Ask with curiosity (not anger): "What happened? What do you need right now?"\n3. Set a boundary: "In our classroom, we [expectation]. What can we try instead?"\n4. Offer a next step: "Let\'s try again. I believe in you."\n\nContext: [Student age, what you know about them]\n\nRemember: Punishment alone doesn\'t work. Connection + boundaries = change.',
      emoji: '🤝',
      color: 'from-cyan-500 to-cyan-600',
      tags: ['behavior', 'restorative', 'communication']
    },
    {
      id: 19,
      title: 'Create a Strengths-Based Incentive System',
      category: 'Behavior Management',
      prompt: 'Design a positive incentive system for [GRADE] that motivates [SPECIFIC BEHAVIORS].\n\nMake sure it:\n- Celebrates EFFORT & GROWTH (not just perfect behavior)\n- Works for kids with different preferences (not everyone wants the same reward)\n- Is LOW-COST or FREE\n- Is trackable in < 5 min/week\n- Never shames kids who struggle\n- Includes students in designing it\n\nIdea: Use a mix of rewards—some kids want praise, some want free time, some want a note home, some want to pick an activity.\n\nRemember:\n- Kids experiencing trauma may have learned that trust = danger. Build it slowly.\n- Celebrate small steps. A kid who raised their hand once = big win if that\'s new for them.\n\nI have [NUMBER] students. Budget: [if any].',
      emoji: '🎁',
      color: 'from-lime-500 to-lime-600',
      tags: ['positive-behavior', 'incentives', 'no-cost']
    },
    {
      id: 20,
      title: 'Write a Calming/Regulation Script',
      category: 'Behavior Management',
      prompt: 'Write a 3-5 minute guided calm-down script for [GRADE] to use when:\n- Energy is too high or class is dysregulated\n- A student is overwhelmed or stressed\n- We need a reset\n\nInclude:\n- Simple breathing (in for 4, hold for 4, out for 4)\n- Body awareness (notice where you feel calm)\n- Positive phrases ("I am safe," "I can try again")\n- Movement (stretch, shake, walk slowly)\n- Grounding (5 things you see, 4 you hear, 3 you feel)\n\nKeep it:\n- Age-appropriate language\n- Calm, slow pace (don\'t rush)\n- INCLUSIVE (no pressure to participate the "right way")\n- No special materials needed\n\nTip: Practice it daily, not just when kids are upset. It\'s a skill, like reading.',
      emoji: '🧘',
      color: 'from-violet-500 to-violet-600',
      tags: ['mindfulness', 'regulation', 'calm-down']
    },
    {
      id: 21,
      title: 'Support a Student Experiencing Trauma or Big Feelings',
      category: 'Behavior Management',
      prompt: 'A student [NAME] is [BEHAVIOR: shutting down, acting out, can\'t focus, seems withdrawn].\n\nI suspect they\'re dealing with [POSSIBLE: grief, housing instability, family stress, hunger, lack of sleep].\n\nCreate a support plan:\n1. RELATIONSHIP: How can I show I care? (one-on-one time, greeting, check-ins)\n2. STRUCTURE: What routines help them feel safe?\n3. BASIC NEEDS: Do they need food, water, bathroom breaks?\n4. PROCESSING: How can they express feelings? (drawing, talking, movement, quiet time)\n5. WHEN THEY STRUGGLE: What\'s my calm response?\n\nResources to connect family with: [food bank, counselor, social services]\n\nRemember: You can\'t fix their home situation, but you can be the stable, caring adult who shows up.',
      emoji: '❤️',
      color: 'from-red-500 to-red-600',
      tags: ['trauma', 'mental-health', 'care']
    },
    {
      id: 22,
      title: 'Teach Conflict Resolution & Peer Problem-Solving',
      category: 'Behavior Management',
      prompt: 'Teach students [GRADE] to solve conflicts independently. Create lesson:\n\nSTEP 1: Name the problem (without blame)\n"The problem is... [what happened]"\n\nSTEP 2: How did it make you feel?\n"I felt... [emotion]"\n\nSTEP 3: What do you want to happen?\n"I want... [solution]"\n\nSTEP 4: Let\'s try something new\n"Next time, we could... [brainstorm ideas together]"\n\nThen:\n- Practice with puppets, role-play, or picture stories\n- Give them a signal for "we have a conflict" (come to me, use a card, etc.)\n- Celebrate when they solve it themselves\n\nScript & practice scenarios: [Create 3 common conflicts for your class to practice]\n\nRemember: Kids need to PRACTICE this skill, not just hear about it.',
      emoji: '🕊️',
      color: 'from-amber-500 to-amber-600',
      tags: ['conflict-resolution', 'social-skills', 'empathy']
    },
    {
      id: 23,
      title: 'Handle a Challenging Parent Conversation',
      category: 'Behavior Management',
      prompt: 'You need to talk to [PARENT/FAMILY] about [BEHAVIOR/CONCERN].\n\nPrepare:\n1. SPECIFIC DATA (not "he\'s struggling"): [Give concrete examples]\n2. What you\'ve tried: "Here\'s what I\'ve done to support them..."\n3. Their perspective: "What\'s going on at home? How can we work together?"\n4. Next steps: "Here\'s what I can do. What can you do? Let\'s try..."\n5. Warmth: "Their student is smart and capable. I believe in them. We\'re a team."\n\nDuring the conversation:\n- Listen more than you talk\n- Assume good intent (families care, even if it doesn\'t always look like it)\n- No blame or judgment\n- Offer practical support: "What resources might help?"\n- End with hope\n\nStudent: [NAME]. Context: [SITUATION]',
      emoji: '💬',
      color: 'from-orange-500 to-orange-600',
      tags: ['family-communication', 'partnership', 'difficult-conversations']
    },
    {
      id: 24,
      title: 'Prevent Behavior Problems Before They Start',
      category: 'Behavior Management',
      prompt: 'Design a preventive behavior plan for [GRADE]. Focus on:\n\nCLEAR EXPECTATIONS: Students know what\'s expected\nPREDICTABLE ROUTINES: Same schedule, same transitions every day\nBELONGING: Every kid feels they matter\nCHOICE: Students have some control\nMOVEMENT: Break up sitting with transitions and brain breaks\nSUCCESS: Tasks are doable, not frustrating\nRELATIONSHIPS: You know your kids and they know you care\n\nFor your classroom:\n- Morning routine: [Describe]\n- Transitions: [How will you signal?]\n- Brain breaks: [What & when?]\n- Choice opportunities: [When can students choose?]\n- Connection times: [When do you check in with each child?]\n\nRemember: Prevention is 10x easier than fixing problems.',
      emoji: '🛡️',
      color: 'from-green-600 to-green-700',
      tags: ['prevention', 'proactive', 'structure']
    },

    // STUDENT ENGAGEMENT & DIFFERENTIATION (8 prompts)
    {
      id: 25,
      title: 'Create Discussion Questions (All Learners Welcome)',
      category: 'Student Engagement',
      prompt: 'Create 10 discussion questions about [TEXT/TOPIC] for [GRADE]. Mix question types:\n\n- RECALL (easy start): "Who was...? What happened when...?"\n- INFERENCE: "Why do you think...? What might happen next?"\n- ANALYSIS: "How is [thing A] different from [thing B]? Why did...?"\n- PERSONAL: "Has this ever happened to you? How did it feel?"\n- CREATIVE: "What if...? How would you...?"\n\nMake them accessible:\n- First questions = easy (everyone can answer)\n- Use sentence frames: "I think _____ because _____"\n- Allow partner talk before whole-class (less intimidating)\n- Accept drawings, gestures, or simple answers\n- Give wait time: 5-10 seconds before expecting answers\n- Celebrate risk-taking: "I love how you took a chance with that answer!"\n\nContext: Students learning English? Include visuals. Students experiencing stress? Start with fun, low-stakes questions.',
      emoji: '💬',
      color: 'from-emerald-500 to-emerald-600',
      tags: ['discussion', 'higher-order-thinking', 'inclusive']
    },
    {
      id: 26,
      title: 'Design Anchor Activities (No Prep, No Judgment)',
      category: 'Student Engagement',
      prompt: 'Create 5 anchor activities (things students do independently while you work with small groups):\n\nFor [GRADE/SUBJECT], students can:\n1. [Skill-building]: [Concrete activity—reading, math practice, writing]\n2. [Exploration]: [Open-ended—drawing, building, investigating]\n3. [Choice/Interest]: [Something they love—art, games, books]\n4. [Review]: [Practice from past lessons]\n5. [Creation]: [Make something—poster, writing, model]\n\nMake sure each:\n- Has clear, visual instructions\n- Requires NO adult help\n- Takes 15-30 min (not 5)\n- Feels worthwhile, not busywork\n- Works for mixed abilities\n- No judgment if someone isn\'t "done"\n\nRotate them so they stay fresh. Post instructions with pictures. Let kids help organize materials.',
      emoji: '⚓',
      color: 'from-sky-500 to-sky-600',
      tags: ['independent-work', 'stations', 'centers']
    },
    {
      id: 27,
      title: 'Plan Tiered Instruction for Mixed Abilities',
      category: 'Student Engagement',
      prompt: 'I\'m teaching [LESSON/SKILL]. My students range from [DESCRIBE RANGE: e.g., "non-readers to fluent readers"].\n\nHelp me create 3 entry points to the same skill:\n\nTIER 1 (Concrete, heavy support): \n- Manipulatives or visuals\n- Shorter task\n- More adult/peer support\n- Success = trying and engaging\n\nTIER 2 (Grade-level):\n- Standard complexity\n- Guided practice included\n- Can work with some independence\n\nTIER 3 (Advanced/Extension):\n- More complex version\n- Open-ended\n- Problem-solving, creativity\n\nFor each tier, include:\n- What the task is\n- What materials/supports you\'ll provide\n- How students show learning',
      emoji: '🎨',
      color: 'from-rose-500 to-rose-600',
      tags: ['differentiation', 'tiered', 'flexible-groups']
    },
    {
      id: 28,
      title: 'Design Low-Cost Engagement Activities & Games',
      category: 'Student Engagement',
      prompt: 'Design 3 classroom games or activities for [GRADE/SUBJECT] to practice [SKILL]:\n\nEach should:\n- Use NO materials or only paper/pencils/items you have\n- Take 15-20 minutes\n- Include everyone (even struggling learners can contribute)\n- Be FUN (not hiding learning)\n- Have simple, clear rules kids can explain to each other\n\nGame ideas:\n1. [Movement-based game about [skill]]\n2. [Partner or team game]\n3. [Whole-group game]\n\nFor each, include:\n- How you explain the rules\n- What success looks like (celebrate effort & strategy, not just winning)\n- Variation for different ability levels\n\nMy class loves: [INTERESTS]',
      emoji: '🎮',
      color: 'from-fuchsia-500 to-fuchsia-600',
      tags: ['games', 'engagement', 'no-cost']
    },
    {
      id: 29,
      title: 'Build Student Choice & Agency',
      category: 'Student Engagement',
      prompt: 'Design places where students [GRADE] have meaningful choices:\n\nCHOICE TYPES:\n1. HOW to show learning: "You can write it, draw it, or show me with objects"\n2. WHAT to read/explore: "Pick 1 book from this list" OR "Pick any book you want"\n3. WHEN to do something: "This needs to be done by Friday, but you choose when"\n4. WITH WHOM: "Work alone, with a partner, or in a group of 3"\n5. HOW LONG: "Spend 15-20 minutes on this activity"\n6. THE ORDER: "Do these 3 tasks in any order"\n\nFor each choice:\n- Make it clear\n- Limit to 2-3 options (too many = paralyzes kids)\n- All options are valuable (no "wrong choice")\n- Kids can live with consequences of their choice\n\nRemember: Choice = agency = engagement = learning.',
      emoji: '🗳️',
      color: 'from-indigo-400 to-indigo-500',
      tags: ['agency', 'choice', 'voice']
    },
    {
      id: 30,
      title: 'Support Gifted & Advanced Learners',
      category: 'Student Engagement',
      prompt: 'I have [NUMBER] advanced learners in [GRADE/SUBJECT]. Help me challenge them without:\n- Giving them MORE of the same work (not fair)\n- Isolating them from the class\n- Making them feel weird\n\nInstead, offer extensions that DEEPEN understanding:\n1. RESEARCH: "You\'ve learned X. Now research Y (related to their interests)"\n2. TEACH: "Can you explain this to someone else/create a video/write a guide?"\n3. APPLY: "How would you use this in a real situation?"\n4. CONNECT: "How is this like [other concept]?"\n5. CREATE: "Can you invent something new using this skill?"\n\nAdvanced learner interests: [What do THEY care about?]\n\nRemember: Gifted kids still need to belong. Don\'t separate them. Enrich within the classroom.',
      emoji: '🚀',
      color: 'from-yellow-500 to-yellow-600',
      tags: ['gifted', 'enrichment', 'advanced']
    },
    {
      id: 31,
      title: 'Create Student Reflection & Self-Assessment',
      category: 'Student Engagement',
      prompt: 'Help students [GRADE] reflect on their own learning for [SKILL/UNIT]:\n\nREFLECTION PROMPTS:\n- "What did you learn?" (What\'s new?)\n- "What was easy?" (What did you do well?)\n- "What was hard?" (What do you need help with?)\n- "What helped you learn?" (Strategies that work for YOU)\n- "How will you use this?" (Real-world connection)\n- "What do you want to learn next?" (Agency)\n\nFORMATS (choose one or mix):\n- Draw it\n- Write it (sentences or just words)\n- Say it (you record or scribe)\n- Act it out\n- Rate yourself (thumbs, numbers, emojis)\n\nWhy: Reflection helps learning STICK. It also shows kids that YOU value their thinking, not just right answers.\n\nFrequency: Weekly or after big lessons.',
      emoji: '🪞',
      color: 'from-cyan-400 to-cyan-500',
      tags: ['reflection', 'metacognition', 'self-assessment']
    },
    {
      id: 32,
      title: 'Build Relationships & Classroom Community',
      category: 'Student Engagement',
      prompt: 'Design 3-4 daily or weekly rituals for [GRADE] that build belonging:\n\nThey should:\n- Take 5-10 minutes max\n- Happen the SAME time every day or week (predictability matters)\n- Include EVERY student (no one left out)\n- Celebrate who kids are (names, interests, identities)\n- Be joyful, not forced\n\nIdea starters:\n1. Morning greeting ritual: Everyone gets greeted by name, by you\n2. Story circle: Kids share something (could be drawing, could be 1 word)\n3. Community celebration: Shout-outs for effort, kindness, trying\n4. Closing ritual: Reflection or song or wave\n\nFor each:\n- What happens\n- When/how often\n- How kids participate\n- Why it builds belonging\n\nRemember: Kids experiencing trauma especially need to know they belong.',
      emoji: '🎉',
      color: 'from-red-400 to-red-500',
      tags: ['community', 'belonging', 'rituals']
    },

    // COMMUNICATION & FAMILY ENGAGEMENT (4 prompts)
    {
      id: 33,
      title: 'Build Family Connections (Joyful, Not Judgment)',
      category: 'Communication',
      prompt: 'Draft a [WEEKLY/MONTHLY] family update for [GRADE] that:\n- CELEBRATES what kids are learning (make families proud)\n- Shows what kids are DOING, not just facts they learned\n- Includes "You can help at home" tips (doable, no cost, honors all families)\n- Asks ONE question that families can answer together\n- Uses simple language (not education jargon)\n- Acknowledges that families are busy/stressed\n\nStructure:\nHi families,\n\nThis week/month we\'re learning about [TOPIC] because it matters for [why].\n\nYou\'ll notice your child can now [concrete skill]. You can practice this at home by [easy activity].\n\nWe\'re proud of [specific celebration—try, kindness, curiosity].\n\n[One fun question to answer & send back]\n\nTip: Send GOOD news, not just problems. Families need to feel their child\'s teacher likes them.',
      emoji: '💌',
      color: 'from-amber-500 to-amber-600',
      tags: ['family-communication', 'positive', 'home-connection']
    },
    {
      id: 34,
      title: 'Prepare for Conversations About Struggle',
      category: 'Communication',
      prompt: 'You need to talk to a family about [TOPIC: behavior, learning, attendance, etc.].\n\nPrepare:\n1. SPECIFIC DATA (not "he\'s struggling"): "Adán has missed 12 days. That makes it hard for him to catch up. I want to help."\n2. What you\'ve tried: "Here\'s what I\'ve done to support him..."\n3. Their perspective: "What\'s going on at home? How can we work together?"\n4. Next steps: "Here\'s what I can do. What can you do? Let\'s try..."\n5. Warmth: "Adán is smart and capable. I believe in him. We\'re a team."\n\nDuring the conversation:\n- Listen more than you talk\n- Assume good intent (families care, even if it doesn\'t always look like it)\n- No blame or judgment\n- Offer practical support: "What resources might help?"\n- End with hope',
      emoji: '🎙️',
      color: 'from-orange-400 to-orange-500',
      tags: ['family-communication', 'difficult-conversations', 'partnership']
    },
    {
      id: 35,
      title: 'Navigate Language Barriers with Families',
      category: 'Communication',
      prompt: 'A family speaks [LANGUAGE] and I speak [YOUR LANGUAGE(S)].\n\nHow can I communicate effectively?\n\nTOOLS:\n- Google Translate (good for texts, imperfect but helpful)\n- Bilingual para or student (with appropriate topic)\n- Translation app (Translator or iTranslate)\n- Interpreter (school or community resource)\n\nFOR IMPORTANT MESSAGES:\n- Use an interpreter (human or video)\n- Send in their home language\n- Speak clearly, not loud\n- Use visuals (show samples of work)\n- Ask "Do you understand?" (not just "Do you have questions?")\n\nSET UP FOR SUCCESS:\n- Learn key words in their language ("hello," "mom," "math")\n- Respect their culture\n- Assume competence (language barrier ≠ ability barrier)\n- Celebrate their bilingualism\n\nFamily: [LANGUAGE]. Resources available: [What do you have?]',
      emoji: '🌍',
      color: 'from-purple-500 to-purple-600',
      tags: ['multilingual', 'translation', 'inclusion']
    },
    {
      id: 36,
      title: 'Create a Welcoming & Inclusive Classroom for All Families',
      category: 'Communication',
      prompt: 'Make your classroom a place where ALL families feel welcome, including:\n- Single parents, LGBTQ+ families, multiracial families, multigenerational families\n- Families experiencing housing instability, food insecurity, immigrant status\n- Families whose first language isn\'t English\n- Families who work shifts, multiple jobs, limited time\n\nDO:\n- Use inclusive language: "What does your family look like?" vs. "mom and dad"\n- Read books with diverse families & stories\n- Display artwork, names, interests of all kids\n- Accept late arrivals, missed assignments when families are struggling\n- Communicate in their language when possible\n- Celebrate their culture (music, food, stories, holidays)\n- Welcome all families (note home, call, invite to events)\n- Don\'t judge (you don\'t know their full story)\n\nDON\'T:\n- Assume all kids have the same family structure\n- Ask intrusive questions about home situations\n- Make kids feel shame about their families\n\nWhat can YOU do to make families feel they belong here?',
      emoji: '🏳️‍🌈',
      color: 'from-pink-600 to-pink-700',
      tags: ['inclusion', 'diversity', 'belonging']
    },

    // SPECIAL TOPICS & SUPPORT (4 prompts)
    {
      id: 37,
      title: 'Support Multilingual & ELL Students',
      category: 'Special Support',
      prompt: 'I\'m teaching [LESSON/SKILL] and have [NUMBER] students learning English (or learning [LANGUAGE]).\n\nCreate a support plan with:\n\n1. VOCABULARY: Key words they\'ll need. Create a word wall with pictures + words.\n2. SENTENCE FRAMES: Sentence starters they can use: "I think _____ because _____"\n3. PRE-TEACHING: Before the lesson, introduce key words + visuals (5 min)\n4. DURING: Pair them with English-proficient peers. Use gestures, show visuals. Slow down & pause.\n5. RESPONSE OPTIONS: Let them answer with gestures, drawings, or one-word answers first\n6. HOME CONNECTION: Send a note home in their language (if possible) with key words\n\nRemember:\n- Bilingualism is an asset, not a problem\n- Their home language helps them learn English\n- Silent period is NORMAL—don\'t force talking\n- Give 5-10 second wait time before expecting answers\n- Assess language separately from content',
      emoji: '🌟',
      color: 'from-yellow-400 to-yellow-500',
      tags: ['ell', 'multilingual', 'language-support']
    },
    {
      id: 38,
      title: 'Create Inclusive Strategies for Students with Autism/ADHD',
      category: 'Special Support',
      prompt: 'I have students [GRADE] with autism spectrum/ADHD. Help me support them:\n\nAUTISM SUPPORT:\n- Visual schedules (pictures of what\'s happening)\n- Clear, literal expectations ("Sit in your chair" vs. "Be good")\n- Quiet space for breaks (not punishment)\n- Forewarning of changes ("In 5 minutes we\'re switching to math")\n- Respect sensory needs (lighting, noise, textures)\n- Celebrate interests & use them in learning\n\nADHD SUPPORT:\n- Movement breaks throughout the day\n- Clear, shorter instructions (write + say)\n- Timers for transitions\n- Fidget tools or movement during seat work\n- Chunked tasks (not one long thing)\n- Frequent positive feedback (attention works)\n- Flexible seating options\n\nFOR BOTH:\n- Respect their communication style (direct, literal, or non-verbal)\n- Build routines—they reduce anxiety\n- Use strengths (special interests, visual thinking, honesty, focus)\n\nStudent: [NAME]. What are their interests/strengths?',
      emoji: '🧠',
      color: 'from-blue-600 to-blue-700',
      tags: ['autism', 'adhd', 'neurodiversity']
    },
    {
      id: 39,
      title: 'Support Students Experiencing Food Insecurity & Housing Instability',
      category: 'Special Support',
      prompt: 'Some of my students [GRADE] may be experiencing food insecurity or housing instability.\n\nHOW TO KNOW:\n- Missing school frequently\n- Arriving late\n- Hungry or tired\n- Seem anxious or withdrawn\n- Don\'t have materials/pencils\n- Bring all belongings to school (not leaving things at home)\n\nHOW TO SUPPORT:\n1. FOOD: Know where breakfast/lunch/snacks are available. Don\'t shame. ("Here, snack time!")\n2. BASIC NEEDS: Extra socks, hygiene supplies, coat, blanket (keep at school)\n3. LEARNING MATERIALS: Pencils, notebook, paper (keep duplicates)\n4. ROUTINE: Your classroom is predictable & safe (big deal)\n5. RELATIONSHIPS: Show them they matter. "I\'m glad you\'re here."\n6. RESOURCES: Know food bank, housing, counseling services in your area\n7. FLEXIBILITY: Missed work? Late again? Grace first, understand second\n\nYour role: NOT to fix their situation, but to be the stable, caring adult who shows up.\n\nResources available in your area: [List]',
      emoji: '❤️',
      color: 'from-red-600 to-red-700',
      tags: ['poverty', 'food-insecurity', 'housing-instability']
    },
    {
      id: 40,
      title: 'Teach & Support Students Experiencing Grief or Loss',
      category: 'Special Support',
      prompt: 'A student [NAME] is dealing with [LOSS: death, family separation, moving, etc.].\n\nSHOW CARE:\n1. ACKNOWLEDGE: "I know you\'re going through something hard. I care about you."\n2. LISTEN: Let them talk, don\'t push. Grief isn\'t linear—some days are hard, some are OK\n3. SMALL CONNECTIONS: Greeting, check-in, one-on-one time\n4. SAFETY: Consistent routine, predictable you\n5. FLEXIBILITY: They may not focus well. That\'s OK. You\'re not trying to "fix" grief\n\nCLASSROOM:\n- Don\'t avoid the topic (they can see books/stories about loss)\n- Allow them to be sad (not punishing emotional expression)\n- Offer choices: "Do you want to sit with us or have quiet time?"\n- No forced participation in celebrations if they\'re grieving\n\nWHEN THEY STRUGGLE:\n- Connect with school counselor/social worker\n- Call family: "I\'ve noticed... how can I support?"\n- Self-care matters—you can\'t pour from an empty cup\n\nRemember: Your consistent care helps them heal.',
      emoji: '🕊️',
      color: 'from-purple-700 to-purple-800',
      tags: ['grief', 'loss', 'emotional-support']
    }
  ];

  const categories = ['all', ...new Set(expandedPromptLibrary.map(p => p.category))];

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

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackLoading(true);

    // Formspree endpoint for email submission
    const formspreeEndpoint = 'https://formspree.io/f/xyzwvut';  // You'll need to set up your own Formspree

    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: feedbackData.name || 'Anonymous',
          email: feedbackData.email || 'not-provided@example.com',
          message: feedbackData.message,
          timestamp: new Date().toLocaleString()
        })
      });

      if (response.ok) {
        setFeedbackSubmitted(true);
        setFeedbackData({ name: '', email: '', message: '' });
        setTimeout(() => setShowFeedback(false), 3000);
      }
    } catch (error) {
      console.log('Note: To enable email feedback, set up Formspree at formspree.io');
    }
    setFeedbackLoading(false);
  };

  const filteredPrompts = expandedPromptLibrary.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags.some(tag => tag.includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const savedPromptsList = expandedPromptLibrary.filter(p => savedPrompts.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setCurrentView('home'); setSearchTerm(''); setSelectedCategory('all'); }}>
            <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-2 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">TeacherAI Prompts</h1>
              <p className="text-xs text-slate-400">40+ prompt ideas for K-5 teachers</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn && (
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
            )}
            {!isLoggedIn && (
              <button
                onClick={() => setCurrentView('login')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all font-semibold"
              >
                Create Profile
              </button>
            )}
            <button
              onClick={() => setShowFeedback(!showFeedback)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-all"
              title="Send feedback"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Feedback Panel */}
      {showFeedback && (
        <div className="fixed right-0 top-24 z-40 bg-slate-900 border-l-2 border-blue-500 rounded-l-lg shadow-lg w-96 max-w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Send Feedback</h3>
              <button onClick={() => setShowFeedback(false)} className="p-1 hover:bg-slate-800 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            {feedbackSubmitted ? (
              <div className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                <p className="text-green-400 text-center">Thank you! Your feedback has been sent. 🎉</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={feedbackData.name}
                  onChange={(e) => setFeedbackData({ ...feedbackData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <input
                  type="email"
                  placeholder="Your email (optional)"
                  value={feedbackData.email}
                  onChange={(e) => setFeedbackData({ ...feedbackData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <textarea
                  placeholder="What's on your mind? Feature ideas, bug reports, love notes... 💭"
                  value={feedbackData.message}
                  onChange={(e) => setFeedbackData({ ...feedbackData, message: e.target.value })}
                  rows="4"
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
                <button
                  type="submit"
                  disabled={feedbackLoading || !feedbackData.message}
                  className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {feedbackLoading ? 'Sending...' : 'Send Feedback'}
                </button>
                <p className="text-xs text-slate-400">📧 Feedback sent to marisa.dominguez@oddball.io</p>
              </form>
            )}
          </div>
        </div>
      )}

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
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-3">Your AI Idea Toolkit 🚀</h2>
            <p className="text-xl text-slate-300 max-w-2xl">
              Discover 40+ trauma-informed, evidence-based prompts designed to save time and spark creativity. Every prompt is tested, encouraging, and practical for K-5 teachers—especially those serving under-resourced schools.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search prompts, topics, or tags..."
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
                  {cat !== 'all' && ` (${expandedPromptLibrary.filter(p => p.category === cat).length})`}
                </button>
              ))}
            </div>
          </div>

          <p className="text-slate-400 mb-6">Showing {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''}</p>

          {/* Prompt Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map(prompt => (
              <div
                key={prompt.id}
                className="group bg-slate-900 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 flex flex-col print:break-inside-avoid"
              >
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

                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wide">
                    {prompt.category}
                  </p>
                  <h3 className="text-lg font-bold mb-3 leading-snug">{prompt.title}</h3>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {prompt.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-4 line-clamp-3">
                    {prompt.prompt.replace(/\[.*?\]/g, '[...]')}
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
              <p className="text-slate-400 text-lg">No prompts found. Try different keywords or categories!</p>
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
                ? "You haven't saved any prompts yet. Browse the library and click the heart!"
                : `You have ${savedPromptsList.length} prompt${savedPromptsList.length !== 1 ? 's' : ''} saved.`}
            </p>
          </div>

          {savedPromptsList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPromptsList.map(prompt => (
                <div key={prompt.id} className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex flex-col">
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
          <p className="text-sm">40+ trauma-informed, evidence-based prompts for K-5 classrooms</p>
        </div>
      </footer>
    </div>
  );
};

export default TeacherAIPromptLibrary;