'use strict';

var NOT_FOR_GUESTS_ROOMS = 100;
var NO_GUESTS = 0;

var mapPinMain = window.data.mapBlock.querySelector('.map__pin--main');
var totalCards = 8;
var notice = document.querySelector('.notice');
var noticeForm = notice.querySelector('.ad-form');
var noticeFieldsets = notice.querySelectorAll('.ad-form__element');
var addressInput = notice.querySelector('#address');
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
var isMapActivated = false;
var startMapPinMainCoords = window.utils.getElementCoords(mapPinMain);

function relocatePins() {
  var pins = window.data.mapBlock.querySelectorAll('.map__pin:not(.map__pin--main)');

  for (var i = 0; i < pins.length; i++) {
    pins[i].style.left = parseInt(pins[i].style.left, 10) - pins[i].offsetWidth / 2 + 'px';
    pins[i].style.top = parseInt(pins[i].style.top, 10) - pins[i].offsetHeight + 'px';
  }
}

function disableFormInputs() {
  for (var i = 0; i < noticeFieldsets.length; i++) {
    noticeFieldsets[i].setAttribute('disabled', true);
  }
}

function enableFormInputs() {
  for (var i = 0; i < noticeFieldsets.length; i++) {
    noticeFieldsets[i].removeAttribute('disabled');
  }
}

function setAddress(coords) {
  addressInput.value = (coords.left + Math.ceil(mapPinMain.offsetWidth / 2)) + ',' + (coords.top + mapPinMain.offsetHeight);
}

function closeAnnouncement() {
  var element = window.data.mapBlock.querySelector('.map__card');
  window.data.mapBlock.removeChild(element);
}

var onAnnouncementEscPress = function (evt) {
  window.utils.isEscEvent(evt, closeAnnouncement);
};

function onCloseButtonClick() {
  closeAnnouncement();
  document.removeEventListener('keydown', onAnnouncementEscPress);
}

function setCloseButtonActionOnClick(element) {
  var closeAnnouncementButton = element.querySelector('.popup__close');
  closeAnnouncementButton.addEventListener('click', onCloseButtonClick);
}

function onMapPinClick(currentPin, currentAnnouncement) {
  currentPin.addEventListener('click', function () {
    var oldAnnocement = window.data.mapBlock.querySelector('.map__card');

    if (oldAnnocement) {
      window.data.mapBlock.removeChild(oldAnnocement);
    }

    window.render.renderAnnouncement(currentAnnouncement);

    var newAnnocement = window.data.mapBlock.querySelector('.map__card');
    setCloseButtonActionOnClick(newAnnocement);
    document.addEventListener('keydown', onAnnouncementEscPress);
  });
}

function setMapPinsActionOnClick(annocements) {
  var mapPin = window.data.mapBlock.querySelectorAll('.map__pin:not(.map__pin--main)');

  for (var i = 0; i < annocements.length; i++) {
    onMapPinClick(mapPin[i], annocements[i]);
  }
}

function activateMapAndForm() {
  var announcementCards = window.generateCards(totalCards);

  window.data.mapBlock.classList.remove('map--faded');
  noticeForm.classList.remove('ad-form--disabled');

  enableFormInputs();
  window.render.renderMapPins(announcementCards);
  relocatePins();
  setMapPinsActionOnClick(announcementCards);
}

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

function setPosition(element, coordsX, coordsY) {
  element.style.left = coordsX + 'px';
  element.style.top = coordsY + 'px';
}

disableFormInputs();
setAddress(startMapPinMainCoords);
setMaxAvailableGuests();

mapPinMain.addEventListener('mousedown', function (evtDown) {
  evtDown.preventDefault();
  if (!isMapActivated) {
    activateMapAndForm();
    isMapActivated = true;
  }

  var pin = evtDown.currentTarget;
  var pinCoords = window.utils.getElementCoords(pin);
  var mapCoords = window.utils.getElementCoords(window.data.map);
  var shiftX = evtDown.pageX - pinCoords.left;
  var shiftY = evtDown.pageY - pinCoords.top;

  pin.style.zIndex = 2;

  var onMouseMove = function (evtMove) {
    moveTo(pin, evtMove);
  };

  var onMouseUp = function (evtUp) {
    evtUp.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  function moveTo(element, evt) {
    var newLeft = evt.pageX - mapCoords.left - shiftX;
    var newTop = evt.pageY - mapCoords.top - shiftY;

    if (newLeft < 0 - Math.ceil(pin.offsetWidth / 2)) {
      newLeft = 0 - Math.ceil(pin.offsetWidth / 2);
    }
    if (newLeft > window.data.mapBlock.offsetWidth - Math.ceil(pin.offsetWidth / 2)) {
      newLeft = window.data.mapBlock.offsetWidth - Math.ceil(pin.offsetWidth / 2);
    }
    if (newTop < window.data.MAP_Y_MIN - pin.offsetHeight) {
      newTop = window.data.MAP_Y_MIN - pin.offsetHeight;
    }
    if (newTop > window.data.MAP_Y_MAX - pin.offsetHeight) {
      newTop = window.data.MAP_Y_MAX - pin.offsetHeight;
    }

    setPosition(element, newLeft, newTop);
    pinCoords.left = newLeft;
    pinCoords.top = newTop;
    setAddress(pinCoords);
  }
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

setAnnoucementFormListeners();
