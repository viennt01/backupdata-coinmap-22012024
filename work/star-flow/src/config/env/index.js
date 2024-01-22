const local = require('./local');
const dev = require('./dev');
const staging = require('./staging');
const production = require('./production');

module.exports = {
  local,
  dev,
  staging,
  production,
};
