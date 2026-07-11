const programs = [
  {
    id: "ancient-atlas",
    title: "Ancient Atlas",
    blurb: "Pyramids, temples, trade routes, and early cities.",
    days: [
      ["Home row anchors", "Ancient Sumer grew beside the Tigris and Euphrates rivers.", "asdf jkl; asdf jkl; dad sad flask ask", "Cities rose when rivers helped people farm, trade, and share ideas."],
      ["E and I reach", "Egyptian scribes wrote records near the Nile River.", "jedi idea field idle seed tide", "The Nile flooded each year and left rich soil for crops."],
      ["R and U reach", "Greek sailors crossed the Aegean Sea to visit many islands.", "rural ruler guard argus regular", "The Aegean Sea helped connect Greek communities by boat."],
      ["T and Y reach", "The Silk Road carried silk, spices, stories, and inventions.", "try yet tally rusty trusty style", "The Silk Road was a web of routes, not one single road."],
      ["G and H center keys", "Maya cities rose in forests across Central America.", "high graph laugh giant hinge", "Maya astronomers carefully watched the Moon, Venus, and the Sun."],
      ["C and comma", "Roman roads helped messages travel across a huge empire.", "civic circle comma comet record", "Some Roman roads were so well built that parts remain today."],
      ["Review quest", "Carthage and Rome competed for power around the Mediterranean.", "ancient maps guide careful travelers", "The Mediterranean Sea connected Europe, Africa, and Asia."],
      ["Top row confidence", "China's early compass helped travelers find direction.", "quiet queen route require unique", "A compass points toward magnetic north, which helps with navigation."],
      ["Bottom row confidence", "The Indus Valley had planned streets and clever drainage.", "valley bronze civic zones", "Archaeologists study objects and ruins to learn about daily life."],
      ["Shift for capitals", "Alexandria, Egypt, became famous for its great library.", "Alexandria Egypt Nile Library", "The ancient Library of Alexandria welcomed scholars from many places."],
      ["Punctuation path", "Maps can show mountains, rivers, deserts, cities, and borders.", "Where is Rome? It is in Italy.", "A question mark helps turn a sentence into a clear question."],
      ["Number row", "The first Olympics were held in Greece in 776 BCE.", "776 BCE 3 rivers 2 seas 1 map", "Historians use dates to place events in order."],
      ["Accuracy day", "Phoenician traders shared an alphabet around the sea.", "patient typists place each finger carefully", "Alphabet systems made writing easier for more people to learn."],
      ["Final expedition", "A good historian checks clues, maps, dates, and places.", "I can type with calm hands and curious eyes.", "Careful typing is like careful research: small details matter."]
    ]
  },
  {
    id: "explorer-routes",
    title: "Explorer Routes",
    blurb: "Oceans, navigation tools, mountain passes, and brave questions.",
    days: [
      ["Home row anchors", "Zheng He sailed large treasure ships across the Indian Ocean.", "asdf jkl; sail fjord flask", "The Indian Ocean links Africa, Asia, Australia, and many islands."],
      ["E and I reach", "Polynesian navigators read stars, waves, birds, and winds.", "isle tide reef steer ideal", "Wayfinding can use nature as a map."],
      ["R and U reach", "Ibn Battuta traveled through Africa, Asia, and Europe.", "route journal ruler rugged", "Travel writers help historians compare places and cultures."],
      ["T and Y reach", "Cartographers draw maps that help people understand Earth.", "type trusty tiny atlas", "Cartography is the science and art of making maps."],
      ["G and H center keys", "Mountain passes can connect towns across tall ranges.", "high ridge rough hiking", "A mountain pass is a lower route through mountains."],
      ["C and comma", "Compasses, clocks, and charts made sea travel safer.", "clock coast chart, course", "Longitude became easier to measure with very accurate clocks."],
      ["Review quest", "Every route has risks, supplies, weather, and decisions.", "steady fingers discover distant places", "Planning matters for explorers and typists."],
      ["Top row confidence", "The equator circles Earth halfway between the poles.", "equator quarter unique quiet", "Places near the equator often have warm climates."],
      ["Bottom row confidence", "Rivers can become highways through forests and plains.", "amazon valley voyage zone", "The Amazon River carries more water than any other river."],
      ["Shift for capitals", "The Andes stretch along the western edge of South America.", "Andes Peru Chile Ecuador", "The Andes are the longest continental mountain range."],
      ["Punctuation path", "Which ocean is largest? The Pacific Ocean is largest.", "Which ocean is largest? Pacific.", "Questions make learning active."],
      ["Number row", "Earth has 7 continents and 5 named oceans.", "7 continents 5 oceans 24 hours", "Different countries may teach continent models differently."],
      ["Accuracy day", "Latitude lines run east and west around the globe.", "latitude longitude location", "Latitude helps describe how far north or south a place is."],
      ["Final expedition", "A thoughtful explorer respects the people and places they visit.", "I type smoothly and learn one route at a time.", "Curiosity works best with respect."]
    ]
  },
  {
    id: "world-wonders",
    title: "World Wonders",
    blurb: "Landmarks, climates, capitals, and surprising places.",
    days: [
      ["Home row anchors", "The Great Barrier Reef is the world's largest coral reef system.", "asdf jkl; reef falls fjord", "Coral reefs are living habitats with many kinds of sea life."],
      ["E and I reach", "Mount Everest rises in the Himalayas between Nepal and China.", "everest height ice line", "Everest is Earth's highest mountain above sea level."],
      ["R and U reach", "The Sahara is a vast desert across northern Africa.", "dry dunes rugged route", "Deserts can be hot, cold, rocky, sandy, or icy."],
      ["T and Y reach", "Tokyo is one of the world's largest metropolitan areas.", "tokyo city tasty train", "Metropolitan areas include a city and nearby connected communities."],
      ["G and H center keys", "The Grand Canyon shows layers of rock and time.", "grand huge high geology", "Rock layers can reveal ancient environments."],
      ["C and comma", "Canada has forests, lakes, plains, tundra, and mountains.", "canada, coast, climate", "A country's geography can include many different landscapes."],
      ["Review quest", "A map scale helps compare map distance with real distance.", "smart map readers check scale", "Scale turns a small drawing into useful distance information."],
      ["Top row confidence", "Rainforests grow near warm places with lots of rain.", "quiet jungle requires water", "Rainforests hold a huge variety of plants and animals."],
      ["Bottom row confidence", "Venice is famous for canals instead of many roads.", "venice boats plaza zone", "Canals are waterways people can travel through."],
      ["Shift for capitals", "Nairobi, Kenya, sits near grasslands and national parks.", "Nairobi Kenya Africa", "A capital city is where a country's government is usually based."],
      ["Punctuation path", "What is a peninsula? It is land with water on three sides.", "What is a peninsula? Land with water.", "Geography words help describe landforms clearly."],
      ["Number row", "Mauna Kea rises over 33,000 feet from the ocean floor.", "33000 feet 1 volcano 50 states", "Some mountains continue far below sea level."],
      ["Accuracy day", "Glaciers move slowly and shape valleys over time.", "careful typing builds reliable skill", "Steady practice changes what feels easy."],
      ["Final expedition", "The world is full of places worth studying closely.", "I can type facts, questions, and discoveries.", "Typing helps turn curiosity into notes, stories, and ideas."]
    ]
  }
].map((program) => ({
  ...program,
  days: program.days.map(([focus, title, warmup, fact], index) => ({
    day: index + 1,
    focus,
    title,
    warmup,
    story: `${title} ${fact}`,
    fact
  }))
}));

const storageKey = "summerTypingAtlasProgress";
const fingerMap = {
  q: "left-pinky", a: "left-pinky", z: "left-pinky",
  w: "left-ring", s: "left-ring", x: "left-ring",
  e: "left-middle", d: "left-middle", c: "left-middle",
  r: "left-index", f: "left-index", v: "left-index", t: "left-index", g: "left-index", b: "left-index",
  y: "right-index", h: "right-index", n: "right-index", u: "right-index", j: "right-index", m: "right-index",
  i: "right-middle", k: "right-middle",
  o: "right-ring", l: "right-ring",
  p: "right-pinky", ";": "right-pinky", ".": "right-pinky", ",": "right-pinky", "?": "right-pinky"
};
const keyRows = ["qwertyuiop", "asdfghjkl;", "zxcvbnm,."];

const state = {
  programId: programs[0].id,
  day: 1,
  mode: "warmup",
  startedAt: null,
  timerId: null,
  errors: 0,
  progress: loadProgress()
};

const el = {
  programList: document.querySelector("#programList"),
  passportTitle: document.querySelector("#passportTitle"),
  totalStars: document.querySelector("#totalStars"),
  bestStreak: document.querySelector("#bestStreak"),
  programKicker: document.querySelector("#programKicker"),
  missionTitle: document.querySelector("#missionTitle"),
  missionFact: document.querySelector("#missionFact"),
  dayBadge: document.querySelector("#dayBadge"),
  missionStars: document.querySelector("#missionStars"),
  dayGrid: document.querySelector("#dayGrid"),
  focusText: document.querySelector("#focusText"),
  warmupBtn: document.querySelector("#warmupBtn"),
  storyBtn: document.querySelector("#storyBtn"),
  promptText: document.querySelector("#promptText"),
  typingInput: document.querySelector("#typingInput"),
  wpmMetric: document.querySelector("#wpmMetric"),
  accuracyMetric: document.querySelector("#accuracyMetric"),
  timeMetric: document.querySelector("#timeMetric"),
  progressMetric: document.querySelector("#progressMetric"),
  restartBtn: document.querySelector("#restartBtn"),
  completeBtn: document.querySelector("#completeBtn"),
  resetProgressBtn: document.querySelector("#resetProgressBtn"),
  coachTips: document.querySelector("#coachTips"),
  keyboard: document.querySelector("#keyboard")
};

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

function saveProgress() {
  localStorage.setItem(storageKey, JSON.stringify(state.progress));
}

function activeProgram() {
  return programs.find((program) => program.id === state.programId);
}

function activeMission() {
  return activeProgram().days[state.day - 1];
}

function missionKey(programId = state.programId, day = state.day) {
  return `${programId}:${day}`;
}

function activeText() {
  const mission = activeMission();
  return state.mode === "warmup" ? mission.warmup : mission.story;
}

function renderPrograms() {
  el.programList.innerHTML = "";
  programs.forEach((program) => {
    const done = program.days.filter((day) => state.progress[missionKey(program.id, day.day)]).length;
    const button = document.createElement("button");
    button.className = `program-button${program.id === state.programId ? " is-active" : ""}`;
    button.type = "button";
    button.innerHTML = `<strong>${program.title}</strong><span>${program.blurb}<br>${done}/14 days stamped</span>`;
    button.addEventListener("click", () => {
      state.programId = program.id;
      state.day = nextOpenDay(program.id);
      state.mode = "warmup";
      resetTyping();
      render();
    });
    el.programList.append(button);
  });
}

function nextOpenDay(programId) {
  const program = programs.find((item) => item.id === programId);
  return program.days.find((day) => !state.progress[missionKey(programId, day.day)])?.day || 14;
}

function renderDays() {
  el.dayGrid.innerHTML = "";
  activeProgram().days.forEach((mission) => {
    const button = document.createElement("button");
    button.className = [
      "day-button",
      mission.day === state.day ? "is-active" : "",
      state.progress[missionKey(state.programId, mission.day)] ? "is-done" : ""
    ].filter(Boolean).join(" ");
    button.type = "button";
    button.textContent = state.progress[missionKey(state.programId, mission.day)] ? "★" : mission.day;
    button.title = `Day ${mission.day}: ${mission.title}`;
    button.addEventListener("click", () => {
      state.day = mission.day;
      state.mode = "warmup";
      resetTyping();
      render();
    });
    el.dayGrid.append(button);
  });
}

function renderPrompt() {
  const target = activeText();
  const typed = el.typingInput.value;
  const nextIndex = typed.length;
  el.promptText.innerHTML = [...target].map((char, index) => {
    let className = "";
    if (index < typed.length) className = typed[index] === char ? "correct" : "wrong";
    if (index === nextIndex) className = `${className} current`.trim();
    return `<span class="${className}">${escapeHtml(char)}</span>`;
  }).join("");
  highlightNextKey(target[nextIndex]);
}

function escapeHtml(char) {
  return char.replace(/[&<>"']/g, (match) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[match]);
}

function renderKeyboard() {
  el.keyboard.innerHTML = "";
  keyRows.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.className = "key-row";
    [...row].forEach((letter) => {
      const key = document.createElement("span");
      key.className = `key ${fingerMap[letter] || ""}`;
      key.dataset.key = letter;
      key.textContent = letter;
      rowEl.append(key);
    });
    el.keyboard.append(rowEl);
  });
}

function highlightNextKey(char = "") {
  document.querySelectorAll(".key").forEach((key) => key.classList.remove("is-next"));
  const normalized = char.toLowerCase();
  const key = normalized ? document.querySelector(`.key[data-key="${CSS.escape(normalized)}"]`) : null;
  if (key) key.classList.add("is-next");
}

function renderStats() {
  const entries = Object.values(state.progress);
  const stars = entries.reduce((sum, item) => sum + (item.stars || 0), 0);
  const completeDays = entries.length;
  el.totalStars.textContent = stars;
  el.bestStreak.textContent = completeDays;
  el.passportTitle.textContent = completeDays ? `${completeDays} mission${completeDays === 1 ? "" : "s"} stamped` : "Ready for day 1";
}

function renderMission() {
  const program = activeProgram();
  const mission = activeMission();
  const saved = state.progress[missionKey()];
  el.programKicker.textContent = program.title;
  el.missionTitle.textContent = mission.title;
  el.missionFact.textContent = mission.fact;
  el.dayBadge.textContent = `Day ${mission.day}`;
  el.missionStars.textContent = `${saved?.stars || 0}/3`;
  el.focusText.textContent = mission.focus;
  el.warmupBtn.classList.toggle("is-active", state.mode === "warmup");
  el.storyBtn.classList.toggle("is-active", state.mode === "story");
  renderPrompt();
  renderCoachTips();
}

function renderCoachTips() {
  const target = activeText();
  const typed = el.typingInput.value;
  const nextChar = target[typed.length] || "";
  const finger = fingerMap[nextChar.toLowerCase()]?.replace("-", " ") || "thumb for space";
  const tips = [
    "Keep index fingers resting on F and J before each try.",
    `Next key: ${nextChar === " " ? "space" : nextChar || "done"} with ${finger}.`,
    "Slow down for capitals and punctuation; accuracy earns more stars than rushing."
  ];
  el.coachTips.innerHTML = tips.map((tip) => `<li>${tip}</li>`).join("");
}

function renderMetrics() {
  const target = activeText();
  const typed = el.typingInput.value;
  const elapsed = state.startedAt ? Math.floor((Date.now() - state.startedAt) / 1000) : 0;
  const correct = [...typed].filter((char, index) => char === target[index]).length;
  const accuracy = typed.length ? Math.round((correct / typed.length) * 100) : 100;
  const minutes = Math.max(elapsed / 60, 1 / 60);
  const wpm = typed.length ? Math.round((correct / 5) / minutes) : 0;
  const progress = Math.min(100, Math.round((typed.length / target.length) * 100));
  el.wpmMetric.textContent = wpm;
  el.accuracyMetric.textContent = `${accuracy}%`;
  el.timeMetric.textContent = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`;
  el.progressMetric.textContent = `${progress}%`;
  el.completeBtn.disabled = !(typed === target && accuracy >= 88);
}

function resetTyping() {
  clearInterval(state.timerId);
  state.startedAt = null;
  state.timerId = null;
  state.errors = 0;
  el.typingInput.value = "";
  renderPrompt();
  renderMetrics();
}

function startTimer() {
  if (state.startedAt) return;
  state.startedAt = Date.now();
  state.timerId = setInterval(renderMetrics, 1000);
}

function stampPassport() {
  const target = activeText();
  const typed = el.typingInput.value;
  const correct = [...typed].filter((char, index) => char === target[index]).length;
  const accuracy = Math.round((correct / target.length) * 100);
  const elapsed = Math.max(1, Math.floor((Date.now() - state.startedAt) / 1000));
  const wpm = Math.round((correct / 5) / (elapsed / 60));
  const stars = Math.max(1, Math.min(3, (accuracy >= 98 ? 2 : accuracy >= 93 ? 1 : 0) + (wpm >= 18 ? 1 : 0)));
  const key = missionKey();
  const previous = state.progress[key]?.stars || 0;
  state.progress[key] = {
    stars: Math.max(previous, stars),
    accuracy: Math.max(state.progress[key]?.accuracy || 0, accuracy),
    wpm: Math.max(state.progress[key]?.wpm || 0, wpm),
    completedAt: new Date().toISOString()
  };
  saveProgress();
  if (state.mode === "warmup") {
    state.mode = "story";
  } else if (state.day < 14) {
    state.day += 1;
    state.mode = "warmup";
  }
  resetTyping();
  render();
}

function render() {
  renderPrograms();
  renderDays();
  renderStats();
  renderMission();
  renderMetrics();
}

el.typingInput.addEventListener("input", () => {
  startTimer();
  const target = activeText();
  if (el.typingInput.value.length > target.length) {
    el.typingInput.value = el.typingInput.value.slice(0, target.length);
  }
  renderPrompt();
  renderMetrics();
  renderCoachTips();
});

el.warmupBtn.addEventListener("click", () => {
  state.mode = "warmup";
  resetTyping();
  render();
});

el.storyBtn.addEventListener("click", () => {
  state.mode = "story";
  resetTyping();
  render();
});

el.restartBtn.addEventListener("click", resetTyping);
el.completeBtn.addEventListener("click", stampPassport);
el.resetProgressBtn.addEventListener("click", () => {
  state.progress = {};
  state.day = 1;
  state.mode = "warmup";
  saveProgress();
  resetTyping();
  render();
});

renderKeyboard();
render();
