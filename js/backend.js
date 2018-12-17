'use strict';

(function () {
  var REQUEST_TIMEOUT = 10000;
  var REQUEST_STATUS_OK = 200;
  var REQUEST_STATUS_BAD_REQUEST = 400;
  var REQUEST_STATUS_UNAUTHORIZEDS = 401;
  var REQUEST_STATUS_NOT_FOUND = 404;
  var REQUEST_STATUS_INTERNAL_STATUS_ERROR = 500;

  window.backend = {
    load: function (url, onLoad, onError) {
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
            error = xhr.status + ': Страница с объявлениями не найдена. Пожалуйста, обновите страницу или попробуйте позднее';
            break;
          case REQUEST_STATUS_INTERNAL_STATUS_ERROR:
            error = xhr.status + ': Неверный адрес для отправки';
            break;
          default:
            error = xhr.status + ': Произошла ошибка при загрузить список похожих объявлений. Пожалуйста, обновите страницу или попробуйте позднее';
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

      xhr.open('GET', url);
      xhr.send();
    },
    save: function (url, data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        var error;
        switch (xhr.status) {
          case REQUEST_STATUS_OK:
            onLoad();
            break;
          case REQUEST_STATUS_BAD_REQUEST:
            error = xhr.status + ': Неверный запрос';
            break;
          case REQUEST_STATUS_UNAUTHORIZEDS:
            error = xhr.status + ': Пользователь не авторизован';
            break;
          case REQUEST_STATUS_NOT_FOUND:
            error = xhr.status + ': Ничего не найдено';
            break;
          case REQUEST_STATUS_INTERNAL_STATUS_ERROR:
            error = xhr.status + ': Неверный адрес для отправки';
            break;
          default:
            error = xhr.status + ': Произошла ошибка при попытке сохранения объявления. Пожалуйста, обновите страницу или попробуйте позднее';
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

      xhr.open('POST', url);
      xhr.send(data);
    },
  };
})();
