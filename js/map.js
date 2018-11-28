'use strict';

var MAP_Y_MIN = 130;
var MAP_Y_MAX = 630;
var MIN_AUTHOR_AVATAR_START_NUMBER = 1;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var MAX_GUESTS = 10;
var MIN_FEATURES_QUANTITY = 1;

var mapBlock = document.querySelector('.map');
var map = document.querySelector('.map__pins');
var mapXmax = map.clientWidth;
var filtersContainer = document.querySelector('.map__filters-container');
var totalCards = 8;
var apartmentType = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var apartmentTypeShort = ['palace', 'flat', 'house', 'bungalo'];
var apartmentTypeShortPrint = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
var checkins = ['12:00', '13:00', '14:00'];
var checkouts = ['12:00', '13:00', '14:00'];
var apartmentFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var apartmentPhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];



var mapPinMain = mapBlock.querySelector('.map__pin--main');

var MAP_PIN_MAIN_WIDTH = mapPinMain.clientWidth;
var MAP_PIN_MAIN_HEIGHT = mapPinMain.clientHeight;

var notice = document.querySelector('.notice');
var noticeForm = notice.querySelector('.ad-form');
var noticeFieldsets = notice.querySelectorAll('.ad-form__element');
var addressInput = notice.querySelector('#address');

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAuthor(authorNumber) {
  var author = {};
  author.avatar = 'img/avatars/user0' + (MIN_AUTHOR_AVATAR_START_NUMBER + authorNumber) + '.png';

  return author;
}

function generateOffer(cardNumber, coordsX, coordsY) {
  var offer = {};

  offer.title = apartmentType[cardNumber];
  offer.adress = coordsX + ', ' + coordsY;
  offer.price = getRandomNumber(MIN_PRICE, MAX_PRICE);
  offer.type = apartmentTypeShort[getRandomNumber(0, apartmentTypeShort.length - 1)];
  offer.rooms = getRandomNumber(MIN_ROOMS, MAX_ROOMS);
  offer.guests = getRandomNumber(1, MAX_GUESTS);
  offer.checkin = checkins[getRandomNumber(0, checkins.length - 1)];
  offer.checkout = checkouts[getRandomNumber(0, checkouts.length - 1)];

  offer.features = [];
  for (var i = 0; i < getRandomNumber(MIN_FEATURES_QUANTITY, apartmentFeatures.length); i++) {
    offer.features.push(apartmentFeatures[i]);
  }

  offer.description = '';

  offer.photos = [];
  for (var j = 0; j < apartmentPhotos.length; j++) {
    offer.photos.push(apartmentPhotos[j]);
  }

  return offer;
}

function generateLocationCoords() {
  var coords = {};
  coords.x = getRandomNumber(0, mapXmax);
  coords.y = getRandomNumber(MAP_Y_MIN, MAP_Y_MAX);

  return coords;
}

function generateCardData(cardNumber) {
  var objElement = {};
  var apartnentCoords = generateLocationCoords();
  var coordsX = apartnentCoords.x;
  var coordsY = apartnentCoords.y;
  objElement.author = generateAuthor(cardNumber);
  objElement.offer = generateOffer(cardNumber, coordsX, coordsY);
  objElement.location = apartnentCoords;

  return objElement;
}

function generateCards(numberOfCards) {
  var cardsArr = [];

  for (var i = 0; i < numberOfCards; i++) {
    cardsArr.push(generateCardData(i));
  }

  return cardsArr;
}

function renderMapPins(cards) {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinWidth = getComputedStyle(pinTemplate, '::after').getPropertyValue('width');
  var pinHeight = getComputedStyle(pinTemplate, '::after').getPropertyValue('height');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < cards.length; i++) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinImg = pinElement.querySelector('img');

    pinElement.style.left = cards[i].location.x - (parseInt(pinWidth, 10) / 2) + 'px';
    pinElement.style.top = cards[i].location.y - parseInt(pinHeight, 10) + 'px';
    pinImg.alt = cards[i].offer.title;
    pinImg.src = cards[i].author.avatar;

    fragment.appendChild(pinElement);
  }
  map.appendChild(fragment);
}

function removeListElements(list) {
  list.innerHTML = '';
}

function generateClassModificator(className, modificator, index) {
  if (Array.isArray(modificator)) {
    return className + '--' + modificator[index];
  } else {
    return className + '--' + modificator;
  }
}

function changeElementAttribute(element, attribute, value, index) {
  if (Array.isArray(value)) {
    element.setAttribute(attribute, value[index]);
  } else {
    element.setAttribute(attribute, value);
  }
}

function generateFeaturesElements(featuresList, quontityOfElements, element, className, modificator) {
  removeListElements(featuresList);
  for (var i = 0; i < quontityOfElements; i++) {
    var newElement = element.cloneNode(true);
    newElement.className = className + ' ' + generateClassModificator(className, modificator, i);
    featuresList.appendChild(newElement);
  }
}

function generateOfferPhotosElements(photosList, quontityOfElements, element, attribute, value) {
  removeListElements(photosList);
  for (var i = 0; i < quontityOfElements; i++) {
    var newElement = element.cloneNode(true);
    changeElementAttribute(newElement, attribute, value, i);
    photosList.appendChild(newElement);
  }
}

function renderAnnouncement(card) {
  var announcementTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var announcementElement = announcementTemplate.cloneNode(true);
  var announcementTitle = announcementElement.querySelector('.popup__title');
  var announcementAdress = announcementElement.querySelector('.popup__text--address');
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
  announcementAdress.textContent = card.offer.adress;
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

var announcementCards = generateCards(totalCards);
// renderMapPins(announcementCards);
// renderAnnouncement(announcementCards[0]);



function activateMap() {
  mapBlock.classList.remove('map--faded');
  noticeForm.classList.remove('ad-form--disabled');
  enableFormInputs();
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

function getCoords(element) {
  var box = element.getBoundingClientRect();

  return {
    top: Math.round(box.top + pageYOffset),
    left: Math.round(box.left + pageXOffset)
  };
}

function setAdress() {
  var adresInputCoords = getCoords(mapPinMain);
  addressInput.value = (adresInputCoords.top - MAP_PIN_MAIN_HEIGHT) + ',' + (adresInputCoords.left - Math.round(MAP_PIN_MAIN_WIDTH / 2));
}

mapPinMain.addEventListener('mouseup', function () {
  activateMap();
});

disableFormInputs();

setAdress();
