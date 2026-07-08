const TOOLBOX_ORDER = [
  'key_left', 'key_right', 'key_up', 'key_down',
  'on_collision',
  'move_up', 'move_down', 'move_left', 'move_right',
  'take_carrot',
  'set_emotion',
  'set_bg',
  'stop_game',
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

const ARROW_ICONS = {
  up: 'img/arrow-up.svg',
  down: 'img/arrow-down.svg',
  left: 'img/arrow-left.svg',
  right: 'img/arrow-right.svg'
};

const MOVE_LABELS = {
  up: 'blockStepUp',
  down: 'blockStepDown',
  left: 'blockStepLeft',
  right: 'blockStepRight'
};

function buildToolboxXml(allowedTypes) {
  const allowAll = !Array.isArray(allowedTypes) || allowedTypes.length === 0;
  const allowedSet = allowAll ? null : new Set(allowedTypes);
  const blocks = [];

  for (const type of TOOLBOX_ORDER) {
    if (!TOOLBOX_XML_BY_TYPE[type]) continue;
    if (!allowAll && !allowedSet.has(type)) continue;
    blocks.push(TOOLBOX_XML_BY_TYPE[type]);
  }

  return `<xml id="toolbox" style="display:none">\n${blocks.join('\n')}\n</xml>`;
}

let toolboxXml = buildToolboxXml(window.LEVELS_RABBIT?.[0]?.allowedBlocks);

function arrowField(dir) {
  return new Blockly.FieldImage(ARROW_ICONS[dir], 24, 24, t(MOVE_LABELS[dir]));
}

function defineRabbitBlocks() {
  Blockly.Blocks.when_run = {
    init: function () {
      this.appendDummyInput().appendField(t('blockWhenRun')).appendField('▶');
      this.setColour('#4f46e5');
      this.setNextStatement(true, null);
      this.setDeletable(false);
      this.setMovable(false);
    }
  };
  Blockly.JavaScript.when_run = function () {
    return '';
  };

  Blockly.Blocks.repeat_times = {
    init: function () {
      this.appendDummyInput()
        .appendField(t('blockRepeat'))
        .appendField(new Blockly.FieldDropdown([
          ['2', '2'],
          ['3', '3'],
          ['4', '4'],
          ['5', '5'],
          ['6', '6'],
          ['8', '8'],
          ['10', '10']
        ]), 'TIMES')
        .appendField(t('blockTimes'));
      this.appendStatementInput('DO').appendField(t('blockDo'));
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#fbbf24');
    }
  };
  Blockly.JavaScript.repeat_times = function (block) {
    const times = Number(block.getFieldValue('TIMES') || 2);
    const statements = Blockly.JavaScript.statementToCode(block, 'DO');
    return `for (let i = 0; i < ${times}; i++) {\n${statements}}\n`;
  };

  makeMoveBlock('move_up', 'up');
  makeMoveBlock('move_down', 'down');
  makeMoveBlock('move_left', 'left');
  makeMoveBlock('move_right', 'right');

  Blockly.Blocks.take_carrot = {
    init: function () {
      this.appendDummyInput()
        .appendField(t('blockTakeCarrot'))
        .appendField(new Blockly.FieldImage('img/carrot.png', 24, 24, t('carrot')));
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#f59e0b');
      this.setTooltip(t('blockTakeCarrotTip'));
    }
  };
  Blockly.JavaScript.take_carrot = function () {
    return '__emit("take");\n';
  };

  Blockly.Blocks.set_emotion = {
    init: function () {
      this.appendDummyInput()
        .appendField(t('blockEmotion'))
        .appendField(new Blockly.FieldDropdown([
          [t('blockHappy'), 'happy'],
          [t('blockSad'), 'sad']
        ]), 'EMO');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#a855f7');
    }
  };
  Blockly.JavaScript.set_emotion = function (block) {
    const emo = block.getFieldValue('EMO');
    return `__emit("emotion","${emo}");\n`;
  };

  Blockly.Blocks.set_bg = {
    init: function () {
      this.appendDummyInput()
        .appendField(t('blockBackground'))
        .appendField(new Blockly.FieldTextInput('#0b1220'), 'COLOR');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#38bdf8');
    }
  };
  Blockly.JavaScript.set_bg = function (block) {
    const color = block.getFieldValue('COLOR');
    return `__emit("bg","${color}");\n`;
  };

  makeKeyBlock('key_left', 'left');
  makeKeyBlock('key_right', 'right');
  makeKeyBlock('key_up', 'up');
  makeKeyBlock('key_down', 'down');

  Blockly.Blocks.on_collision = {
    init: function () {
      this.appendDummyInput()
        .appendField(t('blockOnCollision'))
        .appendField(new Blockly.FieldDropdown([
          [t('blockVirus'), 'virus'],
          [t('blockFriend'), 'friend'],
          [t('blockCarrotTarget'), 'carrot']
        ]), 'TARGET');
      this.appendStatementInput('DO').appendField(t('blockDo'));
      this.setColour('#f97316');
    }
  };
  Blockly.JavaScript.on_collision = function (block) {
    const target = block.getFieldValue('TARGET');
    const statements = Blockly.JavaScript.statementToCode(block, 'DO');
    return `collisions["${target}"] = collisions["${target}"] || [];\n` +
      `__setTarget(collisions["${target}"]);\n` +
      statements +
      '__setTarget(program);\n';
  };

  Blockly.Blocks.stop_game = {
    init: function () {
      this.appendDummyInput()
        .appendField(t('blockStop'))
        .appendField(new Blockly.FieldDropdown([
          [t('blockLose'), 'lose'],
          [t('blockWin'), 'win']
        ]), 'MSG');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#ef4444');
    }
  };
  Blockly.JavaScript.stop_game = function (block) {
    const result = block.getFieldValue('MSG') === 'win' ? t('youWon') : t('youLost');
    return `__emit("stop", ${JSON.stringify(result)});\n`;
  };

  syncJavascriptGenerators();
}

function makeMoveBlock(type, dir) {
  Blockly.Blocks[type] = {
    init: function () {
      this.appendDummyInput()
        .appendField(t(MOVE_LABELS[dir]))
        .appendField(arrowField(dir));
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#10b981');
    }
  };
  Blockly.JavaScript[type] = function () {
    return `__emit("move","${dir}");\n`;
  };
}

function makeKeyBlock(type, dir) {
  Blockly.Blocks[type] = {
    init: function () {
      this.appendDummyInput()
        .appendField(t('blockWhenPressed'))
        .appendField(arrowField(dir));
      this.appendStatementInput('DO').appendField(t('blockDo'));
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
      '__setTarget(program);\n';
  };
}

function syncJavascriptGenerators() {
  if (!Blockly.JavaScript.forBlock) Blockly.JavaScript.forBlock = {};
  const customTypes = ['when_run', ...TOOLBOX_ORDER];
  for (const type of customTypes) {
    if (typeof Blockly.JavaScript[type] === 'function') {
      Blockly.JavaScript.forBlock[type] = Blockly.JavaScript[type];
    }
  }
}

defineRabbitBlocks();

window.buildToolboxXml = buildToolboxXml;
window.defineRabbitBlocks = defineRabbitBlocks;
window.toolboxXml = toolboxXml;
