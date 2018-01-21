'use strict';

describe('Fruit Slot Machine Game Tests - ', function () {

  // API for interacting with the page.
  var controls = {
    get slots() {
      return document.getElementsByClassName('slot');
    },
    get result() {
      return document.getElementById('result');
    },
    get startButton() {
      return document.getElementById('startButton');
    },
    clickStart: function () {
      document.getElementById('startButton').click();
    }
  };
  var appModule = window.FruitSlotGame.App;
  var domAccessModule = window.FruitSlotGame.DomAccess;
  var dataAccessModule = window.FruitSlotGame.DataAccess;
  var apiUtilModule = window.FruitSlotGame.Utils.ApiUtility;
  var constants = window.FruitSlotGame.AppConstants;

  // initialize FruitSlotGame.App and insert html content in to DOM
  beforeEach(function () {
    appModule.init(domAccessModule, dataAccessModule, apiUtilModule, constants);
  });

  // remove html content from the DOM
  afterEach(function () {
    document.body.removeChild(document.body.children[0]);
  });

  it('should render slots, start button and result div in the DOM', function () {
    expect(controls.slots).toBeDefined();
    expect(controls.startButton).toBeDefined();
    expect(controls.result).toBeDefined();
  });

  it('should clear previous result every time start button is clicked', function () {
    controls.result.innerHTML = constants.bigWinText;
    appModule.resetGame(controls.result, controls.slots);
    expect(controls.result.innerHTML).toBe('');
    for (var i = 0; i < controls.slots.length; i++) {
      expect(controls.slots[i].classList).toContain(constants.imageClsPrefix + i);
    }
  });

  it('should start animating the slots when start button is clicked', function () {
    appModule.startAnimation(controls.slots);
    for (var i = 0; i < controls.slots.length; i++) {
      expect(controls.slots[i].style.animation).toMatch(/fruit-reel 0.5s/);
    }
  });

  describe('stop animation asynchronous spec', function () {
    var originalTimeout;
    beforeEach(function () {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    afterEach(function () {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('should stop animating the slots after specified timeout once api has returned data', function (done) {
      var data = {
        win: [3, 4, 3],
        activateBonus: false
      };
      appModule.startAnimation(controls.slots);
      for (var i = 0; i < controls.slots.length; i++) {
        expect(controls.slots[i].style.animation).toMatch(/fruit-reel 0.5s/);
      }
      appModule.stopAnimationAndDisplayWin(data, controls.slots, controls.result);
      setTimeout(function () {
        for (var i = 0; i < controls.slots.length; i++) {
          expect(controls.slots[i].classList).toContain(constants.imageClsPrefix + data.win[i]);
          expect(controls.slots[i].style.animation).toBe('none');
        }
        done();
      }, 6000);
    });
  });

  it('should return the largest count of a repeated number in an array', function () {
    var array = [3, 3, 4, 2, 1, 2, 3, 0, 2, 0];
    // should return 3 since 2 is repeated 3 times (closest 3 and 0 repeated 2 times)
    expect(appModule.getLargestIdenticalElementCount(array)).toBe(3);
  });

  it('should display error message in the result DOM element when api fails', function () {
    appModule.displayError(controls.slots, controls.result);
    expect(controls.result.innerHTML).toBe(constants.serverErrorMsg);
  });

  describe('Different win scenarios - ', function () {

    it('should display - No Win! as result if api returns different numbers in win array', function () {
      var data = {
        win: [1, 2, 3],
        activateBonus: false
      };
      appModule.displayWin(data, controls.result);
      expect(controls.result.innerHTML).toBe(constants.noWinText);
    });

    it('should display - Small Win! as result if api returns 2 equal numbers in win array', function () {
      var data = {
        win: [5, 2, 2],
        activateBonus: false
      };
      appModule.displayWin(data, controls.result);
      expect(controls.result.innerHTML).toBe(constants.smallWinText);
    });

    it('should display - Big Win! as result if api returns all equal numbers in win array', function () {
      var data = {
        win: [3, 3, 3],
        activateBonus: false
      };
      appModule.displayWin(data, controls.result);
      expect(controls.result.innerHTML).toBe(constants.bigWinText);
    });

    it('should display - Bonus Round as result if api returns activateBonus flag as true', function (done) {
      var data = {
        win: [1, 2, 3],
        activateBonus: true
      };
      spyOn(window.FruitSlotGame.DataAccess, 'getWinData').and.callFake(function (callback) {
        callback({
          win: [1, 2, 3],
          activateBonus: false
        });
      });
      appModule.displayWin(data, controls.result);
      setTimeout(function () {
        expect(controls.result.innerHTML).toBe(constants.bonusRoundText);
        done();
      }, 3000);
    });

  });

});