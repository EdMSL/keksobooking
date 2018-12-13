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

  var copyAnnoucements;

  function getCopyOfAnnoucementsForFilter(annoucements) {
    copyAnnoucements = annoucements.slice();
  }

  function getRank(option) {
    var rank = 0;

    if (option.offer.type === selectedHousingType) {
      rank += 1;
    }
    if (option.offer.price === selectedHousingPrice) {
      rank += 1;
    }
    if (option.offer.rooms === selectedHousingRooms) {
      rank += 1;
    }
    if (option.offer.guests === selectedHousingGuests) {
      rank += 1;
    }

    return rank;
  }

  function onSelectChange(evt) {
    var select = evt.target;
    selectedHousingType = select.options[select.selectedIndex].value;
    copyAnnoucements = copyAnnoucements.sort(function (left, right) {
      var rankDiff = getRank(right) - getRank(left);
      // if (rankDiff === 0) {
      //   rankDiff = wizards.indexOf(left) - wizards.indexOf(right);
      // }
      return rankDiff;
    });
    // for (var i = 0; i < housingTypeSelect.options; i++) {

    //   if (housingTypeSelect.options.selected.value === 'Дворец') {
    //     newArr = window.map.loadedAnnoucementsCards.slice();
    //   }
    // }
    // console.log(copyAnnoucements);
    console.log(evt.target.id);
  }

  // function updatePins() {

  // }

  filtersBlock.addEventListener('change', onSelectChange);
  // housingTypeSelect.addEventListener('change', onSelectChange);

  window.filter = {
    getCopyOfAnnoucementsForFilter: getCopyOfAnnoucementsForFilter
  };
})();
