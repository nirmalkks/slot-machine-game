'use strict';

var FruitSlotGame = FruitSlotGame || {};
FruitSlotGame.Utils = FruitSlotGame.Utils || {};
FruitSlotGame.Utils.ApiUtility = FruitSlotGame.Utils.ApiUtility || {};
FruitSlotGame.Utils.ApiUtility = function () {
  function httpGet(url, callback) {
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
  return {
    httpGet: httpGet
  };
}();