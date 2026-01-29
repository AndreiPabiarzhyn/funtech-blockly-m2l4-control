// =========================
// Blockly blocks (Rabbit Run)
// =========================

// ВАЖНО:
// - Все блоки должны быть в ОДНОМ поле toolbox (без категорий)
// - Для каждого уровня мы можем скрывать ненужные блоки через workspace.updateToolbox(...)

// ====== TOOLBOX builder ======
// Возвращает XML toolbox с выбранными типами блоков (без разделов)
// Если allowedTypes не передан — показываем всё.

const TOOLBOX_ORDER = [
  // управление
  'key_left', 'key_right', 'key_up', 'key_down',
  // события
  'on_collision',
  // действия
  'move_up', 'move_down', 'move_left', 'move_right',
  'take_carrot',
  'set_emotion',
  'set_bg',
  'stop_game',
  // цикл
  'repeat_times'
];

const TOOLBOX_XML_BY_TYPE = {
  key_left: '<block type="key_left"></block>',
  key_right: '<block type="key_right"></block>',
  key_up: '<block type="key_up"></block>',
  key_down: '<block type="key_down"></block>',

  on_collision: '<block type="on_collision"></block>',

  move_up: '<block type="move_up"></block>',
  move_down: '<block type="move_down"></block>',
  move_left: '<block type="move_left"></block>',
  move_right: '<block type="move_right"></block>',
  take_carrot: '<block type="take_carrot"></block>',

  set_emotion: '<block type="set_emotion"></block>',
  set_bg: '<block type="set_bg"></block>',

  repeat_times: '<block type="repeat_times"></block>',
  stop_game: '<block type="stop_game"></block>'
};

function buildToolboxXml(allowedTypes) {
  const allowAll = !Array.isArray(allowedTypes) || allowedTypes.length === 0;
  const allowedSet = allowAll ? null : new Set(allowedTypes);

  const blocks = [];
  for (const t of TOOLBOX_ORDER) {
    if (!TOOLBOX_XML_BY_TYPE[t]) continue;
    if (!allowAll && !allowedSet.has(t)) continue;
    blocks.push(TOOLBOX_XML_BY_TYPE[t]);
  }

  return `<xml id="toolbox" style="display:none">\n${blocks.join('\n')}\n</xml>`;
}

// по умолчанию — всё
const toolboxXml = buildToolboxXml();

// ===== Стартовый блок =====
Blockly.Blocks['when_run'] = {
  init: function () {
    this.appendDummyInput().appendField('Когда запущено ▶');
    this.setColour('#4f46e5');
    this.setNextStatement(true, null);
    this.setDeletable(false);
    this.setMovable(false);
  }
};
Blockly.JavaScript['when_run'] = function () {
  return '';
};

// ===== Цикл (селектор повторений) =====
Blockly.Blocks['repeat_times'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('Повторить')
      .appendField(new Blockly.FieldDropdown([
        ['2', '2'],
        ['3', '3'],
        ['4', '4'],
        ['5', '5'],
        ['6', '6'],
        ['8', '8'],
        ['10', '10']
      ]), 'TIMES')
      .appendField('раз');
    this.appendStatementInput('DO').appendField('делай');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#fbbf24');
  }
};
Blockly.JavaScript['repeat_times'] = function (block) {
  const times = Number(block.getFieldValue('TIMES') || 2);
  const statements = Blockly.JavaScript.statementToCode(block, 'DO');
  return `for (let i = 0; i < ${times}; i++) {\n${statements}}\n`;
};

// ===== Блоки движения =====
function makeMoveBlock(type, label, dir) {
  Blockly.Blocks[type] = {
    init: function () {
      this.appendDummyInput().appendField(label);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#10b981');
    }
  };
  Blockly.JavaScript[type] = function () {
    return `__emit("move","${dir}");\n`;
  };
}

makeMoveBlock('move_up', 'Шаг вверх ⬆️', 'up');
makeMoveBlock('move_down', 'Шаг вниз ⬇️', 'down');
makeMoveBlock('move_left', 'Шаг влево ⬅️', 'left');
makeMoveBlock('move_right', 'Шаг вправо ➡️', 'right');

// ===== Взять морковку =====
Blockly.Blocks['take_carrot'] = {
  init: function () {
    this.appendDummyInput().appendField('Взять 🥕');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#f59e0b');
    this.setTooltip('Взять морковку, если стоишь на ней.');
  }
};
Blockly.JavaScript['take_carrot'] = function () {
  return `__emit("take");\n`;
};

// ===== Эмоции =====
Blockly.Blocks['set_emotion'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('Эмоция')
      .appendField(new Blockly.FieldDropdown([
        ['радость 😄', 'happy'],
        ['грусть 😢', 'sad']
      ]), 'EMO');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#a855f7');
  }
};
Blockly.JavaScript['set_emotion'] = function (block) {
  const emo = block.getFieldValue('EMO');
  return `__emit("emotion","${emo}");\n`;
};

// ===== Смена фона (цвет) =====
Blockly.Blocks['set_bg'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('Фон')
      .appendField(new Blockly.FieldColour('#0b1220'), 'COLOR');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#38bdf8');
  }
};
Blockly.JavaScript['set_bg'] = function (block) {
  const color = block.getFieldValue('COLOR');
  return `__emit("bg","${color}");\n`;
};

// ===== Управление: когда нажата стрелка =====
function makeKeyBlock(type, label, dir) {
  Blockly.Blocks[type] = {
    init: function () {
      this.appendDummyInput().appendField(label);
      this.appendStatementInput('DO').appendField('делай');
      this.setColour('#22c55e');
      this.setNextStatement(false);
      this.setPreviousStatement(false);
    }
  };
  Blockly.JavaScript[type] = function (block) {
    const statements = Blockly.JavaScript.statementToCode(block, 'DO');
    return `handlers["${dir}"] = handlers["${dir}"] || [];\n` +
      `__setTarget(handlers["${dir}"]);\n` +
      statements +
      `__setTarget(program);\n`;
  };
}

makeKeyBlock('key_left', 'Когда нажата ⬅️', 'left');
makeKeyBlock('key_right', 'Когда нажата ➡️', 'right');
makeKeyBlock('key_up', 'Когда нажата ⬆️', 'up');
makeKeyBlock('key_down', 'Когда нажата ⬇️', 'down');

// ===== Событие: столкновение =====
Blockly.Blocks['on_collision'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('При столкновении с')
      .appendField(new Blockly.FieldDropdown([
        ['вирусом 🦠', 'virus'],
        ['другом-роботом 🤖', 'friend'],
        ['морковкой 🥕', 'carrot']
      ]), 'TARGET');
    this.appendStatementInput('DO').appendField('делай');
    this.setColour('#f97316');
  }
};
Blockly.JavaScript['on_collision'] = function (block) {
  const t = block.getFieldValue('TARGET');
  const statements = Blockly.JavaScript.statementToCode(block, 'DO');
  return `collisions["${t}"] = collisions["${t}"] || [];\n` +
    `__setTarget(collisions["${t}"]);\n` +
    statements +
    `__setTarget(program);\n`;
};


// ====== STOP GAME ======
Blockly.Blocks['stop_game'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('СТОП игра 🚫')
      .appendField(new Blockly.FieldDropdown([
        ['проигрыш 💥', 'Ты проиграл! 💥'],
        ['победа 🎉', 'Ты победил! 🎉']
      ]), 'MSG');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#ef4444');
  }
};
Blockly.JavaScript['stop_game'] = function (block) {
  const msg = block.getFieldValue('MSG') || 'Ты проиграл! 💥';
  return `__emit("stop", ${JSON.stringify(msg)});\n`;
};
