let config = require( './default' );
const develop = require( './develop' );
const production = require( './production' );

Object.assign( config, process.env.NODE_ENV === 'production'? production : develop );

module.exports = exports = config;
