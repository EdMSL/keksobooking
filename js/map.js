'use strict';

var mapBlock = document.querySelector('.map');

var NOT_FOR_GUESTS_ROOMS = 100;
var NO_GUESTS = 0;

var map = document.querySelector('.map__pins');
var mapPinMain = mapBlock.querySelector('.map__pin--main');
var filtersContainer = document.querySelector('.map__filters-container');
var totalCards = 8;
var apartmentTypeShortPrint = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
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

function renderMapPins(cards) {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < cards.length; i++) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinImg = pinElement.querySelector('img');

    pinElement.style.left = cards[i].location.x - pinElement.offsetWidth / 2 + 'px';
    pinElement.style.top = cards[i].location.y - pinElement.offsetHeight + 'px';
    pinImg.alt = cards[i].offer.title;
    pinImg.src = cards[i].author.avatar;

    fragment.appendChild(pinElement);
  }
  map.appendChild(fragment);
}

function relocatePins() {
  var pins = mapBlock.querySelectorAll('.map__pin:not(.map__pin--main)');

  for (var i = 0; i < pins.length; i++) {
    pins[i].style.left = parseInt(pins[i].style.left, 10) - pins[i].offsetWidth / 2 + 'px';
    pins[i].style.top = parseInt(pins[i].style.top, 10) - pins[i].offsetHeight + 'px';
  }
}

function generateFeaturesElements(featuresList, quontityOfElements, element, className, modificator) {
  window.utils.removeListElements(featuresList);
  for (var i = 0; i < quontityOfElements; i++) {
    var newElement = element.cloneNode(true);
    newElement.className = className + ' ' + window.utils.generateClassModificator(className, modificator, i);
    featuresList.appendChild(newElement);
  }
}

function generateOfferPhotosElements(photosList, quontityOfElements, element, attribute, value) {
  window.utils.removeListElements(photosList);
  for (var i = 0; i < quontityOfElements; i++) {
    var newElement = element.cloneNode(true);
    window.utils.changeElementAttribute(newElement, attribute, value, i);
    photosList.appendChild(newElement);
  }
}

function renderAnnouncement(card) {
  var announcementTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var announcementElement = announcementTemplate.cloneNode(true);
  var announcementTitle = announcementElement.querySelector('.popup__title');
  var announcementAddress = announcementElement.querySelector('.popup__text--address');
  var announcementPrice = announcementElement.querySelector('.popup__text--price');
  var announcementType = announcementElement.querySelector('.popup__type');
  var announcementCapacity = announcementElement.querySelector('.popup__text--capacity');
  var announcementTime = announcementElement.querySelector('.popup__text--time');
  var announcementFeaturesList = announcementElement.querySelector('.popup__features');
  var announcementFeature = announcementFeaturesList.querySelector('.popup__feature:first-of-type');
  var announcementDescription = announcementElement.querySelector('.popup__description');
  var announcementPhotosList = announcementElement.querySelector('.popup__photos');
  var announcementPhoto = announcementPhotosList.querySelector('.popup__photo:first-of-type');
  var announcementAvatar = announcementElement.querySelector('.popup__avatar');
  var fragment = document.createDocumentFragment();

  announcementTitle.textContent = card.offer.title;
  announcementAddress.textContent = card.offer.address;
  announcementPrice.textContent = card.offer.price + '₽/ночь';
  announcementType.textContent = apartmentTypeShortPrint[card.offer.type];
  announcementCapacity.textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей.';
  announcementTime.textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;

  generateFeaturesElements(announcementFeaturesList, card.offer.features.length, announcementFeature, 'popup__feature', card.offer.features);

  announcementDescription.textContent = card.offer.description;

  generateOfferPhotosElements(announcementPhotosList, card.offer.photos.length, announcementPhoto, 'src', card.offer.photos);

  announcementAvatar.src = card.author.avatar;

  fragment.appendChild(announcementElement);
  mapBlock.insertBefore(fragment, filtersContainer);
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
  var element = mapBlock.querySelector('.map__card');
  mapBlock.removeChild(element);
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
    var oldAnnocement = mapBlock.querySelector('.map__card');

    if (oldAnnocement) {
      mapBlock.removeChild(oldAnnocement);
    }

    renderAnnouncement(currentAnnouncement);

    var newAnnocement = mapBlock.querySelector('.map__card');
    setCloseButtonActionOnClick(newAnnocement);
    document.addEventListener('keydown', onAnnouncementEscPress);
  });
}

function setMapPinsActionOnClick(annocements) {
  var mapPin = mapBlock.querySelectorAll('.map__pin:not(.map__pin--main)');

  for (var i = 0; i < annocements.length; i++) {
    onMapPinClick(mapPin[i], annocements[i]);
  }
}

function activateMapAndForm() {
  var announcementCards = window.generateCards(totalCards);

  mapBlock.classList.remove('map--faded');
  noticeForm.classList.remove('ad-form--disabled');

  enableFormInputs();
  renderMapPins(announcementCards);
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
  var mapCoords = window.utils.getElementCoords(map);
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
    if (newLeft > mapBlock.offsetWidth - Math.ceil(pin.offsetWidth / 2)) {
      newLeft = mapBlock.offsetWidth - Math.ceil(pin.offsetWidth / 2);
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
