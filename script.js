'use strict';

const STORAGE_KEYS = {
  appState: 'pixel_app_state',
  users: 'pixel_demo_users',
  session: 'pixel_demo_session',
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const GOAL_COLORS = ['#a855f7', '#f59e0b', '#34d399', '#f87171', '#60a5fa', '#f472b6'];
const SHOP_CAT_EMOJI = {
  groceries: '🥦',
  household: '🏠',
  personal: '🧴',
  electronics: '📱',
  other: '📌',
};
const MOOD_EMOJIS = {
  Amazing: '🤩',
  Happy: '😊',
  Okay: '😐',
  Tired: '😴',
  Stressed: '😰',
  Sad: '😢',
};

const ACCENT_THEMES = {
  violet: { accent: '#8b5cf6', accent2: '#f59e0b', accent3: '#22c55e', accent4: '#ef4444' },
  coral: { accent: '#fb7185', accent2: '#f97316', accent3: '#14b8a6', accent4: '#dc2626' },
  sky: { accent: '#38bdf8', accent2: '#6366f1', accent3: '#10b981', accent4: '#f97316' },
  mint: { accent: '#34d399', accent2: '#14b8a6', accent3: '#84cc16', accent4: '#ef4444' },
};

const DEFAULT_PET = {
  name: 'Pixel',
  health: 85,
  energy: 70,
  mood: 90,
  smart: 60,
  bond: 68,
  discipline: 58,
  level: 7,
  exp: 0,
  lastVisit: todayKey(),
};

const DEFAULT_PROFILE = {
  name: '',
  email: '',
  bio: '',
  mainGoal: '',
};

const DEFAULT_SETTINGS = {
  dailyReminder: true,
  budgetAlerts: true,
  habitReminders: false,
  petReactions: true,
  soundEffects: false,
  taskReminders: false,
  theme: 'dark',
  accent: 'violet',
};

const DEFAULT_TODO_LISTS = ['Personal', 'Work', 'Shopping'];

const DEFAULT_FOCUS = {
  sessions: 0,
  minutes: 0,
  todaySessions: 0,
  todayMinutes: 0,
  lastUpdated: '',
};

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function createDefaultData() {
  return {
    transactions: [],
    todos: [],
    notes: [],
    events: [],
    habits: [],
    goals: [],
    moods: [],
    shopItems: [],
    todoLists: [...DEFAULT_TODO_LISTS],
    pet: { ...DEFAULT_PET },
    focus: { ...DEFAULT_FOCUS, lastUpdated: todayKey() },
    profile: { ...DEFAULT_PROFILE },
    settings: { ...DEFAULT_SETTINGS },
  };
}

const pixelResponses = {
  hello: 'Woof! Hi there! What can I help you with today?',
  hi: 'Hey hey! Great to see you! Need anything?',
  task: 'I will help you stay organized. Try adding a task in To-Do.',
  tired: 'You sound tired. A short break might help. I will be right here.',
  help: 'I can help with Budget, Calendar, To-Do, Ideas, Habits, Goals, Focus, Mood, Shopping, and your daily summary.',
  thanks: 'Anytime. That is what I am here for.',
  'how are you': 'I am pawsitively wonderful. Thanks for asking!',
  mood: 'Feeling something? Head to Mood Tracker and log how you feel.',
  focus: 'Time to focus. Open the Focus Timer for a Pomodoro session.',
  habit: 'Habits make champions. Set one up in the Habits page.',
  idea: 'Got a great idea? Head to Idea Board and capture it.',
  goal: 'Dream big. Set a goal in the Goals page.',
  default: [
    'I am still learning. Try help, budget, add task, or how are you.',
    'Not sure what you mean yet. Try asking for help.',
    'Try help to see what I can do for you.',
  ],
};

const PET_ACTION_CONFIG = {
  taskAdded: { stats: { mood: 2, bond: 2, discipline: 1 }, exp: 4, toast: 'Pixel is excited for your new task.', icon: '✅', animation: 'pet-happy' },
  taskDone: { stats: { mood: 6, smart: 3, bond: 4, discipline: 4 }, exp: 12, toast: 'Pixel is proud you finished that task!', icon: '🏆', animation: 'pet-happy' },
  taskDeleted: { stats: { mood: -2, discipline: -3, bond: -1 }, exp: 0, toast: 'Pixel looked a little disappointed about that deleted task.', icon: '🗑️', animation: 'pet-sad' },
  incomeAdded: { stats: { mood: 4, smart: 2, bond: 2 }, exp: 7, toast: 'Pixel loves healthy finances. Nice income log!', icon: '💰', animation: 'pet-smart' },
  expenseAdded: { stats: { smart: 1, discipline: 1 }, exp: 3, toast: 'Expense tracked. Pixel likes your honesty.', icon: '💸', animation: 'pet-happy' },
  overspent: { stats: { mood: -8, energy: -5, discipline: -6 }, exp: 0, toast: 'Pixel noticed spending is getting a bit high.', icon: '⚠️', animation: 'pet-sad' },
  eventAdded: { stats: { smart: 2, discipline: 2, bond: 1 }, exp: 5, toast: 'Pixel is happy your schedule is under control.', icon: '📅', animation: 'pet-smart' },
  noteAdded: { stats: { smart: 3, mood: 2, bond: 1 }, exp: 5, toast: 'Pixel loves when you capture ideas quickly.', icon: '💡', animation: 'pet-smart' },
  habitDone: { stats: { health: 3, mood: 4, discipline: 6, bond: 3 }, exp: 10, toast: 'Habit complete. Pixel feels stronger already!', icon: '🔥', animation: 'pet-happy' },
  goalProgress: { stats: { smart: 4, mood: 3, discipline: 4, bond: 2 }, exp: 9, toast: 'Pixel sees you moving closer to your goal.', icon: '🎯', animation: 'pet-smart' },
  focusComplete: { stats: { smart: 6, discipline: 5, energy: -6, bond: 2 }, exp: 14, toast: 'Deep focus complete. Pixel looks sharper than ever.', icon: '⏱️', animation: 'pet-smart' },
  moodLogged: { stats: { mood: 3, bond: 4, smart: 1 }, exp: 5, toast: 'Thanks for checking in. Pixel feels closer to you.', icon: '😊', animation: 'pet-happy' },
  shoppingDone: { stats: { discipline: 3, smart: 2, bond: 1 }, exp: 5, toast: 'Shopping progress logged. Pixel approves.', icon: '🛒', animation: 'pet-happy' },
  petFed: { stats: { health: 8, energy: 5, mood: 3, bond: 3 }, exp: 4, toast: 'Yum. Pixel loved the snack!', icon: '🍕', animation: 'pet-happy' },
  petPlayed: { stats: { mood: 8, bond: 5, energy: -5 }, exp: 4, toast: 'Playtime made Pixel super happy!', icon: '🎮', animation: 'pet-happy' },
  petTrained: { stats: { smart: 8, discipline: 4, energy: -7 }, exp: 9, toast: 'Training time made Pixel smarter.', icon: '📚', animation: 'pet-smart' },
  petRested: { stats: { energy: 10, health: 4, mood: 1 }, exp: 3, toast: 'Pixel had a cozy rest and feels refreshed.', icon: '💤', animation: 'pet-tired' },
};

let state = {
  ...createDefaultData(),
  currentPage: 'home',
  calYear: new Date().getFullYear(),
  calMonth: new Date().getMonth(),
  selectedDate: null,
  selectedMood: null,
  focusTask: null,
  timerRunning: false,
  timerInterval: null,
  timerSeconds: 25 * 60,
  timerTotal: 25 * 60,
  timerPhase: 'focus',
  pomDone: 0,
  evColor: '#a855f7',
  noteColor: '#1a1133',
  auth: {
    mode: 'login',
    currentUserEmail: null,
    remember: false,
  },
  filters: {
    budgetType: 'all',
    budgetSearch: '',
    budgetCategory: 'all',
    budgetDate: '',
    todoSearch: '',
    todoPriority: 'all',
    todoStatus: 'all',
    calendarSearch: '',
    noteSearch: '',
    shopCategory: 'all',
    shopSearch: '',
    shopStatus: 'all',
  },
  edit: {
    transaction: null,
    todo: null,
    note: null,
    event: null,
    habit: null,
    goal: null,
    shop: null,
  },
  users: {},
};

function $(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatMoney(amount) {
  return `₹${Number(amount || 0).toFixed(2)}`;
}

function applyThemeSettings() {
  const theme = state.settings.theme || 'dark';
  const accentKey = state.settings.accent || 'violet';
  const palette = ACCENT_THEMES[accentKey] || ACCENT_THEMES.violet;
  document.body.dataset.theme = theme;
  document.documentElement.style.setProperty('--accent', palette.accent);
  document.documentElement.style.setProperty('--accent2', palette.accent2);
  document.documentElement.style.setProperty('--accent3', palette.accent3);
  document.documentElement.style.setProperty('--accent4', palette.accent4);
  const select = $('theme-select');
  if (select) select.value = theme;
  document.querySelectorAll('.accent-swatch').forEach(swatch => {
    swatch.classList.toggle('active', swatch.dataset.accent === accentKey);
  });
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function sameDayString(input, key = todayKey()) {
  if (!input) return false;
  const parsed = new Date(input);
  if (!Number.isNaN(parsed.getTime())) {
    return todayKey(parsed) === key;
  }
  return input === key;
}

function parseDateTime(dateValue, timeValue) {
  if (!dateValue) return null;
  const iso = `${dateValue}T${timeValue || '23:59'}`;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateLabel(dateValue) {
  if (!dateValue) return '';
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return escapeHtml(dateValue);
  return parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateTimeLabel(dateValue, timeValue) {
  if (!dateValue) return 'No due date';
  const parsed = parseDateTime(dateValue, timeValue);
  if (!parsed) return dateValue;
  return parsed.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: timeValue ? 'numeric' : undefined,
    minute: timeValue ? '2-digit' : undefined,
  });
}

function clearElement(element) {
  if (element) element.innerHTML = '';
}

function readUsers() {
  const users = readJson(STORAGE_KEYS.users, {});
  return users && typeof users === 'object' ? users : {};
}

function getRememberedSession() {
  // Check localStorage first (remember me), then sessionStorage (tab session)
  const lsSession = readJson(STORAGE_KEYS.session, null);
  if (lsSession && typeof lsSession === 'object') return lsSession;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.session);
    const ssSession = raw ? JSON.parse(raw) : null;
    return ssSession && typeof ssSession === 'object' ? ssSession : null;
  } catch {
    return null;
  }
}

function getCurrentUserRecord() {
  if (!state.auth.currentUserEmail) return null;
  return state.users[state.auth.currentUserEmail] || null;
}

function getDisplayNameFromEmail(email) {
  if (!email) return 'Pixel Friend';
  const local = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
  return local.replace(/\b\w/g, char => char.toUpperCase()) || 'Pixel Friend';
}

function createUserRecord(email, password, name) {
  return {
    email,
    password,
    name: name || getDisplayNameFromEmail(email),
    createdAt: new Date().toISOString(),
    data: {
      ...createDefaultData(),
      profile: {
        ...DEFAULT_PROFILE,
        name: name || getDisplayNameFromEmail(email),
        email,
      },
    },
  };
}

function exportAppData() {
  return {
    transactions: state.transactions,
    todos: state.todos,
    notes: state.notes,
    events: state.events,
    habits: state.habits,
    goals: state.goals,
    moods: state.moods,
    shopItems: state.shopItems,
    todoLists: state.todoLists,
    pet: state.pet,
    focus: state.focus,
    profile: state.profile,
    settings: state.settings,
  };
}

function normalizeFocusDaily() {
  if (!state.focus.lastUpdated || state.focus.lastUpdated !== todayKey()) {
    state.focus.todayMinutes = 0;
    state.focus.todaySessions = 0;
    state.focus.lastUpdated = todayKey();
  }
}

function refreshHabitDailyState() {
  const today = todayKey();
  const dayIndex = new Date().getDay();
  state.habits.forEach(habit => {
    habit.days = Array.isArray(habit.days) && habit.days.length === 7
      ? habit.days.slice(0, 7)
      : [false, false, false, false, false, false, false];
    habit.doneToday = habit.lastCompletedOn === today;
    if (!habit.doneToday) habit.days[dayIndex] = false;
  });
}

function applyDailyPetDecay() {
  const today = todayKey();
  const lastVisit = state.pet.lastVisit || today;
  const lastDate = new Date(lastVisit);
  const currentDate = new Date(today);
  if (Number.isNaN(lastDate.getTime()) || Number.isNaN(currentDate.getTime())) {
    state.pet.lastVisit = today;
    return;
  }

  const daysAway = Math.floor((currentDate.getTime() - lastDate.getTime()) / 86400000);
  if (daysAway >= 1) {
    state.pet.energy = Math.max(0, Number(state.pet.energy || 0) - 10);
    state.pet.mood = Math.max(0, Number(state.pet.mood || 0) - 10);
    state.pet.discipline = Math.max(0, Number(state.pet.discipline || 0) - 5);
    showToast('Pixel missed you and lost a little energy while you were away.', '😴');
    animatePetReaction('pet-tired');
  }
  state.pet.lastVisit = today;
}

function applyData(data) {
  const safe = data && typeof data === 'object' ? data : {};
  const defaults = createDefaultData();
  state.transactions = normalizeArray(safe.transactions).map(item => ({
    id: Number(item.id) || Date.now() + Math.random(),
    type: item.type === 'income' ? 'income' : 'expense',
    amount: Number(item.amount) || 0,
    desc: String(item.desc || ''),
    cat: String(item.cat || '📌 Other'),
    date: String(item.date || todayKey()),
  }));
  state.todos = normalizeArray(safe.todos).map(item => ({
    id: Number(item.id) || Date.now() + Math.random(),
    text: String(item.text || ''),
    list: String(item.list || 'Personal'),
    priority: ['high', 'medium', 'low'].includes(item.priority) ? item.priority : 'medium',
    done: Boolean(item.done),
    date: String(item.date || todayKey()),
    dueDate: item.dueDate ? String(item.dueDate) : '',
    dueTime: item.dueTime ? String(item.dueTime) : '',
    reminderEnabled: Boolean(item.reminderEnabled),
    reminderSent: Boolean(item.reminderSent),
  }));
  state.notes = normalizeArray(safe.notes).map(item => ({
    id: Number(item.id) || Date.now() + Math.random(),
    title: String(item.title || ''),
    body: String(item.body || ''),
    emoji: String(item.emoji || '💡'),
    tag: String(item.tag || ''),
    color: String(item.color || '#1a1133'),
    date: String(item.date || todayKey()),
  }));
  state.events = normalizeArray(safe.events).map(item => ({
    id: Number(item.id) || Date.now() + Math.random(),
    title: String(item.title || ''),
    date: String(item.date || todayKey()),
    time: String(item.time || ''),
    desc: String(item.desc || ''),
    color: String(item.color || '#a855f7'),
  }));
  state.habits = normalizeArray(safe.habits).map(item => ({
    id: Number(item.id) || Date.now() + Math.random(),
    name: String(item.name || ''),
    emoji: String(item.emoji || '🔥'),
    desc: String(item.desc || ''),
    streak: Number(item.streak) || 0,
    days: normalizeArray(item.days).slice(0, 7),
    doneToday: Boolean(item.doneToday),
    lastCompletedOn: item.lastCompletedOn ? String(item.lastCompletedOn) : '',
  }));
  state.goals = normalizeArray(safe.goals).map((item, index) => ({
    id: Number(item.id) || Date.now() + Math.random(),
    name: String(item.name || ''),
    emoji: String(item.emoji || '🎯'),
    target: Number(item.target) || 100,
    progress: Number(item.progress) || 0,
    desc: String(item.desc || ''),
    color: String(item.color || GOAL_COLORS[index % GOAL_COLORS.length]),
  }));
  state.moods = normalizeArray(safe.moods).map(item => ({
    id: Number(item.id) || Date.now() + Math.random(),
    mood: String(item.mood || 'Okay'),
    emoji: String(item.emoji || MOOD_EMOJIS[item.mood] || '😊'),
    note: String(item.note || ''),
    date: String(item.date || todayKey()),
    time: String(item.time || ''),
  }));
  state.shopItems = normalizeArray(safe.shopItems).map(item => ({
    id: Number(item.id) || Date.now() + Math.random(),
    name: String(item.name || ''),
    qty: Number(item.qty) || 1,
    price: Number(item.price) || 0,
    cat: String(item.cat || 'other'),
    bought: Boolean(item.bought),
  }));
  state.todoLists = Array.from(new Set([
    ...DEFAULT_TODO_LISTS,
    ...normalizeArray(safe.todoLists).map(item => String(item || '').trim()).filter(Boolean),
    ...state.todos.map(todo => todo.list).filter(Boolean),
  ]));
  state.pet = { ...defaults.pet, ...(safe.pet || {}) };
  state.focus = { ...defaults.focus, ...(safe.focus || {}) };
  state.profile = { ...defaults.profile, ...(safe.profile || {}) };
  state.settings = { ...defaults.settings, ...(safe.settings || {}) };
  normalizeFocusDaily();
  refreshHabitDailyState();
}

function saveState() {
  syncProfileFormToState();
  syncSettingsFromDom();
  normalizeFocusDaily();
  writeJson(STORAGE_KEYS.appState, exportAppData());

  const record = getCurrentUserRecord();
  if (record && state.auth.currentUserEmail) {
    record.name = state.profile.name || record.name || getDisplayNameFromEmail(record.email);
    record.data = exportAppData();
    state.users[state.auth.currentUserEmail] = record;
    writeJson(STORAGE_KEYS.users, state.users);
  }

  if (state.auth.currentUserEmail) {
    const sessionData = { email: state.auth.currentUserEmail, remember: state.auth.remember };
    if (state.auth.remember) {
      // Persist across browser closes
      localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(sessionData));
      sessionStorage.removeItem(STORAGE_KEYS.session);
    } else {
      // Only for this browser tab/session (survives refresh but not full close)
      sessionStorage.setItem(STORAGE_KEYS.session, JSON.stringify(sessionData));
      localStorage.removeItem(STORAGE_KEYS.session);
    }
  } else {
    localStorage.removeItem(STORAGE_KEYS.session);
    sessionStorage.removeItem(STORAGE_KEYS.session);
  }
}

function loadState() {
  state.users = readUsers();
  const session = getRememberedSession();
  if (session && session.email && state.users[session.email]) {
    state.auth.currentUserEmail = session.email;
    state.auth.remember = Boolean(session.remember);
    applyData(state.users[session.email].data);
    state.profile.email = state.users[session.email].email;
    state.profile.name = state.profile.name || state.users[session.email].name;
    applyDailyPetDecay();
    return true;
  }
  const savedState = readJson(STORAGE_KEYS.appState, null);
  applyData(savedState || createDefaultData());
  state.auth.currentUserEmail = null;
  state.auth.remember = false;
  applyDailyPetDecay();
  return false;
}

function showToast(message, icon = '🐾') {
  const toastMessage = $('toast-msg');
  const toastIcon = $('toast-icon');
  const toast = $('toast');
  if (!toast || !toastMessage || !toastIcon) return;
  toastMessage.textContent = message;
  toastIcon.textContent = icon;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function openModal(id) {
  if (id === 'modal-event' && !state.edit.event) resetEventForm();
  if (id === 'modal-note' && !state.edit.note) resetNoteForm();
  if (id === 'modal-habit' && !state.edit.habit) resetHabitForm();
  if (id === 'modal-goal' && !state.edit.goal) resetGoalForm();
  const modal = $(id);
  if (modal) modal.classList.add('open');
}

function closeModal(id) {
  const modal = $(id);
  if (modal) modal.classList.remove('open');
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', event => {
    if (event.target === overlay) overlay.classList.remove('open');
  });
});

function updateModalCopy(modalId, title, copy, buttonText) {
  const modal = $(modalId);
  if (!modal) return;
  const heading = modal.querySelector('h3');
  const description = modal.querySelector('p');
  const action = modal.querySelector('.btn-primary');
  if (heading) heading.textContent = title;
  if (description) description.textContent = copy;
  if (action) action.textContent = buttonText;
}

function pickColor(element, type) {
  const parent = element.parentElement;
  if (!parent) return;
  parent.querySelectorAll('.cpick').forEach(item => item.classList.remove('selected'));
  element.classList.add('selected');
  if (type === 'ev') state.evColor = element.dataset.c;
  if (type === 'note') state.noteColor = element.dataset.c;
}

function showLoginPage() {
  const loginPage = $('p-login');
  const topNav = $('top-nav');
  const sidebar = $('sidebar');
  const appShell = $('app-shell');
  if (loginPage) {
    loginPage.style.display = 'flex';
    loginPage.classList.add('active');
  }
  if (topNav) topNav.classList.remove('visible');
  if (sidebar) sidebar.classList.remove('visible');
  if (appShell) appShell.classList.remove('visible');
  updateAuthModeUI();
}

function updateAuthDisplay() {
  const record = getCurrentUserRecord();
  const displayName = state.profile.name || (record ? record.name : '') || getDisplayNameFromEmail(state.profile.email);
  const navUser = $('nav-user-pill');
  if (navUser) navUser.textContent = displayName ? `👤 ${displayName}` : '👤 Guest';

  const profileName = document.querySelector('.profile-name-display');
  const profileSince = document.querySelector('.profile-since');
  if (profileName) profileName.textContent = displayName || "Pixel's Owner";
  if (profileSince && record?.createdAt) {
    profileSince.textContent = `Member since ${new Date(record.createdAt).toLocaleDateString('en-IN')}`;
  }

  const profileEmailInput = $('prof-email');
  if (profileEmailInput) profileEmailInput.value = state.profile.email || '';
}

function enterApp() {
  const loginPage = $('p-login');
  if (loginPage) {
    loginPage.classList.remove('active');
    loginPage.style.display = 'none';
  }
  $('top-nav')?.classList.add('visible');
  $('sidebar')?.classList.add('visible');
  $('app-shell')?.classList.add('visible');
  populateProfileForm();
  renderSettings();
  updateAuthDisplay();
  goPage(state.currentPage || 'home');
}

function toggleAuthMode() {
  state.auth.mode = state.auth.mode === 'login' ? 'signup' : 'login';
  updateAuthModeUI();
}

function togglePasswordVisibility() {
  const input = $('login-password');
  const button = $('login-password-toggle');
  if (!input || !button) return;
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  button.textContent = show ? 'Hide Password' : 'Show Password';
}

function updateAuthModeUI() {
  const title = document.querySelector('.login-title');
  const subtitle = document.querySelector('.ob-sub');
  const nameGroup = $('login-name-group');
  const submitButton = document.querySelector('#login-form .login-cta');
  const switchCopy = $('auth-mode-copy');
  const switchButton = $('auth-mode-toggle');
  if (title) title.textContent = state.auth.mode === 'login' ? 'Welcome back' : 'Create your demo account';
  if (subtitle) {
    subtitle.textContent = state.auth.mode === 'login'
      ? 'Sign in to open your dashboard right away.'
      : 'Sign up once and keep your Pixel dashboard synced in local storage.';
  }
  if (nameGroup) nameGroup.style.display = state.auth.mode === 'signup' ? '' : 'none';
  if (submitButton) submitButton.textContent = state.auth.mode === 'login' ? 'Log In' : 'Sign Up';
  if (switchCopy) {
    switchCopy.textContent = state.auth.mode === 'login'
      ? 'Need an account?'
      : 'Already have an account?';
  }
  if (switchButton) {
    switchButton.textContent = state.auth.mode === 'login' ? 'Create one' : 'Log in';
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function handleLogin(event) {
  event.preventDefault();
  const nameInput = $('login-name');
  const emailInput = $('login-email');
  const passwordInput = $('login-password');
  const rememberInput = $('login-remember');
  if (!emailInput || !passwordInput) return;

  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();
  const remember = rememberInput ? rememberInput.checked : false;

  if (!validateEmail(email)) {
    showToast('Enter a valid email address.', '📧');
    return;
  }
  if (password.length < 6) {
    showToast('Password must be at least 6 characters.', '🔐');
    return;
  }

  state.users = readUsers();
  if (state.auth.mode === 'signup') {
    if (!name) {
      showToast('Add your name to create the account.', '👤');
      return;
    }
    if (state.users[email]) {
      showToast('That demo account already exists. Try logging in instead.', '⚠️');
      return;
    }
    state.users[email] = createUserRecord(email, password, name);
    writeJson(STORAGE_KEYS.users, state.users);
  } else if (!state.users[email] || state.users[email].password !== password) {
    showToast('Email or password did not match this local demo account.', '⚠️');
    return;
  }

  state.auth.currentUserEmail = email;
  state.auth.remember = remember;
  applyData(state.users[email].data);
  state.profile.email = email;
  state.profile.name = state.profile.name || state.users[email].name || getDisplayNameFromEmail(email);
  saveState();
  showToast(`Welcome back, ${state.profile.name || getDisplayNameFromEmail(email)}!`, '🐾');
  enterApp();
}

function logout() {
  if (!confirm('Log out of this demo account?')) return;
  saveState();
  state.auth.currentUserEmail = null;
  state.auth.remember = false;
  localStorage.removeItem(STORAGE_KEYS.session);
  sessionStorage.removeItem(STORAGE_KEYS.session);
  applyData(createDefaultData());
  showLoginPage();
}

function goPage(id) {
  document.querySelectorAll('#app-shell .page').forEach(page => page.classList.remove('active'));
  const page = $(`p-${id}`);
  if (page) page.classList.add('active');
  state.currentPage = id;

  document.querySelectorAll('.sb-btn').forEach(button => {
    button.classList.toggle('active', button.dataset.page === id);
  });
  document.querySelectorAll('.nav-link-top').forEach(button => {
    button.classList.toggle('active', button.dataset.page === id);
  });

  if (id === 'calendar') renderCalendar();
  if (id === 'todo') renderTodos();
  if (id === 'budget') renderTransactions();
  if (id === 'ideas') renderNotes();
  if (id === 'habits') renderHabits();
  if (id === 'goals') renderGoals();
  if (id === 'focus') renderFocusTasks();
  if (id === 'shopping') renderShopList();
  if (id === 'mood') {
    renderMoodLog();
    renderMoodStats();
  }
  if (id === 'profile') updateProfile();
  if (id === 'home') updateHome();
  updatePetDisplay();
}

function syncProfileFormToState() {
  const nameInput = $('prof-name');
  const bioInput = $('prof-bio');
  const goalInput = $('prof-goal');
  if (nameInput) state.profile.name = nameInput.value.trim();
  if (bioInput) state.profile.bio = bioInput.value.trim();
  if (goalInput) state.profile.mainGoal = goalInput.value.trim();
}

function populateProfileForm() {
  if ($('prof-name')) $('prof-name').value = state.profile.name || '';
  if ($('prof-bio')) $('prof-bio').value = state.profile.bio || '';
  if ($('prof-goal')) $('prof-goal').value = state.profile.mainGoal || '';
  if ($('prof-email')) $('prof-email').value = state.profile.email || '';
  if ($('pet-name-input')) $('pet-name-input').value = state.pet.name || 'Pixel';
}

function settingKeyForToggle(toggle) {
  const label = toggle?.closest('.setting-row')?.querySelector('.si-label')?.textContent?.trim() || '';
  if (label === 'Daily Reminder') return 'dailyReminder';
  if (label === 'Budget Alerts') return 'budgetAlerts';
  if (label === 'Habit Reminders') return 'habitReminders';
  if (label === 'Pet Reactions') return 'petReactions';
  if (label === 'Sound Effects') return 'soundEffects';
  if (label === 'Task Reminders') return 'taskReminders';
  return toggle?.dataset.setting || null;
}

function syncSettingsFromDom() {
  document.querySelectorAll('.setting-row .toggle').forEach(toggle => {
    const key = settingKeyForToggle(toggle);
    if (key) state.settings[key] = toggle.classList.contains('on');
  });
}

function renderSettings() {
  document.querySelectorAll('.setting-row .toggle').forEach(toggle => {
    const key = settingKeyForToggle(toggle);
    if (key) toggle.classList.toggle('on', Boolean(state.settings[key]));
  });
  applyThemeSettings();
}

function toggleSetting(element) {
  element.classList.toggle('on');
  const key = settingKeyForToggle(element);
  if (key) state.settings[key] = element.classList.contains('on');
  if (key && key.includes('Reminders') && state.settings[key]) {
    requestReminderPermissionIfNeeded();
  }
  saveState();
  showToast(element.classList.contains('on') ? 'Setting enabled' : 'Setting disabled', '⚙️');
}

function setTheme(theme) {
  state.settings.theme = theme === 'light' ? 'light' : 'dark';
  applyThemeSettings();
  saveState();
}

function setAccent(accent) {
  state.settings.accent = ACCENT_THEMES[accent] ? accent : 'violet';
  applyThemeSettings();
  saveState();
}

function requestReminderPermissionIfNeeded() {
  if (!('Notification' in window)) {
    showToast('Browser notifications are not supported here.', '🔕');
    return Promise.resolve(false);
  }
  if (Notification.permission === 'granted') return Promise.resolve(true);
  if (Notification.permission === 'denied') {
    showToast('Notifications are blocked in this browser.', '🔕');
    return Promise.resolve(false);
  }
  return Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      showToast('Notifications enabled for task reminders.', '🔔');
      return true;
    }
    showToast('Reminder permission was not granted.', '🔕');
    return false;
  });
}

function maybeSendTaskReminders() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  let changed = false;
  state.todos.forEach(todo => {
    if (!todo.reminderEnabled || todo.reminderSent || todo.done || !todo.dueDate) return;
    const due = parseDateTime(todo.dueDate, todo.dueTime || '09:00');
    if (due && due.getTime() <= Date.now()) {
      new Notification(`Task reminder: ${todo.text}`, {
        body: `Due ${formatDateTimeLabel(todo.dueDate, todo.dueTime)}`,
      });
      todo.reminderSent = true;
      changed = true;
    }
  });
  if (changed) saveState();
}

function adjustStat(stat, delta) {
  state.pet[stat] = Number(state.pet[stat] || 0) + delta;
}

function updatePetDisplay() {
  ['health', 'energy', 'mood', 'smart', 'bond', 'discipline'].forEach(stat => {
    const bar = $(`stat-${stat}`);
    const value = $(`stat-${stat}-val`);
    if (bar) bar.style.width = `${state.pet[stat]}%`;
    if (value) value.textContent = state.pet[stat];
  });
  if ($('pet-level')) $('pet-level').textContent = state.pet.level;
  if ($('pet-name-display')) $('pet-name-display').textContent = state.pet.name;
  updatePetMood();
}

function updatePetMood() {
  const average = (state.pet.health + state.pet.energy + state.pet.mood + state.pet.bond) / 4;
  const moods = [
    [80, 'Pixel is Thrilled 🤩'],
    [60, 'Pixel is Happy 😊'],
    [40, 'Pixel is Okay 😐'],
    [20, 'Pixel is Tired 😴'],
    [0, 'Pixel needs love 😢'],
  ];
  const match = moods.find(item => average >= item[0]) || moods[moods.length - 1];
  if ($('nav-mood')) $('nav-mood').textContent = match[1];
}

function gainExp(amount) {
  state.pet.exp += amount;
  if (state.pet.exp >= 100) {
    state.pet.level += 1;
    state.pet.exp = 0;
    showToast(`Pixel leveled up to Level ${state.pet.level}!`, '⭐');
  }
  updatePetDisplay();
  saveState();
}

function feedPet() {
  adjustStat('health', 15);
  adjustStat('energy', 10);
  showToast('Yum! Pixel loved the snack!', '🐾');
}

function playPet() {
  adjustStat('mood', 20);
  adjustStat('energy', -10);
  showToast('Pixel had so much fun!', '🎉');
}

function trainPet() {
  adjustStat('smart', 15);
  adjustStat('energy', -15);
  gainExp(10);
  showToast('Pixel is getting smarter!', '📚');
}

function petSleep() {
  adjustStat('energy', 30);
  adjustStat('health', 5);
  showToast('Pixel is resting. Zzz.', '💤');
}

function clampPetStats() {
  ['health', 'energy', 'mood', 'smart', 'bond', 'discipline'].forEach(stat => {
    state.pet[stat] = Math.max(0, Math.min(100, Number(state.pet[stat] || 0)));
  });
}

function updatePetDisplay() {
  ['health', 'energy', 'mood', 'smart', 'bond', 'discipline'].forEach(stat => {
    const bar = $(`stat-${stat}`);
    const value = $(`stat-${stat}-val`);
    if (bar) bar.style.width = `${Math.max(0, Math.min(100, Number(state.pet[stat] || 0)))}%`;
    if (value) value.textContent = Math.round(Number(state.pet[stat] || 0));
  });
  if ($('pet-level')) $('pet-level').textContent = state.pet.level;
  if ($('pet-name-display')) $('pet-name-display').textContent = state.pet.name;
  updatePetMood();
}

function updatePetMood() {
  const average = (
    Number(state.pet.health || 0) +
    Number(state.pet.energy || 0) +
    Number(state.pet.mood || 0) +
    Number(state.pet.smart || 0) +
    Number(state.pet.bond || 0) +
    Number(state.pet.discipline || 0)
  ) / 6;
  const moods = [
    [80, 'Pixel is Thrilled 🤩'],
    [60, 'Pixel is Happy 😊'],
    [40, 'Pixel is Okay 😐'],
    [20, 'Pixel is Tired 😴'],
    [0, 'Pixel needs love 😢'],
  ];
  const match = moods.find(item => average >= item[0]) || moods[moods.length - 1];
  if ($('nav-mood')) $('nav-mood').textContent = match[1];
}

function animatePetReaction(type) {
  const wrap = document.querySelector('.pet-wrap');
  if (!wrap) return;
  ['pet-happy', 'pet-sad', 'pet-smart', 'pet-tired'].forEach(name => wrap.classList.remove(name));
  void wrap.offsetWidth;
  if (type) {
    wrap.classList.add(type);
    setTimeout(() => wrap.classList.remove(type), 950);
  }
}

function gainExp(amount) {
  state.pet.exp = Number(state.pet.exp || 0) + Number(amount || 0);
  while (state.pet.exp >= 100) {
    state.pet.exp -= 100;
    state.pet.level += 1;
    showToast(`Pixel leveled up to Level ${state.pet.level}!`, '⭐');
  }
  updatePetDisplay();
  saveState();
}

function petReact(action) {
  const config = PET_ACTION_CONFIG[action];
  if (!config) return;
  Object.entries(config.stats || {}).forEach(([stat, delta]) => {
    state.pet[stat] = Number(state.pet[stat] || 0) + Number(delta || 0);
  });
  state.pet.exp = Number(state.pet.exp || 0) + Number(config.exp || 0);
  clampPetStats();
  while (state.pet.exp >= 100) {
    state.pet.exp -= 100;
    state.pet.level += 1;
    showToast(`Pixel leveled up to Level ${state.pet.level}!`, '⭐');
  }
  state.pet.lastVisit = todayKey();
  updatePetDisplay();
  animatePetReaction(config.animation);
  showToast(config.toast, config.icon || '🐾');
  saveState();
}

function feedPet() {
  petReact('petFed');
}

function playPet() {
  petReact('petPlayed');
}

function trainPet() {
  petReact('petTrained');
}

function petSleep() {
  petReact('petRested');
}

function toggleTodo(id) {
  const todo = state.todos.find(item => item.id === id);
  if (!todo) return;
  todo.done = !todo.done;
  if (todo.done) {
    petReact('taskDone');
  } else {
    saveState();
  }
  renderTodos();
  renderFocusTasks();
  updateHome();
}

function toggleTodo(id) {
  const todo = state.todos.find(item => item.id === id);
  if (!todo) return;
  todo.done = !todo.done;
  if (todo.done) {
    petReact('taskDone');
  } else {
    saveState();
  }
  renderTodos();
  renderFocusTasks();
  updateHome();
}

function toggleHabitDay(id) {
  const habit = state.habits.find(item => item.id === id);
  if (!habit) return;
  const today = todayKey();
  const todayIndex = new Date().getDay();
  if (habit.doneToday) {
    habit.doneToday = false;
    habit.lastCompletedOn = '';
    habit.days[todayIndex] = false;
    habit.streak = Math.max(0, habit.streak - 1);
    saveState();
  } else {
    habit.doneToday = true;
    habit.lastCompletedOn = today;
    habit.days[todayIndex] = true;
    habit.streak += 1;
    petReact('habitDone');
  }
  renderHabits();
  updateHome();
}

function updateGoalProgress(id) {
  const goal = state.goals.find(item => item.id === id);
  if (!goal) return;
  const value = Number(prompt(`Update progress for ${goal.name}:`, goal.progress));
  if (Number.isNaN(value)) return;
  goal.progress = Math.min(goal.target, Math.max(0, value));
  if (goal.progress >= goal.target) {
    showToast('Goal complete. Amazing work!', '🏆');
  }
  petReact('goalProgress');
  renderGoals();
}

function startTimer() {
  if (state.timerRunning) return;
  state.timerRunning = true;
  const focusMinutes = Number($('focus-duration')?.value) || 25;
  const breakMinutes = Number($('break-duration')?.value) || 5;
  if (state.timerPhase === 'focus' && state.timerSeconds === state.timerTotal) {
    state.timerSeconds = focusMinutes * 60;
    state.timerTotal = focusMinutes * 60;
  }
  buildPomDots();
  state.timerInterval = setInterval(() => {
    state.timerSeconds -= 1;
    updateTimerDisplay();
    if (state.timerSeconds > 0) return;
    clearInterval(state.timerInterval);
    state.timerRunning = false;
    if (state.timerPhase === 'focus') {
      state.pomDone += 1;
      normalizeFocusDaily();
      state.focus.sessions += 1;
      state.focus.minutes += focusMinutes;
      state.focus.todaySessions += 1;
      state.focus.todayMinutes += focusMinutes;
      if ($('focus-sessions-done')) $('focus-sessions-done').textContent = state.focus.todaySessions;
      if ($('focus-mins-done')) $('focus-mins-done').textContent = state.focus.todayMinutes;
      state.timerPhase = 'break';
      state.timerSeconds = breakMinutes * 60;
      state.timerTotal = breakMinutes * 60;
      if ($('timer-phase')) $('timer-phase').textContent = 'Break Time';
      petReact('focusComplete');
    } else {
      state.timerPhase = 'focus';
      state.timerSeconds = focusMinutes * 60;
      state.timerTotal = focusMinutes * 60;
      if ($('timer-phase')) $('timer-phase').textContent = 'Focus Session';
      showToast('Break over. Ready to focus?', '⏱️');
      saveState();
    }
    updateTimerDisplay();
    updateHome();
  }, 1000);
}

function logMood() {
  if (!state.selectedMood) {
    showToast('Pick a mood first.', '😊');
    return;
  }
  const note = $('mood-note-input').value.trim();
  state.moods.unshift({
    id: Date.now(),
    mood: state.selectedMood,
    emoji: MOOD_EMOJIS[state.selectedMood] || '😊',
    note,
    date: todayKey(),
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  });
  $('mood-note-input').value = '';
  state.selectedMood = null;
  document.querySelectorAll('.mood-emoji-btn').forEach(item => item.classList.remove('selected'));
  petReact('moodLogged');
  renderMoodLog();
  renderMoodStats();
  updateHome();
}

function toggleShopItem(id) {
  const item = state.shopItems.find(entry => entry.id === id);
  if (!item) return;
  item.bought = !item.bought;
  if (item.bought) {
    petReact('shoppingDone');
  } else {
    saveState();
  }
  renderShopList();
}

function appendChatMessage(message, type = 'pixel') {
  const container = $('chat-messages');
  if (!container) return;
  const avatar = type === 'user' ? '😊' : '🐾';
  const wrapperClass = type === 'user' ? 'msg-pixel msg-user' : 'msg-pixel';
  container.insertAdjacentHTML(
    'beforeend',
    `<div class="${wrapperClass}"><span class="msg-avatar">${avatar}</span><div class="msg-bubble">${escapeHtml(message)}</div></div>`
  );
  container.scrollTop = container.scrollHeight;
}

function getBudgetSnapshotResponse() {
  const income = state.transactions.filter(item => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
  const expenses = state.transactions.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
  return `Balance: ${formatMoney(income - expenses)} | Income: ${formatMoney(income)} | Spent: ${formatMoney(expenses)}`;
}

function sendChat() {
  const input = $('chat-input');
  if (!input) return;
  const message = input.value.trim();
  if (!message) return;
  input.value = '';
  appendChatMessage(message, 'user');
  const key = message.toLowerCase();
  setTimeout(() => {
    let response = key.includes('budget') ? getBudgetSnapshotResponse() : pixelResponses[key];
    if (!response) {
      const partialMatch = Object.keys(pixelResponses).find(entry => entry !== 'default' && key.includes(entry));
      response = partialMatch ? pixelResponses[partialMatch] : null;
    }
    if (!response) {
      const defaults = pixelResponses.default;
      response = defaults[Math.floor(Math.random() * defaults.length)];
    }
    appendChatMessage(response, 'pixel');
  }, 320);
  gainExp(2);
}

function setTxType(type) {
  state.filters.transactionFormType = type;
  const expenseButton = $('tx-type-exp');
  const incomeButton = $('tx-type-inc');
  if (expenseButton) expenseButton.className = `btn btn-sm w-full ${type === 'expense' ? 'btn-danger' : 'btn-secondary'}`;
  if (incomeButton) incomeButton.className = `btn btn-sm w-full ${type === 'income' ? 'btn-green' : 'btn-secondary'}`;
}

function updateTransactionFormUi() {
  const card = document.querySelector('.add-tx-card');
  const heading = card?.querySelector('h3');
  const copy = card?.querySelector('p');
  const submit = $('tx-submit-btn');
  const cancel = $('tx-cancel-btn');
  const editing = Boolean(state.edit.transaction);
  if (heading) heading.textContent = editing ? 'Edit Transaction' : '+ Add Transaction';
  if (copy) copy.textContent = editing ? 'Update this entry and save changes' : 'Log your income or expense';
  if (submit) submit.textContent = editing ? 'Save Changes' : 'Record Transaction →';
  if (cancel) cancel.style.display = editing ? '' : 'none';
}

function populateTransactionForm(item) {
  $('tx-amount').value = item.amount;
  $('tx-desc').value = item.desc;
  $('tx-cat').value = item.cat;
  $('tx-date').value = item.date;
  setTxType(item.type);
}

function resetTransactionForm() {
  state.edit.transaction = null;
  $('tx-amount').value = '';
  $('tx-desc').value = '';
  $('tx-date').value = todayKey();
  if ($('tx-cat').options.length) $('tx-cat').selectedIndex = 0;
  setTxType('expense');
  updateTransactionFormUi();
}

function startEditTransaction(id) {
  const item = state.transactions.find(entry => entry.id === id);
  if (!item) return;
  state.edit.transaction = id;
  populateTransactionForm(item);
  updateTransactionFormUi();
}

function addTransaction() {
  const amount = Number($('tx-amount').value);
  const desc = $('tx-desc').value.trim();
  const cat = $('tx-cat').value;
  const date = $('tx-date').value || todayKey();
  const type = state.filters.transactionFormType || 'expense';
  if (!amount || amount <= 0 || !desc) {
    showToast('Please enter amount and description.', '⚠️');
    return;
  }
  if (state.edit.transaction) {
    const item = state.transactions.find(entry => entry.id === state.edit.transaction);
    if (!item) return;
    item.amount = amount;
    item.desc = desc;
    item.cat = cat;
    item.date = date;
    item.type = type;
    showToast('Transaction updated.', '💰');
  } else {
    state.transactions.unshift({ id: Date.now(), type, amount, desc, cat, date });
    showToast(type === 'income' ? 'Income recorded.' : 'Expense logged.', '💸');
  }
  saveState();
  petReact(type === 'income' ? 'incomeAdded' : 'expenseAdded');
  const totalIncome = state.transactions.filter(item => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = state.transactions.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
  if (type === 'expense' && totalExpenses > totalIncome) petReact('overspent');
  resetTransactionForm();
  renderTransactions();
  updateHome();
}

function deleteTransaction(id) {
  state.transactions = state.transactions.filter(item => item.id !== id);
  saveState();
  renderTransactions();
  updateHome();
}

function filterBudget(type) {
  state.filters.budgetType = type;
  ['all', 'income', 'expense'].forEach(key => {
    const button = $(`bf-${key}`);
    if (button) button.className = `btn btn-sm ${key === type ? 'btn-primary' : 'btn-secondary'}`;
  });
  renderTransactions();
}

function getFilteredTransactions() {
  return state.transactions.filter(item => {
    if (state.filters.budgetType !== 'all' && item.type !== state.filters.budgetType) return false;
    if (state.filters.budgetSearch && !item.desc.toLowerCase().includes(state.filters.budgetSearch.toLowerCase())) return false;
    if (state.filters.budgetCategory !== 'all' && item.cat !== state.filters.budgetCategory) return false;
    if (state.filters.budgetDate && item.date !== state.filters.budgetDate) return false;
    return true;
  });
}

function renderTransactions() {
  const list = $('tx-list');
  if (!list) return;
  const filtered = getFilteredTransactions();
  if (!filtered.length) {
    list.innerHTML = '<div class="text-sm text-muted" style="padding:18px;text-align:center">No transactions found.</div>';
  } else {
    list.innerHTML = filtered.map(item => `
      <div class="tx-row" role="listitem">
        <div class="tx-emoji">${escapeHtml(item.cat.split(' ')[0] || '📌')}</div>
        <div>
          <div class="tx-name">${escapeHtml(item.desc)}</div>
          <div class="tx-date">${escapeHtml(formatDateLabel(item.date))}</div>
        </div>
        <div><span class="tx-cat-pill">${escapeHtml(item.cat)}</span></div>
        <div class="${item.type === 'income' ? 'tx-pos' : 'tx-neg'}">${item.type === 'income' ? '+' : '-'}${escapeHtml(formatMoney(item.amount))}</div>
        <div class="item-actions">
          <button class="tx-del-btn" onclick="startEditTransaction(${item.id})">Edit</button>
          <button class="tx-del-btn" onclick="deleteTransaction(${item.id})">Delete</button>
        </div>
      </div>
    `).join('');
  }

  const income = state.transactions.filter(item => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
  const expenses = state.transactions.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
  const balance = income - expenses;
  if ($('b-income')) $('b-income').textContent = formatMoney(income);
  if ($('b-expenses')) $('b-expenses').textContent = formatMoney(expenses);
  if ($('b-balance')) {
    $('b-balance').textContent = formatMoney(balance);
    $('b-balance').style.color = balance >= 0 ? 'var(--accent3)' : 'var(--accent4)';
  }
  if ($('b-count')) $('b-count').textContent = state.transactions.length;
}

function changeMonth(direction) {
  state.calMonth += direction;
  if (state.calMonth > 11) {
    state.calMonth = 0;
    state.calYear += 1;
  }
  if (state.calMonth < 0) {
    state.calMonth = 11;
    state.calYear -= 1;
  }
  renderCalendar();
}

function selectDay(dateString) {
  state.selectedDate = dateString;
  renderCalendar();
  if ($('cal-selected-label')) $('cal-selected-label').textContent = `Events for ${formatDateLabel(dateString)}`;
  renderEvents(dateString);
}

function getFilteredEvents(selectedDate) {
  const search = state.filters.calendarSearch.trim().toLowerCase();
  let events = state.events.slice();
  if (selectedDate && !search) events = events.filter(event => event.date === selectedDate);
  if (search) {
    events = events.filter(event => {
      const haystack = `${event.title} ${event.desc} ${event.date} ${event.time}`.toLowerCase();
      return haystack.includes(search);
    });
  }
  return events.sort((a, b) => {
    const first = parseDateTime(a.date, a.time || '00:00');
    const second = parseDateTime(b.date, b.time || '00:00');
    return (first?.getTime() || 0) - (second?.getTime() || 0);
  });
}

function renderCalendar() {
  if ($('cal-title')) $('cal-title').textContent = `${MONTHS[state.calMonth]} ${state.calYear}`;
  const grid = $('cal-grid');
  if (!grid) return;
  clearElement(grid);

  const firstDay = new Date(state.calYear, state.calMonth, 1).getDay();
  const daysInMonth = new Date(state.calYear, state.calMonth + 1, 0).getDate();
  const previousMonthDays = new Date(state.calYear, state.calMonth, 0).getDate();
  const now = new Date();
  const isCurrentMonth = now.getFullYear() === state.calYear && now.getMonth() === state.calMonth;

  for (let index = firstDay - 1; index >= 0; index -= 1) {
    grid.insertAdjacentHTML('beforeend', `<div class="cal-day other-month">${previousMonthDays - index}</div>`);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateString = `${state.calYear}-${String(state.calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const classes = ['cal-day'];
    if (isCurrentMonth && day === now.getDate()) classes.push('today');
    if (state.selectedDate === dateString) classes.push('selected');
    if (state.events.some(event => event.date === dateString)) classes.push('has-event');
    grid.insertAdjacentHTML(
      'beforeend',
      `<button class="${classes.join(' ')}" type="button" role="gridcell" aria-label="${escapeHtml(dateString)}" onclick="selectDay('${dateString}')">${day}</button>`
    );
  }

  const totalCells = firstDay + daysInMonth;
  const remainder = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let day = 1; day <= remainder; day += 1) {
    grid.insertAdjacentHTML('beforeend', `<div class="cal-day other-month">${day}</div>`);
  }

  renderEvents(state.selectedDate);
}

function startEditEvent(id) {
  const event = state.events.find(item => item.id === id);
  if (!event) return;
  state.edit.event = id;
  $('ev-title').value = event.title;
  $('ev-date').value = event.date;
  $('ev-time').value = event.time || '';
  $('ev-desc').value = event.desc || '';
  state.evColor = event.color || '#a855f7';
  document.querySelectorAll('#ev-color-row .cpick').forEach(pick => {
    pick.classList.toggle('selected', pick.dataset.c === state.evColor);
  });
  updateModalCopy('modal-event', 'Edit Event', 'Update this event and save your changes.', 'Save Changes');
  openModal('modal-event');
}

function resetEventForm() {
  state.edit.event = null;
  $('ev-title').value = '';
  $('ev-date').value = todayKey();
  $('ev-time').value = '';
  $('ev-desc').value = '';
  state.evColor = '#a855f7';
  document.querySelectorAll('#ev-color-row .cpick').forEach((pick, index) => {
    pick.classList.toggle('selected', index === 0);
  });
  updateModalCopy('modal-event', '📅 Add Event', 'Schedule something on your calendar.', 'Save Event');
}

function saveEvent() {
  const title = $('ev-title').value.trim();
  const date = $('ev-date').value;
  const time = $('ev-time').value;
  const desc = $('ev-desc').value.trim();
  if (!title || !date) {
    showToast('Please enter a title and date.', '⚠️');
    return;
  }
  if (state.edit.event) {
    const event = state.events.find(item => item.id === state.edit.event);
    if (!event) return;
    event.title = title;
    event.date = date;
    event.time = time;
    event.desc = desc;
    event.color = state.evColor;
    showToast('Event updated.', '📅');
  } else {
    state.events.unshift({ id: Date.now(), title, date, time, desc, color: state.evColor });
    showToast('Event added.', '📅');
  }
  saveState();
  if (!state.edit.event) petReact('eventAdded');
  closeModal('modal-event');
  resetEventForm();
  renderCalendar();
  updateHome();
}

function deleteEvent(id) {
  state.events = state.events.filter(item => item.id !== id);
  saveState();
  renderCalendar();
  updateHome();
}

function renderEvents(selectedDate) {
  const panel = $('events-panel');
  if (!panel) return;
  const events = getFilteredEvents(selectedDate);
  if (!events.length) {
    panel.innerHTML = `<div class="text-sm text-muted" style="padding:7px 0">${state.filters.calendarSearch ? 'No matching events found.' : 'No events for this day yet.'}</div>`;
    return;
  }
  panel.innerHTML = events.map(event => `
    <div class="event-card" style="border-left-color:${escapeHtml(event.color || '#a855f7')}">
      <div class="item-actions">
        <button class="event-del" onclick="startEditEvent(${event.id})">Edit</button>
        <button class="event-del" onclick="deleteEvent(${event.id})">Delete</button>
      </div>
      <div class="event-time">${escapeHtml(event.time || 'All day')} | ${escapeHtml(formatDateLabel(event.date))}</div>
      <div class="event-title">${escapeHtml(event.title)}</div>
      ${event.desc ? `<div class="event-desc">${escapeHtml(event.desc)}</div>` : ''}
    </div>
  `).join('');
}

function renderTodoListNav() {
  const nav = $('todo-lists-nav');
  if (!nav) return;
  const allLists = ['All', ...state.todoLists];
  nav.innerHTML = allLists.map(list => {
    const count = list === 'All'
      ? state.todos.filter(todo => !todo.done).length
      : state.todos.filter(todo => todo.list === list && !todo.done).length;
    const active = state.currentPage === 'todo' && state.filters.todoList === list;
    const dotColor = list === 'All'
      ? 'var(--accent)'
      : list === 'Personal'
        ? 'var(--blue)'
        : list === 'Work'
          ? 'var(--accent2)'
          : list === 'Shopping'
            ? 'var(--accent3)'
            : 'var(--pink)';
    const label = list === 'All' ? 'All Tasks' : list;
    return `<div class="tl-item${active ? ' active' : ''}" onclick="switchList('${escapeHtml(list)}')" data-list="${escapeHtml(list)}"><div class="tl-dot" style="background:${dotColor}"></div><span class="tl-name">${escapeHtml(label)}</span><span class="tl-count">${count}</span></div>`;
  }).join('');
}

function renderTodoListSelect() {
  const select = $('todo-list-sel');
  if (!select) return;
  const current = select.value;
  select.innerHTML = state.todoLists.map(list => `<option value="${escapeHtml(list)}">${escapeHtml(list)}</option>`).join('');
  if (state.todoLists.includes(current)) select.value = current;
}

function switchList(list) {
  state.filters.todoList = list;
  renderTodos();
}

function addTodoList() {
  const name = prompt('Name your new task list:');
  const cleaned = String(name || '').trim();
  if (!cleaned) return;
  if (state.todoLists.includes(cleaned)) {
    showToast('That list already exists.', '📋');
    return;
  }
  state.todoLists.push(cleaned);
  saveState();
  renderTodoListSelect();
  renderTodoListNav();
  showToast(`"${cleaned}" list created.`, '📋');
}

function updateTodoFormUi() {
  const button = $('todo-submit-btn');
  const cancel = $('todo-cancel-btn');
  if (button) button.textContent = state.edit.todo ? 'Save' : 'Add';
  if (cancel) cancel.style.display = state.edit.todo ? '' : 'none';
}

function resetTodoForm() {
  state.edit.todo = null;
  $('todo-input').value = '';
  $('todo-due-date').value = '';
  $('todo-due-time').value = '';
  $('todo-reminder').checked = false;
  if ($('todo-priority-sel')) $('todo-priority-sel').value = 'high';
  if ($('todo-list-sel')) $('todo-list-sel').value = state.todoLists[0] || 'Personal';
  updateTodoFormUi();
}

function isTodoOverdue(todo) {
  if (todo.done || !todo.dueDate) return false;
  const due = parseDateTime(todo.dueDate, todo.dueTime || '23:59');
  return Boolean(due && due.getTime() < Date.now());
}

function todoMatchesStatus(todo) {
  const status = state.filters.todoStatus;
  const due = parseDateTime(todo.dueDate, todo.dueTime || '23:59');
  if (status === 'completed') return todo.done;
  if (status === 'overdue') return isTodoOverdue(todo);
  if (status === 'today') return !todo.done && todo.dueDate && sameDayString(todo.dueDate);
  if (status === 'upcoming') return !todo.done && due && due.getTime() >= Date.now();
  return true;
}

function getFilteredTodos() {
  return state.todos.filter(todo => {
    if (state.filters.todoList && state.filters.todoList !== 'All' && todo.list !== state.filters.todoList) return false;
    if (state.filters.todoSearch && !todo.text.toLowerCase().includes(state.filters.todoSearch.toLowerCase())) return false;
    if (state.filters.todoPriority !== 'all' && todo.priority !== state.filters.todoPriority) return false;
    if (!todoMatchesStatus(todo)) return false;
    return true;
  });
}

function startEditTodo(id) {
  const todo = state.todos.find(item => item.id === id);
  if (!todo) return;
  state.edit.todo = id;
  $('todo-input').value = todo.text;
  $('todo-list-sel').value = todo.list;
  $('todo-priority-sel').value = todo.priority;
  $('todo-due-date').value = todo.dueDate || '';
  $('todo-due-time').value = todo.dueTime || '';
  $('todo-reminder').checked = Boolean(todo.reminderEnabled);
  updateTodoFormUi();
}

function addTodo() {
  const text = $('todo-input').value.trim();
  const list = $('todo-list-sel').value;
  const priority = $('todo-priority-sel').value;
  const dueDate = $('todo-due-date').value;
  const dueTime = $('todo-due-time').value;
  const reminderEnabled = $('todo-reminder').checked;
  if (!text) {
    showToast('Type a task first.', '✏️');
    return;
  }
  if (reminderEnabled) requestReminderPermissionIfNeeded();
  if (state.edit.todo) {
    const todo = state.todos.find(item => item.id === state.edit.todo);
    if (!todo) return;
    todo.text = text;
    todo.list = list;
    todo.priority = priority;
    todo.dueDate = dueDate;
    todo.dueTime = dueTime;
    todo.reminderEnabled = reminderEnabled;
    todo.reminderSent = false;
    showToast('Task updated.', '✅');
  } else {
    state.todos.unshift({
      id: Date.now(),
      text,
      list,
      priority,
      done: false,
      date: todayKey(),
      dueDate,
      dueTime,
      reminderEnabled,
      reminderSent: false,
    });
    showToast('Task added.', '✅');
  }
  saveState();
  if (!state.edit.todo) petReact('taskAdded');
  resetTodoForm();
  renderTodos();
  renderFocusTasks();
  updateHome();
}

function toggleTodo(id) {
  const todo = state.todos.find(item => item.id === id);
  if (!todo) return;
  todo.done = !todo.done;
  if (todo.done) {
    showToast('Task done. Pixel is proud!', '🏆');
  }
  saveState();
  renderTodos();
  renderFocusTasks();
  updateHome();
}

function deleteTodo(id) {
  state.todos = state.todos.filter(item => item.id !== id);
  saveState();
  petReact('taskDeleted');
  renderTodos();
  renderFocusTasks();
  updateHome();
}

function clearDone() {
  state.todos = state.todos.filter(item => !item.done);
  saveState();
  renderTodos();
  renderFocusTasks();
  updateHome();
  showToast('Completed tasks cleared.', '🧹');
}

function renderTodos() {
  renderTodoListNav();
  renderTodoListSelect();
  const container = $('todo-items');
  if (!container) return;
  const todos = getFilteredTodos();
  if ($('todo-list-name')) $('todo-list-name').textContent = state.filters.todoList === 'All' ? 'All Tasks' : state.filters.todoList;
  if (!todos.length) {
    container.innerHTML = '<div class="text-sm text-muted" style="padding:18px;text-align:center">No tasks match these filters.</div>';
  } else {
    container.innerHTML = todos.map(todo => {
      const overdue = isTodoOverdue(todo);
      const dueLabel = todo.dueDate
        ? `Due ${escapeHtml(formatDateTimeLabel(todo.dueDate, todo.dueTime))}`
        : 'No due date';
      return `
        <div class="todo-item${todo.done ? ' done' : ''}${overdue ? ' todo-overdue' : ''}">
          <div class="todo-cb" onclick="toggleTodo(${todo.id})">${todo.done ? '✓' : ''}</div>
          <div class="todo-text-wrap">
            <div class="todo-text">${escapeHtml(todo.text)}</div>
            <div class="todo-meta-row">
              <span class="todo-date-label">${escapeHtml(todo.list)}</span>
              <span class="todo-date-label">${escapeHtml(dueLabel)}</span>
              ${todo.reminderEnabled ? '<span class="todo-date-label">🔔 Reminder</span>' : ''}
            </div>
          </div>
          <span class="todo-pri pri-${escapeHtml(todo.priority)}">${escapeHtml(todo.priority)}</span>
          <div class="item-actions">
            <button class="todo-del-btn" onclick="startEditTodo(${todo.id})">Edit</button>
            <button class="todo-del-btn" onclick="deleteTodo(${todo.id})">Delete</button>
          </div>
        </div>
      `;
    }).join('');
  }

  const completed = state.todos.filter(todo => todo.done).length;
  const total = state.todos.length;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  if ($('todo-progress-label')) $('todo-progress-label').textContent = `${completed} / ${total}`;
  if ($('todo-progress-bar')) $('todo-progress-bar').style.width = `${progress}%`;
}

function searchNotes() {
  state.filters.noteSearch = $('note-search')?.value.trim() || '';
  renderNotes();
}

function updateNoteFormUi() {
  updateModalCopy(
    'modal-note',
    state.edit.note ? 'Edit Idea' : '💡 New Idea',
    state.edit.note ? 'Update this note and save your changes.' : 'Capture your thought before it slips away.',
    state.edit.note ? 'Save Changes' : 'Save Idea'
  );
}

function resetNoteForm() {
  state.edit.note = null;
  $('note-title').value = '';
  $('note-body').value = '';
  $('note-emoji').value = '';
  $('note-tag').value = '';
  state.noteColor = '#1a1133';
  document.querySelectorAll('#note-color-row .cpick').forEach((pick, index) => {
    pick.classList.toggle('selected', index === 0);
  });
  updateNoteFormUi();
}

function startEditNote(id) {
  const note = state.notes.find(item => item.id === id);
  if (!note) return;
  state.edit.note = id;
  $('note-title').value = note.title;
  $('note-body').value = note.body;
  $('note-emoji').value = note.emoji;
  $('note-tag').value = note.tag;
  state.noteColor = note.color;
  document.querySelectorAll('#note-color-row .cpick').forEach(pick => {
    pick.classList.toggle('selected', pick.dataset.c === state.noteColor);
  });
  updateNoteFormUi();
  openModal('modal-note');
}

function saveNote() {
  const title = $('note-title').value.trim();
  const body = $('note-body').value.trim();
  const emoji = $('note-emoji').value.trim() || '💡';
  const tag = $('note-tag').value.trim();
  if (!title) {
    showToast('Give your idea a title.', '✏️');
    return;
  }
  if (state.edit.note) {
    const note = state.notes.find(item => item.id === state.edit.note);
    if (!note) return;
    note.title = title;
    note.body = body;
    note.emoji = emoji;
    note.tag = tag;
    note.color = state.noteColor;
    showToast('Idea updated.', '💡');
  } else {
    state.notes.unshift({ id: Date.now(), title, body, emoji, tag, color: state.noteColor, date: todayKey() });
    showToast('Idea captured.', '💡');
  }
  saveState();
  if (!state.edit.note) petReact('noteAdded');
  closeModal('modal-note');
  resetNoteForm();
  renderNotes();
  updateProfile();
}

function deleteNote(id) {
  state.notes = state.notes.filter(item => item.id !== id);
  saveState();
  renderNotes();
  updateProfile();
}

function renderNotes() {
  const grid = $('ideas-grid');
  if (!grid) return;
  const query = state.filters.noteSearch.toLowerCase();
  const notes = state.notes.filter(note => {
    const haystack = `${note.title} ${note.body} ${note.tag}`.toLowerCase();
    return !query || haystack.includes(query);
  });
  if (!notes.length) {
    grid.innerHTML = `<div class="text-sm text-muted" style="grid-column:1/-1;padding:18px 0">${query ? 'No matching ideas found.' : 'No ideas yet. Click "+ New Idea" to start.'}</div>`;
    return;
  }
  grid.innerHTML = notes.map(note => `
    <div class="idea-card fade-in" style="background:${escapeHtml(note.color)}">
      <div class="item-actions">
        <button class="todo-del-btn" onclick="startEditNote(${note.id})">Edit</button>
        <button class="todo-del-btn" onclick="deleteNote(${note.id})">Delete</button>
      </div>
      <div class="idea-emoji">${escapeHtml(note.emoji)}</div>
      <div class="idea-title">${escapeHtml(note.title)}</div>
      <div class="idea-body">${escapeHtml(note.body)}</div>
      <div class="todo-meta-row">
        <span class="todo-date-label">${escapeHtml(note.tag || 'untagged')}</span>
        <span class="todo-date-label">${escapeHtml(formatDateLabel(note.date))}</span>
      </div>
    </div>
  `).join('');
}

function updateHabitFormUi() {
  updateModalCopy(
    'modal-habit',
    state.edit.habit ? 'Edit Habit' : '🔥 New Habit',
    state.edit.habit ? 'Adjust this habit and keep your streak going.' : 'Build a habit, build yourself.',
    state.edit.habit ? 'Save Changes' : 'Add Habit'
  );
}

function resetHabitForm() {
  state.edit.habit = null;
  $('hb-name').value = '';
  $('hb-emoji').value = '';
  $('hb-desc').value = '';
  updateHabitFormUi();
}

function startEditHabit(id) {
  const habit = state.habits.find(item => item.id === id);
  if (!habit) return;
  state.edit.habit = id;
  $('hb-name').value = habit.name;
  $('hb-emoji').value = habit.emoji;
  $('hb-desc').value = habit.desc;
  updateHabitFormUi();
  openModal('modal-habit');
}

function saveHabit() {
  const name = $('hb-name').value.trim();
  const emoji = $('hb-emoji').value.trim() || '🔥';
  const desc = $('hb-desc').value.trim();
  if (!name) {
    showToast('Name your habit.', '⚠️');
    return;
  }
  if (state.edit.habit) {
    const habit = state.habits.find(item => item.id === state.edit.habit);
    if (!habit) return;
    habit.name = name;
    habit.emoji = emoji;
    habit.desc = desc;
    showToast('Habit updated.', '🔥');
  } else {
    state.habits.unshift({
      id: Date.now(),
      name,
      emoji,
      desc,
      streak: 0,
      days: [false, false, false, false, false, false, false],
      doneToday: false,
      lastCompletedOn: '',
    });
    showToast('Habit created. Build that streak.', '🔥');
  }
  saveState();
  closeModal('modal-habit');
  resetHabitForm();
  renderHabits();
  updateHome();
}

function toggleHabitDay(id) {
  const habit = state.habits.find(item => item.id === id);
  if (!habit) return;
  const today = todayKey();
  const todayIndex = new Date().getDay();
  if (habit.doneToday) {
    habit.doneToday = false;
    habit.lastCompletedOn = '';
    habit.days[todayIndex] = false;
    habit.streak = Math.max(0, habit.streak - 1);
  } else {
    habit.doneToday = true;
    habit.lastCompletedOn = today;
    habit.days[todayIndex] = true;
    habit.streak += 1;
    showToast(`${habit.name} done. Streak: ${habit.streak} days.`, '🏆');
  }
  saveState();
  if (habit.doneToday) petReact('habitDone');
  renderHabits();
  updateHome();
}

function deleteHabit(id) {
  state.habits = state.habits.filter(item => item.id !== id);
  saveState();
  renderHabits();
  updateHome();
}

function renderHabits() {
  const grid = $('habits-grid');
  if (!grid) return;
  refreshHabitDailyState();
  if (!state.habits.length) {
    grid.innerHTML = '<div class="text-sm text-muted" style="grid-column:1/-1">No habits added yet. Start your first habit.</div>';
    return;
  }
  const todayIndex = new Date().getDay();
  grid.innerHTML = state.habits.map(habit => `
    <div class="habit-card fade-in">
      <div class="habit-top">
        <div>
          <div class="habit-name">${escapeHtml(habit.emoji)} ${escapeHtml(habit.name)}</div>
          <div class="habit-desc">${escapeHtml(habit.desc || 'No description yet')}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:7px;">
          <div class="habit-streak">🔥 ${habit.streak}d</div>
          <div class="item-actions">
            <button class="todo-del-btn" onclick="startEditHabit(${habit.id})">Edit</button>
            <button class="todo-del-btn" onclick="deleteHabit(${habit.id})">Delete</button>
          </div>
        </div>
      </div>
      <div class="habit-week">
        ${habit.days.map((done, index) => `<div class="week-day${done ? ' done' : ''}${index === todayIndex ? ' today' : ''}">${DAYS[index]}</div>`).join('')}
      </div>
      <button class="habit-btn${habit.doneToday ? ' done-today' : ''}" onclick="toggleHabitDay(${habit.id})">${habit.doneToday ? 'Done Today' : 'Mark Done Today'}</button>
    </div>
  `).join('');
}

function updateGoalFormUi() {
  updateModalCopy(
    'modal-goal',
    state.edit.goal ? 'Edit Goal' : '🎯 New Goal',
    state.edit.goal ? 'Update your goal and keep moving forward.' : 'Set a goal and let Pixel cheer you on.',
    state.edit.goal ? 'Save Changes' : 'Create Goal'
  );
}

function resetGoalForm() {
  state.edit.goal = null;
  ['gl-name', 'gl-emoji', 'gl-target', 'gl-progress', 'gl-desc'].forEach(id => { if ($(id)) $(id).value = ''; });
  updateGoalFormUi();
}

function startEditGoal(id) {
  const goal = state.goals.find(item => item.id === id);
  if (!goal) return;
  state.edit.goal = id;
  $('gl-name').value = goal.name;
  $('gl-emoji').value = goal.emoji;
  $('gl-target').value = goal.target;
  $('gl-progress').value = goal.progress;
  $('gl-desc').value = goal.desc;
  updateGoalFormUi();
  openModal('modal-goal');
}

function saveGoal() {
  const name = $('gl-name').value.trim();
  const emoji = $('gl-emoji').value.trim() || '🎯';
  const target = Number($('gl-target').value) || 100;
  const progress = Number($('gl-progress').value) || 0;
  const desc = $('gl-desc').value.trim();
  if (!name) {
    showToast('Name your goal.', '⚠️');
    return;
  }
  if (state.edit.goal) {
    const goal = state.goals.find(item => item.id === state.edit.goal);
    if (!goal) return;
    goal.name = name;
    goal.emoji = emoji;
    goal.target = target;
    goal.progress = progress;
    goal.desc = desc;
    showToast('Goal updated.', '🎯');
  } else {
    state.goals.unshift({
      id: Date.now(),
      name,
      emoji,
      target,
      progress,
      desc,
      color: GOAL_COLORS[state.goals.length % GOAL_COLORS.length],
    });
    showToast('Goal set. Dream big.', '🎯');
  }
  saveState();
  closeModal('modal-goal');
  resetGoalForm();
  renderGoals();
}

function deleteGoal(id) {
  state.goals = state.goals.filter(item => item.id !== id);
  saveState();
  renderGoals();
}

function updateGoalProgress(id) {
  const goal = state.goals.find(item => item.id === id);
  if (!goal) return;
  const value = Number(prompt(`Update progress for ${goal.name}:`, goal.progress));
  if (Number.isNaN(value)) return;
  goal.progress = Math.min(goal.target, Math.max(0, value));
  if (goal.progress >= goal.target) {
    showToast('Goal complete. Amazing work!', '🏆');
  }
  saveState();
  renderGoals();
}

function renderGoals() {
  const grid = $('goals-grid');
  if (!grid) return;
  const cards = state.goals.map(goal => {
    const percent = Math.min(100, Math.round((goal.progress / goal.target) * 100));
    return `
      <div class="goal-card fade-in">
        <div class="goal-accent" style="background:${escapeHtml(goal.color)}"></div>
        <div class="goal-top">
          <span class="goal-emoji">${escapeHtml(goal.emoji)}</span>
          <div class="item-actions">
            <button class="todo-del-btn" onclick="startEditGoal(${goal.id})">Edit</button>
            <button class="todo-del-btn" onclick="deleteGoal(${goal.id})">Delete</button>
          </div>
        </div>
        <div class="goal-name">${escapeHtml(goal.name)}</div>
        <div class="goal-desc">${escapeHtml(goal.desc || 'No description yet')}</div>
        <div class="goal-nums"><span class="goal-current" style="color:${escapeHtml(goal.color)}">${goal.progress}</span><span class="goal-target-label">/ ${goal.target}</span></div>
        <div class="prog-track" style="margin-bottom:6px;"><div class="prog-fill" style="width:${percent}%;background:${escapeHtml(goal.color)}"></div></div>
        <div class="text-xs text-muted">${percent}% complete</div>
        <button class="btn btn-secondary btn-sm w-full" style="margin-top:8px" onclick="updateGoalProgress(${goal.id})">Update Progress</button>
      </div>
    `;
  }).join('');
  grid.innerHTML = `${cards}<div class="goal-add-card" onclick="openModal('modal-goal')"><span style="font-size:32px">＋</span><span class="text-sm text-muted fw8">Add New Goal</span></div>`;
}

function renderFocusTasks() {
  const list = $('focus-task-list');
  if (!list) return;
  const pending = state.todos.filter(todo => !todo.done);
  if (!pending.length) {
    list.innerHTML = '<div class="ftl-item text-sm text-muted">No pending tasks. All caught up.</div>';
    return;
  }
  list.innerHTML = pending.map(todo => `
    <div class="ftl-item${state.focusTask === todo.id ? ' active' : ''}" onclick="setFocusTask(${todo.id})">
      ${escapeHtml(todo.text)}
    </div>
  `).join('');
  const selected = pending.find(todo => todo.id === state.focusTask);
  if ($('focus-task-name')) $('focus-task-name').textContent = selected ? selected.text : 'No task selected';
}

function setFocusTask(id) {
  state.focusTask = id;
  const task = state.todos.find(todo => todo.id === id);
  if ($('focus-task-name')) $('focus-task-name').textContent = task ? task.text : 'No task selected';
  renderFocusTasks();
}

function buildPomDots() {
  const count = Number($('sessions-count')?.value) || 4;
  const container = $('pom-dots');
  if (!container) return;
  container.innerHTML = Array.from({ length: count }, (_, index) => (
    `<div class="pom-dot${index < state.pomDone ? ' done' : index === state.pomDone ? ' active' : ''}"></div>`
  )).join('');
}

function updateTimerDisplay() {
  const minutes = String(Math.floor(state.timerSeconds / 60)).padStart(2, '0');
  const seconds = String(state.timerSeconds % 60).padStart(2, '0');
  if ($('timer-display')) $('timer-display').textContent = `${minutes}:${seconds}`;
  const percentage = state.timerTotal ? state.timerSeconds / state.timerTotal : 1;
  const circumference = 2 * Math.PI * 90;
  if ($('timer-ring-fill')) $('timer-ring-fill').style.strokeDashoffset = circumference * (1 - percentage);
  buildPomDots();
}

function startTimer() {
  if (state.timerRunning) return;
  state.timerRunning = true;
  const focusMinutes = Number($('focus-duration')?.value) || 25;
  const breakMinutes = Number($('break-duration')?.value) || 5;
  if (state.timerPhase === 'focus' && state.timerSeconds === state.timerTotal) {
    state.timerSeconds = focusMinutes * 60;
    state.timerTotal = focusMinutes * 60;
  }
  buildPomDots();
  state.timerInterval = setInterval(() => {
    state.timerSeconds -= 1;
    updateTimerDisplay();
    if (state.timerSeconds > 0) return;
    clearInterval(state.timerInterval);
    state.timerRunning = false;
    if (state.timerPhase === 'focus') {
      state.pomDone += 1;
      normalizeFocusDaily();
      state.focus.sessions += 1;
      state.focus.minutes += focusMinutes;
      state.focus.todaySessions += 1;
      state.focus.todayMinutes += focusMinutes;
      if ($('focus-sessions-done')) $('focus-sessions-done').textContent = state.focus.todaySessions;
      if ($('focus-mins-done')) $('focus-mins-done').textContent = state.focus.todayMinutes;
      gainExp(10);
      adjustStat('smart', 5);
      showToast('Focus session complete. Take a break.', '🏆');
      state.timerPhase = 'break';
      state.timerSeconds = breakMinutes * 60;
      state.timerTotal = breakMinutes * 60;
      if ($('timer-phase')) $('timer-phase').textContent = 'Break Time';
    } else {
      state.timerPhase = 'focus';
      state.timerSeconds = focusMinutes * 60;
      state.timerTotal = focusMinutes * 60;
      if ($('timer-phase')) $('timer-phase').textContent = 'Focus Session';
      showToast('Break over. Ready to focus?', '⏱️');
    }
    saveState();
    updateTimerDisplay();
    updateHome();
  }, 1000);
}

function pauseTimer() {
  clearInterval(state.timerInterval);
  state.timerRunning = false;
}

function resetTimer() {
  clearInterval(state.timerInterval);
  state.timerRunning = false;
  const focusMinutes = Number($('focus-duration')?.value) || 25;
  state.timerPhase = 'focus';
  state.timerSeconds = focusMinutes * 60;
  state.timerTotal = focusMinutes * 60;
  if ($('timer-phase')) $('timer-phase').textContent = 'Focus Session';
  updateTimerDisplay();
}

function selectMood(button) {
  document.querySelectorAll('.mood-emoji-btn').forEach(item => item.classList.remove('selected'));
  button.classList.add('selected');
  state.selectedMood = button.dataset.mood;
}

function logMood() {
  if (!state.selectedMood) {
    showToast('Pick a mood first.', '😊');
    return;
  }
  const note = $('mood-note-input').value.trim();
  state.moods.unshift({
    id: Date.now(),
    mood: state.selectedMood,
    emoji: MOOD_EMOJIS[state.selectedMood] || '😊',
    note,
    date: todayKey(),
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  });
  $('mood-note-input').value = '';
  state.selectedMood = null;
  document.querySelectorAll('.mood-emoji-btn').forEach(item => item.classList.remove('selected'));
  saveState();
  renderMoodLog();
  renderMoodStats();
  updateHome();
  gainExp(3);
  adjustStat('mood', 5);
  showToast('Mood logged. Pixel cares.', '💜');
}

function renderMoodLog() {
  const log = $('mood-log');
  if (!log) return;
  if (!state.moods.length) {
    log.innerHTML = '<div class="text-sm text-muted" style="padding:9px 0">No entries yet. Log your first mood above.</div>';
    return;
  }
  log.innerHTML = state.moods.slice(0, 10).map(entry => `
    <div class="mood-entry fade-in">
      <div class="mood-entry-emoji">${escapeHtml(entry.emoji)}</div>
      <div style="flex:1">
        <div class="mood-entry-date">${escapeHtml(formatDateLabel(entry.date))} | ${escapeHtml(entry.time)}</div>
        <div class="mood-entry-note">${escapeHtml(entry.mood)}${entry.note ? ` - ${escapeHtml(entry.note)}` : ''}</div>
      </div>
    </div>
  `).join('');
}

function renderMoodStats() {
  const container = $('mood-stats');
  if (!container) return;
  const counts = {};
  state.moods.forEach(entry => {
    counts[entry.mood] = (counts[entry.mood] || 0) + 1;
  });
  const total = state.moods.length || 1;
  container.innerHTML = Object.entries(counts).map(([mood, count]) => `
    <div class="mood-stat-row">
      <div class="mood-stat-emoji">${escapeHtml(MOOD_EMOJIS[mood] || '😊')}</div>
      <div style="flex:1;" class="prog-track"><div class="prog-fill" style="width:${Math.round((count / total) * 100)}%;background:var(--accent)"></div></div>
      <div class="mood-stat-val">${count}</div>
    </div>
  `).join('');
}

function filterShop(category, button) {
  state.filters.shopCategory = category;
  document.querySelectorAll('.shop-cat-btn').forEach(item => item.classList.remove('active'));
  if (button) button.classList.add('active');
  renderShopList();
}

function updateShopFormUi() {
  const addButton = $('shop-submit-btn');
  const cancelButton = $('shop-cancel-btn');
  if (addButton) addButton.textContent = state.edit.shop ? 'Save Item' : 'Add Item';
  if (cancelButton) cancelButton.style.display = state.edit.shop ? '' : 'none';
}

function resetShopForm() {
  state.edit.shop = null;
  $('shop-item-name').value = '';
  $('shop-item-qty').value = '1';
  $('shop-item-price').value = '';
  if ($('shop-item-cat')) $('shop-item-cat').value = 'groceries';
  updateShopFormUi();
}

function startEditShopItem(id) {
  const item = state.shopItems.find(entry => entry.id === id);
  if (!item) return;
  state.edit.shop = id;
  $('shop-item-name').value = item.name;
  $('shop-item-qty').value = item.qty;
  $('shop-item-price').value = item.price || '';
  $('shop-item-cat').value = item.cat;
  updateShopFormUi();
}

function addShopItem() {
  const name = $('shop-item-name').value.trim();
  const qty = Number($('shop-item-qty').value) || 1;
  const price = Number($('shop-item-price').value) || 0;
  const cat = $('shop-item-cat').value;
  if (!name) {
    showToast('Enter an item name.', '⚠️');
    return;
  }
  if (state.edit.shop) {
    const item = state.shopItems.find(entry => entry.id === state.edit.shop);
    if (!item) return;
    item.name = name;
    item.qty = qty;
    item.price = price;
    item.cat = cat;
    showToast('Shopping item updated.', '🛒');
  } else {
    state.shopItems.unshift({ id: Date.now(), name, qty, price, cat, bought: false });
    showToast('Item added.', '🛒');
  }
  saveState();
  resetShopForm();
  renderShopList();
}

function toggleShopItem(id) {
  const item = state.shopItems.find(entry => entry.id === id);
  if (!item) return;
  item.bought = !item.bought;
  saveState();
  renderShopList();
}

function deleteShopItem(id) {
  state.shopItems = state.shopItems.filter(entry => entry.id !== id);
  saveState();
  renderShopList();
}

function clearBought() {
  state.shopItems = state.shopItems.filter(entry => !entry.bought);
  saveState();
  renderShopList();
  showToast('Bought items cleared.', '🧹');
}

function getFilteredShopItems() {
  return state.shopItems.filter(item => {
    if (state.filters.shopCategory !== 'all' && item.cat !== state.filters.shopCategory) return false;
    if (state.filters.shopSearch && !item.name.toLowerCase().includes(state.filters.shopSearch.toLowerCase())) return false;
    if (state.filters.shopStatus === 'bought' && !item.bought) return false;
    if (state.filters.shopStatus === 'pending' && item.bought) return false;
    return true;
  });
}

function renderShopList() {
  const list = $('shop-list');
  if (!list) return;
  const items = getFilteredShopItems();
  if (!items.length) {
    list.innerHTML = '<div class="text-sm text-muted" style="padding:18px;text-align:center">Nothing here yet.</div>';
  } else {
    list.innerHTML = items.map(item => `
      <div class="shop-item${item.bought ? ' bought' : ''}">
        <div class="shop-check" onclick="toggleShopItem(${item.id})">${item.bought ? '✓' : ''}</div>
        <span class="shop-item-name">${escapeHtml(SHOP_CAT_EMOJI[item.cat] || '📌')} ${escapeHtml(item.name)}</span>
        <span class="shop-qty">x${item.qty}</span>
        <span class="shop-price">${formatMoney(item.price * item.qty)}</span>
        <div class="item-actions">
          <button class="shop-del-btn" onclick="startEditShopItem(${item.id})">Edit</button>
          <button class="shop-del-btn" onclick="deleteShopItem(${item.id})">Delete</button>
        </div>
      </div>
    `).join('');
  }

  const totalItems = state.shopItems.length;
  const boughtItems = state.shopItems.filter(item => item.bought).length;
  const totalPrice = state.shopItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  if ($('shop-total-items')) $('shop-total-items').textContent = totalItems;
  if ($('shop-bought-items')) $('shop-bought-items').textContent = boughtItems;
  if ($('shop-total-price')) $('shop-total-price').textContent = formatMoney(totalPrice);
}

function saveProfile() {
  syncProfileFormToState();
  state.profile.email = state.auth.currentUserEmail || state.profile.email;
  const record = getCurrentUserRecord();
  if (record) record.name = state.profile.name || record.name;
  saveState();
  updateAuthDisplay();
  updateProfile();
  showToast('Profile saved.', '✅');
  gainExp(2);
}

function savePetName() {
  const name = $('pet-name-input').value.trim();
  if (!name) return;
  state.pet.name = name;
  saveState();
  updatePetDisplay();
  showToast(`Pet renamed to ${name}.`, '🐾');
}

function clearAllData() {
  if (!confirm('Clear all saved dashboard data for this demo account?')) return;
  const email = state.auth.currentUserEmail;
  const record = getCurrentUserRecord();
  applyData(createDefaultData());
  state.profile.email = email || '';
  state.profile.name = record?.name || getDisplayNameFromEmail(email);
  state.currentPage = 'home';
  resetTransactionForm();
  resetTodoForm();
  resetNoteForm();
  resetHabitForm();
  resetGoalForm();
  resetShopForm();
  saveState();
  renderEverything();
  showToast('All data cleared for this account.', '🗑️');
}

function renderWarningList(items, targetId, emptyText) {
  const container = $(targetId);
  if (!container) return;
  if (!items.length) {
    container.innerHTML = `<div class="text-sm text-muted">${escapeHtml(emptyText)}</div>`;
    return;
  }
  container.innerHTML = items.map(item => `<div class="mini-row">${item}</div>`).join('');
}

function updateHome() {
  normalizeFocusDaily();
  refreshHabitDailyState();
  const today = todayKey();
  const doneTasks = state.todos.filter(todo => todo.done).length;
  const todaySpent = state.transactions
    .filter(item => item.type === 'expense' && sameDayString(item.date, today))
    .reduce((sum, item) => sum + item.amount, 0);
  const todayEvents = state.events.filter(event => event.date === today).length;
  const habitsDone = state.habits.filter(habit => habit.doneToday).length;

  if ($('ov-tasks-done')) $('ov-tasks-done').textContent = doneTasks;
  if ($('ov-budget')) $('ov-budget').textContent = formatMoney(todaySpent);
  if ($('ov-events')) $('ov-events').textContent = todayEvents;
  if ($('ov-habits')) $('ov-habits').textContent = habitsDone;
  if ($('today-date-badge')) {
    $('today-date-badge').textContent = new Date().toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  const dueToday = state.todos.filter(todo => !todo.done && todo.dueDate && sameDayString(todo.dueDate, today));
  const homeTasks = $('home-tasks');
  if (homeTasks) {
    if (!dueToday.length) {
      homeTasks.innerHTML = '<div class="text-sm text-muted" style="padding:7px 0">No tasks due today.</div>';
    } else {
      homeTasks.innerHTML = dueToday.slice(0, 5).map(todo => `
        <div class="task-mini${todo.done ? ' done' : ''}" onclick="toggleTodo(${todo.id})">
          <div class="task-check">${todo.done ? '✓' : ''}</div>
          <div>${escapeHtml(todo.text)}<div class="todo-date-label">${escapeHtml(formatDateTimeLabel(todo.dueDate, todo.dueTime))}</div></div>
        </div>
      `).join('');
    }
  }

  const upcomingEvents = state.events
    .filter(event => {
      const when = parseDateTime(event.date, event.time || '00:00');
      return when && when.getTime() >= Date.now();
    })
    .sort((first, second) => parseDateTime(first.date, first.time)?.getTime() - parseDateTime(second.date, second.time)?.getTime())
    .slice(0, 4)
    .map(event => `${escapeHtml(event.title)} <span class="todo-date-label">${escapeHtml(formatDateTimeLabel(event.date, event.time))}</span>`);

  const monthStart = new Date();
  monthStart.setDate(1);
  const monthIncome = state.transactions.filter(item => item.type === 'income' && new Date(item.date).getMonth() === monthStart.getMonth() && new Date(item.date).getFullYear() === monthStart.getFullYear()).reduce((sum, item) => sum + item.amount, 0);
  const monthExpense = state.transactions.filter(item => item.type === 'expense' && new Date(item.date).getMonth() === monthStart.getMonth() && new Date(item.date).getFullYear() === monthStart.getFullYear()).reduce((sum, item) => sum + item.amount, 0);
  const habitRate = state.habits.length ? Math.round((habitsDone / state.habits.length) * 100) : 0;
  const recentMoods = state.moods.slice(0, 5);
  const moodSummary = recentMoods.length ? recentMoods.map(entry => entry.mood).join(', ') : 'No mood data yet';
  const overdueTasks = state.todos.filter(todo => isTodoOverdue(todo));

  renderWarningList(upcomingEvents, 'home-events', 'No upcoming events.');
  renderWarningList([
    `Monthly income: ${formatMoney(monthIncome)}`,
    `Monthly expenses: ${formatMoney(monthExpense)}`,
    `Monthly balance: ${formatMoney(monthIncome - monthExpense)}`,
    `Habit completion rate: ${habitRate}%`,
    `Focus minutes today: ${state.focus.todayMinutes}`,
    `Mood trend: ${escapeHtml(moodSummary)}`,
  ], 'home-insights', 'No daily insights yet.');

  const warnings = [];
  if (overdueTasks.length) warnings.push(`${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}`);
  if (monthExpense > monthIncome && monthIncome > 0) warnings.push('Monthly spending is higher than income');
  renderWarningList(warnings, 'home-warnings', 'No urgent warnings right now.');
}

function updateProfile() {
  syncProfileFormToState();
  updateAuthDisplay();
  if ($('prof-tasks')) $('prof-tasks').textContent = state.todos.filter(todo => todo.done).length;
  if ($('prof-habits')) $('prof-habits').textContent = state.habits.reduce((sum, habit) => sum + habit.streak, 0);
  if ($('prof-notes')) $('prof-notes').textContent = state.notes.length;
  if ($('prof-focus')) $('prof-focus').textContent = state.focus.minutes;
}

function getBackupPayload() {
  return {
    exportedAt: new Date().toISOString(),
    user: state.auth.currentUserEmail,
    data: exportAppData(),
  };
}

function exportData() {
  const blob = new Blob([JSON.stringify(getBackupPayload(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `pixel-backup-${todayKey()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast('Backup exported.', '💾');
}

function openImportDialog() {
  $('import-data-input')?.click();
}

function isImportValid(payload) {
  const data = payload?.data || payload;
  return data && typeof data === 'object'
    && Array.isArray(data.transactions)
    && Array.isArray(data.todos)
    && Array.isArray(data.notes)
    && Array.isArray(data.events)
    && Array.isArray(data.habits)
    && Array.isArray(data.goals)
    && Array.isArray(data.moods)
    && Array.isArray(data.shopItems);
}

function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(String(reader.result || '{}'));
      if (!isImportValid(payload)) {
        showToast('That backup file is not valid.', '⚠️');
        return;
      }
      if (!confirm('Importing this backup will overwrite your current saved data. Continue?')) return;
      applyData(payload.data || payload);
      state.profile.email = state.auth.currentUserEmail || state.profile.email;
      saveState();
      populateProfileForm();
      renderEverything();
      showToast('Backup restored successfully.', '📥');
    } catch (error) {
      showToast('Could not read that backup file.', '⚠️');
    } finally {
      event.target.value = '';
    }
  };
  reader.readAsText(file);
}

function renderEverything() {
  renderTodoListSelect();
  renderTodoListNav();
  renderTransactions();
  renderCalendar();
  renderTodos();
  renderNotes();
  renderHabits();
  renderGoals();
  renderFocusTasks();
  renderMoodLog();
  renderMoodStats();
  renderShopList();
  updateProfile();
  updateHome();
  updatePetDisplay();
  updateTransactionFormUi();
  updateTodoFormUi();
  updateShopFormUi();
  updateAuthDisplay();
  if ($('focus-sessions-done')) $('focus-sessions-done').textContent = state.focus.todaySessions || 0;
  if ($('focus-mins-done')) $('focus-mins-done').textContent = state.focus.todayMinutes || 0;
}

function enhanceLoginUi() {
  const form = $('login-form');
  if (!form || $('login-name-group')) return;
  const emailInput = $('login-email');
  const passwordInput = $('login-password');
  const firstGroup = emailInput?.closest('.f-group');
  const passwordGroup = passwordInput?.closest('.f-group');
  if (firstGroup) {
    const group = document.createElement('div');
    group.className = 'f-group';
    group.id = 'login-name-group';
    group.innerHTML = '<label class="f-label" for="login-name">Name</label><input class="f-input login-input" id="login-name" type="text" placeholder="Your name">';
    form.insertBefore(group, firstGroup);
  }
  if (passwordGroup && !$('login-password-toggle')) {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'btn btn-secondary btn-sm';
    toggle.id = 'login-password-toggle';
    toggle.textContent = 'Show Password';
    toggle.onclick = togglePasswordVisibility;
    passwordGroup.appendChild(toggle);
  }
  if (!$('auth-mode-toggle')) {
    const footer = document.createElement('div');
    footer.className = 'login-row';
    footer.innerHTML = '<span id="auth-mode-copy">Need an account?</span>';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-secondary btn-sm';
    button.id = 'auth-mode-toggle';
    button.onclick = toggleAuthMode;
    footer.appendChild(button);
    form.appendChild(footer);
  }
}

function enhanceTopNavUi() {
  const navRight = document.querySelector('#top-nav .nav-right');
  if (!navRight || $('nav-user-pill')) return;
  const userPill = document.createElement('div');
  userPill.className = 'mood-badge';
  userPill.id = 'nav-user-pill';
  userPill.textContent = '👤 Guest';
  const logoutButton = document.createElement('button');
  logoutButton.className = 'btn btn-secondary btn-sm';
  logoutButton.id = 'logout-btn';
  logoutButton.textContent = 'Logout';
  logoutButton.onclick = logout;
  navRight.appendChild(userPill);
  navRight.appendChild(logoutButton);
}

function enhanceBudgetUi() {
  const table = document.querySelector('.tx-table');
  const header = table?.firstElementChild;
  if (!header || $('budget-search')) return;
  const tools = document.createElement('div');
  tools.className = 'budget-tools';

  const search = document.createElement('input');
  search.className = 'f-input';
  search.id = 'budget-search';
  search.placeholder = 'Search description';
  search.addEventListener('input', () => {
    state.filters.budgetSearch = search.value.trim();
    renderTransactions();
  });

  const category = document.createElement('select');
  category.className = 'f-input';
  category.id = 'budget-category-filter';
  const categories = Array.from($('tx-cat').options).map(option => option.value);
  category.innerHTML = `<option value="all">All Categories</option>${categories.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('')}`;
  category.addEventListener('change', () => {
    state.filters.budgetCategory = category.value;
    renderTransactions();
  });

  const date = document.createElement('input');
  date.className = 'f-input';
  date.id = 'budget-date-filter';
  date.type = 'date';
  date.addEventListener('input', () => {
    state.filters.budgetDate = date.value;
    renderTransactions();
  });

  tools.append(search, category, date);
  table.insertBefore(tools, table.children[1]);

  const submitButton = document.querySelector('.add-tx-body .btn.btn-primary.w-full');
  if (submitButton) submitButton.id = 'tx-submit-btn';
  if (!$('tx-cancel-btn') && submitButton?.parentElement) {
    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'btn btn-secondary w-full btn-sm';
    cancel.id = 'tx-cancel-btn';
    cancel.textContent = 'Cancel Edit';
    cancel.style.display = 'none';
    cancel.onclick = resetTransactionForm;
    submitButton.parentElement.appendChild(cancel);
  }
  setTxType('expense');
  updateTransactionFormUi();
}

function enhanceCalendarUi() {
  const panel = $('events-panel');
  if (!panel || $('calendar-event-search')) return;
  const searchWrap = document.createElement('div');
  searchWrap.className = 'calendar-tools';
  searchWrap.innerHTML = '<input class="f-input" id="calendar-event-search" type="search" placeholder="Search events">';
  panel.parentElement.insertBefore(searchWrap, panel);
  $('calendar-event-search').addEventListener('input', event => {
    state.filters.calendarSearch = event.target.value.trim();
    renderEvents(state.selectedDate);
  });
}

function enhanceTodoUi() {
  const addRow = document.querySelector('.todo-add-row');
  const header = document.querySelector('.todo-main');
  if (!addRow || $('todo-search')) return;

  const tools = document.createElement('div');
  tools.className = 'todo-tools';
  tools.innerHTML = `
    <input class="f-input" id="todo-search" type="search" placeholder="Search tasks">
    <select class="f-input" id="todo-status-filter">
      <option value="all">All Statuses</option>
      <option value="today">Today</option>
      <option value="upcoming">Upcoming</option>
      <option value="overdue">Overdue</option>
      <option value="completed">Completed</option>
    </select>
    <select class="f-input" id="todo-priority-filter">
      <option value="all">All Priorities</option>
      <option value="high">High</option>
      <option value="medium">Medium</option>
      <option value="low">Low</option>
    </select>
  `;
  header.insertBefore(tools, addRow);

  $('todo-search').addEventListener('input', event => {
    state.filters.todoSearch = event.target.value.trim();
    renderTodos();
  });
  $('todo-status-filter').addEventListener('change', event => {
    state.filters.todoStatus = event.target.value;
    renderTodos();
  });
  $('todo-priority-filter').addEventListener('change', event => {
    state.filters.todoPriority = event.target.value;
    renderTodos();
  });

  const dueDate = document.createElement('input');
  dueDate.className = 'f-input';
  dueDate.id = 'todo-due-date';
  dueDate.type = 'date';

  const dueTime = document.createElement('input');
  dueTime.className = 'f-input';
  dueTime.id = 'todo-due-time';
  dueTime.type = 'time';

  const reminder = document.createElement('label');
  reminder.className = 'inline-check';
  reminder.innerHTML = '<input id="todo-reminder" type="checkbox"> Remind me';

  const addButton = addRow.querySelector('.btn.btn-primary.btn-sm');
  if (addButton) addButton.id = 'todo-submit-btn';
  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.className = 'btn btn-secondary btn-sm';
  cancelButton.id = 'todo-cancel-btn';
  cancelButton.textContent = 'Cancel';
  cancelButton.style.display = 'none';
  cancelButton.onclick = resetTodoForm;

  addRow.append(dueDate, dueTime, reminder, cancelButton);
  $('todo-reminder').addEventListener('change', event => {
    if (event.target.checked) requestReminderPermissionIfNeeded();
  });
  state.filters.todoList = 'All';
  updateTodoFormUi();
}

function enhanceShoppingUi() {
  const list = document.querySelector('.shop-list');
  if (!list || $('shop-search')) return;
  const toolbar = document.createElement('div');
  toolbar.className = 'shop-toolbar';
  toolbar.innerHTML = `
    <input class="f-input" id="shop-search" type="search" placeholder="Search shopping items">
    <select class="f-input" id="shop-status-filter">
      <option value="all">All Items</option>
      <option value="pending">Pending</option>
      <option value="bought">Bought</option>
    </select>
  `;
  list.insertBefore(toolbar, list.firstElementChild.nextElementSibling);
  $('shop-search').addEventListener('input', event => {
    state.filters.shopSearch = event.target.value.trim();
    renderShopList();
  });
  $('shop-status-filter').addEventListener('change', event => {
    state.filters.shopStatus = event.target.value;
    renderShopList();
  });

  const addButton = document.querySelector('.shop-add-row .btn.btn-primary.btn-sm');
  if (addButton) addButton.id = 'shop-submit-btn';
  if (!$('shop-cancel-btn') && addButton?.parentElement) {
    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'btn btn-secondary btn-sm';
    cancel.id = 'shop-cancel-btn';
    cancel.textContent = 'Cancel';
    cancel.style.display = 'none';
    cancel.onclick = resetShopForm;
    addButton.parentElement.appendChild(cancel);
  }
  updateShopFormUi();
}

function enhanceProfileUi() {
  const profileCard = document.querySelector('#p-profile .settings-card:last-child');
  if (!profileCard || $('prof-email')) return;
  const emailGroup = document.createElement('div');
  emailGroup.className = 'f-group';
  emailGroup.innerHTML = '<label class="f-label">Email</label><input class="f-input" id="prof-email" readonly>';
  profileCard.insertBefore(emailGroup, profileCard.children[1]);

  const appearanceCard = document.createElement('div');
  appearanceCard.className = 'settings-card';
  appearanceCard.innerHTML = `
    <div class="fw8" style="font-size:15px;margin-bottom:14px;">🎨 Theme & Accent</div>
    <div class="f-group">
      <label class="f-label">Theme</label>
      <select class="f-input" id="theme-select">
        <option value="dark">Dark Theme</option>
        <option value="light">Light Theme</option>
      </select>
    </div>
    <div class="f-group">
      <label class="f-label">Accent Color</label>
      <div class="accent-picker">
        <button type="button" class="accent-swatch" data-accent="violet" style="--swatch:#8b5cf6" onclick="setAccent('violet')" aria-label="Violet accent"></button>
        <button type="button" class="accent-swatch" data-accent="coral" style="--swatch:#fb7185" onclick="setAccent('coral')" aria-label="Coral accent"></button>
        <button type="button" class="accent-swatch" data-accent="sky" style="--swatch:#38bdf8" onclick="setAccent('sky')" aria-label="Sky accent"></button>
        <button type="button" class="accent-swatch" data-accent="mint" style="--swatch:#34d399" onclick="setAccent('mint')" aria-label="Mint accent"></button>
      </div>
    </div>
  `;
  const layout = document.querySelector('#p-profile .profile-layout > div:last-child');
  layout.insertBefore(appearanceCard, profileCard);
  appearanceCard.querySelector('#theme-select').addEventListener('change', event => setTheme(event.target.value));

  const actionRow = document.createElement('div');
  actionRow.className = 'profile-actions';
  actionRow.innerHTML = `
    <button class="btn btn-secondary btn-sm" type="button" onclick="exportData()">Export Data</button>
    <button class="btn btn-secondary btn-sm" type="button" onclick="openImportDialog()">Import Data</button>
    <button class="btn btn-secondary btn-sm" type="button" onclick="logout()">Logout</button>
  `;
  profileCard.appendChild(actionRow);

  const importInput = document.createElement('input');
  importInput.type = 'file';
  importInput.accept = 'application/json';
  importInput.id = 'import-data-input';
  importInput.style.display = 'none';
  importInput.addEventListener('change', importData);
  profileCard.appendChild(importInput);
}

function enhanceHomeUi() {
  const summaryCol = document.querySelector('.summary-col');
  const quickActions = summaryCol?.querySelector('.fade-in:last-child');
  if (!summaryCol || $('home-events')) return;

  const eventCard = document.createElement('div');
  eventCard.className = 'card fade-in';
  eventCard.innerHTML = '<div class="sc-head"><span class="sc-head-title">📅 Upcoming Events</span></div><div id="home-events" class="stack-list"></div>';

  const insightCard = document.createElement('div');
  insightCard.className = 'card fade-in';
  insightCard.innerHTML = '<div class="sc-head"><span class="sc-head-title">🧠 Daily Intelligence</span></div><div id="home-insights" class="stack-list"></div>';

  const warningCard = document.createElement('div');
  warningCard.className = 'card fade-in';
  warningCard.innerHTML = '<div class="sc-head"><span class="sc-head-title">⚠️ Warnings</span></div><div id="home-warnings" class="stack-list"></div>';

  summaryCol.insertBefore(eventCard, quickActions);
  summaryCol.insertBefore(insightCard, quickActions);
  summaryCol.insertBefore(warningCard, quickActions);
}

function markInitialChat() {
  clearElement($('chat-messages'));
  appendChatMessage("Woof! I'm Pixel, your personal assistant. I can help with budget, calendar, tasks, ideas, habits, shopping, and your day-to-day planning.", 'pixel');
}

function hydrateDomState() {
  if ($('tx-date')) $('tx-date').value = $('tx-date').value || todayKey();
  if ($('ev-date')) $('ev-date').value = $('ev-date').value || todayKey();
  populateProfileForm();
  renderSettings();
  applyThemeSettings();
  renderTodoListSelect();
  renderTodoListNav();
  updateTransactionFormUi();
  updateTodoFormUi();
  updateShopFormUi();
}

function toggleHabitDay(id) {
  const habit = state.habits.find(item => item.id === id);
  if (!habit) return;
  const today = todayKey();
  const todayIndex = new Date().getDay();
  if (habit.doneToday) {
    habit.doneToday = false;
    habit.lastCompletedOn = '';
    habit.days[todayIndex] = false;
    habit.streak = Math.max(0, habit.streak - 1);
    saveState();
  } else {
    habit.doneToday = true;
    habit.lastCompletedOn = today;
    habit.days[todayIndex] = true;
    habit.streak += 1;
    petReact('habitDone');
  }
  renderHabits();
  updateHome();
}

function updateGoalProgress(id) {
  const goal = state.goals.find(item => item.id === id);
  if (!goal) return;
  const value = Number(prompt(`Update progress for ${goal.name}:`, goal.progress));
  if (Number.isNaN(value)) return;
  goal.progress = Math.min(goal.target, Math.max(0, value));
  if (goal.progress >= goal.target) {
    showToast('Goal complete. Amazing work!', '🏆');
  }
  petReact('goalProgress');
  renderGoals();
}

function startTimer() {
  if (state.timerRunning) return;
  state.timerRunning = true;
  const focusMinutes = Number($('focus-duration')?.value) || 25;
  const breakMinutes = Number($('break-duration')?.value) || 5;
  if (state.timerPhase === 'focus' && state.timerSeconds === state.timerTotal) {
    state.timerSeconds = focusMinutes * 60;
    state.timerTotal = focusMinutes * 60;
  }
  buildPomDots();
  state.timerInterval = setInterval(() => {
    state.timerSeconds -= 1;
    updateTimerDisplay();
    if (state.timerSeconds > 0) return;
    clearInterval(state.timerInterval);
    state.timerRunning = false;
    if (state.timerPhase === 'focus') {
      state.pomDone += 1;
      normalizeFocusDaily();
      state.focus.sessions += 1;
      state.focus.minutes += focusMinutes;
      state.focus.todaySessions += 1;
      state.focus.todayMinutes += focusMinutes;
      if ($('focus-sessions-done')) $('focus-sessions-done').textContent = state.focus.todaySessions;
      if ($('focus-mins-done')) $('focus-mins-done').textContent = state.focus.todayMinutes;
      state.timerPhase = 'break';
      state.timerSeconds = breakMinutes * 60;
      state.timerTotal = breakMinutes * 60;
      if ($('timer-phase')) $('timer-phase').textContent = 'Break Time';
      petReact('focusComplete');
    } else {
      state.timerPhase = 'focus';
      state.timerSeconds = focusMinutes * 60;
      state.timerTotal = focusMinutes * 60;
      if ($('timer-phase')) $('timer-phase').textContent = 'Focus Session';
      showToast('Break over. Ready to focus?', '⏱️');
      saveState();
    }
    updateTimerDisplay();
    updateHome();
  }, 1000);
}

function logMood() {
  if (!state.selectedMood) {
    showToast('Pick a mood first.', '😊');
    return;
  }
  const note = $('mood-note-input').value.trim();
  state.moods.unshift({
    id: Date.now(),
    mood: state.selectedMood,
    emoji: MOOD_EMOJIS[state.selectedMood] || '😊',
    note,
    date: todayKey(),
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  });
  $('mood-note-input').value = '';
  state.selectedMood = null;
  document.querySelectorAll('.mood-emoji-btn').forEach(item => item.classList.remove('selected'));
  petReact('moodLogged');
  renderMoodLog();
  renderMoodStats();
  updateHome();
}

function toggleShopItem(id) {
  const item = state.shopItems.find(entry => entry.id === id);
  if (!item) return;
  item.bought = !item.bought;
  if (item.bought) {
    petReact('shoppingDone');
  } else {
    saveState();
  }
  renderShopList();
}

function toggleTodo(id) {
  const todo = state.todos.find(item => item.id === id);
  if (!todo) return;
  todo.done = !todo.done;
  if (todo.done) {
    petReact('taskDone');
  } else {
    saveState();
  }
  renderTodos();
  renderFocusTasks();
  updateHome();
}

document.addEventListener('DOMContentLoaded', () => {
  enhanceLoginUi();
  enhanceTopNavUi();
  enhanceBudgetUi();
  enhanceCalendarUi();
  enhanceTodoUi();
  enhanceShoppingUi();
  enhanceProfileUi();
  enhanceHomeUi();

  markInitialChat();
  const hasSession = loadState();
  hydrateDomState();
  saveState();
  resetEventForm();
  resetNoteForm();
  resetHabitForm();
  resetGoalForm();
  resetTransactionForm();
  resetTodoForm();
  resetShopForm();
  updateTimerDisplay();
  buildPomDots();
  renderEverything();
  maybeSendTaskReminders();
  setInterval(maybeSendTaskReminders, 60000);

  if (hasSession) {
    enterApp();
  } else {
    showLoginPage();
    if ($('login-email')) $('login-email').focus();
  }
});
