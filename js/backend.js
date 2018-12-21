'use strict';

(function () {
  var REQUEST_TIMEOUT = 10000;
  var REQUEST_STATUS_OK = 200;
  var REQUEST_STATUS_BAD_REQUEST = 400;
  var REQUEST_STATUS_UNAUTHORIZEDS = 401;
  var REQUEST_STATUS_NOT_FOUND = 404;
  var REQUEST_STATUS_INTERNAL_STATUS_ERROR = 500;

  var badRequestMessage = ': Неверный запрос';
  var unauthorizedsMessage = ': Пользователь не авторизован';
  var internalMessage = ': Неверный адрес для отправки';
  var onLoadNotFoundMessage = ': Страница с объявлениями не найдена. Пожалуйста, обновите страницу или попробуйте позднее';
  var onSaveNotFoundMessage = ': Страница не найдена. Пожалуйста, обновите страницу или попробуйте позднее';
  var onLoadDefaultMessage = ': Произошла ошибка при загрузке списка похожих объявлений. Пожалуйста, обновите страницу или попробуйте позднее';
  var onSaveDefaultMessage = ': Произошла ошибка при попытке сохранения объявления. Пожалуйста, обновите страницу или попробуйте позднее';

  function getXHR(onLoad, onError, badRequestErrorMessage, unauthorizedsErrorMessage, notFoundErrorMessage, internalErrorMessage, defaultErrorMessage) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case REQUEST_STATUS_OK:
          onLoad(xhr.response);
          break;
        case REQUEST_STATUS_BAD_REQUEST:
          error = xhr.status + badRequestErrorMessage;
          break;
        case REQUEST_STATUS_UNAUTHORIZEDS:
          error = xhr.status + unauthorizedsErrorMessage;
          break;
        case REQUEST_STATUS_NOT_FOUND:
          error = xhr.status + notFoundErrorMessage;
          break;
        case REQUEST_STATUS_INTERNAL_STATUS_ERROR:
          error = xhr.status + internalErrorMessage;
          break;
        default:
          error = xhr.status + defaultErrorMessage;
      }

      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Превышено время ожидания. Пожалуйста, попробуйте позднее');
    });

    xhr.timeout = REQUEST_TIMEOUT;

    return xhr;
  }

  function load(url, onLoad, onError) {
    var xhr = getXHR(onLoad, onError, badRequestMessage, unauthorizedsMessage, onLoadNotFoundMessage, internalMessage, onLoadDefaultMessage);
    xhr.open('GET', url);
    xhr.send();
  }

  function save(url, data, onLoad, onError) {
    var xhr = getXHR(onLoad, onError, badRequestMessage, unauthorizedsMessage, onSaveNotFoundMessage, internalMessage, onSaveDefaultMessage);
    xhr.open('POST', url);
    xhr.send(data);
  }

  window.backend = {
    load: load,
    save: save
  };
})();
