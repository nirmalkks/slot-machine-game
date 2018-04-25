'use strict';

/*
 * Data Access module for Fruit Slot Machine game
 * contains methods to initialize the module and fetching "win" sequence from server
 */

export default class DataAccess {

  /*
   * init method
   * initializes the module with ApiUtility dependency, api url and slot count
   * @param {util} ApiUtilityModule object
   * @param {url} String representing api url
   * @param {count} Number indicating the count of slots/random numbers that should be returned from api
   */
  constructor(util, url, count) {
    this.apiUtility = util;
    this.apiURL = url;
    this.randomNoCount = count;
  }

  /*
   * getWinData method
   * gets "win" data from server by calling the api
   * @param {callback} function to be executed once api returns the data
   */

  getWinData(callback) {
    this.apiUtility.httpGet(this.apiURL + '?count=' + this.randomNoCount, function (response) {
      callback(JSON.parse(response));
    });
  }

}