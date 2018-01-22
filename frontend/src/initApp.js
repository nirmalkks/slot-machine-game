'use strict';

/*
 * Binds window onload event to a function which initializes App module with all its dependencies
 */

window.onload = function () {
  window.FruitSlotGame.App.init(window.FruitSlotGame.DomAccess, window.FruitSlotGame.DataAccess,
    window.FruitSlotGame.Utils.ApiUtility, window.FruitSlotGame.AppConstants);
};