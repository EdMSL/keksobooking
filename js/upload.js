'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var notice = window.data.notice;
  var noticeAvatarUploader = notice.querySelector('.ad-form-header__input');
  var noticeAvatarImg = notice.querySelector('.ad-form-header__preview img');
  var defaultAvatarSrc = getDefaultAvatarSrc();
  var noticePhotosUploader = notice.querySelector('.ad-form__input');
  var noticePhotosContainer = notice.querySelector('.ad-form__photo-container');
  var noticePhotoContainer = notice.querySelector('.ad-form__photo');
  var isFirstPhotoUpload = true;

  function getDefaultAvatarSrc() {
    return noticeAvatarImg.getAttribute('src');
  }

  function setDefaultAvatar() {
    noticeAvatarImg.src = defaultAvatarSrc;
  }

  function resetUploadedPhotos() {
    var photos = noticePhotosContainer.querySelectorAll('.ad-form__photo');
    photos.forEach(function (element) {
      noticePhotosContainer.removeChild(element);
    });
  }

  function setAvatarUploader() {
    noticeAvatarUploader.addEventListener('change', function () {
      var file = noticeAvatarUploader.files[0];
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          noticeAvatarImg.src = reader.result;
        });

        reader.readAsDataURL(file);
      }
    });
  }

  function setPhotosUploader() {
    noticePhotosUploader.addEventListener('change', function () {
      var file = noticePhotosUploader.files[0];
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          var imgCont = isFirstPhotoUpload ? noticePhotoContainer : noticePhotoContainer.cloneNode();
          var img = document.createElement('img');

          img.style = 'width: 70px; height: 70px';
          img.src = reader.result;

          imgCont.appendChild(img);
          noticePhotosContainer.appendChild(imgCont);

          isFirstPhotoUpload = false;
        });

        reader.readAsDataURL(file);
      }
    });
  }

  window.upload = {
    setAvatarUploader: setAvatarUploader,
    setPhotosUploader: setPhotosUploader,
    setDefaultAvatar: setDefaultAvatar,
    resetUploadedPhotos: resetUploadedPhotos
  };
})();
