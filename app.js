let workspace;
let currentLevel = 0;
let state;
let compiled = { program: [], handlers: {}, collisions: {} };
const completedLevels = new Set();

// используем картинки-спрайты
const EMOJI = {
  R: 'img/rabbit.png',
  E: 'img/door.png',
  C: 'img/carrot.png',
  W: 'img/wall.png',
  V: 'img/virus.png',
  X: 'img/enemy.png',
  B: 'img/robot_friend.png',
  '.': 'img/empty2.png'
};

// звуки (проверь пути и файлы)
const sounds = {
  fail: new Audio('sounds/fail.mp3'),
  win: new Audio('sounds/win.mp3'),
  carrot: new Audio('sounds/carrot.wav')
};

// canvas для эффектов
let fxCanvas, ctx, cell;
const CARROT_POP_MS = 400;
const EXIT_FX_MS = 600;

function $(sel) { return document.querySelector(sel); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function levels() { return window.LEVELS_RABBIT || []; }
function resizeBlockly() {
  if (workspace && window.Blockly?.svgResize) Blockly.svgResize(workspace);
}

function resetFlyoutView() {
  if (!workspace || typeof workspace.getFlyout !== 'function') return;
  const flyout = workspace.getFlyout();
  if (!flyout) return;
  if (typeof flyout.setVisible === 'function') flyout.setVisible(true);
  if (typeof flyout.scrollToStart === 'function') flyout.scrollToStart();
  resizeBlockly();
}

/* ============ Blockly ============ */
function initBlockly(allowedBlocks) {
  workspace = Blockly.inject('blockly', {
    toolbox: window.buildToolboxXml ? window.buildToolboxXml(allowedBlocks) : window.toolboxXml,
    trashcan: true,
    scrollbars: true,
    zoom: { startScale: 0.9 },
    grid: { spacing: 20, length: 3, colour: '#1f2937', snap: true }
  });

  try {
    const startBlock = workspace.newBlock('when_run');
    startBlock.initSvg();
    startBlock.render();
    startBlock.moveBy(80, 30);
    startBlock.setDeletable(false);
    startBlock.setMovable(false);
  } catch (e) {
    console.error('Start block failed', e);
  }

  workspace.addChangeListener(() => {
    updateLimitCounter();
  });
  resizeBlockly();
}

function rebuildBlocklyForLevel(level) {
  if (workspace) {
    workspace.dispose();
    workspace = null;
  }
  try {
    initBlockly(level?.allowedBlocks);
    resetFlyoutView();
  } catch (e) {
    console.error('Blockly init failed', e);
  }
}

// === Управление с клавиатуры (для уровней с режимом keyboard) ===
let keyListenerAttached = false;
let moversTimer = null;

function attachKeyListenerOnce() {
  if (keyListenerAttached) return;
  keyListenerAttached = true;
  window.addEventListener('keydown', async (e) => {
    if (!state || !state.keyboardActive) return;
    const map = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'up',
      ArrowDown: 'down'
    };
    const dir = map[e.key];
    if (!dir) return;
    e.preventDefault();

    const cmds = compiled.handlers?.[dir];
    if (!cmds || cmds.length === 0) return;
    await execCommands(cmds, { force: true });
  }, { passive: false });
}

/* ============ Уровни ============ */
function loadLevel(idx) {
  const allLevels = levels();
  if (!allLevels.length) {
    console.error('No levels loaded');
    return;
  }
  if (idx >= allLevels.length) {
    showWinModal(true);
    return;
  }

  currentLevel = idx;
  const L = allLevels[idx];

  // прячем/показываем блоки под уровень (без разделов, всё в одном toolbox)
  // buildToolboxXml определён в blocks.js
  rebuildBlocklyForLevel(L);

  // стопаем интерактив/движущиеся препятствия прошлого уровня
  if (moversTimer) {
    clearInterval(moversTimer);
    moversTimer = null;
  }
  if (state) state.keyboardActive = false;
  attachKeyListenerOnce();
  $('#levelTitle').textContent = t('level', { current: idx + 1, total: allLevels.length });
  $('#limit').textContent = L.maxBlocks;
  $('#used').textContent = 0;
  renderLevelProgress();

  state = {
    size: L.size,
    grid: L.grid.map(row => row.split('')),
    original: L.grid.map(row => row.split('')), // копия для полного сброса
    carrots: 0,
    rabbit: { x: 0, y: 0 },
    start: { x: 0, y: 0 },
    exit: { x: 0, y: 0 },
    running: false,
    mode: L.mode || 'program',
    keyboardActive: false,
    bg: L.bg || '#0b1220',
    emotion: null,
    errorCell: null,
    movers: Array.isArray(L.movers) ? L.movers.map(m => ({ ...m })) : []
  };

  // разбор карты
  for (let y = 0; y < state.size; y++) {
    for (let x = 0; x < state.size; x++) {
      const ch = state.grid[y][x];
      if (ch === 'C') {
        state.carrots++;
      } else if (ch === 'R') {
        state.rabbit = { x, y };
        state.start = { x, y };
        state.grid[y][x] = '.'; // УБИРАЕМ 'R' из сетки, чтобы не было «второго» кролика
        state.original[y][x] = '.'; // и в оригинале тоже
      } else if (ch === 'E') {
        state.exit = { x, y };
      }
    }
  }

  state.totalCarrots = state.carrots;
  updateCarrotIndicator();

  renderBoard();
  $('#goal').textContent = localized(L.goal);
  clearCode();
  resetFlyoutView();
  resizeBlockly();
}


function updateCarrotIndicator() {
  const el = document.getElementById('carrotIndicator');
  if (!el || !state) return;
  const total = state.totalCarrots || 0;
  const collected = total - (state.carrots || 0);
  if (total > 0) {
    el.textContent = `${t('carrot')} ${collected}/${total}`;
  } else {
    el.textContent = '';
  }
}

function renderLevelProgress() {
  const el = $('#levelProgress');
  const allLevels = levels();
  if (!el || !allLevels.length) return;

  el.innerHTML = '';
  allLevels.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'level-dot';
    dot.textContent = String(idx + 1);
    dot.title = t('level', { current: idx + 1, total: allLevels.length });
    dot.setAttribute('aria-label', dot.title);
    if (idx === currentLevel) dot.classList.add('active');
    if (completedLevels.has(idx)) dot.classList.add('done');
    dot.addEventListener('click', () => loadLevel(idx));
    el.appendChild(dot);
  });
}

function clearCode() {
  if (!workspace) return;
  const all = workspace.getAllBlocks(false);
  for (const b of all) if (b.type !== 'when_run') b.dispose(false, true);
  compiled = { program: [], handlers: {}, collisions: {} };
  updateLimitCounter();
  resetFlyoutView();
}

/* ============ Поле ============ */
function renderBoard() {
  const board = $('#board');
  board.style.setProperty('--size', state.size);
  board.style.background = state.bg || '#0b1220';

  // синхронизируем canvas с полем
  fxCanvas.width = board.clientWidth;
  fxCanvas.height = board.clientHeight;
  cell = board.clientWidth / state.size;

  board.innerHTML = '';
  for (let y = 0; y < state.size; y++) {
    for (let x = 0; x < state.size; x++) {
      const ch = state.grid[y][x];
      const cellDiv = document.createElement('div');
      cellDiv.className = 'cell' + (ch === 'W' ? ' wall' : '');
      if (state.errorCell && state.errorCell.x === x && state.errorCell.y === y) {
        cellDiv.classList.add('error-cell');
      }
      cellDiv.dataset.x = x;
      cellDiv.dataset.y = y;

      // сначала фон клетки (пол или стена/морковь/дверь/враг/друг)
      if (EMOJI[ch]) {
         const imgBG = document.createElement('img');
         imgBG.src = EMOJI[ch];
         imgBG.className = 'sprite';
         cellDiv.appendChild(imgBG);
      }

      // движущиеся препятствия поверх фона
      if (Array.isArray(state.movers)) {
        const mover = state.movers.find(m => m.x === x && m.y === y);
        if (mover) {
          const imgM = document.createElement('img');
          imgM.src = mover.type === 'enemy' ? EMOJI['X'] : EMOJI['V'];
          imgM.className = 'sprite';
          cellDiv.appendChild(imgM);
        }
      }

      // поверх — сам кролик, если он в этой клетке
      if (x === state.rabbit.x && y === state.rabbit.y) {
        const rab = document.createElement('img');
        rab.src = EMOJI['R'];
        rab.className = 'sprite';
        cellDiv.appendChild(rab);

        // эмоция (если есть)
        if (state.emotion) {
          const emo = document.createElement('div');
          emo.textContent = state.emotion === 'happy' ? '😄' : '😢';
          emo.style.position = 'absolute';
          emo.style.bottom = '70%';
          emo.style.fontSize = '22px';
          emo.style.filter = 'drop-shadow(0 2px 6px rgba(0,0,0,.6))';
          cellDiv.appendChild(emo);
        }
      }

      board.appendChild(cellDiv);
    }
  }
}

function updateLimitCounter() {
  if (!workspace) return;
  const used = workspace.getAllBlocks(false).filter(b => b.type !== 'when_run').length;
  $('#used').textContent = used;
}

/* ============ Код из блоков ============ */
function compile() {
  compiled = { program: [], handlers: {}, collisions: {} };
  const code = Blockly.JavaScript.workspaceToCode(workspace);
  try {
    // eslint-disable-next-line no-new-func
    // program/handlers/collisions наполняются генераторами блоков через __emit/__setTarget
    const wrapped = `
      let __target = program;
      function __setTarget(t){ __target = t; }
      function __emit(cmd, arg){ __target.push([cmd, arg]); }
      ${code}
    `;
    new Function('program', 'handlers', 'collisions', wrapped)(
      compiled.program,
      compiled.handlers,
      compiled.collisions
    );
  } catch (e) {
    console.error(e);
  }
  return compiled;
}

function canUseMoreBlocks() {
  const used = workspace.getAllBlocks(false).filter(b => b.type !== 'when_run').length;
  return used <= levels()[currentLevel].maxBlocks;
}

/* ============ Команды/действия (общий исполнитель) ============ */
function setBackground(color) {
  state.bg = color;
  const board = $('#board');
  if (board) board.style.background = color;
}

async function setEmotion(emo) {
  state.emotion = emo;
  renderBoard();
  await sleep(450);
  state.emotion = null;
  renderBoard();
}

async function execCommands(cmds, opts = {}) {
  if (!Array.isArray(cmds) || cmds.length === 0) return;
  if (state.actionLock && !opts.force) return;
  state.actionLock = true;
  for (const [cmd, arg] of cmds) {
    if (cmd === 'move') {
      const ok = await step(arg);
      if (!ok) break;
    } else if (cmd === 'take') {
      const ok = await takeCarrot();
      if (!ok) break;
} else if (cmd === 'emotion') {
      await setEmotion(arg);
    } else if (cmd === 'stop') {
      showFailModal(arg || t('youLost'));
      resetToStart();
      break;
    } else if (cmd === 'bg') {
      setBackground(arg);
    }
  }
  state.actionLock = false;
}

/* ============ Режим keyboard ============ */
function enableKeyboardMode() {
  attachKeyListenerOnce();

  // полный сброс карты
  state.grid = state.original.map(row => [...row]);
  state.carrots = 0;
  for (let y = 0; y < state.size; y++)
    for (let x = 0; x < state.size; x++)
      if (state.grid[y][x] === 'C') state.carrots++;
  state.totalCarrots = state.carrots;
  updateCarrotIndicator();

  state.rabbit = { ...state.start };
  state.keyboardActive = true;
  state.actionLock = false;
  setBackground(state.bg || '#0b1220');
  renderBoard();

  // запускаем движущиеся препятствия (если есть)
  if (moversTimer) {
    clearInterval(moversTimer);
    moversTimer = null;
  }
  if (Array.isArray(state.movers) && state.movers.length > 0) {
    moversTimer = setInterval(() => {
      if (!state.keyboardActive) return;
      tickMovers();
    }, 420);
  }
}

function resetToStart() {
  state.grid = state.original.map(row => [...row]);
  state.carrots = 0;
  for (let y = 0; y < state.size; y++)
    for (let x = 0; x < state.size; x++)
      if (state.grid[y][x] === 'C') state.carrots++;
  state.totalCarrots = state.carrots;
  updateCarrotIndicator();
  state.rabbit = { ...state.start };
  renderBoard();
}

function entityTypeAt(x, y) {
  const ch = state.grid?.[y]?.[x];
  if (ch === 'V') return 'virus';
  if (ch === 'X') return 'enemy';
  if (ch === 'B') return 'friend';
  if (ch === 'C') return 'carrot';
  if (Array.isArray(state.movers)) {
    const mover = state.movers.find(m => m.x === x && m.y === y);
    if (mover) return mover.type === 'enemy' ? 'enemy' : 'virus';
  }
  return null;
}

async function flashErrorCell(x, y) {
  if (!state) return;
  const inside = x >= 0 && y >= 0 && x < state.size && y < state.size;
  state.errorCell = inside ? { x, y } : { ...state.rabbit };
  renderBoard();
  await sleep(500);
  state.errorCell = null;
  renderBoard();
}

async function handleCollision(type) {
  const cmds = compiled.collisions?.[type];
  // Если обработчик не задан блоками — ничего не происходит
  if (!cmds || !cmds.length) return;
  await execCommands(cmds, { force: true });
}

function tickMovers() {
  if (!Array.isArray(state.movers) || state.movers.length === 0) return;

  for (const m of state.movers) {
    // mover:
    // axis: 'x'|'y' (по умолчанию 'y')
    // для 'y': minY/maxY, для 'x': minX/maxX
    if (typeof m.dir !== 'number') m.dir = 1;
    const axis = m.axis === 'x' ? 'x' : 'y';

    if (axis === 'y') {
      // двигаемся от стены до стены (или границ), с отскоком
      let ny = m.y + m.dir;
      // учтём min/max если заданы
      const minY = (typeof m.minY === 'number') ? m.minY : 0;
      const maxY = (typeof m.maxY === 'number') ? m.maxY : (state.size - 1);

      const blocked = (yy) => (yy < minY || yy > maxY || yy < 0 || yy >= state.size || state.grid?.[yy]?.[m.x] === 'W');
      if (blocked(ny)) {
        m.dir *= -1;
        ny = m.y + m.dir;
        if (blocked(ny)) ny = m.y; // если зажато стенами
      }
      m.y = ny;
    } else {
      let nx = m.x + m.dir;
      const minX = (typeof m.minX === 'number') ? m.minX : 0;
      const maxX = (typeof m.maxX === 'number') ? m.maxX : (state.size - 1);

      const blocked = (xx) => (xx < minX || xx > maxX || xx < 0 || xx >= state.size || state.grid?.[m.y]?.[xx] === 'W');
      if (blocked(nx)) {
        m.dir *= -1;
        nx = m.x + m.dir;
        if (blocked(nx)) nx = m.x;
      }
      m.x = nx;
    }

    // столкновение с кроликом — тоже только если есть обработчик
    if (m.x === state.rabbit.x && m.y === state.rabbit.y) {
      const t = (m.type === 'enemy') ? 'enemy' : 'virus';
      const hasHandler = compiled.collisions?.[t] && compiled.collisions[t].length;
      if (hasHandler) {
        // eslint-disable-next-line no-void
        void handleCollision(t);
      }
    }
  }

  updateCarrotIndicator();
  renderBoard();
}

/* ============ Запуск программы ============ */
async function run() {
  if (state.running) return;
  if (!canUseMoreBlocks()) {
    showFailModal(t('tooManyBlocks'));
    return;
  }
  compile();

  // режимы: program (как раньше) или keyboard (управление с клавиатуры)
  if (state.mode === 'keyboard') {
    // В keyboard-режиме выполняем "верхнеуровневые" команды один раз (например, фон)
    await execCommands(compiled.program);
    enableKeyboardMode();
    return;
  }

  // полный сброс карты
  state.grid = state.original.map(row => [...row]);
  state.carrots = 0;
  for (let y = 0; y < state.size; y++)
    for (let x = 0; x < state.size; x++)
      if (state.grid[y][x] === 'C') state.carrots++;
  state.totalCarrots = state.carrots;
  updateCarrotIndicator();

  // сброс в старт
  state.rabbit = { ...state.start };
  renderBoard();

  // ⏸ задержка перед первым шагом
  await sleep(300);

  state.running = true;
  for (const [cmd, arg] of compiled.program) {
    if (cmd === 'move') {
      const ok = await step(arg);
      if (!ok) {
        showFailModal(t('wallHit'));
        state.running = false;
        return;
      }
    } else if (cmd === 'take') {
      const ok = await takeCarrot();
      if (!ok) {
        state.running = false;
        return;
      }
    } else if (cmd === 'emotion') {
      await setEmotion(arg);
    } else if (cmd === 'bg') {
      setBackground(arg);
    }
  }
  state.running = false;

  // проверяем победу
  const won = checkWin();
  if (!won) {
    const atExit = (state.rabbit.x === state.exit.x && state.rabbit.y === state.exit.y);
    const needCarrots = levels()[currentLevel].needCarrots;
    if (!(atExit && needCarrots && state.carrots > 0)) {
      showFailModal(t('notAtExit'));
    }
    // сбросим кролика и морковки
    state.rabbit = { ...state.start };
    state.grid = state.original.map(row => [...row]);
    state.carrots = 0;
    for (let y = 0; y < state.size; y++)
      for (let x = 0; x < state.size; x++)
        if (state.grid[y][x] === 'C') state.carrots++;
    renderBoard();
  }
}


/* ============ Движение ============ */
async function step(dir) {
  const dx = dir === 'left' ? -1 : dir === 'right' ? 1 : 0;
  const dy = dir === 'up' ? -1 : dir === 'down' ? 1 : 0;
  const nx = state.rabbit.x + dx;
  const ny = state.rabbit.y + dy;

  // границы и стены
  if (nx < 0 || ny < 0 || nx >= state.size || ny >= state.size) {
    await flashErrorCell(nx, ny);
    return false;
  }
  if (state.grid[ny][nx] === 'W') {
    await flashErrorCell(nx, ny);
    return false;
  }

  state.rabbit.x = nx;
  state.rabbit.y = ny;
  renderBoard();
  // keyboard-режим: управление с клавиатуры (без автосбора)
  if (state.mode === 'keyboard') {
    // столкновения работают ТОЛЬКО если в программе есть обработчик
    const t = entityTypeAt(nx, ny);
    if (t) {
      const hasHandler = compiled.collisions?.[t] && compiled.collisions[t].length;
      if (hasHandler) {
        await handleCollision(t);
      }
      // после возможного столкновения (и возможного подбора) проверяем победу
      checkWin();
      await sleep(120);
      return true;
    }


    // победа после шага (морковки собираются блоком "Взять 🥕")
    checkWin();
    await sleep(120);
    return true;
  }

  await sleep(250);
  return true;
}

/* ============ Морковка ============ */
async function takeCarrot() {
  const { x, y } = state.rabbit;
  if (state.grid[y][x] === 'C') {
    try { sounds.carrot.currentTime = 0; sounds.carrot.play(); } catch {}
    await carrotPopFX(x, y);           // вспышка
    state.grid[y][x] = '.';            // убираем морковку
    state.carrots--;
    updateCarrotIndicator();
    renderBoard();
    return true;
  } else {
    showFailModal(t('noCarrot'));
    return false;
  }
}

/* ============ Победа/проверка ============ */
function checkWin() {
  const atExit = (state.rabbit.x === state.exit.x && state.rabbit.y === state.exit.y);
  const needCarrots = levels()[currentLevel].needCarrots;
  const allCarrots = (state.carrots === 0);

  if (atExit && (!needCarrots || allCarrots)) {
    try { sounds.win.currentTime = 0; sounds.win.play(); } catch {}
    exitFX(state.exit.x, state.exit.y);
    completedLevels.add(currentLevel);
    renderLevelProgress();

    // Финальная победа на последнем уровне.
    if (currentLevel === levels().length - 1) {
      showWinModal(true);
    } else {
      showWinModal(false);
    }
    return true;
  } else if (atExit && needCarrots && !allCarrots) {
    showFailModal(t('collectAllCarrots'));
    return false;
  }
  return false;
}


/* ============ FX ============ */
function carrotPopFX(cx, cy) {
  return new Promise(resolve => {
    const start = performance.now();
    const loop = (t) => {
      const p = Math.min(1, (t - start) / CARROT_POP_MS);

      ctx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

      const x = cx * cell + cell / 2;
      const y = cy * cell + cell / 2;

      ctx.save();
      ctx.globalAlpha = 1 - p;
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#f59e0b'; // оранж
      ctx.beginPath();
      ctx.arc(x, y, cell * (0.25 + 0.35 * p), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      if (p < 1) requestAnimationFrame(loop);
      else {
        ctx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
        resolve();
      }
    };
    requestAnimationFrame(loop);
  });
}

function exitFX(cx, cy) {
  const start = performance.now();
  const loop = (t) => {
    const p = Math.min(1, (t - start) / EXIT_FX_MS);
    ctx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

    const x = cx * cell + cell / 2;
    const y = cy * cell + cell / 2;

    ctx.save();
    ctx.globalAlpha = 1 - p;
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#3b82f6'; // синий
    ctx.beginPath();
    ctx.arc(x, y, cell * (0.3 + 0.5 * p), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    if (p < 1) requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

/* ============ Модалки ============ */
function showFailModal(msg) {
  try { sounds.fail.currentTime = 0; sounds.fail.play(); } catch {}
  const dlg = $('#modal');
  $('#modalTitle').textContent = t('modalError');
  $('#modalBody').innerHTML = `
    <p>${msg}</p>
    <img src="img/fail.png" alt="fail" style="max-width:120px">
    <div class="modal-actions"><button id="okBtn" class="btn primary">${t('ok')}</button></div>
  `;
  dlg.showModal();

  // ✅ обработчик кнопки вместо формы
  dlg.querySelector('#okBtn').addEventListener('click', () => {
    dlg.close();
    state.rabbit = { ...state.start };
    renderBoard();
  });
}

function showWinModal(final) {
  const dlg = $('#modal');
  dlg.classList.remove('win-final');

  if (final) {
    dlg.classList.add('win-final');
    $('#modalTitle').textContent = t('modalCongrats');
    $('#modalBody').innerHTML = `
      <p>${t('allLevelsDone')}</p>
      <img src="img/trophy.png" alt="trophy">
      <div class="modal-actions"><button id="okBtn" class="btn primary">${t('ok')}</button></div>
    `;
  } else {
    $('#modalTitle').textContent = t('modalGood');
    $('#modalBody').innerHTML = `
      <p>${t('levelDone')}</p>
      <img src="img/success.gif" alt="success">
      <div class="modal-actions"><button id="okBtn" class="btn primary">${t('ok')}</button></div>
    `;
  }

  dlg.showModal();

  // ✅ кнопка вместо формы
  dlg.querySelector('#okBtn').addEventListener('click', () => {
    dlg.close();
    if (!final) loadLevel(currentLevel + 1);
  });
}

function applyStaticTranslations() {
  document.title = t('appTitle');
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });

  const prev = $('#prevLevel');
  const next = $('#nextLevel');
  if (prev) {
    prev.title = t('previous');
    prev.setAttribute('aria-label', t('previous'));
  }
  if (next) {
    next.title = t('next');
    next.setAttribute('aria-label', t('next'));
  }
}

function refreshLanguage(lang) {
  setLanguage(lang);
  applyStaticTranslations();
  if (typeof window.defineRabbitBlocks === 'function') window.defineRabbitBlocks();
  const levelToReload = currentLevel;
  if (workspace) {
    workspace.dispose();
    workspace = null;
  }
  loadLevel(levelToReload);
}

/* ============ Кнопки/Старт ============ */
window.addEventListener('DOMContentLoaded', () => {
  fxCanvas = document.getElementById('fxCanvas');
  ctx = fxCanvas.getContext('2d');

  setLanguage(currentLanguage);
  applyStaticTranslations();
  const languageSelect = $('#languageSelect');
  if (languageSelect) {
    languageSelect.value = currentLanguage;
    languageSelect.addEventListener('change', (e) => refreshLanguage(e.target.value));
  }

  loadLevel(0);

  $('#runBtn').addEventListener('click', run);
  $('#clearBlocksBtn').addEventListener('click', clearCode);
  $('#resetBtn').addEventListener('click', () => loadLevel(currentLevel));
  //$('#hintBtn').addEventListener('click', () => {
    //const hint = LEVELS_RABBIT[currentLevel].hint || 'Попробуй шаг за шагом.';
    //showFailModal(hint);
  //});

  $('#prevLevel').addEventListener('click', () => {
    if (currentLevel > 0) loadLevel(currentLevel - 1);
  });
  $('#nextLevel').addEventListener('click', () => {
    if (currentLevel < levels().length - 1) loadLevel(currentLevel + 1);
  });

  // при ресайзе браузера пересинхроним canvas с полем
  window.addEventListener('resize', () => {
    renderBoard();
    resizeBlockly();
  });
});
