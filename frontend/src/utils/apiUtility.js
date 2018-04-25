'use strict';

/*
 * API Utility module for Fruit Slot Machine game
 * contains http get method implementation
 */

const ApiUtility = {
  httpGet: function httpGet(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
          callback(xmlHttp.responseText);
        } else {
          callback(null);
        }
      }
    };
    xmlHttp.open('GET', url, true);
    xmlHttp.send(null);
  }
};

export default ApiUtility;