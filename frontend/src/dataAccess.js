'use strict';

/*
 * Data Access module for Fruit Slot Machine game
 * contains methods to initialize the module and fetching "win" sequence from server
 */

var FruitSlotGame = FruitSlotGame || {};
FruitSlotGame.DataAccess = FruitSlotGame.DataAccess || {};
FruitSlotGame.DataAccess = function () {
  var apiUtility;
  var apiURL;
  var randomNoCount;

  /*
   * init method
   * initializes the module with ApiUtility dependency, api url and slot count
   * @param {util} ApiUtilityModule object
   * @param {url} String representing api url
   * @param {count} Number indicating the count of slots/random numbers that should be returned from api
   */

  function init(util, url, count) {
    apiUtility = util;
    apiURL = url;
    randomNoCount = count;
  }

  /*
   * getWinData method
   * gets "win" data from server by calling the api
   * @param {callback} function to be executed once api returns the data
   */

  function getWinData(callback) {
    apiUtility.httpGet(apiURL + '?count=' + randomNoCount, function (response) {
      callback(JSON.parse(response));
    });
  }

  return {
    init: init,
    getWinData: getWinData
  };
}();