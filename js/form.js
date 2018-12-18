'use strict';

(function () {
  var NOT_FOR_GUESTS_ROOMS = 100;
  var NO_GUESTS = 0;

  var notice = window.data.notice;
  var noticeFieldsets = notice.querySelectorAll('.ad-form__element');
  var noticeHeader = notice.querySelector('.ad-form-header');
  var titleInput = notice.querySelector('#title');
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
  var descriptionInput = notice.querySelector('#description');
  var featuresInputs = notice.querySelectorAll('.features input[type="checkbox"]');
  var selects = notice.querySelectorAll('select');
  var selectsDefaultValues = getDefaultSelectsOptions(selects);

  function disableFormInputs() {
    for (var i = 0; i < noticeFieldsets.length; i++) {
      noticeFieldsets[i].setAttribute('disabled', true);
    }
    noticeHeader.setAttribute('disabled', true);
  }

  function enableFormInputs() {
    for (var i = 0; i < noticeFieldsets.length; i++) {
      noticeFieldsets[i].removeAttribute('disabled');
    }
    noticeHeader.removeAttribute('disabled');
  }

  function getSelectedOptionOnSelect(select) {
    for (var i = 0; i < select.options.length; i++) {
      if (select.options[i].selected) {
        var selectedOption = select.options[i].index;
      }
    }
    return selectedOption;
  }

  function getDefaultSelectsOptions(selectsList) {
    var selectedValues = [];
    for (var i = 0; i < selectsList.length; i++) {
      selectedValues.push(getSelectedOptionOnSelect(selectsList[i]));
    }
    return selectedValues;
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

  function setSelectsDefaultValue() {
    for (var i = 0; i < selects.length; i++) {
      selects[i].options.selectedIndex = selectsDefaultValues[i];
    }
  }

  function resetFeatures() {
    for (var i = 0; i < featuresInputs.length; i++) {
      featuresInputs[i].checked = false;
    }
  }

  function setDefaultInputsValue() {
    setSelectsDefaultValue();
    resetFeatures();
    titleInput.value = '';
    priceInput.value = null;
    descriptionInput.value = '';
    window.upload.setDefaultAvatar();
    window.upload.resetUploadedPhotos();

  }

  function setAnnoucementFormListeners() {
    typeInput.addEventListener('change', function () {
      setMinAvailablePriceToPriceInput();
    });
    timeinInput.addEventListener('change', onTimeInputChange);
    timeoutInput.addEventListener('change', onTimeInputChange);
    roomsInput.addEventListener('change', onRoomInputChange);
  }

  titleInput.addEventListener('invalid', function () {
    titleInput.style.border = '2px solid red';
    if (titleInput.validity.tooShort) {
      titleInput.setCustomValidity('Заголовок должен состоять минимум из 30-и символов');
    } else if (titleInput.validity.tooLong) {
      titleInput.setCustomValidity('Заголовок должен состоять максимум из 100 символов');
    } else if (titleInput.validity.valueMissing) {
      titleInput.setCustomValidity('Это обязательное поле');
    } else {
      titleInput.setCustomValidity('');
      titleInput.style.border = 'none';
    }
  });

  priceInput.addEventListener('invalid', function () {
    priceInput.style.border = '2px solid red';
    if (priceInput.validity.rangeOverflow) {
      priceInput.setCustomValidity('Цена больше максимально допустимой');
    } else if (priceInput.validity.rangeUnderflow) {
      priceInput.setCustomValidity('Цена меньше минимально допустимой');
    } else if (priceInput.validity.valueMissing) {
      priceInput.setCustomValidity('Это обязательное поле');
    } else {
      priceInput.setCustomValidity('');
      priceInput.style.border = 'none';
    }
  });

  window.upload.setAvatarUploader();
  window.upload.setPhotosUploader();

  window.form = {
    disableFormInputs: disableFormInputs,
    enableFormInputs: enableFormInputs,
    setAnnoucementFormListeners: setAnnoucementFormListeners,
    setMaxAvailableGuests: setMaxAvailableGuests,
    setDefaultInputsValue: setDefaultInputsValue,
    setMinAvailablePriceToPriceInput: setMinAvailablePriceToPriceInput
  };
})();
