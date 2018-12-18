'use strict';

(function () {
  var filtersBlock = window.data.mapBlock.querySelector('.map__filters');
  var housingSelects = filtersBlock.querySelectorAll('select');
  var housingFeaturesContainer = filtersBlock.querySelector('.map__features');
  var housingFeaturesInputs = filtersBlock.querySelectorAll('#housing-features input');

  var middleMinPrice = 10000;
  var middleMaxPrice = 50000;

  var copyAnnoucements;

  function getCopyOfAnnoucementsForFilter(annoucements) {
    copyAnnoucements = annoucements.slice();
  }

  function getPrice(price) {
    var priceStr;
    if (+price < middleMinPrice) {
      priceStr = 'low';
    }
    if (+price >= middleMinPrice && +price < middleMaxPrice) {
      priceStr = 'middle';
    }
    if (+price >= middleMaxPrice) {
      priceStr = 'high';
    }
    return priceStr;
  }

  function getOfferValue(element) {
    var idArr = element.split('-');
    return idArr[idArr.length - 1];
  }

  function getSelectsSelectedValues() {
    var newArr = Array.prototype.map.call(housingSelects, function (element) {
      return element.options[element.selectedIndex].value;
    });
    return newArr;
  }

  function getSuitableAnnoucementsAfterSelects(annoucements) {
    var currentAnnoucements = annoucements;
    var selectsSelectedValues = getSelectsSelectedValues();

    for (var i = 0; i < selectsSelectedValues.length; i++) {
      var currentSelectValue = selectsSelectedValues[i];
      var currentOfferValue = getOfferValue(housingSelects[i].id);

      if (currentSelectValue === 'any') {
        continue;
      }

      currentAnnoucements = currentAnnoucements.filter(function (element) {
        if (currentOfferValue === 'price') {
          return getPrice(element.offer[currentOfferValue]) + '' === currentSelectValue;
        } else {
          return element.offer[currentOfferValue] + '' === currentSelectValue;
        }
      });
    }
    return currentAnnoucements;
  }

  function getSelectedCheckboxesValues() {
    var newArr = [];
    for (var i = 0; i < housingFeaturesInputs.length; i++) {
      var currentFeaturesInputValue = getOfferValue(housingFeaturesInputs[i].id);
      if (housingFeaturesInputs[i].checked) {
        newArr.push(currentFeaturesInputValue);
      }
    }
    return newArr;
  }

  function getSuitableAnnoucementsAfterCheckboxes(annoucements) {
    var currentAnnoucements = annoucements;
    var selectedFeatures = getSelectedCheckboxesValues();

    for (var i = 0; i < selectedFeatures.length; i++) {
      var currentSelectedFeature = selectedFeatures[i];

      currentAnnoucements = currentAnnoucements.filter(function (element) {
        for (var j = 0; j < element.offer.features.length; j++) {
          var currentAnnousementFeature = element.offer.features[j];
          var isAnnoucementHaveFeature;

          if (currentAnnousementFeature === currentSelectedFeature) {
            isAnnoucementHaveFeature = true;
          }
        }
        return isAnnoucementHaveFeature;
      });
    }
    return currentAnnoucements;
  }

  function selectSuitableAnnoucements() {
    var suitableAnnoucements = copyAnnoucements.slice();

    suitableAnnoucements = getSuitableAnnoucementsAfterSelects(suitableAnnoucements);
    suitableAnnoucements = getSuitableAnnoucementsAfterCheckboxes(suitableAnnoucements);

    updatePins(suitableAnnoucements);
  }

  function updatePins(annoucements) {
    window.pins.closeAnnouncement();
    window.pins.clearPins();
    window.render.renderMapPins(annoucements);
    window.pins.mapPins = window.data.mapBlock.querySelectorAll('.map__pin:not(.map__pin--main)');
    window.pins.relocatePins(window.pins.mapPins);
  }

  function resetSelects() {
    housingSelects.forEach(function (element) {
      element.selectedIndex = 0;
    });
  }

  function disableSelects() {
    housingSelects.forEach(function (element) {
      element.setAttribute('disabled', true);
    });
  }

  function enableSelects() {
    housingSelects.forEach(function (element) {
      element.removeAttribute('disabled');
    });
  }

  function resetCheckboxes() {
    housingFeaturesInputs.forEach(function (element) {
      element.checked = false;
    });
  }

  function disableCheckboxes() {
    housingFeaturesContainer.setAttribute('disabled', true);
  }

  function enableCheckboxes() {
    housingFeaturesContainer.removeAttribute('disabled');
  }

  function resetFilters() {
    resetSelects();
    resetCheckboxes();
  }

  function disableFilters() {
    disableSelects();
    disableCheckboxes();
  }

  function enableFilters() {
    enableSelects();
    enableCheckboxes();
  }

  var onSelectChange = window.debounce(function () {
    selectSuitableAnnoucements();
  });

  filtersBlock.addEventListener('change', onSelectChange);

  window.filter = {
    disableFilters: disableFilters,
    enableFilters: enableFilters,
    getCopyOfAnnoucementsForFilter: getCopyOfAnnoucementsForFilter,
    resetFilters: resetFilters
  };
})();
