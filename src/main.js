/**
 * Pudding Notes 🍮 — Apple Style Notes & Checklist
 * Unique Signature Features:
 * 1. Pudding Mood Flavors (Caramel, Matcha, Berry, Choco)
 * 2. Pudding Bounce Physics & Bubble Audio
 * 3. Focus / Zen Writing Mode
 * 4. Circular Progress Ring & Confetti Celebration
 */

// =============================================================================
// 1. SOUND FX (Apple Haptic + Pudding Bubble Synthesizer via Web Audio API)
// =============================================================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('inotes_sound') !== 'false';
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPop(freq = 900, duration = 0.04) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {}
  }

  playCheck() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      // Soft pudding bubble drop sound
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {}
  }

  playCelebration() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      // Arpeggiated cheerful chime: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + i * 0.08;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.05, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch {}
  }
}

const sfx = new SoundFX();

// =============================================================================
// 2. INITIAL SEED DATA
// =============================================================================
const DEFAULT_FOLDERS = [
  { id: 'notes', name: 'Catatan', icon: '📁', isDefault: true }
];

const INITIAL_NOTES = [
  {
    id: 'note-1',
    title: 'Selamat Datang di Pudding Notes 🍮✨',
    body: '<div><mark class="pudding-stabilo hl-yellow">Pudding Notes</mark> kini dilengkapi fitur jurnal buku &amp; scrapbook estetik:</div><br><div>1. <b>Hias dengan Stabilo</b>: Sorot kalimat apa saja lalu tekan tombol <mark class="pudding-stabilo hl-green">🖍️ Stabilo</mark> untuk memberi warna pastel lembut!</div><div>2. <b>Bisa Nambah Foto &amp; Stiker</b>: Tekan <mark class="pudding-stabilo hl-pink">📸 Foto</mark> atau <mark class="pudding-stabilo hl-pink">🍮 Stiker</mark> untuk tempel dekorasi estetik!</div><div>3. <b>Bisa Diputer-puter Bebas</b>: Geser knob putar <mark class="pudding-stabilo hl-orange">🔄 360 derajat</mark> di atas stiker untuk memiringkan arahnya!</div><div>4. <b>Kostum Buku &amp; Tekstur Kertas</b>: Klik tombol <mark class="pudding-stabilo hl-blue">📔 Kostum Buku</mark> untuk ganti sampul Spiral Ring, Diary Kulit, atau Scrapbook!</div>',
    folder: 'notes',
    pinned: true,
    bookStyle: {
      cover: 'spiral',
      paper: 'lined',
      ribbon: 'caramel'
    },
    stickers: [
      {
        id: 'stk_demo_1',
        title: 'Pudding Custard',
        caption: 'Pudding Time 🍮',
        src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><path d="M22 68 Q18 42 30 32 Q50 24 70 32 Q82 42 78 68 Q80 78 50 82 Q20 78 22 68 Z" fill="#fde047" stroke="#ca8a04" stroke-width="2.5"/><path d="M30 32 Q50 24 70 32 Q66 45 60 46 Q54 38 46 48 Q38 44 30 32 Z" fill="#b45309"/><ellipse cx="50" cy="27" rx="6" ry="6" fill="#ef4444"/><circle cx="43" cy="54" r="2.5" fill="#1e293b"/><circle cx="57" cy="54" r="2.5" fill="#1e293b"/><ellipse cx="38" cy="60" rx="3" ry="1.5" fill="#f472b6"/><ellipse cx="62" cy="60" rx="3" ry="1.5" fill="#f472b6"/><path d="M47 62 Q50 65 53 62" stroke="#1e293b" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'),
        style: 'polaroid',
        x: 630,
        y: 320,
        width: 125,
        height: 145,
        rotation: 4,
        zIndex: 10
      }
    ],
    checklist: [
      { id: 'c1', text: 'Coba putar stiker polaroid di pojok kanan dengan handle putar 🔄', done: true },
      { id: 'c2', text: 'Sorot teks lalu beri warna dengan tombol 🖍️ Stabilo', done: false },
      { id: 'c3', text: 'Klik tombol 📔 Kostum Buku untuk ganti cover & garis kertas', done: false },
      { id: 'c4', text: 'Klik 📸 Foto atau 🍮 Stiker untuk dekorasi catatanmu', done: false }
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    updatedAt: Date.now() - 1000 * 60 * 10
  },
  {
    id: 'note-2',
    title: 'Rencana Peluncuran Web ke Vercel 🚀',
    body: '<div>Checklist kesiapan deployment ke Vercel untuk aplikasi modern:</div><br><div>1. Pastikan build artifact berjalan tanpa warning.</div><div>2. Uji responsivitas di layar iPhone &amp; tablet.</div><div>3. Cek kembali kontras warna dan tipografi.</div>',
    folder: 'notes',
    pinned: true,
    bookStyle: {
      cover: 'diary',
      paper: 'grid',
      ribbon: 'ruby'
    },
    stickers: [],
    checklist: [
      { id: 'c5', text: 'Setup file vercel.json untuk routing statis Vite', done: true },
      { id: 'c6', text: 'Testing performa & SEO', done: true },
      { id: 'c7', text: 'Jalankan npx vercel untuk deploy instan', done: false }
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
    updatedAt: Date.now() - 1000 * 60 * 60 * 2
  },
  {
    id: 'note-3',
    title: 'Daftar Belanja Kebutuhan Mingguan 🛒',
    body: '<div>Bahan-bahan kopi dan camilan untuk workspace meja kerja:</div>',
    folder: 'notes',
    pinned: false,
    bookStyle: {
      cover: 'scrapbook',
      paper: 'kraft',
      ribbon: 'none'
    },
    stickers: [],
    checklist: [
      { id: 'c8', text: 'Biji Kopi Arabika Specialty 250g', done: false },
      { id: 'c9', text: 'Oat Milk Barista Edition', done: true },
      { id: 'c10', text: 'Almond panggang premium', done: false }
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24
  }
];

// =============================================================================
// 3. APPLICATION STATE
// =============================================================================
class AppState {
  constructor() {
    this.folders = this.loadFolders();
    this.notes = this.loadNotes();
    this.activeNoteId = this.notes[0]?.id || null;
    this.currentFolder = 'all';
    this.smartFilter = 'all';
    this.searchQuery = '';
    this.sortBy = localStorage.getItem('inotes_sort') || 'updated';
    this.theme = localStorage.getItem('inotes_theme') || 'dark';
    this.flavor = localStorage.getItem('pudding_flavor') || 'caramel';
    this.isZenMode = false;
    this.saveTimeout = null;
    
    // Undo buffer
    this.lastDeleted = null;
    this.toastTimeout = null;
  }

  loadFolders() {
    const raw = localStorage.getItem('inotes_folders');
    if (raw) {
      try {
        let list = JSON.parse(raw);
        list = list.filter(f => f.id !== 'all' && f.id !== 'work' && f.id !== 'personal' && f.id !== 'ideas');
        const hasNotes = list.some(f => f.id === 'notes');
        if (!hasNotes) {
          list.unshift({ id: 'notes', name: 'Catatan', icon: '📁', isDefault: true });
        }
        return list;
      } catch {
        return DEFAULT_FOLDERS;
      }
    }
    return DEFAULT_FOLDERS;
  }

  saveFolders() {
    localStorage.setItem('inotes_folders', JSON.stringify(this.folders));
  }

  loadNotes() {
    const raw = localStorage.getItem('inotes_data');
    if (raw) {
      try {
        const notes = JSON.parse(raw);
        notes.forEach(n => {
          if (!n.folder || n.folder === 'all' || n.folder === 'work' || n.folder === 'personal' || n.folder === 'ideas') {
            n.folder = 'notes';
          }
          if (!n.bookStyle) {
            n.bookStyle = { cover: 'spiral', paper: 'lined', ribbon: 'caramel' };
          }
          if (!n.stickers) {
            n.stickers = [];
          }
          // Ensure first note has neat, pristine demo stickers and text
          if (n.id === 'note-1') {
            if (!n.stickers || n.stickers.length === 0 || n.stickers.length > 1 || n.stickers[0].y < 200) {
              n.stickers = JSON.parse(JSON.stringify(INITIAL_NOTES[0].stickers));
            }
            // Clean up any fragmented test text from automated tests
            if (n.body && (n.body.includes('>Pu</') || n.body.includes('Pu <') || n.body.includes('Pu dding') || n.body.includes('kini di<'))) {
              n.body = INITIAL_NOTES[0].body;
            }
          }
        });
        return notes;
      } catch {
        return INITIAL_NOTES;
      }
    }
    return INITIAL_NOTES;
  }

  saveNotes() {
    localStorage.setItem('inotes_data', JSON.stringify(this.notes));
  }

  getActiveNote() {
    return this.notes.find(n => n.id === this.activeNoteId) || null;
  }

  getFilteredNotes() {
    let filtered = this.notes.filter(note => {
      if (this.smartFilter === 'pinned' && !note.pinned) return false;
      if (this.smartFilter === 'todo' && (!note.checklist || note.checklist.length === 0)) return false;

      // When smart filter is 'all', apply folder filter if not viewing 'all'
      if (this.smartFilter === 'all' && this.currentFolder !== 'all' && note.folder !== this.currentFolder) {
        return false;
      }

      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        const inTitle = (note.title || '').toLowerCase().includes(q);
        const inBody = (note.body || '').toLowerCase().includes(q);
        const inChecklist = (note.checklist || []).some(c => c.text.toLowerCase().includes(q));
        if (!inTitle && !inBody && !inChecklist) return false;
      }

      return true;
    });

    filtered.sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
      if (this.sortBy === 'created') {
        return (b.createdAt || 0) - (a.createdAt || 0);
      } else if (this.sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      } else {
        return (b.updatedAt || 0) - (a.updatedAt || 0);
      }
    });

    return filtered;
  }
}

const state = new AppState();

// =============================================================================
// 4. DOM ELEMENTS
// =============================================================================
const appContainer = document.getElementById('app');
const splitView = document.getElementById('splitView');
const sidebar = document.getElementById('sidebar');
const folderList = document.getElementById('folderList');
const smartFilterList = document.getElementById('smartFilterList');
const badgeAllCount = document.getElementById('badgeAllCount');
const badgePinnedCount = document.getElementById('badgePinnedCount');
const badgeTodoCount = document.getElementById('badgeTodoCount');
const flavorPicker = document.getElementById('flavorPicker');

const btnOpenNewFolderModal = document.getElementById('btnOpenNewFolderModal');
const btnNewFolderInline = document.getElementById('btnNewFolderInline');
const btnToggleSidebar = document.getElementById('btnToggleSidebar');
const btnToggleTheme = document.getElementById('btnToggleTheme');
const themeLabel = document.getElementById('themeLabel');
const btnToggleSound = document.getElementById('btnToggleSound');
const soundLabel = document.getElementById('soundLabel');
const currentFolderTitle = document.getElementById('currentFolderTitle');
const btnNewNote = document.getElementById('btnNewNote');
const searchInput = document.getElementById('searchInput');
const btnClearSearch = document.getElementById('btnClearSearch');
const notesCountMeta = document.getElementById('notesCountMeta');
const sortSelect = document.getElementById('sortSelect');
const notesListContainer = document.getElementById('notesListContainer');

// Editor Elements
const btnMobileBack = document.getElementById('btnMobileBack');
const btnBookBack = document.getElementById('btnBookBack');
const btnTogglePanels = document.getElementById('btnTogglePanels');
const btnSaveNote = document.getElementById('btnSaveNote');
const saveBtnText = document.getElementById('saveBtnText');
const saveStatus = document.getElementById('saveStatus');
const editorToolbar = document.getElementById('editorToolbar');
const btnToggleZen = document.getElementById('btnToggleZen');
const btnExitZen = document.getElementById('btnExitZen');
const btnPinNote = document.getElementById('btnPinNote');
const btnExportNote = document.getElementById('btnExportNote');
const btnDeleteCurrentNote = document.getElementById('btnDeleteCurrentNote');
const noteDateMeta = document.getElementById('noteDateMeta');
const noteWordsMeta = document.getElementById('noteWordsMeta');
const noteFolderSelect = document.getElementById('noteFolderSelect');
const noteTitleInput = document.getElementById('noteTitleInput');

// Canvas & Book Costume Elements
const editorContentWrap = document.getElementById('editorContentWrap');
const editorDocCanvas = document.getElementById('editorDocCanvas');
const bookRibbon = document.getElementById('bookRibbon');
const scrapbookStage = document.getElementById('scrapbookStage');

// Stabilo Highlighter Elements
const stabiloToolWrap = document.getElementById('stabiloToolWrap');
const btnStabiloToggle = document.getElementById('btnStabiloToggle');
const activeStabiloDot = document.getElementById('activeStabiloDot');
const stabiloPalette = document.getElementById('stabiloPalette');
const btnClearStabilo = document.getElementById('btnClearStabilo');

// Book Costume Side Drawer Elements
const btnOpenBookModal = document.getElementById('btnOpenBookModal');
const bookModal = document.getElementById('bookModal');
const btnBookModalClose = document.getElementById('btnBookModalClose');
const bookCoverGrid = document.getElementById('bookCoverGrid');
const paperPatternGrid = document.getElementById('paperPatternGrid');
const bookRibbonChoices = document.getElementById('bookRibbonChoices');
const btnSaveBookCostume = document.getElementById('btnSaveBookCostume');

// Photo Side Drawer Elements (Terpisah & Buka ke Samping Tanpa Blur)
const btnOpenPhotoDrawer = document.getElementById('btnOpenPhotoDrawer');
const photoDrawer = document.getElementById('photoDrawer');
const btnPhotoDrawerClose = document.getElementById('btnPhotoDrawerClose');
const imageDropzone = document.getElementById('imageDropzone');
const imageFileInput = document.getElementById('imageFileInput');
const imageUrlInput = document.getElementById('imageUrlInput');
const btnLoadImageUrl = document.getElementById('btnLoadImageUrl');
const uploadPreviewArea = document.getElementById('uploadPreviewArea');
const uploadPreviewImg = document.getElementById('uploadPreviewImg');
const previewCaptionText = document.getElementById('previewCaptionText');
const imageCaptionInput = document.getElementById('imageCaptionInput');
const photoStyleSelector = document.getElementById('photoStyleSelector');
const btnConfirmAddImage = document.getElementById('btnConfirmAddImage');

// Sticker Side Drawer Elements (Terpisah & Buka ke Samping Tanpa Blur)
const btnOpenStickerDrawer = document.getElementById('btnOpenStickerDrawer');
const stickerDrawer = document.getElementById('stickerDrawer');
const btnStickerDrawerClose = document.getElementById('btnStickerDrawerClose');
const btnStickerDrawerDone = document.getElementById('btnStickerDrawerDone');
const stickersGrid = document.getElementById('stickersGrid');

// Checklist Elements
const checklistSection = document.getElementById('checklistSection');
const progressRingCircle = document.getElementById('progressRingCircle');
const puddingProgressBar = document.getElementById('puddingProgressBar');
const checklistProgressBadge = document.getElementById('checklistProgressBadge');
const btnAddCheckItem = document.getElementById('btnAddCheckItem');
const checklistItemsList = document.getElementById('checklistItemsList');
const noteBodyEditor = document.getElementById('noteBodyEditor');
const puddingConfetti = document.getElementById('puddingConfetti');

// Folder Modal Elements
const folderModal = document.getElementById('folderModal');
const btnFolderModalClose = document.getElementById('btnFolderModalClose');
const newFolderNameInput = document.getElementById('newFolderNameInput');
const emojiPickerRow = document.getElementById('emojiPickerRow');
const btnCancelFolder = document.getElementById('btnCancelFolder');
const btnConfirmFolder = document.getElementById('btnConfirmFolder');
let selectedEmoji = '📁';

// Apple Alert Confirm Modal
const confirmModal = document.getElementById('confirmModal');
const alertIcon = document.getElementById('alertIcon');
const alertTitle = document.getElementById('alertTitle');
const alertMessage = document.getElementById('alertMessage');
const btnAlertConfirm = document.getElementById('btnAlertConfirm');
const btnAlertCancel = document.getElementById('btnAlertCancel');
let onConfirmCallback = null;

// Export Modal
const exportModal = document.getElementById('exportModal');
const btnModalClose = document.getElementById('btnModalClose');
const btnCopyMarkdown = document.getElementById('btnCopyMarkdown');
const btnDownloadMd = document.getElementById('btnDownloadMd');
const btnPrintNote = document.getElementById('btnPrintNote');

// Toast with Undo
const appleToast = document.getElementById('appleToast');
const toastMessage = document.getElementById('toastMessage');
const toastUndoBtn = document.getElementById('toastUndoBtn');

// =============================================================================
// 5. SIGNATURE FEATURES: FLAVORS, ZEN MODE, CONFETTI
// =============================================================================

// 1. PUDDING FLAVOR THEME SWITCHER
function applyFlavor(flavor) {
  state.flavor = flavor;
  document.documentElement.setAttribute('data-flavor', flavor);
  localStorage.setItem('pudding_flavor', flavor);

  flavorPicker.querySelectorAll('.flavor-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.flavor === flavor);
  });
}

flavorPicker.addEventListener('click', (e) => {
  const btn = e.target.closest('.flavor-pill');
  if (!btn) return;
  const flavor = btn.dataset.flavor;
  applyFlavor(flavor);
  sfx.playPop(1050, 0.04);
  showToast(`Rasa ${btn.textContent} diaktifkan! ✨`);
});

// 2. FOCUS / ZEN WRITING MODE
function toggleZenMode() {
  state.isZenMode = !state.isZenMode;
  appContainer.classList.toggle('zen-mode', state.isZenMode);
  btnToggleZen.classList.toggle('active', state.isZenMode);
  sfx.playPop(state.isZenMode ? 1100 : 700, 0.05);

  if (state.isZenMode) {
    showToast('Focus / Zen Mode Aktif 🧘 (Tekan Esc untuk keluar)');
  }
}

btnToggleZen.addEventListener('click', toggleZenMode);
btnExitZen.addEventListener('click', toggleZenMode);

// 3. CONFETTI CELEBRATION BURST
function triggerConfettiBurst() {
  puddingConfetti.innerHTML = '';
  const colors = ['#f5a623', '#32d74b', '#ff453a', '#5e5ce6', '#ffd60a', '#ff375f'];

  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-particle';
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = 30 + Math.random() * 40; // Center burst around editor
    const delay = Math.random() * 0.3;
    const duration = 1 + Math.random() * 0.8;

    p.style.backgroundColor = color;
    p.style.left = left + '%';
    p.style.top = '30%';
    p.style.animationDelay = delay + 's';
    p.style.animationDuration = duration + 's';
    p.style.transform = `scale(${0.6 + Math.random() * 0.8})`;

    puddingConfetti.appendChild(p);
  }

  sfx.playCelebration();

  setTimeout(() => {
    puddingConfetti.innerHTML = '';
  }, 2200);
}

// =============================================================================
// 6. TOAST & APPLE ALERT DIALOG
// =============================================================================

function showToast(msg, withUndo = false) {
  clearTimeout(state.toastTimeout);
  toastMessage.textContent = msg;

  if (withUndo && state.lastDeleted) {
    toastUndoBtn.classList.add('active');
  } else {
    toastUndoBtn.classList.remove('active');
  }

  appleToast.classList.add('show');
  sfx.playPop(1200, 0.05);

  state.toastTimeout = setTimeout(() => {
    appleToast.classList.remove('show');
    toastUndoBtn.classList.remove('active');
  }, 4500);
}

toastUndoBtn.addEventListener('click', () => {
  if (state.lastDeleted) {
    const { note, index } = state.lastDeleted;
    state.notes.splice(Math.min(index, state.notes.length), 0, note);
    state.activeNoteId = note.id;
    state.lastDeleted = null;
    state.saveNotes();
    sfx.playCheck();
    renderSidebar();
    renderNotesList();
    renderEditor();
    showToast('Catatan dipulihkan! ↩️', false);
  }
});

function showAppleAlert({ icon = '🗑️', title, message, confirmText = 'Hapus', onConfirm }) {
  alertIcon.textContent = icon;
  alertTitle.textContent = title;
  alertMessage.textContent = message;
  btnAlertConfirm.textContent = confirmText;
  onConfirmCallback = onConfirm;
  confirmModal.classList.add('open');
  sfx.playPop(600, 0.05);
}

btnAlertCancel.addEventListener('click', () => {
  confirmModal.classList.remove('open');
  onConfirmCallback = null;
});

btnAlertConfirm.addEventListener('click', () => {
  confirmModal.classList.remove('open');
  if (onConfirmCallback) {
    onConfirmCallback();
    onConfirmCallback = null;
  }
});

confirmModal.addEventListener('click', (e) => {
  if (e.target === confirmModal) {
    confirmModal.classList.remove('open');
    onConfirmCallback = null;
  }
});

// =============================================================================
// 7. RENDER FUNCTIONS
// =============================================================================

function formatDate(timestamp) {
  if (!timestamp) return '—';
  const d = new Date(timestamp);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (isToday) return `Hari ini, ${timeStr}`;
  return `${d.toLocaleDateString([], { day: 'numeric', month: 'short' })}, ${timeStr}`;
}

function renderSidebar() {
  folderList.innerHTML = '';
  
  state.folders.forEach(folder => {
    const count = state.notes.filter(n => n.folder === folder.id).length;

    const btn = document.createElement('button');
    const isFolderActive = state.currentFolder === folder.id && state.smartFilter === 'all';
    btn.className = `folder-item ${isFolderActive ? 'active' : ''}`;

    const canDelete = !folder.isDefault;
    const deleteBtnHtml = canDelete 
      ? `<span class="btn-folder-delete" title="Hapus Projek / Folder">✕</span>` 
      : '';

    btn.innerHTML = `
      <div class="folder-item-left">
        <span>${folder.icon}</span>
        <span class="folder-name-text">${escapeHtml(folder.name)}</span>
      </div>
      <div class="folder-item-right">
        <span class="folder-badge">${count}</span>
        ${deleteBtnHtml}
      </div>
    `;

    btn.addEventListener('click', (e) => {
      // If user clicked delete folder button
      if (e.target.closest('.btn-folder-delete')) {
        e.stopPropagation();
        showAppleAlert({
          icon: '📁',
          title: 'Hapus Folder / Projek?',
          message: `Folder "${folder.name}" akan dihapus. Semua catatan di dalamnya tetap aman dan dipindahkan ke folder "Catatan".`,
          confirmText: 'Hapus Projek',
          onConfirm: () => {
            state.notes.forEach(n => {
              if (n.folder === folder.id) n.folder = 'notes';
            });
            state.folders = state.folders.filter(f => f.id !== folder.id);
            if (state.currentFolder === folder.id) {
              state.currentFolder = 'notes';
              currentFolderTitle.textContent = 'Catatan';
            }
            state.saveFolders();
            state.saveNotes();
            sfx.playPop(500, 0.05);
            renderSidebar();
            renderNotesList();
            renderEditor();
            showToast(`Projek "${folder.name}" dihapus 📂`);
          }
        });
        return;
      }

      sfx.playPop(800, 0.03);
      state.currentFolder = folder.id;
      state.smartFilter = 'all';
      currentFolderTitle.textContent = folder.name;
      renderSidebar();
      renderNotesList();
    });

    folderList.appendChild(btn);
  });

  const allCount = state.notes.length;
  const pinnedCount = state.notes.filter(n => n.pinned).length;
  const todoCount = state.notes.filter(n => n.checklist && n.checklist.length > 0).length;

  badgeAllCount.textContent = allCount;
  badgePinnedCount.textContent = pinnedCount;
  badgeTodoCount.textContent = todoCount;

  smartFilterList.querySelectorAll('.smart-item').forEach(btn => {
    const filter = btn.dataset.filter;
    if (filter === 'all') {
      btn.classList.toggle('active', state.currentFolder === 'all' && state.smartFilter === 'all');
    } else {
      btn.classList.toggle('active', state.smartFilter === filter);
    }
  });

  noteFolderSelect.innerHTML = '';
  state.folders.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.textContent = `${f.icon} ${f.name}`;
    noteFolderSelect.appendChild(opt);
  });
}

smartFilterList.addEventListener('click', (e) => {
  const btn = e.target.closest('.smart-item');
  if (!btn) return;
  sfx.playPop(800, 0.03);
  state.smartFilter = btn.dataset.filter;
  state.currentFolder = 'all';

  if (state.smartFilter === 'pinned') currentFolderTitle.textContent = 'Catatan Disematkan';
  else if (state.smartFilter === 'todo') currentFolderTitle.textContent = 'Catatan Ber-Checklist';
  else currentFolderTitle.textContent = 'Semua Catatan';

  renderSidebar();
  renderNotesList();
});

function renderNotesList() {
  const filtered = state.getFilteredNotes();
  notesCountMeta.textContent = `${filtered.length} Catatan`;

  notesListContainer.innerHTML = '';

  if (filtered.length === 0) {
    notesListContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <div style="font-weight: 600; font-size: 13.5px;">Tidak ada catatan</div>
        <div style="font-size: 11.5px; color: var(--text-tertiary);">Klik "Baru" untuk mulai menulis catatan</div>
      </div>
    `;
    return;
  }

  filtered.forEach(note => {
    const wrapper = document.createElement('div');
    wrapper.className = 'note-card-wrapper';

    const trashAction = document.createElement('div');
    trashAction.className = 'swipe-trash-action';
    trashAction.innerHTML = `<span>Hapus</span>`;

    const card = document.createElement('div');
    card.className = `note-card ${note.id === state.activeNoteId ? 'active' : ''}`;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = note.body || '';
    const plainText = (tempDiv.textContent || tempDiv.innerText || 'Belum ada isi catatan...').trim();

    const totalTodos = note.checklist ? note.checklist.length : 0;
    const doneTodos = note.checklist ? note.checklist.filter(c => c.done).length : 0;
    const todoHtml = totalTodos > 0 
      ? `<span class="card-todo-indicator">☑️ ${doneTodos}/${totalTodos}</span>`
      : '';

    card.innerHTML = `
      <div class="card-header-row">
        <div class="card-title">${escapeHtml(note.title || 'Catatan Baru')}</div>
        <div class="card-quick-actions">
          <button class="card-action-btn card-action-pin ${note.pinned ? 'active' : ''}" title="${note.pinned ? 'Lepas Sematan' : 'Sematkan Catatan'}">📌</button>
          <button class="card-action-btn card-action-delete" title="Hapus Catatan">🗑️</button>
        </div>
      </div>
      <div class="card-snippet">${escapeHtml(plainText)}</div>
      <div class="card-footer-row">
        <span>${formatDate(note.updatedAt)}</span>
        ${todoHtml}
      </div>
    `;

    const btnPinCard = card.querySelector('.card-action-pin');
    btnPinCard.addEventListener('click', (e) => {
      e.stopPropagation();
      note.pinned = !note.pinned;
      sfx.playPop(note.pinned ? 1000 : 700, 0.04);
      state.saveNotes();
      renderSidebar();
      renderNotesList();
      renderEditor();
      showToast(note.pinned ? 'Catatan disematkan 📌' : 'Sematan dilepas');
    });

    const btnDelCard = card.querySelector('.card-action-delete');
    btnDelCard.addEventListener('click', (e) => {
      e.stopPropagation();
      showAppleAlert({
        title: 'Hapus Catatan?',
        message: `Catatan "${note.title || 'Catatan Baru'}" akan dihapus. Anda dapat membatalkannya melalui tombol Batalkan.`,
        onConfirm: () => deleteNote(note.id)
      });
    });

    card.addEventListener('click', () => {
      if (card.dataset.swiped === 'true') return;
      sfx.playPop(750, 0.03);
      state.activeNoteId = note.id;
      renderNotesList();
      renderEditor();

      // Buka catatan secara penuh (Full Book Mode) layaknya buku asli!
      enterFullBookMode();

      if (window.innerWidth <= 680) {
        splitView.classList.add('view-editor');
      }
    });

    trashAction.addEventListener('click', () => {
      deleteNote(note.id);
    });

    setupSwipeGesture(card, wrapper, () => {
      deleteNote(note.id);
    });

    wrapper.appendChild(trashAction);
    wrapper.appendChild(card);
    notesListContainer.appendChild(wrapper);
  });
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function setupSwipeGesture(card, wrapper, onDelete) {
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let pointerId = null;

  card.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || e.target.closest('.card-action-btn')) return;
    startX = e.clientX;
    currentX = startX;
    isDragging = true;
    pointerId = e.pointerId;
    card.setPointerCapture(pointerId);
    card.style.transition = 'none';
  });

  card.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
    const deltaX = currentX - startX;

    if (deltaX < 0) {
      card.style.transform = `translateX(${deltaX}px)`;
    } else {
      card.style.transform = `translateX(${deltaX * 0.25}px)`;
    }
  });

  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    card.releasePointerCapture(pointerId);

    const deltaX = currentX - startX;
    card.style.transition = 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)';

    if (deltaX < -110) {
      card.dataset.swiped = 'true';
      card.style.transform = 'translateX(-100%)';
      sfx.playPop(400, 0.08);
      setTimeout(() => {
        wrapper.style.transition = 'height 240ms ease, opacity 200ms ease, margin 200ms ease';
        wrapper.style.height = '0px';
        wrapper.style.opacity = '0';
        wrapper.style.margin = '0';
        setTimeout(() => onDelete(), 240);
      }, 100);
    } else {
      card.style.transform = 'translateX(0px)';
      setTimeout(() => {
        card.dataset.swiped = 'false';
      }, 50);
    }
  };

  card.addEventListener('pointerup', endDrag);
  card.addEventListener('pointercancel', endDrag);
}

// =============================================================================
// 7B. CUTE STICKERS DATASET & SCRAPBOOK ENGINE
// =============================================================================

const CUTE_STICKERS = [
  {
    id: 'stk_pudding',
    name: 'Pudding Custard',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80"><path d="M22 68 Q18 42 30 32 Q50 24 70 32 Q82 42 78 68 Q80 78 50 82 Q20 78 22 68 Z" fill="#fde047" stroke="#ca8a04" stroke-width="2.5"/><path d="M30 32 Q50 24 70 32 Q66 45 60 46 Q54 38 46 48 Q38 44 30 32 Z" fill="#b45309"/><ellipse cx="50" cy="27" rx="6" ry="6" fill="#ef4444"/><circle cx="43" cy="54" r="2.5" fill="#1e293b"/><circle cx="57" cy="54" r="2.5" fill="#1e293b"/><ellipse cx="38" cy="60" rx="3" ry="1.5" fill="#f472b6"/><ellipse cx="62" cy="60" rx="3" ry="1.5" fill="#f472b6"/><path d="M47 62 Q50 65 53 62" stroke="#1e293b" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`
  },
  {
    id: 'stk_strawberry',
    name: 'Strawberry',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80"><path d="M50 28 Q75 32 72 65 Q68 85 50 92 Q32 85 28 65 Q25 32 50 28 Z" fill="#f43f5e" stroke="#be123c" stroke-width="2.5"/><path d="M50 28 Q42 16 34 22 Q44 26 50 28 Q56 26 66 22 Q58 16 50 28 Z" fill="#22c55e"/><circle cx="40" cy="46" r="1.5" fill="#fef08a"/><circle cx="60" cy="46" r="1.5" fill="#fef08a"/><circle cx="48" cy="58" r="1.5" fill="#fef08a"/><circle cx="36" cy="68" r="1.5" fill="#fef08a"/><circle cx="62" cy="68" r="1.5" fill="#fef08a"/></svg>`
  },
  {
    id: 'stk_cat',
    name: 'Kucing Lucu',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="52" r="32" fill="#fed7aa" stroke="#ea580c" stroke-width="2.5"/><polygon points="26,32 18,12 38,22" fill="#fed7aa" stroke="#ea580c" stroke-width="2.5"/><polygon points="74,32 82,12 62,22" fill="#fed7aa" stroke="#ea580c" stroke-width="2.5"/><polygon points="27,29 22,17 35,23" fill="#f472b6"/><polygon points="73,29 78,17 65,23" fill="#f472b6"/><ellipse cx="40" cy="48" rx="3.5" ry="4.5" fill="#1e293b"/><ellipse cx="60" cy="48" rx="3.5" ry="4.5" fill="#1e293b"/><polygon points="50,56 46,53 54,53" fill="#f43f5e"/><path d="M46 58 Q42 62 46 64 M54 58 Q58 62 54 64" stroke="#1e293b" stroke-width="2" fill="none"/><line x1="24" y1="52" x2="10" y2="50" stroke="#ea580c" stroke-width="2"/><line x1="24" y1="56" x2="10" y2="58" stroke="#ea580c" stroke-width="2"/><line x1="76" y1="52" x2="90" y2="50" stroke="#ea580c" stroke-width="2"/><line x1="76" y1="56" x2="90" y2="58" stroke="#ea580c" stroke-width="2"/></svg>`
  },
  {
    id: 'stk_heart',
    name: 'Hati Berkilau',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80"><path d="M50 82 C20 62 10 40 22 24 C34 8 46 20 50 28 C54 20 66 8 78 24 C90 40 80 62 50 82 Z" fill="#ec4899" stroke="#be185d" stroke-width="2.5"/><circle cx="34" cy="30" r="3" fill="#fff" opacity="0.7"/><polygon points="78,16 80,20 84,22 80,24 78,28 76,24 72,22 76,20" fill="#fef08a"/></svg>`
  },
  {
    id: 'stk_star',
    name: 'Bintang Emas',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80"><polygon points="50,12 61,36 88,38 67,56 73,82 50,68 27,82 33,56 12,38 39,36" fill="#facc15" stroke="#ca8a04" stroke-width="2.5"/><circle cx="43" cy="46" r="2.5" fill="#1e293b"/><circle cx="57" cy="46" r="2.5" fill="#1e293b"/><path d="M47 54 Q50 58 53 54" stroke="#1e293b" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="37" cy="52" rx="2.5" ry="1.5" fill="#fb923c"/><ellipse cx="63" cy="52" rx="2.5" ry="1.5" fill="#fb923c"/></svg>`
  },
  {
    id: 'stk_coffee',
    name: 'Kopi Hangat',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80"><path d="M25 40 L30 78 Q32 86 50 86 Q68 86 70 78 L75 40 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5"/><path d="M72 46 Q88 46 86 64 Q84 74 70 72" stroke="#94a3b8" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="40" rx="25" ry="6" fill="#78350f"/><path d="M48 38 Q50 36 52 38 Q50 42 48 38 Z" fill="#fed7aa"/><path d="M42 26 Q45 20 42 14 M50 28 Q53 22 50 16 M58 26 Q61 20 58 14" stroke="#d97706" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/></svg>`
  },
  {
    id: 'stk_ribbon',
    name: 'Pita Pastel',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80"><ellipse cx="50" cy="48" rx="8" ry="7" fill="#f43f5e" stroke="#be123c" stroke-width="2"/><path d="M42 48 Q15 28 20 56 Q30 62 44 52 Z" fill="#fb7185" stroke="#be123c" stroke-width="2"/><path d="M58 48 Q85 28 80 56 Q70 62 56 52 Z" fill="#fb7185" stroke="#be123c" stroke-width="2"/><path d="M44 54 Q36 82 28 84 Q38 72 46 56 Z" fill="#fb7185" stroke="#be123c" stroke-width="2"/><path d="M56 54 Q64 82 72 84 Q62 72 54 56 Z" fill="#fb7185" stroke="#be123c" stroke-width="2"/></svg>`
  },
  {
    id: 'stk_tape',
    name: 'Washi Tape',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80"><rect x="10" y="36" width="80" height="28" rx="3" fill="#a7f3d0" stroke="#059669" stroke-width="2"/><path d="M10 36 L15 50 L10 64 M90 36 L85 50 L90 64" fill="#a7f3d0" stroke="#059669" stroke-width="2"/><line x1="24" y1="42" x2="32" y2="58" stroke="#059669" stroke-width="2" opacity="0.5"/><line x1="44" y1="42" x2="52" y2="58" stroke="#059669" stroke-width="2" opacity="0.5"/><line x1="64" y1="42" x2="72" y2="58" stroke="#059669" stroke-width="2" opacity="0.5"/></svg>`
  },
  {
    id: 'stk_flower',
    name: 'Bunga Daisy',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="50" r="14" fill="#facc15" stroke="#ca8a04" stroke-width="2"/><ellipse cx="50" cy="22" rx="9" ry="15" fill="#fff" stroke="#e2e8f0" stroke-width="2"/><ellipse cx="50" cy="78" rx="9" ry="15" fill="#fff" stroke="#e2e8f0" stroke-width="2"/><ellipse cx="22" cy="50" rx="15" ry="9" fill="#fff" stroke="#e2e8f0" stroke-width="2"/><ellipse cx="78" cy="50" rx="15" ry="9" fill="#fff" stroke="#e2e8f0" stroke-width="2"/><circle cx="50" cy="50" r="12" fill="#f59e0b"/></svg>`
  },
  {
    id: 'stk_pin',
    name: 'Pin Emas',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="34" r="18" fill="#fbbf24" stroke="#d97706" stroke-width="2.5"/><circle cx="44" cy="28" r="4" fill="#fef08a"/><path d="M50 48 L50 82" stroke="#64748b" stroke-width="4" stroke-linecap="round"/><ellipse cx="50" cy="85" rx="8" ry="4" fill="#000" opacity="0.25"/></svg>`
  }
];

function svgToDataUrl(svgStr) {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
}

// -----------------------------------------------------------------------------
// STABILO HIGHLIGHTER LOGIC
// -----------------------------------------------------------------------------
let activeStabiloColor = 'yellow';

const STABILO_COLORS = {
  yellow: '#fef08a',
  green: '#bbf7d0',
  pink: '#fbcfe8',
  blue: '#bae6fd',
  orange: '#fed7aa',
  purple: '#e9d5ff'
};

function getStabiloColorHex(color) {
  return STABILO_COLORS[color] || '#fef08a';
}

function applyStabiloHighlight(color) {
  activeStabiloColor = color;
  if (activeStabiloDot) {
    activeStabiloDot.style.background = getStabiloColorHex(color);
  }

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
    showToast(`Stabilo ${color} aktif! Sorot teks di catatan untuk mewarnai 🖍️`);
    return;
  }

  const range = sel.getRangeAt(0);
  if (!noteBodyEditor.contains(range.commonAncestorContainer)) {
    showToast('Sorot teks di dalam catatan untuk memakai stabilo! 🖍️');
    return;
  }

  // Check if selection is already inside a stabilo mark
  let parentMark = range.commonAncestorContainer.nodeType === 1
    ? range.commonAncestorContainer.closest('.pudding-stabilo')
    : range.commonAncestorContainer.parentElement.closest('.pudding-stabilo');

  if (parentMark) {
    parentMark.className = `pudding-stabilo hl-${color}`;
    triggerAutoSave();
    sfx.playCheck();
    showToast(`Warna stabilo diubah ke ${color}! ✨`);
    return;
  }

  try {
    const mark = document.createElement('mark');
    mark.className = `pudding-stabilo hl-${color}`;
    mark.appendChild(range.extractContents());
    range.insertNode(mark);
    sel.removeAllRanges();
    triggerAutoSave();
    sfx.playCheck();
    showToast(`Stabilo diterapkan! ✨`);
  } catch (err) {
    document.execCommand('backColor', false, getStabiloColorHex(color));
    triggerAutoSave();
  }
}

function clearStabiloHighlight() {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) {
    showToast('Pilih teks berstabilo untuk dihapus.');
    return;
  }

  const range = sel.getRangeAt(0);
  let parentMark = range.commonAncestorContainer.nodeType === 1
    ? range.commonAncestorContainer.closest('.pudding-stabilo')
    : range.commonAncestorContainer.parentElement?.closest('.pudding-stabilo');

  if (parentMark) {
    const parent = parentMark.parentNode;
    while (parentMark.firstChild) {
      parent.insertBefore(parentMark.firstChild, parentMark);
    }
    parent.removeChild(parentMark);
    triggerAutoSave();
    sfx.playPop(550, 0.04);
    showToast('Stabilo dihapus 🧹');
  } else {
    const marks = noteBodyEditor.querySelectorAll('.pudding-stabilo');
    let removed = false;
    marks.forEach(m => {
      if (sel.containsNode(m, true)) {
        const parent = m.parentNode;
        while (m.firstChild) parent.insertBefore(m.firstChild, m);
        parent.removeChild(m);
        removed = true;
      }
    });
    if (removed) {
      triggerAutoSave();
      sfx.playPop(550, 0.04);
      showToast('Stabilo dihapus 🧹');
    } else {
      showToast('Pilih teks berstabilo untuk dihapus.');
    }
  }
}

// -----------------------------------------------------------------------------
// KOSTUM BUKU & KERTAS LOGIC
// -----------------------------------------------------------------------------
function applyBookCostume(bookStyle) {
  if (!editorDocCanvas) return;
  const cover = bookStyle?.cover || 'spiral';
  const paper = bookStyle?.paper || 'lined';
  const ribbon = bookStyle?.ribbon || 'caramel';

  // Covers
  ['book-spiral', 'book-diary', 'book-scrapbook', 'book-clipboard', 'book-clean'].forEach(c => {
    editorDocCanvas.classList.remove(c);
  });
  editorDocCanvas.classList.add(`book-${cover}`);

  // Papers
  ['paper-lined', 'paper-grid', 'paper-dots', 'paper-cream', 'paper-kraft', 'paper-plain'].forEach(p => {
    editorDocCanvas.classList.remove(p);
  });
  editorDocCanvas.classList.add(`paper-${paper}`);

  // Ribbon
  if (bookRibbon) {
    ['ribbon-caramel', 'ribbon-ruby', 'ribbon-matcha', 'ribbon-berry', 'ribbon-none'].forEach(r => {
      bookRibbon.classList.remove(r);
    });
    bookRibbon.classList.add(`ribbon-${ribbon}`);
  }
}

// -----------------------------------------------------------------------------
// SCRAPBOOK ROTATABLE & DRAGGABLE STICKER ENGINE
// -----------------------------------------------------------------------------
let selectedStickerElement = null;

function deselectAllStickers() {
  if (selectedStickerElement) {
    selectedStickerElement.classList.remove('is-selected');
    selectedStickerElement = null;
  }
}

function selectSticker(elem) {
  deselectAllStickers();
  elem.classList.add('is-selected');
  selectedStickerElement = elem;
}

function renderScrapbookStage(note) {
  if (!scrapbookStage) return;
  scrapbookStage.innerHTML = '';
  selectedStickerElement = null;

  if (!note.stickers || note.stickers.length === 0) return;

  note.stickers.forEach(item => {
    const el = document.createElement('div');
    el.className = 'scrapbook-item';
    el.dataset.id = item.id;
    el.style.left = `${item.x || 40}px`;
    el.style.top = `${item.y || 40}px`;
    el.style.transform = `rotate(${item.rotation || 0}deg)`;
    el.style.zIndex = item.zIndex || 10;

    const styleName = item.style || 'polaroid';
    const washiHtml = styleName === 'polaroid' ? '<div class="washi-tape-strip"></div>' : '';
    const pinHtml = styleName === 'pin' ? '<div class="pushpin-icon">📌</div>' : '';
    const captionHtml = (styleName === 'polaroid' && item.caption) 
      ? `<div class="polaroid-caption">${escapeHtml(item.caption)}</div>` 
      : '';

    el.innerHTML = `
      <div class="sticker-controls">
        <button class="sticker-rotate-knob" title="Tarik untuk memutar (360°)">🔄</button>
        <div class="sticker-action-bar">
          <button class="sticker-act-btn btn-rot-left" title="Putar -15°">⟲ -15°</button>
          <button class="sticker-act-btn btn-rot-reset" title="Luruskan (0°)">0°</button>
          <button class="sticker-act-btn btn-rot-right" title="Putar +15°">⟳ +15°</button>
          <button class="sticker-act-btn btn-toggle-style" title="Ganti Gaya Frame">🎨 Gaya</button>
          <button class="sticker-act-btn btn-del-sticker" title="Hapus Stiker">🗑️</button>
        </div>
        <div class="sticker-resize-knob" title="Tarik untuk ubah ukuran"></div>
      </div>
      <div class="sticker-visual-wrap style-${styleName}">
        ${washiHtml}
        ${pinHtml}
        <img src="${item.src}" alt="${escapeHtml(item.title || 'Stiker')}" draggable="false" style="width: ${item.width || 120}px; height: auto;" />
        ${captionHtml}
      </div>
    `;

    setupStickerInteraction(el, item, note);
    scrapbookStage.appendChild(el);
  });
}

function setupStickerInteraction(el, item, note) {
  // 1. ROTATE KNOB HANDLER (Drag to freely rotate 360 degrees)
  const rotateKnob = el.querySelector('.sticker-rotate-knob');
  if (rotateKnob) {
    rotateKnob.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      selectSticker(el);
      rotateKnob.setPointerCapture(e.pointerId);

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const startRad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const startDeg = startRad * (180 / Math.PI);
      const initialRot = item.rotation || 0;

      const onMove = (moveEvt) => {
        const curRad = Math.atan2(moveEvt.clientY - centerY, moveEvt.clientX - centerX);
        const curDeg = curRad * (180 / Math.PI);
        const deltaDeg = curDeg - startDeg;
        let newRot = Math.round(initialRot + deltaDeg);
        item.rotation = newRot;
        el.style.transform = `rotate(${newRot}deg)`;
      };

      const onUp = () => {
        rotateKnob.releasePointerCapture(e.pointerId);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        triggerAutoSave();
        sfx.playPop(1000, 0.03);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });
  }

  // 2. QUICK ROTATE & ACTION BUTTONS
  const btnRotLeft = el.querySelector('.btn-rot-left');
  if (btnRotLeft) {
    btnRotLeft.addEventListener('click', (e) => {
      e.stopPropagation();
      item.rotation = (item.rotation || 0) - 15;
      el.style.transform = `rotate(${item.rotation}deg)`;
      sfx.playPop(850, 0.03);
      triggerAutoSave();
    });
  }

  const btnRotRight = el.querySelector('.btn-rot-right');
  if (btnRotRight) {
    btnRotRight.addEventListener('click', (e) => {
      e.stopPropagation();
      item.rotation = (item.rotation || 0) + 15;
      el.style.transform = `rotate(${item.rotation}deg)`;
      sfx.playPop(850, 0.03);
      triggerAutoSave();
    });
  }

  const btnRotReset = el.querySelector('.btn-rot-reset');
  if (btnRotReset) {
    btnRotReset.addEventListener('click', (e) => {
      e.stopPropagation();
      item.rotation = 0;
      el.style.transform = `rotate(0deg)`;
      sfx.playPop(900, 0.03);
      triggerAutoSave();
      showToast('Sudut diluruskan ke 0°');
    });
  }

  const btnToggleStyle = el.querySelector('.btn-toggle-style');
  if (btnToggleStyle) {
    btnToggleStyle.addEventListener('click', (e) => {
      e.stopPropagation();
      const styles = ['polaroid', 'cutout', 'pin', 'clean'];
      const curIdx = styles.indexOf(item.style || 'polaroid');
      item.style = styles[(curIdx + 1) % styles.length];
      renderScrapbookStage(note);
      sfx.playPop(1050, 0.03);
      triggerAutoSave();
    });
  }

  const btnDel = el.querySelector('.btn-del-sticker');
  if (btnDel) {
    btnDel.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = note.stickers.findIndex(s => s.id === item.id);
      if (idx !== -1) {
        note.stickers.splice(idx, 1);
        renderScrapbookStage(note);
        sfx.playPop(500, 0.05);
        triggerAutoSave();
        showToast('Stiker / Foto dihapus 🗑️');
      }
    });
  }

  // 3. RESIZE KNOB
  const resizeKnob = el.querySelector('.sticker-resize-knob');
  if (resizeKnob) {
    resizeKnob.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      selectSticker(el);
      resizeKnob.setPointerCapture(e.pointerId);

      const startX = e.clientX;
      const initialWidth = item.width || 120;

      const onMove = (moveEvt) => {
        const deltaX = moveEvt.clientX - startX;
        const newW = Math.max(60, Math.min(450, initialWidth + deltaX));
        item.width = Math.round(newW);
        const img = el.querySelector('img');
        if (img) img.style.width = `${item.width}px`;
      };

      const onUp = () => {
        resizeKnob.releasePointerCapture(e.pointerId);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        triggerAutoSave();
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });
  }

  // 4. DRAG STICKER TO MOVE POSITION
  el.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.sticker-rotate-knob') || e.target.closest('.sticker-action-bar') || e.target.closest('.sticker-resize-knob')) {
      return;
    }
    e.stopPropagation();
    selectSticker(el);

    // Bring sticker to top
    const maxZ = Math.max(...(note.stickers.map(s => s.zIndex || 10)), 10) + 1;
    item.zIndex = maxZ;
    el.style.zIndex = maxZ;

    el.setPointerCapture(e.pointerId);
    el.classList.add('is-dragging');

    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const startX = item.x || 0;
    const startY = item.y || 0;

    const onMove = (moveEvt) => {
      const deltaX = moveEvt.clientX - startClientX;
      const deltaY = moveEvt.clientY - startClientY;
      const rawX = Math.round(startX + deltaX);
      const rawY = Math.round(startY + deltaY);

      // Clamp inside the book canvas so stickers/photos never leave the book
      const canvasW = editorDocCanvas ? editorDocCanvas.offsetWidth : 900;
      const canvasH = editorDocCanvas ? editorDocCanvas.offsetHeight : 1200;
      const itemW = item.width || el.offsetWidth || 120;
      const itemH = el.offsetHeight || 120;

      item.x = Math.max(12, Math.min(canvasW - itemW - 12, rawX));
      item.y = Math.max(12, Math.min(canvasH - itemH - 12, rawY));

      el.style.left = `${item.x}px`;
      el.style.top = `${item.y}px`;
    };

    const onUp = () => {
      el.classList.remove('is-dragging');
      el.releasePointerCapture(e.pointerId);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      triggerAutoSave();
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  });
}

// =============================================================================
// 8. EDITOR INTERACTION & PROGRESS RING
// =============================================================================

function renderEditor() {
  const note = state.getActiveNote();
  if (!note) {
    noteTitleInput.value = '';
    noteBodyEditor.innerHTML = '';
    checklistItemsList.innerHTML = '';
    checklistSection.style.display = 'none';
    noteDateMeta.textContent = '—';
    noteWordsMeta.textContent = '0 kata';
    btnPinNote.classList.remove('active');
    if (scrapbookStage) scrapbookStage.innerHTML = '';
    return;
  }

  noteTitleInput.value = note.title || '';
  noteBodyEditor.innerHTML = note.body || '';
  noteFolderSelect.value = note.folder || (state.folders[1]?.id || 'personal');
  noteDateMeta.textContent = `Diedit ${formatDate(note.updatedAt)}`;
  updateWordCount();

  if (note.pinned) {
    btnPinNote.classList.add('active');
    btnPinNote.title = 'Lepas Sematan';
  } else {
    btnPinNote.classList.remove('active');
    btnPinNote.title = 'Sematkan Catatan';
  }

  // Apply Book Costume (Cover, Paper Pattern, Ribbon)
  if (!note.bookStyle) {
    note.bookStyle = { cover: 'spiral', paper: 'lined', ribbon: 'caramel' };
  }
  applyBookCostume(note.bookStyle);

  // Render Draggable & Rotatable Stickers / Photos
  if (!note.stickers) {
    note.stickers = [];
  }
  renderScrapbookStage(note);

  renderChecklist(note);
}

function renderChecklist(note) {
  if (!note.checklist) note.checklist = [];
  checklistItemsList.innerHTML = '';

  if (note.checklist.length === 0) {
    checklistSection.style.display = 'none';
    return;
  }

  checklistSection.style.display = 'block';

  const total = note.checklist.length;
  const done = note.checklist.filter(c => c.done).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  // Update badge and progress styling
  checklistProgressBadge.textContent = `${done}/${total}`;
  if (done === total && total > 0) {
    checklistProgressBadge.textContent = '100% Selesai! 🎉';
    checklistProgressBadge.classList.add('complete');
    puddingProgressBar.classList.add('complete');
  } else {
    checklistProgressBadge.classList.remove('complete');
    puddingProgressBar.classList.remove('complete');
  }

  // Update Circular Progress Ring SVG (circumference: 50.26)
  const offset = 50.26 - (pct / 100) * 50.26;
  progressRingCircle.style.strokeDashoffset = offset;

  // Update Fluid Progress Bar
  puddingProgressBar.style.width = `${pct}%`;

  note.checklist.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = `check-item-row ${item.done ? 'done' : ''}`;

    const checkbox = document.createElement('button');
    checkbox.className = `apple-checkbox ${item.done ? 'checked' : ''}`;
    checkbox.innerHTML = `
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;

    checkbox.addEventListener('click', () => {
      item.done = !item.done;

      // PUDDING BOUNCE FISIKA ANIMATION
      checkbox.classList.add('pudding-bounce');
      row.classList.add('pudding-bounce');
      setTimeout(() => {
        checkbox.classList.remove('pudding-bounce');
        row.classList.remove('pudding-bounce');
      }, 450);

      if (item.done) {
        sfx.playCheck();
        // Check if all are now done
        const newDone = note.checklist.filter(c => c.done).length;
        if (newDone === note.checklist.length) {
          triggerConfettiBurst();
          showToast('Hore! Semua checklist selesai! 🎉🍮');
        }
      } else {
        sfx.playPop(700, 0.03);
      }

      triggerAutoSave();
      renderChecklist(note);
      renderNotesList();
    });

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'check-item-input';
    input.spellcheck = false;
    input.autocomplete = 'off';
    input.value = item.text;
    input.placeholder = 'Tugas... (Enter untuk baris baru)';

    input.addEventListener('input', (e) => {
      item.text = e.target.value;
      triggerAutoSave();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        insertChecklistItemAfter(index);
      } else if (e.key === 'Backspace' && input.value === '') {
        e.preventDefault();
        deleteChecklistItemAndFocusPrevious(index);
      }
    });

    const btnDel = document.createElement('button');
    btnDel.className = 'btn-delete-check-item';
    btnDel.innerHTML = '&times;';
    btnDel.title = 'Hapus to-do ini';
    btnDel.addEventListener('click', () => {
      note.checklist.splice(index, 1);
      sfx.playPop(500, 0.03);
      triggerAutoSave();
      renderChecklist(note);
      renderNotesList();
    });

    row.appendChild(checkbox);
    row.appendChild(input);
    row.appendChild(btnDel);
    checklistItemsList.appendChild(row);
  });
}

function insertChecklistItemAfter(index) {
  const note = state.getActiveNote();
  if (!note) return;
  if (!note.checklist) note.checklist = [];

  const newItem = {
    id: 'c_' + Date.now() + Math.random().toString(36).substring(2, 6),
    text: '',
    done: false
  };

  note.checklist.splice(index + 1, 0, newItem);
  sfx.playPop(900, 0.03);
  renderChecklist(note);
  renderNotesList();
  triggerAutoSave();

  setTimeout(() => {
    const inputs = checklistItemsList.querySelectorAll('.check-item-input');
    if (inputs[index + 1]) {
      inputs[index + 1].focus();
    }
  }, 40);
}

function deleteChecklistItemAndFocusPrevious(index) {
  const note = state.getActiveNote();
  if (!note || !note.checklist || note.checklist.length === 0) return;

  note.checklist.splice(index, 1);
  sfx.playPop(550, 0.03);
  renderChecklist(note);
  renderNotesList();
  triggerAutoSave();

  setTimeout(() => {
    const inputs = checklistItemsList.querySelectorAll('.check-item-input');
    const targetIdx = Math.max(0, index - 1);
    if (inputs[targetIdx]) {
      inputs[targetIdx].focus();
    }
  }, 40);
}

function addNewChecklistItem(text = '') {
  const note = state.getActiveNote();
  if (!note) return;
  if (!note.checklist) note.checklist = [];

  const newItem = {
    id: 'c_' + Date.now() + Math.random().toString(36).substring(2, 6),
    text: text,
    done: false
  };

  note.checklist.push(newItem);
  sfx.playPop(900, 0.03);
  renderChecklist(note);
  renderNotesList();
  triggerAutoSave();

  setTimeout(() => {
    const inputs = checklistItemsList.querySelectorAll('.check-item-input');
    if (inputs.length > 0) {
      inputs[inputs.length - 1].focus();
    }
  }, 40);
}

function updateWordCount() {
  const note = state.getActiveNote();
  if (!note) return;
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = note.body || '';
  const text = (note.title || '') + ' ' + (tempDiv.textContent || '');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  noteWordsMeta.textContent = `${words} kata`;
}

function triggerAutoSave() {
  const note = state.getActiveNote();
  if (!note) return;

  saveStatus.classList.add('saving');
  saveStatus.querySelector('.status-text').textContent = 'Menyimpan...';
  if (btnSaveNote) {
    btnSaveNote.classList.add('unsaved');
  }

  clearTimeout(state.saveTimeout);
  state.saveTimeout = setTimeout(() => {
    note.title = noteTitleInput.value.trim() || 'Catatan Baru';
    note.body = noteBodyEditor.innerHTML;
    note.folder = noteFolderSelect.value;
    note.updatedAt = Date.now();

    state.saveNotes();
    saveStatus.classList.remove('saving');
    saveStatus.querySelector('.status-text').textContent = 'Tersimpan';
    noteDateMeta.textContent = `Diedit ${formatDate(note.updatedAt)}`;
    updateWordCount();
    renderNotesList();
    renderSidebar();

    if (btnSaveNote) {
      btnSaveNote.classList.remove('unsaved');
    }
  }, 350);
}

function saveCurrentNoteImmediately() {
  const note = state.getActiveNote();
  if (!note) return;

  clearTimeout(state.saveTimeout);
  note.title = noteTitleInput.value.trim() || 'Catatan Baru';
  note.body = noteBodyEditor.innerHTML;
  note.folder = noteFolderSelect.value;
  note.updatedAt = Date.now();

  state.saveNotes();
  saveStatus.classList.remove('saving');
  saveStatus.querySelector('.status-text').textContent = 'Tersimpan';
  noteDateMeta.textContent = `Diedit ${formatDate(note.updatedAt)}`;
  updateWordCount();
  renderNotesList();
  renderSidebar();

  if (btnSaveNote) {
    btnSaveNote.classList.remove('unsaved');
    btnSaveNote.classList.add('just-saved', 'pudding-bounce');
    if (saveBtnText) saveBtnText.textContent = 'Tersimpan ✓';
    setTimeout(() => {
      btnSaveNote.classList.remove('just-saved', 'pudding-bounce');
      if (saveBtnText) saveBtnText.textContent = 'Simpan';
    }, 1500);
  }

  sfx.playCheck();
  showToast('Catatan berhasil disimpan! 💾');
}

noteTitleInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    noteBodyEditor.focus();
  }
});

noteBodyEditor.addEventListener('paste', (e) => {
  e.preventDefault();
  const text = (e.originalEvent || e).clipboardData.getData('text/plain');
  document.execCommand('insertText', false, text);
});

// =============================================================================
// 9. ACTIONS: NEW NOTE, DELETE WITH UNDO, FOLDER MANAGEMENT
// =============================================================================

function createNewNote() {
  sfx.playPop(1100, 0.05);
  const now = Date.now();
  
  // If user is inside a specific folder, save note there.
  // If in 'all' view or smart filter, default to 'notes' (or first folder).
  const targetFolder = (state.currentFolder === 'all' || !state.folders.some(f => f.id === state.currentFolder))
    ? (state.folders[0]?.id || 'notes') 
    : state.currentFolder;

  // Reset smart filter to 'all' so new note is immediately visible in the active list
  state.smartFilter = 'all';

  const newNote = {
    id: 'note_' + now,
    title: 'Catatan Baru',
    body: '<div>Ketik catatan di sini...</div>',
    folder: targetFolder,
    pinned: false,
    checklist: [],
    bookStyle: {
      cover: 'spiral',
      paper: 'lined',
      ribbon: 'caramel'
    },
    stickers: [],
    createdAt: now,
    updatedAt: now
  };

  state.notes.unshift(newNote);
  state.activeNoteId = newNote.id;
  state.saveNotes();

  if (state.currentFolder === 'all') {
    currentFolderTitle.textContent = 'Semua Catatan';
  } else {
    const f = state.folders.find(x => x.id === state.currentFolder);
    if (f) currentFolderTitle.textContent = f.name;
  }

  renderSidebar();
  renderNotesList();
  renderEditor();

  // Buka catatan secara penuh (Full Book Mode) layaknya buku asli!
  enterFullBookMode();

  if (window.innerWidth <= 680) {
    splitView.classList.add('view-editor');
  }

  showToast('Catatan baru dibuat ✨');
  noteTitleInput.focus();
  noteTitleInput.select();
}

function deleteNote(noteId) {
  const idx = state.notes.findIndex(n => n.id === noteId);
  if (idx === -1) return;

  const [removedNote] = state.notes.splice(idx, 1);
  state.lastDeleted = { note: removedNote, index: idx };

  if (state.activeNoteId === noteId) {
    state.activeNoteId = state.notes[0]?.id || null;
  }
  state.saveNotes();
  sfx.playPop(450, 0.06);
  renderSidebar();
  renderNotesList();
  renderEditor();
  showToast('Catatan dihapus', true);
}

function togglePinNote() {
  const note = state.getActiveNote();
  if (!note) return;
  note.pinned = !note.pinned;
  sfx.playPop(note.pinned ? 1000 : 700, 0.04);
  state.saveNotes();
  renderSidebar();
  renderNotesList();
  renderEditor();
  showToast(note.pinned ? 'Catatan disematkan 📌' : 'Sematan dilepas');
}

function formatText(command, value = null) {
  document.execCommand(command, false, value);
  noteBodyEditor.focus();
  triggerAutoSave();
}

// Custom Folder Creation
function openFolderModal() {
  newFolderNameInput.value = '';
  selectedEmoji = '📁';
  emojiPickerRow.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.emoji === selectedEmoji);
  });
  folderModal.classList.add('open');
  sfx.playPop(850, 0.03);
  setTimeout(() => newFolderNameInput.focus(), 100);
}

emojiPickerRow.addEventListener('click', (e) => {
  const btn = e.target.closest('.emoji-btn');
  if (!btn) return;
  selectedEmoji = btn.dataset.emoji;
  emojiPickerRow.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  sfx.playPop(950, 0.02);
});

btnConfirmFolder.addEventListener('click', () => {
  const name = newFolderNameInput.value.trim();
  if (!name) {
    newFolderNameInput.focus();
    return;
  }

  const folderId = 'f_' + Date.now();
  state.folders.push({
    id: folderId,
    name: name,
    icon: selectedEmoji,
    isDefault: false
  });

  state.saveFolders();
  state.currentFolder = folderId;
  state.smartFilter = 'all';
  currentFolderTitle.textContent = name;
  folderModal.classList.remove('open');
  sfx.playCheck();
  renderSidebar();
  renderNotesList();
  showToast(`Projek "${name}" dibuat! 📂`);
});

btnCancelFolder.addEventListener('click', () => {
  folderModal.classList.remove('open');
});

btnFolderModalClose.addEventListener('click', () => {
  folderModal.classList.remove('open');
});

btnOpenNewFolderModal.addEventListener('click', openFolderModal);
btnNewFolderInline.addEventListener('click', openFolderModal);

// =============================================================================
// 10. EVENT LISTENERS & SHORTCUTS
// =============================================================================

noteTitleInput.addEventListener('input', () => {
  const note = state.getActiveNote();
  if (!note) return;
  const val = noteTitleInput.value.trim() || 'Catatan Baru';
  note.title = val;

  // Immediate character-by-character live update on active note card
  const activeTitle = notesListContainer.querySelector('.note-card.active .card-title');
  if (activeTitle) {
    activeTitle.textContent = val;
  }
  triggerAutoSave();
});

noteBodyEditor.addEventListener('input', () => {
  const note = state.getActiveNote();
  if (!note) return;
  note.body = noteBodyEditor.innerHTML;

  // Immediate character-by-character live snippet update on active note card
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = note.body;
  const plainText = (tempDiv.textContent || tempDiv.innerText || 'Belum ada isi catatan...').trim();

  const activeSnippet = notesListContainer.querySelector('.note-card.active .card-snippet');
  if (activeSnippet) {
    activeSnippet.textContent = plainText;
  }
  updateWordCount();
  triggerAutoSave();
});

noteFolderSelect.addEventListener('change', () => {
  const note = state.getActiveNote();
  if (!note) return;
  note.folder = noteFolderSelect.value;
  triggerAutoSave();
  renderSidebar();
  renderNotesList();
  const folderObj = state.folders.find(f => f.id === note.folder);
  showToast(`Dipindahkan ke ${folderObj ? folderObj.name : 'folder'} 📂`);
});

btnNewNote.addEventListener('click', createNewNote);
btnPinNote.addEventListener('click', togglePinNote);

btnDeleteCurrentNote.addEventListener('click', () => {
  const note = state.getActiveNote();
  if (!note) return;
  showAppleAlert({
    title: 'Hapus Catatan?',
    message: `Catatan "${note.title || 'Catatan Baru'}" akan dihapus dari aplikasi.`,
    onConfirm: () => deleteNote(note.id)
  });
});

btnAddCheckItem.addEventListener('click', () => addNewChecklistItem());

editorToolbar.addEventListener('click', (e) => {
  const btn = e.target.closest('.tool-btn');
  if (!btn) return;
  const action = btn.dataset.action;
  sfx.playPop(850, 0.03);

  if (action === 'bold') formatText('bold');
  else if (action === 'italic') formatText('italic');
  else if (action === 'heading') formatText('formatBlock', '<h1>');
  else if (action === 'subheading') formatText('formatBlock', '<h2>');
  else if (action === 'bullet') formatText('insertUnorderedList');
  else if (action === 'add-checklist') addNewChecklistItem();
});

btnToggleSidebar.addEventListener('click', () => {
  sfx.playPop(800, 0.03);
  splitView.classList.toggle('sidebar-collapsed');
});

btnMobileBack.addEventListener('click', () => {
  sfx.playPop(750, 0.03);
  splitView.classList.remove('view-editor');
});

searchInput.addEventListener('input', (e) => {
  state.searchQuery = e.target.value;
  btnClearSearch.style.display = state.searchQuery ? 'flex' : 'none';
  renderNotesList();
});

btnClearSearch.addEventListener('click', () => {
  searchInput.value = '';
  state.searchQuery = '';
  btnClearSearch.style.display = 'none';
  renderNotesList();
});

sortSelect.value = state.sortBy;
sortSelect.addEventListener('change', (e) => {
  state.sortBy = e.target.value;
  localStorage.setItem('inotes_sort', state.sortBy);
  sfx.playPop(800, 0.03);
  renderNotesList();
});

// Theme Toggle
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('inotes_theme', theme);
  themeLabel.textContent = theme === 'dark' ? 'Gelap' : 'Terang';
}

btnToggleTheme.addEventListener('click', () => {
  const newTheme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  sfx.playPop(1000, 0.04);
});

// Sound Toggle
btnToggleSound.addEventListener('click', () => {
  sfx.enabled = !sfx.enabled;
  localStorage.setItem('inotes_sound', sfx.enabled);
  soundLabel.textContent = sfx.enabled ? 'Suara: Nyala' : 'Suara: Mati';
  if (sfx.enabled) sfx.playPop(1200, 0.04);
});

// Export Modal
btnExportNote.addEventListener('click', () => {
  sfx.playPop(900, 0.03);
  exportModal.classList.add('open');
});

btnModalClose.addEventListener('click', () => {
  exportModal.classList.remove('open');
});

exportModal.addEventListener('click', (e) => {
  if (e.target === exportModal) {
    exportModal.classList.remove('open');
  }
});

function generateMarkdownContent() {
  const note = state.getActiveNote();
  if (!note) return '';

  let md = `# ${note.title}\n\n`;
  if (note.checklist && note.checklist.length > 0) {
    md += `### Checklist & Tugas\n`;
    note.checklist.forEach(item => {
      md += `- [${item.done ? 'x' : ' '}] ${item.text}\n`;
    });
    md += `\n`;
  }

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = note.body || '';
  md += tempDiv.innerText || tempDiv.textContent || '';
  return md;
}

btnCopyMarkdown.addEventListener('click', async () => {
  const md = generateMarkdownContent();
  try {
    await navigator.clipboard.writeText(md);
    exportModal.classList.remove('open');
    showToast('Markdown disalin ke clipboard! 📋');
  } catch {
    showToast('Gagal menyalin');
  }
});

btnDownloadMd.addEventListener('click', () => {
  const note = state.getActiveNote();
  if (!note) return;
  const md = generateMarkdownContent();
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(note.title || 'catatan').toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`;
  a.click();
  URL.revokeObjectURL(url);
  exportModal.classList.remove('open');
  showToast('File .md berhasil diunduh! 💾');
});

btnPrintNote.addEventListener('click', () => {
  exportModal.classList.remove('open');
  window.print();
});

if (btnSaveNote) {
  btnSaveNote.addEventListener('click', saveCurrentNoteImmediately);
}

// -----------------------------------------------------------------------------
// EVENT LISTENERS: STABILO, KOSTUM BUKU, STIKER & FOTO
// -----------------------------------------------------------------------------
function setupStabiloEvents() {
  if (btnStabiloToggle && stabiloPalette) {
    btnStabiloToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      stabiloPalette.classList.toggle('open');
      sfx.playPop(900, 0.03);
    });

    stabiloPalette.addEventListener('click', (e) => {
      const swatch = e.target.closest('.swatch-btn');
      if (swatch) {
        e.stopPropagation();
        const color = swatch.dataset.color;
        stabiloPalette.querySelectorAll('.swatch-btn').forEach(b => b.classList.remove('active'));
        swatch.classList.add('active');
        applyStabiloHighlight(color);
        stabiloPalette.classList.remove('open');
        return;
      }

      if (e.target.closest('.btn-clear-stabilo')) {
        e.stopPropagation();
        clearStabiloHighlight();
        stabiloPalette.classList.remove('open');
        return;
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.stabilo-tool-wrap')) {
        stabiloPalette.classList.remove('open');
      }
    });
  }
}

function updateSplitViewDrawerState() {
  const isAnyOpen = (bookModal && bookModal.classList.contains('open')) ||
                    (photoDrawer && photoDrawer.classList.contains('open')) ||
                    (stickerDrawer && stickerDrawer.classList.contains('open'));
  if (splitView) {
    splitView.classList.toggle('drawer-open', isAnyOpen);
  }
}

function closeAllDrawers() {
  closeBookDrawer();
  closePhotoDrawer();
  closeStickerDrawer();
}

function openBookDrawer() {
  closePhotoDrawer();
  closeStickerDrawer();

  const note = state.getActiveNote();
  if (!note) return;
  if (!note.bookStyle) {
    note.bookStyle = { cover: 'spiral', paper: 'lined', ribbon: 'caramel' };
  }

  if (bookCoverGrid) {
    bookCoverGrid.querySelectorAll('.costume-card').forEach(card => {
      card.classList.toggle('active', card.dataset.cover === note.bookStyle.cover);
    });
  }
  if (paperPatternGrid) {
    paperPatternGrid.querySelectorAll('.costume-card').forEach(card => {
      card.classList.toggle('active', card.dataset.paper === note.bookStyle.paper);
    });
  }
  if (bookRibbonChoices) {
    bookRibbonChoices.querySelectorAll('.ribbon-choice-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.ribbon === note.bookStyle.ribbon);
    });
  }

  if (bookModal) bookModal.classList.add('open');
  if (btnOpenBookModal) btnOpenBookModal.classList.add('active');
  updateSplitViewDrawerState();
  sfx.playPop(900, 0.03);
}

function closeBookDrawer() {
  if (bookModal) bookModal.classList.remove('open');
  if (btnOpenBookModal) btnOpenBookModal.classList.remove('active');
  updateSplitViewDrawerState();
}

function openPhotoDrawer() {
  closeBookDrawer();
  closeStickerDrawer();

  if (photoDrawer) photoDrawer.classList.add('open');
  if (btnOpenPhotoDrawer) btnOpenPhotoDrawer.classList.add('active');
  updateSplitViewDrawerState();
  sfx.playPop(900, 0.03);
}

function closePhotoDrawer() {
  if (photoDrawer) photoDrawer.classList.remove('open');
  if (btnOpenPhotoDrawer) btnOpenPhotoDrawer.classList.remove('active');
  updateSplitViewDrawerState();
}

function openStickerDrawer() {
  closeBookDrawer();
  closePhotoDrawer();

  if (stickerDrawer) stickerDrawer.classList.add('open');
  if (btnOpenStickerDrawer) btnOpenStickerDrawer.classList.add('active');
  updateSplitViewDrawerState();
  sfx.playPop(900, 0.03);
}

function closeStickerDrawer() {
  if (stickerDrawer) stickerDrawer.classList.remove('open');
  if (btnOpenStickerDrawer) btnOpenStickerDrawer.classList.remove('active');
  updateSplitViewDrawerState();
}

function setupBookCostumeEvents() {
  if (btnOpenBookModal) {
    btnOpenBookModal.addEventListener('click', () => {
      if (bookModal && bookModal.classList.contains('open')) {
        closeBookDrawer();
        sfx.playPop(700, 0.03);
      } else {
        openBookDrawer();
      }
    });
  }

  if (btnBookModalClose) {
    btnBookModalClose.addEventListener('click', () => {
      closeBookDrawer();
      sfx.playPop(700, 0.03);
    });
  }

  if (bookCoverGrid) {
    bookCoverGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.costume-card');
      if (!card) return;
      const cover = card.dataset.cover;
      bookCoverGrid.querySelectorAll('.costume-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const note = state.getActiveNote();
      if (note) {
        note.bookStyle = note.bookStyle || {};
        note.bookStyle.cover = cover;
        applyBookCostume(note.bookStyle);
        triggerAutoSave();
        sfx.playPop(950, 0.03);
      }
    });
  }

  if (paperPatternGrid) {
    paperPatternGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.costume-card');
      if (!card) return;
      const paper = card.dataset.paper;
      paperPatternGrid.querySelectorAll('.costume-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const note = state.getActiveNote();
      if (note) {
        note.bookStyle = note.bookStyle || {};
        note.bookStyle.paper = paper;
        applyBookCostume(note.bookStyle);
        triggerAutoSave();
        sfx.playPop(950, 0.03);
      }
    });
  }

  if (bookRibbonChoices) {
    bookRibbonChoices.addEventListener('click', (e) => {
      const btn = e.target.closest('.ribbon-choice-btn');
      if (!btn) return;
      const ribbon = btn.dataset.ribbon;
      bookRibbonChoices.querySelectorAll('.ribbon-choice-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const note = state.getActiveNote();
      if (note) {
        note.bookStyle = note.bookStyle || {};
        note.bookStyle.ribbon = ribbon;
        applyBookCostume(note.bookStyle);
        triggerAutoSave();
        sfx.playPop(950, 0.03);
      }
    });
  }

  if (btnSaveBookCostume) {
    btnSaveBookCostume.addEventListener('click', () => {
      closeBookDrawer();
      sfx.playCheck();
      showToast('Kostum buku diterapkan! 📔✨');
    });
  }
}

// -----------------------------------------------------------------------------
// EVENT LISTENERS: FOTO & GAMBAR DRAWER (BUKA KE SAMPING, TANPA BLUR)
// -----------------------------------------------------------------------------
let currentUploadDataUrl = '';
let selectedPhotoStyle = 'polaroid';

function setupPhotoDrawerEvents() {
  if (btnOpenPhotoDrawer) {
    btnOpenPhotoDrawer.addEventListener('click', () => {
      if (photoDrawer && photoDrawer.classList.contains('open')) {
        closePhotoDrawer();
        sfx.playPop(700, 0.03);
      } else {
        openPhotoDrawer();
      }
    });
  }

  if (btnPhotoDrawerClose) {
    btnPhotoDrawerClose.addEventListener('click', () => {
      closePhotoDrawer();
      sfx.playPop(700, 0.03);
    });
  }

  if (imageDropzone && imageFileInput) {
    imageDropzone.addEventListener('click', () => {
      imageFileInput.click();
    });

    imageDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      imageDropzone.style.borderColor = 'var(--accent-gold)';
    });

    imageDropzone.addEventListener('dragleave', () => {
      imageDropzone.style.borderColor = '';
    });

    imageDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      imageDropzone.style.borderColor = '';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleImageFile(e.dataTransfer.files[0]);
      }
    });

    imageFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleImageFile(e.target.files[0]);
      }
    });
  }

  function handleImageFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Pilih file gambar (JPG, PNG, GIF, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      currentUploadDataUrl = e.target.result;
      showUploadPreview(currentUploadDataUrl);
    };
    reader.readAsDataURL(file);
  }

  if (btnLoadImageUrl && imageUrlInput) {
    btnLoadImageUrl.addEventListener('click', () => {
      const url = imageUrlInput.value.trim();
      if (!url) return;
      currentUploadDataUrl = url;
      showUploadPreview(url);
    });
  }

  function showUploadPreview(src) {
    if (uploadPreviewImg) uploadPreviewImg.src = src;
    if (uploadPreviewArea) uploadPreviewArea.style.display = 'flex';
    if (btnConfirmAddImage) btnConfirmAddImage.disabled = false;
    sfx.playPop(1050, 0.03);
  }

  if (imageCaptionInput && previewCaptionText) {
    imageCaptionInput.addEventListener('input', (e) => {
      previewCaptionText.textContent = e.target.value.trim() || 'Catatan Kenangan ✨';
    });
  }

  if (photoStyleSelector) {
    photoStyleSelector.addEventListener('click', (e) => {
      const btn = e.target.closest('.style-choice-btn');
      if (!btn) return;
      selectedPhotoStyle = btn.dataset.style;
      photoStyleSelector.querySelectorAll('.style-choice-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sfx.playPop(900, 0.02);
    });
  }

  if (btnConfirmAddImage) {
    btnConfirmAddImage.addEventListener('click', () => {
      if (!currentUploadDataUrl) return;
      const note = state.getActiveNote();
      if (!note) return;
      note.stickers = note.stickers || [];

      const newPhoto = {
        id: 'img_' + Date.now(),
        title: 'Foto Scrapbook',
        caption: (imageCaptionInput?.value || '').trim(),
        src: currentUploadDataUrl,
        style: selectedPhotoStyle || 'polaroid',
        x: 220 + Math.floor(Math.random() * 60),
        y: 360 + Math.floor(Math.random() * 60),
        width: 150,
        rotation: Math.floor(Math.random() * 16) - 8,
        zIndex: (note.stickers.length || 0) + 10
      };

      note.stickers.push(newPhoto);
      renderScrapbookStage(note);
      triggerAutoSave();
      sfx.playCheck();

      closePhotoDrawer();
      currentUploadDataUrl = '';
      if (imageFileInput) imageFileInput.value = '';
      if (imageUrlInput) imageUrlInput.value = '';
      if (imageCaptionInput) imageCaptionInput.value = '';
      if (uploadPreviewArea) uploadPreviewArea.style.display = 'none';
      if (btnConfirmAddImage) btnConfirmAddImage.disabled = true;

      showToast('Foto berhasil ditempel ke buku catatan! 📸✨');
    });
  }
}

// -----------------------------------------------------------------------------
// EVENT LISTENERS: STIKER DRAWER (BUKA KE SAMPING, TANPA BLUR, LIVE INTERACTION)
// -----------------------------------------------------------------------------
function setupStickerDrawerEvents() {
  if (stickersGrid && stickersGrid.children.length === 0) {
    CUTE_STICKERS.forEach(item => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'sticker-pick-card';
      card.innerHTML = `
        <div class="sticker-pick-icon">${item.svg}</div>
        <div class="sticker-pick-name">${escapeHtml(item.name)}</div>
      `;
      card.addEventListener('click', () => {
        const note = state.getActiveNote();
        if (!note) return;
        note.stickers = note.stickers || [];

        const canvasWidth = editorDocCanvas ? editorDocCanvas.offsetWidth : 800;
        const targetX = Math.max(160, Math.min(canvasWidth - 140, 680));

        const newSticker = {
          id: 'stk_' + Date.now(),
          title: item.name,
          src: svgToDataUrl(item.svg),
          style: 'cutout',
          x: targetX,
          y: 280 + Math.floor(Math.random() * 140),
          width: 90,
          rotation: Math.floor(Math.random() * 20) - 10,
          zIndex: (note.stickers.length || 0) + 10
        };

        note.stickers.push(newSticker);
        renderScrapbookStage(note);
        triggerAutoSave();
        sfx.playCheck();
        // User langsung melihat stiker menempel di buku tanpa tertutup modal!
        showToast(`Stiker ${item.name} berhasil ditempel! ✨`);
      });
      stickersGrid.appendChild(card);
    });
  }

  if (btnOpenStickerDrawer) {
    btnOpenStickerDrawer.addEventListener('click', () => {
      if (stickerDrawer && stickerDrawer.classList.contains('open')) {
        closeStickerDrawer();
        sfx.playPop(700, 0.03);
      } else {
        openStickerDrawer();
      }
    });
  }

  if (btnStickerDrawerClose) {
    btnStickerDrawerClose.addEventListener('click', () => {
      closeStickerDrawer();
      sfx.playPop(700, 0.03);
    });
  }

  if (btnStickerDrawerDone) {
    btnStickerDrawerDone.addEventListener('click', () => {
      closeStickerDrawer();
      sfx.playCheck();
      showToast('Stiker selesai dipasang! ✨');
    });
  }
}

// -----------------------------------------------------------------------------
// EVENT LISTENERS: FULL BOOK MODE & PANEL TOGGLE (KAYA BUKU BENERAN)
// -----------------------------------------------------------------------------
function enterFullBookMode() {
  if (splitView) {
    splitView.classList.add('full-book-mode');
    splitView.classList.remove('sidebar-collapsed');
    splitView.classList.remove('panels-collapsed');
  }
  if (btnBookBack) {
    btnBookBack.classList.remove('list-open');
    const label = btnBookBack.querySelector('#btnBookBackLabel');
    if (label) label.textContent = 'Semua Catatan';
  }
  if (btnTogglePanels) {
    btnTogglePanels.classList.add('active');
  }
}

function exitFullBookMode() {
  if (splitView) {
    splitView.classList.remove('full-book-mode');
    splitView.classList.add('sidebar-collapsed'); // Shows notes panel, keeps sidebar collapsed for clean view
  }
  if (btnBookBack) {
    btnBookBack.classList.add('list-open');
    const label = btnBookBack.querySelector('#btnBookBackLabel');
    if (label) label.textContent = '✕ Tutup Daftar';
  }
}

function toggleFullBookMode() {
  if (splitView && splitView.classList.contains('full-book-mode')) {
    exitFullBookMode();
    sfx.playPop(850, 0.03);
    showToast('Daftar catatan dibuka 📋');
  } else {
    enterFullBookMode();
    sfx.playPop(950, 0.03);
    showToast('Mode Buku Penuh: Tulis layaknya buku asli! 📖✨');
  }
}

function setupPanelToggleEvents() {
  if (btnBookBack) {
    btnBookBack.addEventListener('click', () => {
      toggleFullBookMode();
    });
  }

  if (btnTogglePanels) {
    btnTogglePanels.addEventListener('click', () => {
      sfx.playPop(800, 0.03);
      if (splitView.classList.contains('full-book-mode')) {
        exitFullBookMode();
        showToast('Daftar catatan ditampilkan 📋');
      } else {
        enterFullBookMode();
        showToast('Mode Buku Penuh Aktif 📖✨');
      }
    });
  }
}

// Deselect stickers when clicking outside
if (editorContentWrap) {
  editorContentWrap.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('.scrapbook-item')) {
      deselectAllStickers();
    }
  });
}

// Keyboard Shortcuts
window.addEventListener('keydown', (e) => {
  // Ctrl+S or Cmd+S: Save Note
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault();
    saveCurrentNoteImmediately();
    return;
  }

  // Esc: Exit Zen mode or close modals & side drawers
  if (e.key === 'Escape') {
    if (state.isZenMode) {
      toggleZenMode();
      return;
    }
    deselectAllStickers();
    closeAllDrawers();
    exportModal.classList.remove('open');
    confirmModal.classList.remove('open');
    folderModal.classList.remove('open');
  }

  // Ctrl+N or Cmd+N: New Note
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
    e.preventDefault();
    createNewNote();
  }

  // Ctrl+F or Cmd+F: Search
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
});

// =============================================================================
// FIGMA-STYLE CANVAS PANNING & GESTURE NAVIGATION (BEBAS GESER KANAN KIRI ATAS BAWAH)
// =============================================================================
let isHandToolActive = false;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;
let scrollStartLeft = 0;
let scrollStartTop = 0;
let isSpacePressed = false;

function setupFigmaCanvasPanning() {
  const wrap = editorContentWrap;
  if (!wrap) return;

  const btnHand = document.getElementById('btnToggleHandTool');
  if (btnHand) {
    btnHand.addEventListener('click', () => {
      isHandToolActive = !isHandToolActive;
      btnHand.classList.toggle('active', isHandToolActive);
      wrap.classList.toggle('hand-tool-active', isHandToolActive);
      sfx.playPop(isHandToolActive ? 750 : 600, 0.03);
      showToast(isHandToolActive ? '🖐️ Mode Geser Aktif: Klik & geser kanvas bebas ke mana saja!' : '✏️ Mode Tulis Aktif');
    });
  }

  // Spacebar toggle to pan like Figma
  window.addEventListener('keydown', (e) => {
    const isEditingText = document.activeElement && (
      document.activeElement.isContentEditable || 
      document.activeElement.tagName === 'INPUT' || 
      document.activeElement.tagName === 'TEXTAREA'
    );

    if (e.code === 'Space' && !isSpacePressed && !isEditingText) {
      isSpacePressed = true;
      wrap.classList.add('hand-tool-active');
    }
    // H shortcut for Hand Tool, V for Select tool (standard Figma shortcuts)
    if (!isEditingText && (e.key === 'h' || e.key === 'H') && !e.ctrlKey && !e.metaKey) {
      if (btnHand) btnHand.click();
    }
    if (!isEditingText && (e.key === 'v' || e.key === 'V') && !e.ctrlKey && !e.metaKey && isHandToolActive) {
      if (btnHand) btnHand.click();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
      isSpacePressed = false;
      if (!isHandToolActive) {
        wrap.classList.remove('hand-tool-active');
      }
    }
  });

  // Start panning on pointerdown
  wrap.addEventListener('pointerdown', (e) => {
    const isMiddleClick = e.button === 1;
    const isPanMode = isHandToolActive || isSpacePressed || isMiddleClick;
    const isTargetInteractive = e.target.closest('input, textarea, [contenteditable="true"], button, select, .scrapbook-item, .apple-checkbox');

    // Pan if: hand tool active, space held, middle click, OR dragged on empty paper background!
    if (isPanMode || (!isTargetInteractive && e.button === 0)) {
      if (isTargetInteractive && !isPanMode) return;

      isPanning = true;
      panStartX = e.clientX;
      panStartY = e.clientY;
      scrollStartLeft = wrap.scrollLeft;
      scrollStartTop = wrap.scrollTop;

      wrap.classList.add('is-panning');
      try {
        wrap.setPointerCapture(e.pointerId);
      } catch {}

      e.preventDefault();
    }
  });

  // Move while panning
  wrap.addEventListener('pointermove', (e) => {
    if (!isPanning) return;
    const dx = e.clientX - panStartX;
    const dy = e.clientY - panStartY;

    wrap.scrollLeft = scrollStartLeft - dx;
    wrap.scrollTop = scrollStartTop - dy;
  });

  // Stop panning
  const stopPan = () => {
    if (isPanning) {
      isPanning = false;
      wrap.classList.remove('is-panning');
      try {
        wrap.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  wrap.addEventListener('pointerup', stopPan);
  wrap.addEventListener('pointercancel', stopPan);

  // Wheel horizontal scroll with Shift or natural trackpad
  wrap.addEventListener('wheel', (e) => {
    if (e.shiftKey && e.deltaY !== 0) {
      wrap.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, { passive: false });
}

// =============================================================================
// 11. INITIALIZATION
// =============================================================================
applyTheme(state.theme);
applyFlavor(state.flavor);
soundLabel.textContent = sfx.enabled ? 'Suara: Nyala' : 'Suara: Mati';
setupStabiloEvents();
setupBookCostumeEvents();
setupPhotoDrawerEvents();
setupStickerDrawerEvents();
setupPanelToggleEvents();
setupFigmaCanvasPanning();
renderSidebar();
renderNotesList();
renderEditor();
enterFullBookMode();
