'use strict';

(function () {
  var mapPinMain = window.data.mapBlock.querySelector('.map__pin--main');
  var totalCards = 8;
  var notice = window.data.notice;
  var noticeForm = notice.querySelector('.ad-form');
  var noticeFieldsets = notice.querySelectorAll('.ad-form__element');
  var addressInput = notice.querySelector('#address');
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

  function setPosition(element, coordsX, coordsY) {
    element.style.left = coordsX + 'px';
    element.style.top = coordsY + 'px';
  }

  disableFormInputs();
  setAddress(startMapPinMainCoords);
  window.form.setMaxAvailableGuests();

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

  window.form.setAnnoucementFormListeners();
})();

