'use strict';

(function () {
  var MAP_PIN_ARROW_HEIGHT = 15;

  var mapPinMain = window.data.mapBlock.querySelector('.map__pin--main');
  var notice = window.data.notice;
  var noticeForm = notice.querySelector('.ad-form');
  var addressInput = notice.querySelector('#address');
  var resetMapButton = window.data.notice.querySelector('.ad-form__reset');
  var isMapActivated = false;
  var mapCoords = window.utils.getElementCoords(window.data.map);
  var startMapPinMainCoords = getStartMapPinMainCoords();
  var errorCloseButton;

  function getStartMapPinMainCoords() {
    return {
      top: window.utils.getElementCoords(mapPinMain).top - mapCoords.top,
      left: window.utils.getElementCoords(mapPinMain).left - mapCoords.left,
    };
  }

  function setAddress(coords) {
    addressInput.value = (coords.left + Math.ceil(mapPinMain.offsetWidth / 2)) + ',' + (coords.top + mapPinMain.offsetHeight + MAP_PIN_ARROW_HEIGHT);
  }

  function activateMapAndForm() {
    window.data.mapBlock.classList.remove('map--faded');
    noticeForm.classList.remove('ad-form--disabled');
    window.pins.getAnnouncements();
    window.form.enableFormInputs();
    window.form.setMinAvailablePriceToPriceInput();
    window.form.setRequredInputsErrorListeners();

  }

  function deactivateMapAndForm() {
    window.data.mapBlock.classList.add('map--faded');
    noticeForm.classList.add('ad-form--disabled');
    window.form.removeRequredInputsErrorListeners();
    window.form.setDefaultInputsValue();
    window.form.disableFormInputs();
    window.filter.resetFilters();
    window.filter.disableFilters();
    setPosition(mapPinMain, startMapPinMainCoords.left, startMapPinMainCoords.top);
    setAddress(startMapPinMainCoords);
    window.pins.closeAnnouncement();
    window.pins.clearPins();
    isMapActivated = false;
  }

  function setPosition(element, coordsX, coordsY) {
    element.style.left = coordsX + 'px';
    element.style.top = coordsY + 'px';
  }

  function onMapPinMainMousedown(evtDown) {
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
      if (newTop < window.data.MAP_Y_MIN - (pin.offsetHeight + MAP_PIN_ARROW_HEIGHT)) {
        newTop = window.data.MAP_Y_MIN - (pin.offsetHeight + MAP_PIN_ARROW_HEIGHT);
      }
      if (newTop > window.data.MAP_Y_MAX - (pin.offsetHeight + MAP_PIN_ARROW_HEIGHT)) {
        newTop = window.data.MAP_Y_MAX - (pin.offsetHeight + MAP_PIN_ARROW_HEIGHT);
      }

      setPosition(element, newLeft, newTop);
      pinCoords.left = newLeft;
      pinCoords.top = newTop;
      setAddress(pinCoords);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function closeSuccessWindow() {
    var successWindow = window.data.mapBlock.querySelector('.success');
    window.data.mapBlock.removeChild(successWindow);
    document.removeEventListener('keydown', onSuccessWindowEscPress);
    document.removeEventListener('click', onSuccessWindowClick);
  }

  function onSuccessWindowEscPress(evt) {
    evt.preventDefault();
    window.utils.isEscEvent(evt, closeSuccessWindow);
  }

  function onSuccessWindowClick() {
    closeSuccessWindow();
  }

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
    errorCloseButton.removeEventListener('click', onErrorCloseButtonClick);
  }

  function onErrorWindowEscPress(evt) {
    evt.preventDefault();
    window.utils.isEscEvent(evt, closeErrorWindow);
  }

  function onErrorWindowClick() {
    closeErrorWindow();
  }

  function onErrorCloseButtonClick() {
    closeErrorWindow();
  }

  function onErrorAnnouncementSave() {
    window.render.renderErrorWindow();
    errorCloseButton = window.data.mapBlock.querySelector('.error__button');
    document.addEventListener('keydown', onErrorWindowEscPress);
    document.addEventListener('click', onErrorWindowClick);
    errorCloseButton.addEventListener('click', onErrorCloseButtonClick);

  }

  window.form.disableFormInputs();
  window.filter.disableFilters();
  setAddress(startMapPinMainCoords);
  window.form.setMaxAvailableGuests();

  mapPinMain.addEventListener('mousedown', onMapPinMainMousedown);

  noticeForm.addEventListener('submit', function (evt) {
    window.backend.save('https://js.dump.academy/keksobookin', new FormData(noticeForm), onSuccesAnnouncementSave, onErrorAnnouncementSave);
    evt.preventDefault();
  });

  resetMapButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    deactivateMapAndForm();
  });

  window.form.setAnnoucementFormListeners();
})();
