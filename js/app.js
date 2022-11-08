window.addEventListener('load', async () => {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js')
        console.log('Service worker register success', reg)
      } catch (e) {
        console.log('Service worker register fail')
      }
    }
  })

  function deeplinkActivate() {
    'use strict';

    let deeplinks = document.querySelectorAll('.deeplink');
    if (deeplinks.length) {
      deeplinks.forEach((deeplink) => {
        deeplink.addEventListener('click', function (e) {
          e.preventDefault();
          // Detect device
          let devType = getMobileOperatingSystem();
          let android_apk_url = this.getAttribute('android-apk');
          let apk_url = this.getAttribute('apk');
          let siteUrl = this.getAttribute('href');
          let frame = document.querySelector('#app-frame');

          switch (devType) {
            case 'android':
              frame.setAttribute('src', android_apk_url);
              frame.addEventListener('DOMContentLoaded', function () {
                return;
              });
              setTimeout(function () {
                window.location = siteUrl;
              }, 700);
              break;
            default:
              frame.setAttribute('src', apk_url);
              frame.addEventListener('DOMContentLoaded', function () {
                return;
              });
              setTimeout(function () {
                window.location = siteUrl;
              }, 700);
              break;
          }
        });
      });
    }
  }

  let modalActivate = function () {
    let modalArr = document.querySelectorAll('.modal--open');
    modalArr.forEach(function (modalEl) {
      modalEl.addEventListener('click', function (e) {
        e.preventDefault();
        let modalContainer = document.querySelector(this.hash);
        let modalInner = document.querySelector(this.hash + ' .modal-inner');

        modalContainer.style.display = 'block';
        let outerClick = (e) => {
          if (!modalInner.contains(e.target)) {
            modalContainer.style.display = 'none';
            document.removeEventListener('mouseup', outerClick);
          }
        };
        document.addEventListener('mouseup', outerClick);
      });
    });
  };

  let getMobileOperatingSystem = function () {
    let userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/android/i.test(userAgent)) {
      return 'android';
    }

    // iOS detection from: https://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'ios';
    }

    return 'desktop';
  };

  function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }
  function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(
      function () {
        console.log('Async: Copying to clipboard was successful!');
      },
      function (err) {
        console.error('Async: Could not copy text: ', err);
      }
    );
  }

  function copyActivate() {
    let copyBtns = document.querySelectorAll('.js-copy');
    copyBtns.forEach(function (btn) {
      let text = btn.querySelector('.info-subtitle').textContent;
      btn.addEventListener('click', function (event) {
        copyTextToClipboard(text);
        let $temp = document.createElement('span');
        $temp.className = 'copy-success';
        $temp.innerText = 'Copied to clipboard';
        btn.append($temp);
        setTimeout(() => {
          $temp.remove();
        }, 1500);
      });
    });
  }

  function shareActivate() {

    if (!navigator.canShare) {
      if(document.querySelector('.share')) {
        let btn = document.querySelector('.share');
        btn.style.display = 'none';

      }
    } else {
      let btn = document.querySelector('.share');
      let url = window.location.href;
      let nickname = document.querySelector('.business-card__nickname').textContent;
      let title = nickname + ' Business Card';
      let shareData = {
        title: title,
        url: url,
      };
      btn.addEventListener('click', async () => {
        try {
          await navigator.share(shareData);
        } catch (err) {
          console.log(err);
        }
      });
    }
  }

  deeplinkActivate();
  modalActivate();
  copyActivate();
  shareActivate();
