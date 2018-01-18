let config = require('./default');
const develop = require('./develop');
const production = require('./production');
const missedFields = ['backend'];

Object.assign(config, process.env.NODE_ENV === 'production' ? production : develop);

// set defaults
for (let field of missedFields) {
  if (!config[ field ]) config[ field ] = {};
}

module.exports = exports = config;
