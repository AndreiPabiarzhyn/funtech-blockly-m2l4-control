const LEVELS_RABBIT = [
  {
    mode: 'program',
    size: 5,
    grid: [
      'RCCCC',
      '....E',
      '..W..',
      '..W..',
      '.....'
    ],
    goal: {
      ru: 'Используй цикл: собери все морковки и дойди до выхода.',
      en: 'Use a loop: collect all carrots and reach the exit.',
      pl: 'Użyj pętli: zbierz wszystkie marchewki i dotrzyj do wyjścia.'
    },
    maxBlocks: 8,
    needCarrots: true,
    allowedBlocks: ['repeat_times', 'move_up', 'move_down', 'move_left', 'move_right', 'take_carrot'],
    hint: {
      ru: 'Повтори 4 раза: шаг вправо + взять морковку. Потом иди вниз и вправо.',
      en: 'Repeat 4 times: step right + take carrot. Then go down and right.',
      pl: 'Powtórz 4 razy: krok w prawo + weź marchewkę. Potem idź w dół i w prawo.'
    }
  },
  {
    mode: 'program',
    size: 5,
    grid: [
      'R....',
      'C....',
      'C..W.',
      'C..W.',
      'C..E.'
    ],
    goal: {
      ru: 'Цикл вниз: собери морковки и доберись до выхода.',
      en: 'Loop downward: collect the carrots and reach the exit.',
      pl: 'Pętla w dół: zbierz marchewki i dotrzyj do wyjścia.'
    },
    maxBlocks: 9,
    needCarrots: true,
    allowedBlocks: ['repeat_times', 'move_up', 'move_down', 'move_left', 'move_right', 'take_carrot'],
    hint: {
      ru: 'Повтори 4 раза: шаг вниз + взять морковку. Потом иди вправо к двери.',
      en: 'Repeat 4 times: step down + take carrot. Then go right to the door.',
      pl: 'Powtórz 4 razy: krok w dół + weź marchewkę. Potem idź w prawo do drzwi.'
    }
  },
  {
    mode: 'program',
    size: 5,
    grid: [
      'R..W.',
      'C..W.',
      'C...E',
      'C.WW.',
      'C....'
    ],
    goal: {
      ru: 'Собери все морковки с циклом и дойди до выхода.',
      en: 'Collect all carrots with a loop and reach the exit.',
      pl: 'Zbierz wszystkie marchewki pętlą i dotrzyj do wyjścia.'
    },
    maxBlocks: 10,
    needCarrots: true,
    allowedBlocks: ['repeat_times', 'move_up', 'move_down', 'move_left', 'move_right', 'take_carrot'],
    hint: {
      ru: 'Сначала собери левую колонку морковок, потом обойди стены.',
      en: 'Collect the left carrot column first, then go around the walls.',
      pl: 'Najpierw zbierz lewą kolumnę marchewek, potem omiń ściany.'
    }
  },
  {
    mode: 'program',
    size: 5,
    grid: [
      'R...E',
      '.WWW.',
      'CCCC.',
      '.....',
      '.....'
    ],
    goal: {
      ru: 'Цикл: собери 4 морковки на строке и дойди до выхода.',
      en: 'Loop: collect 4 carrots in the row and reach the exit.',
      pl: 'Pętla: zbierz 4 marchewki w rzędzie i dotrzyj do wyjścia.'
    },
    maxBlocks: 10,
    needCarrots: true,
    allowedBlocks: ['repeat_times', 'move_up', 'move_down', 'move_left', 'move_right', 'take_carrot'],
    hint: {
      ru: 'Спустись к строке с морковками, используй цикл, затем поднимись к выходу.',
      en: 'Go down to the carrot row, use a loop, then go up to the exit.',
      pl: 'Zejdź do rzędu z marchewkami, użyj pętli, potem wróć do wyjścia.'
    }
  },
  {
    mode: 'keyboard',
    size: 5,
    grid: [
      'R.C..',
      '.WVW.',
      '..C..',
      '.W.W.',
      '..C.E'
    ],
    goal: {
      ru: 'Управление с клавиатуры: сделай 4 блока "когда нажата стрелка" и шаги к ним. Собери морковки и дойди до выхода.',
      en: 'Keyboard control: create 4 "when arrow pressed" blocks with matching steps. Collect carrots and reach the exit.',
      pl: 'Sterowanie klawiaturą: zrób 4 bloki "po naciśnięciu strzałki" z odpowiednimi krokami. Zbierz marchewki i dotrzyj do wyjścia.'
    },
    maxBlocks: 18,
    needCarrots: true,
    allowedBlocks: ['key_left', 'key_right', 'key_up', 'key_down', 'move_up', 'move_down', 'move_left', 'move_right', 'on_collision', 'take_carrot', 'stop_game'],
    hint: {
      ru: 'Для каждой стрелки добавь соответствующий шаг.',
      en: 'Add the matching step inside each arrow event.',
      pl: 'Do każdej strzałki dodaj odpowiedni krok.'
    }
  },
  {
    mode: 'keyboard',
    size: 5,
    grid: [
      'R..C.',
      '.W.WV',
      '..C..',
      '.WVW.',
      'C...E'
    ],
    goal: {
      ru: 'Ещё один уровень на управление: собери морковки и доберись до выхода.',
      en: 'Another control level: collect the carrots and reach the exit.',
      pl: 'Kolejny poziom sterowania: zbierz marchewki i dotrzyj do wyjścia.'
    },
    maxBlocks: 18,
    needCarrots: true,
    allowedBlocks: ['key_left', 'key_right', 'key_up', 'key_down', 'move_up', 'move_down', 'move_left', 'move_right', 'on_collision', 'take_carrot', 'stop_game'],
    hint: {
      ru: 'Управление как в прошлом уровне. Аккуратно обходи стены.',
      en: 'Use the same controls as before. Carefully avoid the walls.',
      pl: 'Sterowanie jak na poprzednim poziomie. Ostrożnie omijaj ściany.'
    }
  },
  {
    mode: 'keyboard',
    size: 5,
    grid: [
      'R..C.',
      '.W.W.',
      '..V..',
      '.W.W.',
      'C...E'
    ],
    goal: {
      ru: 'Столкновения: добавь реакцию на вирус. При столкновении игра должна завершиться проигрышем.',
      en: 'Collisions: add a reaction to the virus. On collision, the game should end with a loss.',
      pl: 'Zderzenia: dodaj reakcję na wirusa. Po zderzeniu gra powinna zakończyć się przegraną.'
    },
    maxBlocks: 22,
    needCarrots: true,
    allowedBlocks: ['key_left', 'key_right', 'key_up', 'key_down', 'move_up', 'move_down', 'move_left', 'move_right', 'on_collision', 'set_emotion', 'take_carrot', 'stop_game'],
    hint: {
      ru: 'Добавь: при столкновении с вирусом -> СТОП игра (проигрыш). Для морковки можно сделать столкновение -> взять морковку.',
      en: 'Add: on collision with virus -> STOP game (lose). For carrots, you can use collision -> take carrot.',
      pl: 'Dodaj: przy zderzeniu z wirusem -> STOP gra (przegrana). Dla marchewek możesz użyć zderzenia -> weź marchewkę.'
    }
  },
  {
    mode: 'keyboard',
    size: 5,
    grid: [
      'R.C..',
      '.W.W.',
      '..C..',
      '.W.W.',
      'C...E'
    ],
    movers: [
      { x: 0, y: 2, axis: 'x', dir: 1, type: 'virus' }
    ],
    goal: {
      ru: 'Уровень 8: вирус движется по горизонтали. Собери морковки, дойди до выхода и не столкнись.',
      en: 'Level 8: the virus moves horizontally. Collect carrots, reach the exit, and avoid collision.',
      pl: 'Poziom 8: wirus porusza się poziomo. Zbierz marchewki, dotrzyj do wyjścia i unikaj zderzenia.'
    },
    maxBlocks: 24,
    needCarrots: true,
    allowedBlocks: ['key_left', 'key_right', 'key_up', 'key_down', 'move_up', 'move_down', 'move_left', 'move_right', 'on_collision', 'take_carrot', 'set_emotion', 'set_bg', 'stop_game'],
    hint: {
      ru: 'Сделай реакцию на вирус: СТОП игра (проигрыш). Морковку можно собирать через столкновение с морковкой.',
      en: 'Create a virus reaction: STOP game (lose). Carrots can be collected with a carrot collision handler.',
      pl: 'Dodaj reakcję na wirusa: STOP gra (przegrana). Marchewki można zbierać przez obsługę zderzenia z marchewką.'
    }
  },
  {
    mode: 'keyboard',
    size: 5,
    grid: [
      'R..C.',
      '.W.W.',
      '..C..',
      '.W.W.',
      'C..E.'
    ],
    movers: [
      { x: 2, y: 1, axis: 'y', dir: 1, type: 'virus' }
    ],
    goal: {
      ru: 'Уровень 9: вирус движется по вертикали. Собери морковки и доберись до выхода.',
      en: 'Level 9: the virus moves vertically. Collect carrots and reach the exit.',
      pl: 'Poziom 9: wirus porusza się pionowo. Zbierz marchewki i dotrzyj do wyjścia.'
    },
    maxBlocks: 26,
    needCarrots: true,
    allowedBlocks: ['key_left', 'key_right', 'key_up', 'key_down', 'move_up', 'move_down', 'move_left', 'move_right', 'on_collision', 'take_carrot', 'set_emotion', 'set_bg', 'stop_game'],
    hint: {
      ru: 'При столкновении с вирусом заверши игру. При столкновении с морковкой возьми морковку.',
      en: 'Stop the game on virus collision. Take the carrot on carrot collision.',
      pl: 'Zakończ grę przy zderzeniu z wirusem. Weź marchewkę przy zderzeniu z marchewką.'
    }
  },
  {
    mode: 'keyboard',
    size: 5,
    grid: [
      'R.C..',
      '.W.W.',
      '.....',
      '.W.W.',
      'C.B.E'
    ],
    movers: [
      { x: 0, y: 2, axis: 'x', dir: 1, type: 'virus' },
      { x: 2, y: 1, axis: 'y', dir: 1, type: 'virus' }
    ],
    goal: {
      ru: 'Уровень 10: два вируса движутся. Собери морковки, можно встретить друга-робота, затем дойди до выхода.',
      en: 'Level 10: two viruses are moving. Collect carrots, optionally meet the robot friend, then reach the exit.',
      pl: 'Poziom 10: poruszają się dwa wirusy. Zbierz marchewki, możesz spotkać robota-przyjaciela, potem dotrzyj do wyjścia.'
    },
    maxBlocks: 28,
    needCarrots: true,
    allowedBlocks: ['key_left', 'key_right', 'key_up', 'key_down', 'move_up', 'move_down', 'move_left', 'move_right', 'on_collision', 'take_carrot', 'set_emotion', 'set_bg', 'stop_game'],
    hint: {
      ru: 'Сделай две реакции: вирус -> СТОП игра, морковка -> взять морковку. На роботе можно поставить радостную эмоцию.',
      en: 'Create two reactions: virus -> STOP game, carrot -> take carrot. On the robot, you can set a happy emotion.',
      pl: 'Zrób dwie reakcje: wirus -> STOP gra, marchewka -> weź marchewkę. Przy robocie możesz ustawić radosną emocję.'
    }
  }
];

window.LEVELS_RABBIT = LEVELS_RABBIT;
