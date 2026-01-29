const LEVELS_RABBIT = [
  // =============================
  // 1–4: цикл + сбор морковок + дверь (program)
  // =============================
  {
    mode: 'program',
    size: 5,
    grid: [
      "RCCCC",
      "....E",
      "..W..",
      "..W..",
      "....."
    ],
    goal: "Используй ЦИКЛ: собери все 🥕 и дойди до 🚪.",
    maxBlocks: 8,
    needCarrots: true,
    allowedBlocks: ['repeat_times','move_up','move_down','move_left','move_right','take_carrot'],
    hint: "Подсказка: повтори 4 раза (Шаг вправо ➡️ + Взять 🥕), потом вниз ⬇️ и вправо ➡️."
  },
  {
    mode: 'program',
    size: 5,
    grid: [
      "R....",
      "C....",
      "C..W.",
      "C..W.",
      "C..E."
    ],
    goal: "Цикл вниз: собери 🥕 и доберись до 🚪.",
    maxBlocks: 9,
    needCarrots: true,
    allowedBlocks: ['repeat_times','move_up','move_down','move_left','move_right','take_carrot'],
    hint: "Повтори 4 раза: Шаг вниз ⬇️ + Взять 🥕. Потом вправо ➡️ к двери."
  },
  {
    mode: 'program',
    size: 5,
    grid: [
      "R..W.",
      "C..W.",
      "C....",
      "C.WW.",
      "C...E"
    ],
    goal: "Собери все 🥕 (цикл!) и дойди до 🚪.",
    maxBlocks: 10,
    needCarrots: true,
    allowedBlocks: ['repeat_times','move_up','move_down','move_left','move_right','take_carrot'],
    hint: "Сначала собери колонку морковок слева (вниз + взять), потом обходи стены."
  },
  {
    mode: 'program',
    size: 5,
    grid: [
      "R...E",
      ".WWW.",
      "CCCC.",
      ".....",
      "....."
    ],
    goal: "Цикл: собери 4 🥕 на строке и дойди до 🚪.",
    maxBlocks: 10,
    needCarrots: true,
    allowedBlocks: ['repeat_times','move_up','move_down','move_left','move_right','take_carrot'],
    hint: ""
  },

  // =============================
  // 5–10: управление с клавиатуры + морковки; столкновения с 7 уровня
  // =============================
  {
    mode: 'keyboard',
    size: 5,
    grid: [
      "R.C..",
      ".W.W.",
      "..C..",
      ".W.W.",
      "..C.E"
    ],
    goal: "Управление с клавиатуры! Сделай 4 блока: когда нажата стрелка — делай шаг. Собери 🥕 и дойди до 🚪.",
    maxBlocks: 18,
    needCarrots: true,
    allowedBlocks: ['key_left', 'key_right', 'key_up', 'key_down', 'move_up', 'move_down', 'move_left', 'move_right', 'on_collision', 'take_carrot', 'stop_game'],
    hint: "Сделай 4 блока: когда ⬅️/➡️/⬆️/⬇️ — соответствующий шаг."
  },
  {
    mode: 'keyboard',
    size: 5,
    grid: [
      "R..C.",
      ".W.W.",
      "..C..",
      ".W.W.",
      "C...E"
    ],
    goal: "Ещё один уровень на управление: собери 🥕 и дойди до 🚪.",
    maxBlocks: 18,
    needCarrots: true,
    allowedBlocks: ['key_left', 'key_right', 'key_up', 'key_down', 'move_up', 'move_down', 'move_left', 'move_right', 'on_collision', 'take_carrot', 'stop_game'],
    hint: "Управление как в прошлом уровне. Аккуратно обходи стены."
  },
  {
    mode: 'keyboard',
    size: 5,
    grid: [
      "R..C.",
      ".W.W.",
      "..V..",
      ".W.W.",
      "C...E"
    ],
    goal: "Столкновения! Добавь блок «При столкновении с вирусом 🦠». При столкновении — проигрыш и сброс.",
    maxBlocks: 22,
    needCarrots: true,
    allowedBlocks: ['key_left', 'key_right', 'key_up', 'key_down', 'move_up', 'move_down', 'move_left', 'move_right', 'on_collision', 'set_emotion', 'take_carrot', 'stop_game'],
    hint: "Сделай: При столкновении с вирусом 🦠 → СТОП игра (проигрыш 💥). И добавь: При столкновении с 🥕 → Взять 🥕."
  },
  {
    mode: 'keyboard',
    size: 5,
    grid: [
      "R.C..",
      ".W.W.",
      "..C..",
      ".W.W.",
      "C...E"
    ],
    movers: [
      { x: 0, y: 2, axis: 'x', dir: 1, type: 'virus' }
    ],
    goal: "Уровень 8: 🦠 двигается по горизонтали (влево-вправо). Собери 🥕 и дойди до 🚪. Столкнулся — проиграл.",
    maxBlocks: 24,
    needCarrots: true,
    allowedBlocks: ['key_left','key_right','key_up','key_down','move_up','move_down','move_left','move_right','on_collision','take_carrot','set_emotion','set_bg','stop_game'],
    hint: "Сделай блок: При столкновении с вирусом 🦠 → СТОП игра (проигрыш 💥). А морковку собирай через столкновение с 🥕 + Взять 🥕."
  },
  {
    mode: 'keyboard',
    size: 5,
    grid: [
      "R..C.",
      ".W.W.",
      "..C..",
      ".W.W.",
      "C..E."
    ],
    movers: [
      { x: 2, y: 1, axis: 'y', dir: 1, type: 'virus' }
    ],
    goal: "Уровень 9: 🦠 двигается по вертикали (вверх-вниз). Собери 🥕 и дойди до 🚪. Столкнулся — проиграл.",
    maxBlocks: 26,
    needCarrots: true,
    allowedBlocks: ['key_left','key_right','key_up','key_down','move_up','move_down','move_left','move_right','on_collision','take_carrot','set_emotion','set_bg','stop_game'],
    hint: "При столкновении с вирусом 🦠 → СТОП игра. При столкновении с 🥕 → Взять 🥕."
  },
  {
    mode: 'keyboard',
    size: 5,
    grid: [
      "R.C..",
      ".W.W.",
      ".....",
      ".W.W.",
      "C.B.E"
    ],
    movers: [
      { x: 0, y: 2, axis: 'x', dir: 1, type: 'virus' },
      { x: 2, y: 1, axis: 'y', dir: 1, type: 'virus' }
    ],
    goal: "Уровень 10: два вируса 🦠 двигаются! Собери 🥕, можно встретить друга-робота 🤖 и дойти до 🚪. Столкнулся — проиграл.",
    maxBlocks: 28,
    needCarrots: true,
    allowedBlocks: ['key_left','key_right','key_up','key_down','move_up','move_down','move_left','move_right','on_collision','take_carrot','set_emotion','set_bg','stop_game'],
    hint: "Сделай 2 реакции: вирус 🦠 → СТОП игра, морковка 🥕 → Взять 🥕. Можно на роботе 🤖 ставить эмоцию радость 🙂."
  }];
