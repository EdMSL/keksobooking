'use strict';

(function () {
  var mapPinMain = window.data.mapBlock.querySelector('.map__pin--main');
  var notice = window.data.notice;
  var noticeForm = notice.querySelector('.ad-form');
  var noticeFieldsets = notice.querySelectorAll('.ad-form__element');
  var addressInput = notice.querySelector('#address');
  var resetMapButton = window.data.notice.querySelector('.ad-form__reset');
  var isMapActivated = false;
  var mapCoords = window.utils.getElementCoords(window.data.map);
  var startMapPinMainCoords = getStartMapPinMainCoords();

  function getStartMapPinMainCoords() {
    return {
      top: window.utils.getElementCoords(mapPinMain).top - mapCoords.top,
      left: window.utils.getElementCoords(mapPinMain).left - mapCoords.left,
    };
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
    currentPin.addEventListener('click', function () {
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
    });
  }

  function setMapPinsActionOnClick(pins, annocements) {
    for (var i = 0; i < annocements.length; i++) {
      onMapPinClick(pins[i], annocements[i]);
    }
  }

  function relocatePins(pins) {
    for (var i = 0; i < pins.length; i++) {
      pins[i].style.left = parseInt(pins[i].style.left, 10) - pins[i].offsetWidth / 2 + 'px';
      pins[i].style.top = parseInt(pins[i].style.top, 10) - pins[i].offsetHeight + 'px';
    }
  }

  function onSuccesAnnouncementsLoad(announcementCards) {
    var loadedAnnoucementsCards = announcementCards;
    window.render.renderMapPins(loadedAnnoucementsCards);
    var mapPins = window.data.mapBlock.querySelectorAll('.map__pin:not(.map__pin--main)');
    setMapPinsActionOnClick(mapPins, loadedAnnoucementsCards);
    relocatePins(mapPins);

    window.mapPins = mapPins;
  }

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

  function activateMapAndForm() {
    window.data.mapBlock.classList.remove('map--faded');
    noticeForm.classList.remove('ad-form--disabled');

    window.backend.load('https://js.dump.academy/keksobooking/data', onSuccesAnnouncementsLoad, onErrorAnnouncementsLoad);
    enableFormInputs();
  }

  function deactivateMapAndForm() {
    window.data.mapBlock.classList.add('map--faded');
    noticeForm.classList.add('ad-form--disabled');
    disableFormInputs();
    setPosition(mapPinMain, startMapPinMainCoords.left, startMapPinMainCoords.top);
    setAddress(startMapPinMainCoords);
    window.form.setDefaultInputsValue();
    closeAnnouncement();

    for (var i = 0; i < window.mapPins.length; i++) {
      window.data.map.removeChild(window.mapPins[i]);
    }

    isMapActivated = false;
  }

  function setPosition(element, coordsX, coordsY) {
    element.style.left = coordsX + 'px';
    element.style.top = coordsY + 'px';
  }

  var onMapPinMainMousedown = function (evtDown) {
    evtDown.preventDefault();
    if (!isMapActivated) {
      activateMapAndForm();
      isMapActivated = true;
    }

    var pin = evtDown.currentTarget;
    var pinCoords = window.utils.getElementCoords(pin);
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
  };

  function closeSuccessWindow() {
    var successWindow = window.data.mapBlock.querySelector('.success');
    window.data.mapBlock.removeChild(successWindow);
    document.removeEventListener('keydown', onSuccessWindowEscPress);
    document.removeEventListener('click', onSuccessWindowClick);
  }

  var onSuccessWindowEscPress = function (evt) {
    evt.preventDefault();
    window.utils.isEscEvent(evt, closeSuccessWindow);
  };

  var onSuccessWindowClick = function () {
    closeSuccessWindow();
  };

  function onSuccesAnnouncementSave() {
    deactivateMapAndForm();
    window.render.renderSuccessWindow();
    document.addEventListener('keydown', onSuccessWindowEscPress);
    document.addEventListener('click', onSuccessWindowClick);
  }

  function closeErrorWindow() {
    var errorWindow = window.data.mapBlock.querySelector('.error');
    window.data.mapBlock.removeChild(errorWindow);
    document.removeEventListener('keydown', onErrorWindowEscPress);
    document.removeEventListener('click', onErrorWindowClick);
  }

  var onErrorWindowEscPress = function (evt) {
    evt.preventDefault();
    window.utils.isEscEvent(evt, closeErrorWindow);
  };

  var onErrorWindowClick = function () {
    closeErrorWindow();
  };

  var onErrorCloseButtonClick = function () {
    closeErrorWindow();
  };

  function onErrorAnnouncementSave() {
    window.render.renderErrorWindow();
    var errorCloseButton = window.data.mapBlock.querySelector('.error__button');
    document.addEventListener('keydown', onErrorWindowEscPress);
    document.addEventListener('click', onErrorWindowClick);
    errorCloseButton.addEventListener('click', onErrorCloseButtonClick);
  }

  disableFormInputs();
  setAddress(startMapPinMainCoords);
  window.form.setMaxAvailableGuests();

  mapPinMain.addEventListener('mousedown', onMapPinMainMousedown);

  noticeForm.addEventListener('submit', function (evt) {
    window.backend.save('https://js.dump.academy/keksobooking', new FormData(noticeForm), onSuccesAnnouncementSave, onErrorAnnouncementSave);
    evt.preventDefault();
  });

  resetMapButton.addEventListener('click', function () {
    deactivateMapAndForm();
  });

  window.form.setAnnoucementFormListeners();
})();

