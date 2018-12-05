'use strict';

(function () {
  var mapBlock = window.data.mapBlock;
  var map = window.data.map;
  var filtersContainer = mapBlock.querySelector('.map__filters-container');
  var apartmentTypeShortPrint = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

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

  window.render = {
    renderMapPins: renderMapPins,
    renderAnnouncement: renderAnnouncement
  };
})();