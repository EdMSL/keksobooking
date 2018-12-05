'use strict';

(function () {
  var MIN_AUTHOR_AVATAR_START_NUMBER = 1;
  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;
  var MIN_ROOMS = 1;
  var MAX_ROOMS = 5;
  var MAX_GUESTS = 10;
  var MIN_FEATURES_QUANTITY = 1;

  var map = document.querySelector('.map__pins');
  var mapXmax = map.clientWidth;
  var apartmentType = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var checkins = ['12:00', '13:00', '14:00'];
  var checkouts = ['12:00', '13:00', '14:00'];
  var apartmentFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var apartmentPhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  function generateAuthor(authorNumber) {
    var author = {};
    author.avatar = 'img/avatars/user0' + (MIN_AUTHOR_AVATAR_START_NUMBER + authorNumber) + '.png';

    return author;
  }

  function generateOffer(cardNumber, coordsX, coordsY) {
    var offer = {};

    offer.title = apartmentType[cardNumber];
    offer.address = coordsX + ', ' + coordsY;
    offer.price = window.utils.getRandomNumber(MIN_PRICE, MAX_PRICE);
    offer.type = window.utils.getRandomValueFromArray(window.data.apartmentTypeShort);
    offer.rooms = window.utils.getRandomNumber(MIN_ROOMS, MAX_ROOMS);
    offer.guests = window.utils.getRandomNumber(1, MAX_GUESTS);
    offer.checkin = window.utils.getRandomValueFromArray(checkins);
    offer.checkout = window.utils.getRandomValueFromArray(checkouts);

    offer.features = [];
    for (var i = 0; i < window.utils.getRandomNumber(MIN_FEATURES_QUANTITY, apartmentFeatures.length); i++) {
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
    coords.x = window.utils.getRandomNumber(0, mapXmax);
    coords.y = window.utils.getRandomNumber(window.data.MAP_Y_MIN, window.data.MAP_Y_MAX);

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

  window.generateCards = generateCards;
})();
