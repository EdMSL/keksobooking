'use strict';

(function () {
  var ESC_KEY_CODE = 27;

  window.utils = {
    getRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getRandomValueFromArray: function (array) {
      return array[window.utils.getRandomNumber(0, array.length - 1)];
    },
    getElementCoords: function (element) {
      var box = element.getBoundingClientRect();
      return {
        top: Math.round(box.top + pageYOffset),
        left: Math.round(box.left + pageXOffset)
      };
    },
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEY_CODE) {
        action();
      }
    },
    changeElementAttribute: function (element, attribute, value, index) {
      if (Array.isArray(value)) {
        element.setAttribute(attribute, value[index]);
      } else {
        element.setAttribute(attribute, value);
      }
    },
    removeListElements: function (list) {
      list.innerHTML = '';
    },
    generateClassModificator: function (className, modificator, index) {
      if (Array.isArray(modificator)) {
        return className + '--' + modificator[index];
      } else {
        return className + '--' + modificator;
      }
    }
  };
})();
