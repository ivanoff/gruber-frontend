const request = require('request');
const conf = require('../config');
const defaultUrl = 'http://localhost:3038';

/**
 * Send data to backend server
 * @param {object} - request parameters:
 *  - method {string} - send method, default: POST
 *  - link {string} - backend API link, default: ''
 *  - json {object} - json data to send, default: {}
 * @param {function} next - request's callback function
 * @example: sender( { json: { text: 'search data' } }, () => {} ) - POST / with json data
 * @example: sender( { method: 'GET', link: 'cities' }, () => {} ) - GET /cities with no data
 **/
module.exports = exports = ({ method = 'POST', link = '', json = {} }, next) => {

  if (!link.match(/^\//)) link = '/' + link;

  const options = {
    uri: (conf.backend.url || defaultUrl) + link,
    method,
    json,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  request(options, next);

};
