'use strict';

/*
 * App constants module for Fruit Slot Machine game
 * contains configurations that could be changed as per requirements
 */

var FruitSlotGame = FruitSlotGame || {};
FruitSlotGame.AppConstants = FruitSlotGame.AppConstants || {};
FruitSlotGame.AppConstants = (function () {
  return {
    apiURL: '/api',
    slotCount: 3,
    imageClsPrefix: 'bg-Symbol_',
    defaultAnimationCss: 'fruit-reel 0.5s steps(6) infinite',
    bigWinText: 'Big Win!',
    smallWinText: 'Small Win!',
    noWinText: 'No Win!',
    bonusRoundText: 'Bonus Round',
    serverErrorMsg: 'Server error! Try again after some time'
  };
}());