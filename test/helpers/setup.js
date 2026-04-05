'use strict';
const Module = require('module');

const reteMock = {
  Component: class { constructor(n) { this.name = n; this.data = {}; } },
  Input: class { constructor() {} },
  Output: class { constructor() {} },
  Control: class { constructor(key) { this.key = key; } putData() {} update() {} },
  Engine: class { constructor() {} on() {} },
  Socket: class { constructor() {} combineWith() {} },
};

const original = Module._load;
Module._load = function(req, parent, isMain) {
  if (req === 'rete') return reteMock;
  if (req === 'rete-react-render-plugin') return { Control: class {} };
  if (req.endsWith('ReactNode.jsx') || req.endsWith('ReactNode')) return { ReactNode: null };
  if (req.endsWith('globalUtils')) return { deepCopy: (o) => JSON.parse(JSON.stringify(o)) };
  return original.call(this, req, parent, isMain);
};

require('@babel/register')({
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react',
  ],
  extensions: ['.js', '.jsx'],
});
