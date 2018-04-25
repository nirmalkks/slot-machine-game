/*
 * Module containing the handler methods for the different routes
 */

var path = require('path');
var randomInt = require('random-int');

/*
 * apihandler method
 * handler for route - /api?count={n}
 * generates "win" number sequence array and flag indicating whether
 * or not to trigger bonus round and sends the JSON object as resonse
 * @param {req} request object
 * @param {res} response object
 */

function apihandler(req, res) {
  var count = req.query['count'];
  var winDataArray = [];
  for (var i = 0; i < count; i++) {
    winDataArray.push(randomInt(5));
  }
  res.json({
    win: winDataArray,
    activateBonus: randomInt(5) === 0 ? true : false
  });
}

/*
 * home method
 * handler for route - /
 * serves the file index.html on app launch
 * @param {req} request object
 * @param {res} response object
 */
function home(req, res) {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
}

module.exports = {
  apihandler,
  home
};