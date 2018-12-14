'use strict';

(function () {
  var filtersBlock = window.data.mapBlock.querySelector('.map__filters');
  var housingTypeSelect = filtersBlock.querySelector('#housing-type');
  var housingPriceSelect = filtersBlock.querySelector('#housing-price');
  var housingRoomsSelect = filtersBlock.querySelector('#housing-rooms');
  var housingGuestsSelect = filtersBlock.querySelector('#housing-guests');
  var housingFeaturesInputs = filtersBlock.querySelectorAll('#housing-features input');

  var selectedHousingType;
  var selectedHousingPrice;
  var selectedHousingRooms;
  var selectedHousingGuests;

  var middleMinPrice = 10000;
  var middleMaxPrice = 50000;

  var copyAnnoucements;
  var changedCopyAnnoucements;

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

  // function getRank(option) {
  //   var rank = 0;

  //   if (option.offer.type === selectedHousingType) {
  //     rank += 1;
  //   }
  //   if (getPrice(option.offer.price) === selectedHousingPrice) {
  //     rank += 1;
  //   }
  //   if (option.offer.rooms === selectedHousingRooms) {
  //     rank += 1;
  //   }
  //   if (option.offer.guests === selectedHousingGuests) {
  //     rank += 1;
  //   }
  //   return rank;
  // }

  // function getCurrentSelectValue(element) {
  //   var selectedValue;
  //   if (element.id === 'housing-type') {
  //     selectedValue = selectedHousingType = element.options[element.selectedIndex].value;
  //   }
  //   if (element.id === 'housing-price') {
  //     selectedValue = selectedHousingPrice = element.options[element.selectedIndex].value;
  //   }
  //   if (element.id === 'housing-rooms') {
  //     selectedValue = selectedHousingRooms = element.options[element.selectedIndex].value;
  //   }
  //   if (element.id === 'housing-guests') {
  //     selectedValue = selectedHousingGuests = element.options[element.selectedIndex].value;
  //   }
  //   return selectedValue;
  // }

  // function getSelectValueForOffer(element) {
  //   var idArr = element.id.split('-');
  //   return idArr[idArr.length - 1];
  // }

  // function filterElements(element) {
  //   return element.offer[housing] + '' === set;
  // }

  // function onSelectChange(evt) {
  //   var select = evt.target;
  //   var set = getCurrentSelectValue(select);
  //   var housing = getSelectValueForOffer(select);
  //   changedCopyAnnoucements = copyAnnoucements.slice().
  //   filter(function (element) {
  //     return element.offer[housing] + '' === set;
  //   }).
  //   sort(function (left, right) {
  //     var rankDiff = getRank(right) - getRank(left);
  //     // if (rankDiff === 0) {
  //     //   rankDiff = wizards.indexOf(left) - wizards.indexOf(right);
  //     // }
  //     return rankDiff;
  //   });

  //   updatePins(changedCopyAnnoucements);
  // }

  // function filter(element, value) {
  //   return offerElement === selectedValue;
  // }

  function showNeed(select, elementOffer) {
    var selectedValue = select.options[select.selectedIndex].value;
    changedCopyAnnoucements = copyAnnoucements.slice().
    filter(function (element) {
      if (selectedValue === 'any') {
        return copyAnnoucements;
      }
      if (elementOffer === 'price') {
        return getPrice(element.offer[elementOffer]) + '' === selectedValue;
      } else {
        return element.offer[elementOffer] + '' === selectedValue;
      }
    });
    updatePins(changedCopyAnnoucements);
    console.log(changedCopyAnnoucements)
    // .sort(function (left, right) {
    //   var rankDiff = getRank(right) - getRank(left);
    //   return rankDiff;
    // });
  }

  function onHousingTypeSelectChange(evt) {
    showNeed(evt.target, 'type');

    // updatePins(changedCopyAnnoucements);
  }

  function onHousingPriceSelectChange(evt) {
    showNeed(evt.target, 'price');

    // updatePins(changedCopyAnnoucements);
  }

  function onHousingRoomsSelectChange(evt) {
    showNeed(evt.target, 'rooms');

    // updatePins(changedCopyAnnoucements);
  }

  function onHousingGuestsSelectChange(evt) {
    showNeed(evt.target, 'guests');

    // updatePins(changedCopyAnnoucements);
  }

  function updatePins(annoucements) {
    window.pins.closeAnnouncement();
    window.pins.clearPins();
    window.render.renderMapPins(annoucements);
    window.pins.mapPins = window.data.mapBlock.querySelectorAll('.map__pin:not(.map__pin--main)');
    window.pins.setMapPinsActionOnClick(annoucements);
    window.pins.relocatePins(window.pins.mapPins);
  }

  housingTypeSelect.addEventListener('change', onHousingTypeSelectChange);
  housingPriceSelect.addEventListener('change', onHousingPriceSelectChange);
  housingRoomsSelect.addEventListener('change', onHousingRoomsSelectChange);
  housingGuestsSelect.addEventListener('change', onHousingGuestsSelectChange);

  window.filter = {
    getCopyOfAnnoucementsForFilter: getCopyOfAnnoucementsForFilter
  };
})();
