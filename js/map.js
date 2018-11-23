'use strict';

var MAP_Y_MIN = 130;
var MAP_Y_MAX = 630;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var MAX_GUESTS = 10;

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

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomSort() {
  return Math.random() - 0.5;
}

function getRandomNumbersArr(n) {
  var numbersArr = [];

  for (var i = 0; i < n; i++) {
    numbersArr.push(i);
  }

  numbersArr.sort(getRandomSort);

  return numbersArr;
}

function generateAuthor(authorNumber) {
  var author = {};
  author.avatar = 'img/avatars/user0' + authorNumber + '.png';

  return author;
}

function generateOffer(cardNumber, coordsX, coordsY) {
  var offer = {};
  // var randomFeaturesArr = getRandomNumbersArr(apartmentFeatures.length);
  var randomPhotosArr = getRandomNumbersArr(apartmentPhotos.length);

  offer.title = apartmentType[cardNumber];
  offer.adress = coordsX + ', ' + coordsY;
  offer.price = getRandomNumber(MIN_PRICE, MAX_PRICE);
  offer.type = apartmentTypeShort[getRandomNumber(0, apartmentTypeShort.length - 1)];
  offer.rooms = getRandomNumber(MIN_ROOMS, MAX_ROOMS);
  offer.guests = getRandomNumber(1, MAX_GUESTS);
  offer.checkin = checkins[getRandomNumber(0, checkins.length - 1)];
  offer.checkout = checkouts[getRandomNumber(0, checkouts.length - 1)];

  offer.features = [];
  for (var i = 0; i < getRandomNumber(1, apartmentFeatures.length); i++) {
    offer.features.push(apartmentFeatures[i]);
  }

  offer.description = '';

  offer.photos = [];
  for (var j = 0; j < apartmentPhotos.length; j++) {
    offer.photos.push(apartmentPhotos[randomPhotosArr[j]]);
  }

  return offer;
}

function generateLocationCoords() {
  var coords = {};
  coords.x = getRandomNumber(0, mapXmax);
  coords.y = getRandomNumber(MAP_Y_MIN, MAP_Y_MAX);

  return coords;
}

function generateCardData(cardNumber, authorNumber) {
  var objElement = {};
  var apartnentCoords = generateLocationCoords();
  var coordsX = apartnentCoords.x;
  var coordsY = apartnentCoords.y;
  objElement.author = generateAuthor(authorNumber + 1);
  objElement.offer = generateOffer(cardNumber, coordsX, coordsY);
  objElement.location = apartnentCoords;

  return objElement;
}

function generateCards(numberOfCards) {
  var cardsArr = [];
  var authorNumbers = getRandomNumbersArr(numberOfCards);

  for (var i = 0; i < numberOfCards; i++) {
    cardsArr.push(generateCardData(i, authorNumbers[i]));
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

function renderAnnouncement(cards) {
  var announcementTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var announcementElement = announcementTemplate.cloneNode(true);
  var announcementTitle = announcementElement.querySelector('.popup__title');
  var announcementAdress = announcementElement.querySelector('.popup__text--address');
  var announcementPrice = announcementElement.querySelector('.popup__text--price');
  var announcementType = announcementElement.querySelector('.popup__type');
  var announcementCapacity = announcementElement.querySelector('.popup__text--capacity');
  var announcementTime = announcementElement.querySelector('.popup__text--time');
  var announcementFeaturesList = announcementElement.querySelector('.popup__features');
  var announcementFeatureElements = announcementFeaturesList.querySelectorAll('.popup__feature');
  var announcementDescription = announcementElement.querySelector('.popup__description');
  var announcementPhotosList = announcementElement.querySelector('.popup__photos');
  var announcementPhoto = announcementPhotosList.querySelectorAll('.popup__photo');
  var announcementAvatar = announcementElement.querySelector('.popup__avatar');
  var fragment = document.createDocumentFragment();

  announcementTitle.textContent = cards[0].offer.title;
  announcementAdress.textContent = cards[0].offer.adress;
  announcementPrice.textContent = cards[0].offer.price + '₽/ночь';
  announcementType.textContent = apartmentTypeShortPrint[cards[0].offer.type];
  announcementCapacity.textContent = cards[0].offer.rooms + ' комнаты для ' + cards[0].offer.guests + ' гостей.';
  announcementTime.textContent = 'Заезд после ' + cards[0].offer.checkin + ', выезд до ' + cards[0].offer.checkout;

  for (var i = cards[0].offer.features.length; i < announcementFeatureElements.length; i++) {
    announcementFeaturesList.removeChild(announcementFeatureElements[i]);
  }

  announcementDescription.textContent = cards[0].offer.description;

  for (var j = 0; j < cards[0].offer.photos.length - 1; j++) {
    announcementPhotosList.appendChild(announcementPhoto[0].cloneNode(true));
  }

  var announcementPhotos = announcementPhotosList.querySelectorAll('.popup__photo');

  for (var k = 0; k < announcementPhotos.length; k++) {
    announcementPhotos[k].src = cards[0].offer.photos[k];
  }

  announcementAvatar.src = cards[0].author.avatar;

  fragment.appendChild(announcementElement);
  mapBlock.insertBefore(fragment, filtersContainer);
}

var announcementCards = generateCards(totalCards);
renderMapPins(announcementCards);
renderAnnouncement(announcementCards);
