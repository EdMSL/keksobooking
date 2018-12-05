'use strict';

(function () {
  var NOT_FOR_GUESTS_ROOMS = 100;
  var NO_GUESTS = 0;

  var notice = window.data.notice;
  var typeInput = notice.querySelector('#type');
  var priceInput = notice.querySelector('#price');
  var minAvailablePrice = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  var timeinInput = notice.querySelector('#timein');
  var timeoutInput = notice.querySelector('#timeout');
  var roomsInput = notice.querySelector('#room_number');
  var capacityInput = notice.querySelector('#capacity');

  function setMinAvailablePriceToPriceInput() {
    for (var i = 0; i < typeInput.options.length; i++) {
      if (typeInput.value === window.data.apartmentTypeShort[i]) {
        priceInput.setAttribute('min', minAvailablePrice[window.data.apartmentTypeShort[i]]);
        priceInput.setAttribute('placeholder', minAvailablePrice[window.data.apartmentTypeShort[i]]);
      }
    }
  }

  function setIdenticalTimeToTimeInputs(evt) {
    timeoutInput.selectedIndex = timeinInput.selectedIndex = evt.target.selectedIndex;
  }

  function onTimeInputChange(evt) {
    setIdenticalTimeToTimeInputs(evt);
  }

  function setNotForGuestsApartment(quontityOfRooms, listOfCapacitys, availableCapacity) {
    for (var i = 0; i < roomsInput.options.length; i++) {
      if (quontityOfRooms > NO_GUESTS) {
        listOfCapacitys[i].setAttribute('disabled', true);
      }
      listOfCapacitys[availableCapacity].removeAttribute('disabled');
    }
  }

  function isCapasityGuestsMoreThenRooms(capasity, rooms, noGuests) {
    return capasity > rooms || capasity === noGuests;
  }

  function setMaxAvailableGuests() {
    var selectedQuontityOfRoomsIndex = roomsInput.selectedIndex;
    var selectedQuontityOfRooms = +roomsInput.options[selectedQuontityOfRoomsIndex].value;
    var currentCapasityIndex = capacityInput.options.selectedIndex;
    var currentCapasityInInput = +capacityInput.options[currentCapasityIndex].value;

    for (var i = 0; i < roomsInput.options.length; i++) {
      var capacitysOfGuests = capacityInput.options;
      var currentCapacityGuests = +capacityInput.options[i].value;

      if (isCapasityGuestsMoreThenRooms(currentCapacityGuests, selectedQuontityOfRooms, NO_GUESTS)) {
        capacitysOfGuests[i].setAttribute('disabled', true);
      } else {
        capacitysOfGuests[i].removeAttribute('disabled');
      }

      if (selectedQuontityOfRooms === NOT_FOR_GUESTS_ROOMS) {
        setNotForGuestsApartment(selectedQuontityOfRooms, capacitysOfGuests, selectedQuontityOfRoomsIndex);
        capacityInput.selectedIndex = selectedQuontityOfRoomsIndex;
      }
    }
    if (isCapasityGuestsMoreThenRooms(currentCapasityInInput, selectedQuontityOfRooms, NO_GUESTS)) {
      capacityInput.selectedIndex = roomsInput.selectedIndex;
    }
  }

  function onRoomInputChange() {
    setMaxAvailableGuests();
  }

  function setAnnoucementFormListeners() {
    typeInput.addEventListener('change', function () {
      setMinAvailablePriceToPriceInput();
    });
    timeinInput.addEventListener('change', onTimeInputChange);
    timeoutInput.addEventListener('change', onTimeInputChange);
    roomsInput.addEventListener('change', onRoomInputChange);
  }

  window.form = {
    setAnnoucementFormListeners: setAnnoucementFormListeners,
    setMaxAvailableGuests: setMaxAvailableGuests
  };
})();
