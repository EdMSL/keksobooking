'use strict';

(function () {
  window.utils = {
    getRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getRandomValueFromArray: function (array) {
      return array[window.utils.getRandomNumber(0, array.length - 1)];
    }
  };
})();
