'use strict';

var MAP_Y_MIN = 130;
var MAP_Y_MAX = 630;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var MAX_GUESTS = 10;

var map = document.querySelector('.map__pins');
var mapXmax = map.clientWidth;
var totalCards = 8;
var apartmentType = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var apartmentTypeShort = ['palace', 'flat', 'house', 'bungalo'];
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
  var randomFeaturesArr = getRandomNumbersArr(apartmentFeatures.length);
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
    offer.features.push(apartmentFeatures[randomFeaturesArr[i]]);
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

function renderCards() {
  var cardTemplate = document.querySelector('#card');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var fragment = document.createDocumentFragment();
  var cards = generateCards(totalCards);

  for (var i = 0; i < cards.length; i++) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinImg = pinElement.querySelector('img');

    pinElement.style.left = cards[i].location.x + 'px';
    pinElement.style.top = cards[i].location.y + 'px';
    pinImg.alt = cards[i].offer.title;
    pinImg.src = cards[i].author.avatar;


    fragment.appendChild(pinElement);
  }
  map.appendChild(fragment);
}
renderCards();
// console.log(cards);
