/**
 * iNotes — Apple Style Notes & Checklist
 * Implements Apple Design WWDC principles:
 * - Fluid spring motion & tactile feedback
 * - Instant input feedback & Web Audio haptic simulation
 * - Direct card hover actions + swipe gesture
 * - Undo/Batalkan capability for zero-friction note management
 * - Custom folder creation & Apple alert confirmation
 */

// =============================================================================
// 1. SOUND GENERATOR (Apple Haptic Audio via Web Audio API)
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
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1040, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {}
  }
}

const sfx = new SoundFX();

// =============================================================================
// 2. INITIAL SEED DATA
// =============================================================================
const DEFAULT_FOLDERS = [
  { id: 'all', name: 'Semua Catatan', icon: '📝', isDefault: true },
  { id: 'work', name: 'Pekerjaan', icon: '💼', isDefault: true },
  { id: 'personal', name: 'Pribadi', icon: '👤', isDefault: true },
  { id: 'ideas', name: 'Ide & Desain', icon: '💡', isDefault: true }
];

const INITIAL_NOTES = [
  {
    id: 'note-1',
    title: 'Selamat Datang di iNotes ✨',
    body: '<div>iNotes didesain dengan panduan <b>Apple Human Interface</b>:</div><br><div>• Aksi hover cepat di kartu (ikon Pin &amp; Hapus langsung terlihat).</div><div>• Tekan <b>Enter</b> di checklist untuk otomatis membuat baris to-do baru!</div><div>• Dilengkapi tombol <b>Batalkan / Undo</b> jika tak sengaja menghapus catatan.</div><div>• Buat folder kustom sendiri dengan tombol <b>+ Folder Baru</b>.</div>',
    folder: 'ideas',
    pinned: true,
    checklist: [
      { id: 'c1', text: 'Ketik tugas baru lalu tekan Enter untuk buat baris berikutnya', done: true },
      { id: 'c2', text: 'Arahkan kursor ke kartu catatan untuk melihat tombol Hapus / Pin langsung', done: false },
      { id: 'c3', text: 'Coba buat folder baru dengan memilih emoji favoritmu', done: false },
      { id: 'c4', text: 'Ganti tema gelap atau terang dengan tombol di sidebar', done: false }
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    updatedAt: Date.now() - 1000 * 60 * 10
  },
  {
    id: 'note-2',
    title: 'Rencana Peluncuran Web ke Vercel 🚀',
    body: '<div>Checklist kesiapan deployment ke Vercel untuk aplikasi modern:</div><br><div>1. Pastikan build artifact berjalan tanpa warning.</div><div>2. Uji responsivitas di layar iPhone &amp; tablet.</div>',
    folder: 'work',
    pinned: true,
    checklist: [
      { id: 'c5', text: 'Konfigurasi file vercel.json untuk routing statis', done: true },
      { id: 'c6', text: 'Testing Lighthouse Score performa & SEO', done: true },
      { id: 'c7', text: 'Jalankan npx vercel untuk deploy instan', done: false }
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
    updatedAt: Date.now() - 1000 * 60 * 60 * 2
  },
  {
    id: 'note-3',
    title: 'Daftar Belanja Kebutuhan Mingguan 🛒',
    body: '<div>Bahan-bahan kopi dan camilan untuk meja kerja:</div>',
    folder: 'personal',
    pinned: false,
    checklist: [
      { id: 'c8', text: 'Biji Kopi Arabika Specialty 250g', done: false },
      { id: 'c9', text: 'Oat Milk Barista Edition', done: true },
      { id: 'c10', text: 'Snack sehat almond panggang', done: false }
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
    this.activeTagFilter = 'all'; // 'all', 'pinned', 'todo'
    this.searchQuery = '';
    this.sortBy = localStorage.getItem('inotes_sort') || 'updated';
    this.theme = localStorage.getItem('inotes_theme') || 'dark';
    this.saveTimeout = null;
    
    // Undo buffer
    this.lastDeleted = null;
    this.toastTimeout = null;
  }

  loadFolders() {
    const raw = localStorage.getItem('inotes_folders');
    if (raw) {
      try {
        return JSON.parse(raw);
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
        return JSON.parse(raw);
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
      // Folder filter
      if (this.currentFolder !== 'all' && note.folder !== this.currentFolder) {
        return false;
      }
      // Tag filter
      if (this.activeTagFilter === 'pinned' && !note.pinned) return false;
      if (this.activeTagFilter === 'todo' && (!note.checklist || note.checklist.length === 0)) return false;

      // Search query filter
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        const inTitle = (note.title || '').toLowerCase().includes(q);
        const inBody = (note.body || '').toLowerCase().includes(q);
        const inChecklist = (note.checklist || []).some(c => c.text.toLowerCase().includes(q));
        if (!inTitle && !inBody && !inChecklist) return false;
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      // Pinned notes always stick to the top
      if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;

      if (this.sortBy === 'created') {
        return (b.createdAt || 0) - (a.createdAt || 0);
      } else if (this.sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      } else {
        // 'updated'
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
const splitView = document.getElementById('splitView');
const sidebar = document.getElementById('sidebar');
const folderList = document.getElementById('folderList');
const tagList = document.getElementById('tagList');
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
const saveStatus = document.getElementById('saveStatus');
const editorToolbar = document.getElementById('editorToolbar');
const btnPinNote = document.getElementById('btnPinNote');
const btnExportNote = document.getElementById('btnExportNote');
const btnDeleteCurrentNote = document.getElementById('btnDeleteCurrentNote');
const noteDateMeta = document.getElementById('noteDateMeta');
const noteWordsMeta = document.getElementById('noteWordsMeta');
const noteFolderSelect = document.getElementById('noteFolderSelect');
const noteTitleInput = document.getElementById('noteTitleInput');
const checklistSection = document.getElementById('checklistSection');
const checklistProgressBadge = document.getElementById('checklistProgressBadge');
const btnAddCheckItem = document.getElementById('btnAddCheckItem');
const checklistItemsList = document.getElementById('checklistItemsList');
const noteBodyEditor = document.getElementById('noteBodyEditor');

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
// 5. TOAST & APPLE ALERT DIALOG
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
    renderFolders();
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
// 6. RENDER FUNCTIONS
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

function renderFolders() {
  folderList.innerHTML = '';
  
  state.folders.forEach(folder => {
    const count = folder.id === 'all' 
      ? state.notes.length 
      : state.notes.filter(n => n.folder === folder.id).length;

    const btn = document.createElement('button');
    btn.className = `folder-item ${state.currentFolder === folder.id ? 'active' : ''}`;
    btn.innerHTML = `
      <div class="folder-item-left">
        <span>${folder.icon}</span>
        <span class="folder-name-text">${escapeHtml(folder.name)}</span>
      </div>
      <span class="folder-badge">${count}</span>
    `;

    btn.addEventListener('click', () => {
      sfx.playPop(800, 0.03);
      state.currentFolder = folder.id;
      currentFolderTitle.textContent = folder.name;
      renderFolders();
      renderNotesList();
    });

    folderList.appendChild(btn);
  });

  // Populate editor folder select
  noteFolderSelect.innerHTML = '';
  state.folders.filter(f => f.id !== 'all').forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.textContent = `${f.icon} ${f.name}`;
    noteFolderSelect.appendChild(opt);
  });
}

function renderNotesList() {
  const filtered = state.getFilteredNotes();
  notesCountMeta.textContent = `${filtered.length} Catatan`;

  notesListContainer.innerHTML = '';

  if (filtered.length === 0) {
    notesListContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <div style="font-weight: 600; font-size: 14px;">Tidak ada catatan</div>
        <div style="font-size: 12px; color: var(--text-tertiary);">Klik "Baru" untuk mulai menulis ide atau to-do</div>
      </div>
    `;
    return;
  }

  filtered.forEach(note => {
    const wrapper = document.createElement('div');
    wrapper.className = 'note-card-wrapper';

    // Swipe trash background action (for touch gestures)
    const trashAction = document.createElement('div');
    trashAction.className = 'swipe-trash-action';
    trashAction.innerHTML = `<span>Hapus</span>`;

    // Note card
    const card = document.createElement('div');
    card.className = `note-card ${note.id === state.activeNoteId ? 'active' : ''}`;
    
    // Plain text snippet
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = note.body || '';
    const plainText = tempDiv.textContent || tempDiv.innerText || 'Belum ada isi catatan...';

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

    // Quick Action: PIN directly from card
    const btnPinCard = card.querySelector('.card-action-pin');
    btnPinCard.addEventListener('click', (e) => {
      e.stopPropagation();
      note.pinned = !note.pinned;
      sfx.playPop(note.pinned ? 1000 : 700, 0.04);
      state.saveNotes();
      renderNotesList();
      renderEditor();
      showToast(note.pinned ? 'Catatan disematkan 📌' : 'Sematan dilepas');
    });

    // Quick Action: DELETE directly from card (User-Friendly Desktop experience!)
    const btnDelCard = card.querySelector('.card-action-delete');
    btnDelCard.addEventListener('click', (e) => {
      e.stopPropagation();
      showAppleAlert({
        title: 'Hapus Catatan?',
        message: `Catatan "${note.title || 'Catatan Baru'}" akan dihapus. Anda dapat membatalkannya melalui tombol Batalkan.`,
        onConfirm: () => deleteNote(note.id)
      });
    });

    // Card Selection
    card.addEventListener('click', () => {
      if (card.dataset.swiped === 'true') return;
      sfx.playPop(750, 0.03);
      state.activeNoteId = note.id;
      renderNotesList();
      renderEditor();

      if (window.innerWidth <= 680) {
        splitView.classList.add('view-editor');
      }
    });

    trashAction.addEventListener('click', () => {
      deleteNote(note.id);
    });

    // Swipe support for touch screens
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
    card.style.transition = 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1)';

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
// 7. EDITOR INTERACTION & FLUID CHECKLIST UX
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
  checklistProgressBadge.textContent = `${done}/${total}`;

  note.checklist.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = `check-item-row ${item.done ? 'done' : ''}`;

    // Circular Checkbox
    const checkbox = document.createElement('button');
    checkbox.className = `apple-checkbox ${item.done ? 'checked' : ''}`;
    checkbox.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;

    checkbox.addEventListener('click', () => {
      item.done = !item.done;
      if (item.done) {
        sfx.playCheck();
      } else {
        sfx.playPop(700, 0.03);
      }
      triggerAutoSave();
      renderChecklist(note);
      renderNotesList();
    });

    // Input text with fluid Enter/Backspace chaining
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'check-item-input';
    input.value = item.text;
    input.placeholder = 'Tugas... (Enter untuk baris baru)';

    input.addEventListener('input', (e) => {
      item.text = e.target.value;
      triggerAutoSave();
    });

    // FLUID UX: Enter creates new item right below, Backspace deletes empty item
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        insertChecklistItemAfter(index);
      } else if (e.key === 'Backspace' && input.value === '') {
        e.preventDefault();
        deleteChecklistItemAndFocusPrevious(index);
      }
    });

    // Delete item button
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
    renderFolders();
  }, 350);
}

// When user presses Enter in Title, jump to body
noteTitleInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    noteBodyEditor.focus();
  }
});

// Clean paste for rich text
noteBodyEditor.addEventListener('paste', (e) => {
  e.preventDefault();
  const text = (e.originalEvent || e).clipboardData.getData('text/plain');
  document.execCommand('insertText', false, text);
});

// =============================================================================
// 8. ACTIONS: NEW NOTE, DELETE WITH UNDO, FOLDER MANAGEMENT
// =============================================================================

function createNewNote() {
  sfx.playPop(1100, 0.05);
  const now = Date.now();
  const targetFolder = state.currentFolder === 'all' 
    ? (state.folders[1]?.id || 'personal') 
    : state.currentFolder;

  const newNote = {
    id: 'note_' + now,
    title: 'Catatan Baru',
    body: '<div>Ketik catatan di sini...</div>',
    folder: targetFolder,
    pinned: false,
    checklist: [],
    createdAt: now,
    updatedAt: now
  };

  state.notes.unshift(newNote);
  state.activeNoteId = newNote.id;
  state.saveNotes();

  renderFolders();
  renderNotesList();
  renderEditor();

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

  // Save to undo buffer
  const [removedNote] = state.notes.splice(idx, 1);
  state.lastDeleted = { note: removedNote, index: idx };

  if (state.activeNoteId === noteId) {
    state.activeNoteId = state.notes[0]?.id || null;
  }
  state.saveNotes();
  sfx.playPop(450, 0.06);
  renderFolders();
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
  currentFolderTitle.textContent = name;
  folderModal.classList.remove('open');
  sfx.playCheck();
  renderFolders();
  renderNotesList();
  showToast(`Folder "${name}" dibuat! 📂`);
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
// 9. EVENT LISTENERS & SHORTCUTS
// =============================================================================

noteTitleInput.addEventListener('input', triggerAutoSave);
noteBodyEditor.addEventListener('input', triggerAutoSave);
noteFolderSelect.addEventListener('change', triggerAutoSave);

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

// Sort Selector
sortSelect.value = state.sortBy;
sortSelect.addEventListener('change', (e) => {
  state.sortBy = e.target.value;
  localStorage.setItem('inotes_sort', state.sortBy);
  sfx.playPop(800, 0.03);
  renderNotesList();
});

// Tag Filters
tagList.addEventListener('click', (e) => {
  const btn = e.target.closest('.tag-pill');
  if (!btn) return;
  sfx.playPop(800, 0.03);
  tagList.querySelectorAll('.tag-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  state.activeTagFilter = btn.dataset.filter;
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

// Keyboard Shortcuts
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
    e.preventDefault();
    createNewNote();
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
  if (e.key === 'Escape') {
    exportModal.classList.remove('open');
    confirmModal.classList.remove('open');
    folderModal.classList.remove('open');
  }
});

// =============================================================================
// 10. INITIALIZATION
// =============================================================================
applyTheme(state.theme);
soundLabel.textContent = sfx.enabled ? 'Suara: Nyala' : 'Suara: Mati';
renderFolders();
renderNotesList();
renderEditor();
