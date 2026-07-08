const LANG_STORAGE_KEY = 'rabbitRunLanguage';
const SUPPORTED_LANGUAGES = ['ru', 'en', 'pl'];

const I18N = {
  ru: {
    appTitle: 'Rabbit Run - Blockly',
    brand: 'Rabbit Run',
    previous: 'Предыдущий уровень',
    next: 'Следующий уровень',
    run: 'Запустить',
    reset: 'Сброс',
    clearBlocks: 'Очистить',
    level: 'Уровень {current}/{total}',
    blocks: 'Блоков:',
    footer: 'Сделано для Kodland · разработчик: Andrei Pabiarzhyn · © 2025',
    rabbit: 'кролик',
    exit: 'выход',
    carrot: 'морковка',
    wall: 'стена',
    empty: 'пусто',
    modalHint: 'Подсказка',
    modalError: 'Ошибка',
    modalCongrats: 'Поздравляем!',
    modalGood: 'Молодец!',
    ok: 'Ок',
    allLevelsDone: 'Ты прошёл все уровни!',
    levelDone: 'Уровень пройден!',
    tooManyBlocks: 'Слишком много блоков!',
    wallHit: 'Ты упёрся в стену или вышел за поле!',
    tryAgain: 'Попробуй ещё раз!',
    notAtExit: 'Дойди до выхода, чтобы пройти уровень.',
    collectAllCarrots: 'Ты дошёл до выхода, но не собрал все морковки!',
    noCarrot: 'Здесь нет морковки!',
    youLost: 'Ты проиграл!',
    youWon: 'Ты победил!',
    blockWhenRun: 'Когда запущено',
    blockRepeat: 'Повторить',
    blockTimes: 'раз',
    blockDo: 'делай',
    blockStepUp: 'Шаг вверх',
    blockStepDown: 'Шаг вниз',
    blockStepLeft: 'Шаг влево',
    blockStepRight: 'Шаг вправо',
    blockTakeCarrot: 'Взять морковку',
    blockTakeCarrotTip: 'Взять морковку, если стоишь на ней.',
    blockEmotion: 'Эмоция',
    blockHappy: 'радость',
    blockSad: 'грусть',
    blockBackground: 'Фон',
    blockWhenPressed: 'Когда нажата',
    blockOnCollision: 'При столкновении с',
    blockVirus: 'вирусом',
    blockFriend: 'другом-роботом',
    blockCarrotTarget: 'морковкой',
    blockStop: 'СТОП игра',
    blockLose: 'проигрыш',
    blockWin: 'победа'
  },
  en: {
    appTitle: 'Rabbit Run - Blockly',
    brand: 'Rabbit Run',
    previous: 'Previous level',
    next: 'Next level',
    run: 'Run',
    reset: 'Reset',
    clearBlocks: 'Clear',
    level: 'Level {current}/{total}',
    blocks: 'Blocks:',
    footer: 'Made for Kodland · developer: Andrei Pabiarzhyn · © 2025',
    rabbit: 'rabbit',
    exit: 'exit',
    carrot: 'carrot',
    wall: 'wall',
    empty: 'empty',
    modalHint: 'Hint',
    modalError: 'Error',
    modalCongrats: 'Congratulations!',
    modalGood: 'Great job!',
    ok: 'Ok',
    allLevelsDone: 'You completed all levels!',
    levelDone: 'Level completed!',
    tooManyBlocks: 'Too many blocks!',
    wallHit: 'You hit a wall or left the board!',
    tryAgain: 'Try again!',
    notAtExit: 'Reach the exit to complete the level.',
    collectAllCarrots: 'You reached the exit, but did not collect all carrots!',
    noCarrot: 'There is no carrot here!',
    youLost: 'You lost!',
    youWon: 'You won!',
    blockWhenRun: 'When run',
    blockRepeat: 'Repeat',
    blockTimes: 'times',
    blockDo: 'do',
    blockStepUp: 'Step up',
    blockStepDown: 'Step down',
    blockStepLeft: 'Step left',
    blockStepRight: 'Step right',
    blockTakeCarrot: 'Take carrot',
    blockTakeCarrotTip: 'Take the carrot if the rabbit is standing on it.',
    blockEmotion: 'Emotion',
    blockHappy: 'happy',
    blockSad: 'sad',
    blockBackground: 'Background',
    blockWhenPressed: 'When pressed',
    blockOnCollision: 'On collision with',
    blockVirus: 'virus',
    blockFriend: 'robot friend',
    blockCarrotTarget: 'carrot',
    blockStop: 'STOP game',
    blockLose: 'lose',
    blockWin: 'win'
  },
  pl: {
    appTitle: 'Rabbit Run - Blockly',
    brand: 'Rabbit Run',
    previous: 'Poprzedni poziom',
    next: 'Następny poziom',
    run: 'Uruchom',
    reset: 'Reset',
    clearBlocks: 'Wyczyść',
    level: 'Poziom {current}/{total}',
    blocks: 'Bloki:',
    footer: 'Stworzone dla Kodland · programista: Andrei Pabiarzhyn · © 2025',
    rabbit: 'królik',
    exit: 'wyjście',
    carrot: 'marchewka',
    wall: 'ściana',
    empty: 'puste',
    modalHint: 'Podpowiedź',
    modalError: 'Błąd',
    modalCongrats: 'Gratulacje!',
    modalGood: 'Świetnie!',
    ok: 'Ok',
    allLevelsDone: 'Ukończyłeś wszystkie poziomy!',
    levelDone: 'Poziom ukończony!',
    tooManyBlocks: 'Za dużo bloków!',
    wallHit: 'Uderzyłeś w ścianę albo wyszedłeś poza planszę!',
    tryAgain: 'Spróbuj jeszcze raz!',
    notAtExit: 'Dotrzyj do wyjścia, aby ukończyć poziom.',
    collectAllCarrots: 'Dotarłeś do wyjścia, ale nie zebrałeś wszystkich marchewek!',
    noCarrot: 'Tutaj nie ma marchewki!',
    youLost: 'Przegrałeś!',
    youWon: 'Wygrałeś!',
    blockWhenRun: 'Po uruchomieniu',
    blockRepeat: 'Powtórz',
    blockTimes: 'razy',
    blockDo: 'wykonaj',
    blockStepUp: 'Krok w górę',
    blockStepDown: 'Krok w dół',
    blockStepLeft: 'Krok w lewo',
    blockStepRight: 'Krok w prawo',
    blockTakeCarrot: 'Weź marchewkę',
    blockTakeCarrotTip: 'Weź marchewkę, jeśli królik na niej stoi.',
    blockEmotion: 'Emocja',
    blockHappy: 'radość',
    blockSad: 'smutek',
    blockBackground: 'Tło',
    blockWhenPressed: 'Po naciśnięciu',
    blockOnCollision: 'Przy zderzeniu z',
    blockVirus: 'wirusem',
    blockFriend: 'robotem-przyjacielem',
    blockCarrotTarget: 'marchewką',
    blockStop: 'STOP gra',
    blockLose: 'przegrana',
    blockWin: 'wygrana'
  }
};

let currentLanguage = localStorage.getItem(LANG_STORAGE_KEY) || 'ru';
if (!SUPPORTED_LANGUAGES.includes(currentLanguage)) currentLanguage = 'ru';

function t(key, values = {}) {
  const dict = I18N[currentLanguage] || I18N.ru;
  const text = dict[key] || I18N.ru[key] || key;
  return Object.entries(values).reduce(
    (result, [name, value]) => result.replaceAll(`{${name}}`, value),
    text
  );
}

function setLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) return;
  currentLanguage = lang;
  localStorage.setItem(LANG_STORAGE_KEY, lang);
  document.documentElement.lang = lang;
}

function localized(value) {
  if (value && typeof value === 'object') {
    return value[currentLanguage] || value.ru || value.en || Object.values(value)[0] || '';
  }
  return value || '';
}

window.I18N = I18N;
window.t = t;
window.setLanguage = setLanguage;
window.localized = localized;
