'use strict';

/*
 * App module for Fruit Slot Machine game
 * contains methods to start, stop and reset game
 */

var FruitSlotGame = FruitSlotGame || {};
FruitSlotGame.App = FruitSlotGame.App || {};
FruitSlotGame.App = (function () {
  var domAccess;
  var data;
  var constants;
  var isBonusRound = false;

  /*
   * init method
   * all the dependencies for the App module are injected here
   * also binds start button click handler
   * @param {domAccessModule} DomAccessModule object
   * @param {dataAccessModule} DataAccessModule object
   * @param {apiUtilsModule} ApiUtilityModule object
   * @param {appConstantsModule} AppConstantsModule object
   */

  function init(domAccessModule, dataAccessModule, apiUtilsModule, appConstantsModule) {
    domAccess = domAccessModule;
    data = dataAccessModule;
    constants = appConstantsModule;
    domAccess.init(constants.slotCount);
    data.init(apiUtilsModule, constants.apiURL, constants.slotCount);
    domAccess.getStartBtnDiv().addEventListener('click', onStartButtonClick);
  }

  /*
   * onStartButtonClick method
   * event handler for start button click
   * resets the DOM to the initial state, starts animating the slots
   * and calls the api to get the "win" number sequence
   */

  function onStartButtonClick() {
    var slotDivs = domAccess.getSlotDivs();
    var resultDiv = domAccess.getResultDiv();
    var callbackFn = function (data) {
      if (data) {
        stopAnimationAndDisplayWin(data, slotDivs, resultDiv);
      } else {
        displayError(slotDivs, resultDiv);
      }
    };
    resetGame(resultDiv, slotDivs, isBonusRound);
    startAnimation(slotDivs);
    data.getWinData(callbackFn);
  }

  /*
   * resetGame method
   * resets game by clearing previous result if any
   * also sets slot images to the default ones
   * @param {resultDiv} HTML DOM element that displays the result
   * @param {slotDivs} HTML DOM element collection representing the slots
   * @param {isBonusRound} Boolean flag to indicate if bonus round is triggered
   */

  function resetGame(resultDiv, slotDivs, isBonusRound) {
    if (!isBonusRound) {
      domAccess.setElementInnerHTML(resultDiv, '');
    }
    for (var i = 0; i < slotDivs.length; i++) {
      domAccess.replaceClass(slotDivs[i], i, constants.imageClsPrefix);
    }
  }

  /*
   * startAnimation method
   * starts animating the slots when start button is clicked
   * @param {slotDivs} HTML DOM element collection representing the slots
   */

  function startAnimation(slotDivs) {
    for (var i = 0; i < slotDivs.length; i++) {
      domAccess.setElementCssProperty(slotDivs[i], 'animation', constants.defaultAnimationCss);
    }
  }

  /*
   * stopAnimationAndDisplayWin method
   * stops the animation and displays the result after a timeout of 5000ms
   * sets slot images corresponding to the win returned from api
   * @param {data} Object containing the data returned from api
   * @param {slotDivs} HTML DOM element collection representing the slots
   * @param {resultDiv} HTML DOM element that displays the result
   */

  function stopAnimationAndDisplayWin(data, slotDivs, resultDiv) {
    var timeout = 5000;
    for (var i = 0; i < slotDivs.length; i++) {
      (function (index) {
        setTimeout(function () {
          domAccess.replaceClass(slotDivs[index], data.win[index], constants.imageClsPrefix);
          domAccess.setElementCssProperty(slotDivs[index], 'animation', 'none');
          if (index === slotDivs.length - 1) {
            displayWin(data, resultDiv);
          }
        }, (timeout + i * 500));
      }(i));
    }
  }

  /*
   * displayWin method
   * updates result DOM element with "win" text corresponding to the data
   * also triggers bonus round if activateBonus flag is returned as true from api
   * @param {data} Object containing the data returned from api
   * @param {resultDiv} HTML DOM element that displays the result
   */

  function displayWin(data, resultDiv) {
    var result;
    var win = data.win;
    var largestIdenticalElementCount = getLargestIdenticalElementCount(data.win);

    if (largestIdenticalElementCount === win.length) {
      result = constants.bigWinText;
    } else if (largestIdenticalElementCount >= 2) {
      result = constants.smallWinText;
    } else {
      result = constants.noWinText;
    }
    domAccess.setElementInnerHTML(resultDiv, result);
    isBonusRound = data.activateBonus;
    if (isBonusRound) {
      triggerBonusRound(resultDiv);
    }
  }

  /*
   * getLargestIdenticalElementCount method
   * takes "win" array and finds out the repeat count for each number
   * and returns the largest count for any number which displayWin()
   * uses to display the correct "win" text
   * @param {array} Array containing the "win" number sequence
   */

  function getLargestIdenticalElementCount(array) {
    var elementCountObj = array.reduce((elCountObj, element) => {
      elCountObj[element] = ++elCountObj[element] || 1;
      return elCountObj;
    }, {});
    var keysArray = Object.keys(elementCountObj);

    if (keysArray.length === 1) {
      return elementCountObj[keysArray[0]];
    } else {
      return Object.keys(elementCountObj).reduce(function (a, b) {
        return elementCountObj[a] > elementCountObj[b] ? elementCountObj[a] : elementCountObj[b];
      });
    }
  }

  /*
   * triggerBonusRound method
   * updates result DOM element with text letting user know that bonus round is activated
   * invokes start button click handler method to spin the slots once again
   * @param {resultDiv} HTML DOM element that displays the result
   */

  function triggerBonusRound(resultDiv) {
    setTimeout(function () {
      domAccess.setElementInnerHTML(resultDiv, constants.bonusRoundText);
      onStartButtonClick();
    }, 2000);
  }

  /*
   * displayError method
   * updates result DOM element to display a message in case api fails and no data is returned
   * also stops animating the slots
   * @param {slotDivs} HTML DOM element collection representing the slots
   * @param {resultDiv} HTML DOM element that displays the result
   */

  function displayError(slotDivs, resultDiv) {
    domAccess.setElementInnerHTML(resultDiv, constants.serverErrorMsg);
    for (var i = 0; i < slotDivs.length; i++) {
      domAccess.setElementCssProperty(slotDivs[i], 'animation', 'none');
    }
  }

  return {
    init: init,
    resetGame: resetGame,
    startAnimation: startAnimation,
    stopAnimationAndDisplayWin: stopAnimationAndDisplayWin,
    displayWin: displayWin,
    getLargestIdenticalElementCount: getLargestIdenticalElementCount,
    displayError: displayError
  };
}());