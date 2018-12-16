'use strict';

(function () {
  function onErrorAnnouncementsLoad(message) {
    var errorBlock = document.createElement('div');
    errorBlock.id = 'error-block';
    errorBlock.style = 'z-index: 5; font-size: 15px; background-color: red; color: white; padding: 5px;';
    errorBlock.textContent = message;
    errorBlock.style.position = 'fixed';
    errorBlock.style.left = 0;
    errorBlock.style.top = 0;
    document.body.insertAdjacentElement('afterbegin', errorBlock);
  }

  function closeAnnouncement(annocement, oldPin) {
    var element = annocement ? annocement : window.data.mapBlock.querySelector('.map__card');
    var pin = oldPin ? oldPin : window.data.mapBlock.querySelector('.map__pin--active');

    if (element) {
      window.data.mapBlock.removeChild(element);
      document.removeEventListener('keydown', onAnnouncementEscPress);
      pin.classList.remove('map__pin--active');
    }
  }

  var onAnnouncementEscPress = function (evt) {
    evt.preventDefault();
    window.utils.isEscEvent(evt, closeAnnouncement);
  };

  function onCloseButtonClick() {
    closeAnnouncement();
  }

  function setCloseButtonActionOnClick(element) {
    var closeAnnouncementButton = element.querySelector('.popup__close');
    closeAnnouncementButton.addEventListener('click', onCloseButtonClick);
  }

  function onMapPinClick(currentPin, currentAnnouncement) {
    var oldAnnocement = window.data.mapBlock.querySelector('.map__card');
    var oldPin = window.data.mapBlock.querySelector('.map__pin--active');

    if (oldAnnocement) {
      closeAnnouncement(oldAnnocement, oldPin);
    }

    window.render.renderAnnouncement(currentAnnouncement);

    var newAnnocement = window.data.mapBlock.querySelector('.map__card');
    setCloseButtonActionOnClick(newAnnocement);
    document.addEventListener('keydown', onAnnouncementEscPress);
    currentPin.classList.add('map__pin--active');
  }

  function setMapPinsActionOnClick(annocements) {
    window.data.map.addEventListener('click', function (evt) {
      var targetPin = evt.target.closest('.map__pin:not(.map__pin--main)');

      if (!targetPin) {
        return;
      }

      var indexOfTargetPin = Array.prototype.indexOf.call(window.pins.mapPins, targetPin);
      onMapPinClick(targetPin, annocements[indexOfTargetPin]);
    });
  }

  function relocatePins(pins) {
    for (var i = 0; i < pins.length; i++) {
      pins[i].style.left = parseInt(pins[i].style.left, 10) - pins[i].offsetWidth / 2 + 'px';
      pins[i].style.top = parseInt(pins[i].style.top, 10) - pins[i].offsetHeight + 'px';
    }
  }

  function clearPins() {
    for (var i = 0; i < window.pins.mapPins.length; i++) {
      window.data.map.removeChild(window.pins.mapPins[i]);
    }
  }

  function onSuccesAnnouncementsLoad(announcementCards) {
    var loadedAnnoucementsCards = announcementCards;
    window.filter.getCopyOfAnnoucementsForFilter(loadedAnnoucementsCards);
    window.render.renderMapPins(loadedAnnoucementsCards);
    var mapPins = window.data.mapBlock.querySelectorAll('.map__pin:not(.map__pin--main)');
    setMapPinsActionOnClick(loadedAnnoucementsCards);
    relocatePins(mapPins);
    window.filter.enableFilters();

    window.pins.loadedAnnoucementsCards = loadedAnnoucementsCards;
    window.pins.mapPins = mapPins;
  }

  function getAnnouncements() {
    window.backend.load('https://js.dump.academy/keksobooking/data', onSuccesAnnouncementsLoad, onErrorAnnouncementsLoad);
  }


  window.pins = {
    closeAnnouncement: closeAnnouncement,
    getAnnouncements: getAnnouncements,
    setMapPinsActionOnClick: setMapPinsActionOnClick,
    relocatePins: relocatePins,
    clearPins: clearPins
  };
})();
