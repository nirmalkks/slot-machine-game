'use strict';

import DomAccess from './domAccess';
import DataAccess from './dataAccess';
import ApiUtility from './utils/apiUtility';
import AppConstants from './utils/appConstants';

/*
 * App module for Fruit Slot Machine game
 * contains methods to start, stop and reset game
 */

export default class GameApp {

  /*
   * init method
   * all the dependencies for the App module are injected here
   * also binds start button click handler
   * @param {domAccessModule} DomAccessModule object
   * @param {dataAccessModule} DataAccessModule object
   * @param {apiUtilsModule} ApiUtilityModule object
   * @param {appConstantsModule} AppConstantsModule object
   */
  constructor() {
    this.constants = AppConstants;
    this.domAccess = new DomAccess(this.constants.slotCount);
    this.data = new DataAccess(ApiUtility, this.constants.apiURL, this.constants.slotCount);
    this.isBonusRound = false;
    this.domAccess.getStartBtnDiv().addEventListener('click', this.onStartButtonClick.bind(this));
  }

  /*
   * onStartButtonClick method
   * event handler for start button click
   * resets the DOM to the initial state, starts animating the slots
   * and calls the api to get the "win" number sequence
   */

  onStartButtonClick() {
    var slotDivs = this.domAccess.getSlotDivs();
    var resultDiv = this.domAccess.getResultDiv();
    var callbackFn = function (data) {
      if (data) {
        this.stopAnimationAndDisplayWin(data, slotDivs, resultDiv);
      } else {
        this.displayError(slotDivs, resultDiv);
      }
    };
    this.resetGame(resultDiv, slotDivs, this.isBonusRound);
    this.startAnimation(slotDivs);
    this.data.getWinData(callbackFn.bind(this));
  }

  /*
   * resetGame method
   * resets game by clearing previous result if any
   * also sets slot images to the default ones
   * @param {resultDiv} HTML DOM element that displays the result
   * @param {slotDivs} HTML DOM element collection representing the slots
   * @param {isBonusRound} Boolean flag to indicate if bonus round is triggered
   */

  resetGame(resultDiv, slotDivs, isBonusRound) {
    if (!isBonusRound) {
      this.domAccess.setElementInnerHTML(resultDiv, '');
    }
    for (var i = 0; i < slotDivs.length; i++) {
      this.domAccess.replaceClass(slotDivs[i], i, this.constants.imageClsPrefix);
    }
  }

  /*
   * startAnimation method
   * starts animating the slots when start button is clicked
   * @param {slotDivs} HTML DOM element collection representing the slots
   */

  startAnimation(slotDivs) {
    for (var i = 0; i < slotDivs.length; i++) {
      this.domAccess.setElementCssProperty(slotDivs[i], 'animation', this.constants.defaultAnimationCss);
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

  stopAnimationAndDisplayWin(data, slotDivs, resultDiv) {
    const timeout = 5000;
    const that = this;
    for (var i = 0; i < slotDivs.length; i++) {
      (function (index) {
        setTimeout(function () {
          that.domAccess.replaceClass(slotDivs[index], data.win[index], that.constants.imageClsPrefix);
          that.domAccess.setElementCssProperty(slotDivs[index], 'animation', 'none');
          if (index === slotDivs.length - 1) {
            that.displayWin(data, resultDiv);
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

  displayWin(data, resultDiv) {
    var result;
    var win = data.win;
    var largestIdenticalElementCount = this.getLargestIdenticalElementCount(data.win);

    if (largestIdenticalElementCount === win.length) {
      result = this.constants.bigWinText;
    } else if (largestIdenticalElementCount >= 2) {
      result = this.constants.smallWinText;
    } else {
      result = this.constants.noWinText;
    }
    this.domAccess.setElementInnerHTML(resultDiv, result);
    this.isBonusRound = data.activateBonus;
    if (this.isBonusRound) {
      this.triggerBonusRound(resultDiv);
    }
  }

  /*
   * getLargestIdenticalElementCount method
   * takes "win" array and finds out the repeat count for each number
   * and returns the largest count for any number which displayWin()
   * uses to display the correct "win" text
   * @param {array} Array containing the "win" number sequence
   */

  getLargestIdenticalElementCount(array) {
    var elementCountObj = array.reduce(function (elCountObj, element) {
      elCountObj[element] = ++elCountObj[element] || 1;
      return elCountObj;
    }, {});
    var keysArray = Object.keys(elementCountObj);
    var firstElCount = elementCountObj[keysArray[0]];

    if (keysArray.length === 1) {
      return firstElCount;
    } else {
      return Object.keys(elementCountObj).reduce(function (largestCountSoFar, currentEl) {
        return largestCountSoFar > elementCountObj[currentEl] ? largestCountSoFar : elementCountObj[currentEl];
      }, firstElCount);
    }
  }

  /*
   * triggerBonusRound method
   * updates result DOM element with text letting user know that bonus round is activated
   * invokes start button click handler method to spin the slots once again
   * @param {resultDiv} HTML DOM element that displays the result
   */

  triggerBonusRound(resultDiv) {
    const that = this;
    setTimeout(function () {
      that.domAccess.setElementInnerHTML(resultDiv, that.constants.bonusRoundText);
      that.onStartButtonClick();
    }, 2000);
  }

  /*
   * displayError method
   * updates result DOM element to display a message in case api fails and no data is returned
   * also stops animating the slots
   * @param {slotDivs} HTML DOM element collection representing the slots
   * @param {resultDiv} HTML DOM element that displays the result
   */

  displayError(slotDivs, resultDiv) {
    this.domAccess.setElementInnerHTML(resultDiv, this.constants.serverErrorMsg);
    for (var i = 0; i < slotDivs.length; i++) {
      this.domAccess.setElementCssProperty(slotDivs[i], 'animation', 'none');
    }
  }

}