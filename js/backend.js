'use strict';

(function () {
  var REQUEST_TIMEOUT = 10000;
  var REQUEST_STATUS_OK = 200;
  var REQUEST_STATUS_BAD_REQUEST = 400;
  var REQUEST_STATUS_UNAUTHORIZEDS = 401;
  var REQUEST_STATUS_NOT_FOUND = 404;
  var REQUEST_STATUS_INTERNAL_STATUS_ERROR = 500;

  function getXHR(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case REQUEST_STATUS_OK:
          onLoad(xhr.response);
          break;
        case REQUEST_STATUS_BAD_REQUEST:
          error = xhr.status + ': Неверный запрос';
          break;
        case REQUEST_STATUS_UNAUTHORIZEDS:
          error = xhr.status + ': Пользователь не авторизован';
          break;
        case REQUEST_STATUS_NOT_FOUND:
          error = xhr.status + ': Страница не найдена. Пожалуйста, обновите страницу или попробуйте позднее';
          break;
        case REQUEST_STATUS_INTERNAL_STATUS_ERROR:
          error = xhr.status + ': Неверный адрес';
          break;
        default:
          error = xhr.status + ': Произошла ошибка при загрузке. Пожалуйста, обновите страницу или попробуйте позднее';
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
    var xhr = getXHR(onLoad, onError);
    xhr.open('GET', url);
    xhr.send();
  }

  function save(url, data, onLoad, onError) {
    var xhr = getXHR(onLoad, onError);
    xhr.open('POST', url);
    xhr.send(data);
  }

  window.backend = {
    load: load,
    save: save
  };
})();
