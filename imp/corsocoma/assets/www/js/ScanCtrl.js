angular.module('scan.controller', [])

.controller('BarcodeCtrl', function($cordovaGoogleAnalytics, $scope, $cordovaBarcodeScanner, $ionicPlatform, $localstorage, $location, $state, $window, $cordovaDialogs, scanService) {
    /*Analytics Tracking START*/
    function _waitForAnalytics() {
      if (typeof analytics !== 'undefined') {
        $cordovaGoogleAnalytics.debugMode();
        $cordovaGoogleAnalytics.startTrackerWithId('UA-3423286-12');
        $cordovaGoogleAnalytics.trackView('Barcode Scan View');
      } else {
        setTimeout(function() {
          _waitForAnalytics();
        }, 250);
      }
    };
    _waitForAnalytics();
    /*Analytics Tracking END*/

    /* scan = function () {
     	 scanService.setScanResult('9912000166390');
     	 $state.transitionTo('tab.scanresult');
     }*/


    scan = function() {
        console.log('Start Scan function');
        $ionicPlatform.ready(function() {


          $cordovaBarcodeScanner.scan().then(function(result) {
            // есть результат сканирования
            if (result.text.length > 0) {
              scanService.setScanResult(result.text);
              $cordovaGoogleAnalytics.trackEvent('Scan', 'Scan produtct success', result.text);
              $state.transitionTo('tab.scanresult');

            } else {
              //пользователь ничего не отсканировал вызываем диалог
              $cordovaDialogs.confirm('Вы не отсканировали штрихкод', 'Ошибка', ['Отмена', 'Сканировать'])
                .then(function(buttonIndex) {
                  // no button = 0, 'OK' = 1, 'Cancel' = 2
                  //var btnIndex = buttonIndex;
                  switch (buttonIndex) {
                    case 1:
                      console.log("Cancel Pressed");
                      $state.transitionTo('tab.menu');
                      break;
                    case 2:
                      console.log("Ok Pressed");
                      scan();
                      break;
                    case 0:
                      console.log("Noting Pressed");
                      $state.transitionTo('tab.menu');
                      break;
                  }
                });
            }


          }, function(error) {
            $cordovaGoogleAnalytics.trackEvent('Scan', 'Scan produtct error', error);
            alert("Scanning failed: " + error);
          }, {
            "preferFrontCamera": true, // iOS and Android
            "showFlipCameraButton": true, // iOS and Android
            "formats": "EAN_13", // default: all but PDF_417 and RSS_EXPANDED
            "orientation" : "landscape"
          });
        });
      }
      //функция определяющая что есть камера и разрешающая доступ
    var onSuccess = function(exists) {
      console.log('Camera OK!');
      console.log(exists);
      //доступ есть запускаем функцию сканирования
      if (exists != false) {
        scan();
      } else {
        //доступа нет открываем диалог
        $cordovaDialogs.confirm('Для того чтобы сканировать штрихкоды, нам необходим доступ к Вашей камере', 'Доступ к камере', ['Отмена', 'Разрешить'])
          .then(function(buttonIndex) {
            // no button = 0, 'OK' = 1, 'Cancel' = 2
            //var btnIndex = buttonIndex;
            switch (buttonIndex) {
              case 1:
                console.log("Cancel Pressed");
                break;
              case 2:
                console.log("Ok Pressed");
                //открываем настройки приложения
                if (typeof cordova.plugins.settings.openSetting != undefined) {
                  cordova.plugins.settings.open(function() {
                      console.log("opened settings")
                    },
                    function() {
                      console.log("failed to open settings")
                    });
                }
                //открываем настройки приложения
                break;
              case 0:
                console.log("Noting Pressed");
                break;
            }
          });

        console.log('Camera NEED enable!');
      }


    };
    //ошибка доступа все совсем плохо
    function onError(error) {
      console.log('Camera NEED enable!');
      console.log(eror);

    }


    if ($localstorage.getObject('deviceInfo').platform == 'iOS' || $localstorage.getObject('deviceInfo') === null) {
      //определяем есть ли доступ к камере
      //сначала проверяем авторизацию
      cordova.plugins.diagnostic.getCameraAuthorizationStatus(function(status) {
        console.log("Camera authorization status: " + status);
      }, onError);

      cordova.plugins.diagnostic.requestCameraAuthorization(function(granted) {
        if (granted) {
          //если авторизирована есть ли доступ
          cordova.plugins.diagnostic.isCameraEnabled(onSuccess, onError);
        }
        console.log("Authorization request for camera use was " + (granted ? "granted" : "denied"));
      }, function(error) {
        //что то пошло не так
        console.error(error);
      });

    } else {
      scan();
    }


  })
  .controller('DiscountCardScanCtrl', function($scope, $localstorage, $cordovaGoogleAnalytics, $cordovaBarcodeScanner, $localstorage, $ionicPlatform, $location, $state, $window, $cordovaDialogs, scanService) {
    scan = function() {
        console.log('Start Scan function');
        $ionicPlatform.ready(function() {


          $cordovaBarcodeScanner.scan().then(function(result) {
            // есть результат сканирования
            if (result.text.length > 0) {
              scanService.setScanCardResult(result.text);
              $cordovaGoogleAnalytics.trackEvent('Scan', 'Scan produtct success', result.text);
              $localstorage.set('discountCard', result.text);
              console.log(result.text);
              $state.transitionTo('tab.customercard');


            } else {
              //пользователь ничего не отсканировал вызываем диалог
              $cordovaDialogs.confirm('Вы не отсканировали штрихкод', 'Ошибка', ['Отмена', 'Сканировать'])
                .then(function(buttonIndex) {
                  // no button = 0, 'OK' = 1, 'Cancel' = 2
                  //var btnIndex = buttonIndex;
                  switch (buttonIndex) {
                    case 1:
                      console.log("Cancel Pressed");
                      $state.transitionTo('tab.menu');
                      break;
                    case 2:
                      console.log("Ok Pressed");
                      scan();
                      break;
                    case 0:
                      console.log("Noting Pressed");
                      $state.transitionTo('tab.menu');
                      break;
                  }
                });
            }


          }, function(error) {
            $cordovaGoogleAnalytics.trackEvent('Scan', 'Scan produtct error', error);
            alert("Scanning failed: " + error);
          }, {
            "preferFrontCamera": true, // iOS and Android
            "showFlipCameraButton": true, // iOS and Android
            "formats": "EAN_13", // default: all but PDF_417 and RSS_EXPANDED
            "orientation" : "landscape"
          });
        });
      }
      //функция определяющая что есть камера и разрешающая доступ
    var onSuccess = function(exists) {
      console.log('Camera OK!');
      console.log(exists);
      //доступ есть запускаем функцию сканирования
      if (exists != false) {
        scan();
      } else {
        //доступа нет открываем диалог
        $cordovaDialogs.confirm('Для того чтобы сканировать штрихкоды, нам необходим доступ к Вашей камере', 'Доступ к камере', ['Отмена', 'Разрешить'])
          .then(function(buttonIndex) {
            // no button = 0, 'OK' = 1, 'Cancel' = 2
            //var btnIndex = buttonIndex;
            switch (buttonIndex) {
              case 1:
                console.log("Cancel Pressed");
                break;
              case 2:
                console.log("Ok Pressed");
                //открываем настройки приложения
                if (typeof cordova.plugins.settings.openSetting != undefined) {
                  cordova.plugins.settings.open(function() {
                      console.log("opened settings")
                    },
                    function() {
                      console.log("failed to open settings")
                    });
                }
                //открываем настройки приложения
                break;
              case 0:
                console.log("Noting Pressed");
                break;
            }
          });

        console.log('Camera NEED enable!');
      }


    };
    //ошибка доступа все совсем плохо
    function onError(error) {
      console.log('Camera NEED enable!');
      console.log(eror);

    }
    if ($localstorage.getObject('deviceInfo').platform == 'iOS' || $localstorage.getObject('deviceInfo') === null) {
      //определяем есть ли доступ к камере
      //сначала проверяем авторизацию
      cordova.plugins.diagnostic.requestCameraAuthorization(function(granted) {
        if (granted) {
          //если авторизирована есть ли доступ
          cordova.plugins.diagnostic.isCameraEnabled(onSuccess, onError);
        }
        console.log("Authorization request for camera use was " + (granted ? "granted" : "denied"));
      }, function(error) {
        //что то пошло не так
        console.error(error);
      });
    } else {
      scan();
    }

  })

.controller('DiscountCardCtrl', function($scope, $localstorage, $cordovaGoogleAnalytics, $location, $state, $window, discountCardService) {
  $scope.noCard = false;
  $scope.messageTitle = 'У Вас еще нет ни одной синхронизированной дисконтной карты.';
  $scope.message = 'Чтобы синхронизировать карту с приложением и получить аткуальную по ней информацию, Вам нужно сосканировать её штрихкод.';

  if ($localstorage.get('discountCard') == null) {
    $scope.noCard = true;
    discountCardService.sendCard(0, $localstorage.getObject('account').customer_id);
  }

  $scope.options = {
    width: 2,
    height: 100,
    quite: 10,
    displayValue: true,
    font: "monospace",
    textAlign: "center",
    fontSize: 12,
    backgroundColor: "",
    lineColor: "#000"
  };
  getDuration = function(start, end) {
    try {
      return ((moment.duration(end - start)).asHours());
    } catch (e) {
      return "Cant evaluate"
    }
  };
  getCard = function() {
    discountCardService.getCard().then(function(data) {
      if (data.success == true) {
        $scope.cardData = data.cardData;
        //отправляем на сервер информацию по карте
        if ($localstorage.getObject('account') != null) {
          discountCardService.sendCard(data.cardData.CardNumber, $localstorage.getObject('account').customer_id);
        }
         $localstorage.setObject('ordersHistory', data.cardData.Order);

        //CardNumber
        $localstorage.setObject('discountCardData', {
          CardHolder: data.cardData.CardHolder,
          Sale: data.cardData.Sale.split('Скидка ').join('').split('%').join(''),
          Total: data.cardData.Total,
          TotalQuantity: data.cardData.TotalQuantity,
          uploadDate: new moment()
        });
      } else {
        $scope.error = data.error;
      }

    });
  }

  if ($localstorage.get('discountCard') != null) {
    if ($localstorage.getObject('discountCardData') === null) {
      getCard();
    } else {
      var cardData = $localstorage.getObject('discountCardData');
      //проверка сколько дней прошло с загрузки карты
      var chektime = new moment().diff(moment(cardData.uploadDate), 'days');
      //если больше 1 дня то загружаем из 1С
      if (chektime > 1) {
        getCard();
      } else {
        //если меньше дня то берем локальную копию
        $scope.cardData = cardData;
      }



    }
    $scope.mycode = {};
    $scope.mycode.type = "ean";
    $scope.mycode.code = $localstorage.get('discountCard');
  }

  $scope.scan = function() {
    $state.transitionTo('tab.scancustomercard');
  };
  $scope.delete = function() {
    $localstorage.deleteKey('discountCard');
    $localstorage.deleteKey('discountCardData');
    $scope.noCard = true;
    discountCardService.sendCard(0, $localstorage.getObject('account').customer_id);
  }


})

.controller('BarcodeResultCtrl', function($scope, $location, $cordovaGoogleAnalytics, $ionicPopup, scanService, productAvaliableService, barcodeService, productImagesByBarcode) {
  console.log('Start BarcodeResultCtrl');
  /*Analytics Tracking START*/
  function _waitForAnalytics() {
    if (typeof analytics !== 'undefined') {
      $cordovaGoogleAnalytics.debugMode();
      $cordovaGoogleAnalytics.startTrackerWithId('UA-3423286-12');
      $cordovaGoogleAnalytics.trackView('Barcode Scan Result');
    } else {
      setTimeout(function() {
        _waitForAnalytics();
      }, 250);
    }
  };
  _waitForAnalytics();

  /*Analytics Tracking END*/
  $scope.scanResult = scanService.getScanResult();
  $scope.error = false;
  $scope.showbtn = false;
  $scope.scanError = '';
  console.log('Scan result from service: ' + $scope.scanResult);
  if ($scope.scanResult) {
    setTimeout(function() {
      $scope.showbtn = true;
    }, 1000);

    $cordovaGoogleAnalytics.trackEvent('View', 'Scan result', $scope.scanResult);
    console.log('haveScanResult');
    barcodeService.getId($scope.scanResult).then(function(data) {
      if (data != 'error') {
        console.log('barcodeService.getId :' + data);
        $location.path("/tab/collection/item/" + data);
      } else {
        setTimeout(function() {
          $scope.showbtn = true;
        }, 1000);
        $scope.error = true;
        $scope.scanError = 'Данный штрихкод в базе не найден';
      }
    });

  } else {
    //    $cordovaGoogleAnalytics.trackEvent('View', 'Scan result', 'Ошибка при просмотре штрихкода');
    $scope.scanResult = 'Ошибка сканирования!';
    $scope.scanError = 'Похоже вы сканируете не правильный штрихкод';
    $scope.error = true;
  }
})
