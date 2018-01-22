'use strict';

/*
 * DOM Access module for Fruit Slot Machine game
 * contains methods to initialize the DOM and querying DOM elements for manipulation
 */

var FruitSlotGame = FruitSlotGame || {};
FruitSlotGame.DomAccess = FruitSlotGame.DomAccess || {};
FruitSlotGame.DomAccess = (function () {
  var slotDivs;
  var resultDiv;
  var startBtnDiv;

  /*
   * init method
   * initializes the DOM with the given number of slot; queries and fetches
   * DOM elements representing the slots, result text container and start button
   * @param {slotCount} Number of slots to be displayed
   */

  function init(slotCount) {
    var slotsDom = '';
    for (var i = 0; i < slotCount; i++) {
      slotsDom += '<div id="slot' + (i + 1) + '" class="slot bg-Symbol_' + i + '"></div>';
    }
    var gameDom = '<div class="content-wrapper">' +
      '<div class="main-container">' +
      '<div id="result"></div>' +
      '<div class=slot-wrapper>' +
      slotsDom +
      '<div class="clear"></div>' +
      '</div>' +
      '<div id="startButton" class="btn"></div>' +
      '</div>' +
      '</div>';

    document.body.insertAdjacentHTML('afterbegin', gameDom);
    slotDivs = document.getElementsByClassName('slot');
    resultDiv = document.getElementById('result');
    startBtnDiv = document.getElementById('startButton');
  }

  /*
   * getSlotDivs method
   * returns the DOM element collection representing the slots
   */

  function getSlotDivs() {
    return slotDivs;
  }

  /*
   * getStartBtnDiv method
   * returns the DOM element representing the start button
   */

  function getStartBtnDiv() {
    return startBtnDiv;
  }

  /*
   * getResultDiv method
   * returns the DOM element used for displaying the "win"
   */

  function getResultDiv() {
    return resultDiv;
  }

  /*
   * setElementCssProperty method
   * sets the given css property for an HTML DOM element
   * @param {element} DOM element
   * @param {property} String - CSSproperty for which value should be set
   * @param {value} String value to be set
   */

  function setElementCssProperty(element, property, value) {
    element.style[property] = value;
  }

  /*
   * setElementInnerHTML method
   * sets the inner HTML content for an HTML DOM element
   * @param {element} DOM element
   * @param {text} String to be set as inner HTML
   */

  function setElementInnerHTML(element, text) {
    element.innerHTML = text;
  }

  /*
   * replaceClass method
   * updates slot image by replacing current image css class with the one
   * corresponding to the number returned from api
   * @param {element} DOM element representing a particular slot
   * @param {number} Number indicating the index of the slot
   * @param {imageClsPrefix} String used as the prefix for slot image css class
   */

  function replaceClass(element, number, imageClsPrefix) {
    var regex = new RegExp(imageClsPrefix + '\\d+', 'g');
    var match = element.className.match(regex);
    if (match) {
      element.className = element.className.replace(match[0], imageClsPrefix + number);
    }
  }

  return {
    init: init,
    getStartBtnDiv: getStartBtnDiv,
    getSlotDivs: getSlotDivs,
    getResultDiv: getResultDiv,
    setElementCssProperty: setElementCssProperty,
    setElementInnerHTML: setElementInnerHTML,
    replaceClass: replaceClass
  };
}());