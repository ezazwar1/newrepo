angular.module('starter.controllers', ['pascalprecht.translate'])

  .controller('AppCtrl', function ($translate, $ionicPopup, $rootScope, $ionicLoading, $q, $scope, $location, $stateParams, $state, $ionicSideMenuDelegate, $http, localStorageService, dbFactory) {

    console.log("AppCtrl")
    $translate.use(localeLang);
    var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight || e.clientHeight || g.clientHeight;

    $rootScope.screenHeight = y;
    $rootScope.screenWidth = x;

    $translate('APP_SHARE_TEXT_WATCHING').then(function (headline) {
      $scope.shareSubtextWatching = headline;
    });

    $translate('APP_SHARE_SUBTEXT').then(function (headline) {
      $scope.shareSubtext = headline;
    });

    $translate('APP_SHARE_TEXT').then(function (headline) {
      $scope.shareText = headline;
    });

    $translate('HORARIOS').then(function (headline) {
      $scope.horariosLbl = headline;
    });

    $translate('TARIFAS').then(function (headline) {
      $scope.tarifasLbl = headline;
    });

    $translate('MAPA').then(function (headline) {
      $scope.mapaLbl = headline;
    });

    $translate('APP_NEXT_SPACE').then(function (headline) {
      $scope.nextButtonSpace = headline;
    });

    $translate('APP_PREV_SPACE').then(function (headline) {
      $scope.prevButtonSpace = headline;
    });

    $translate('ERROR_DOWNLOADING').then(function (headline) {
      $scope.errorDownloading = headline;
    });

    $translate('APP_CHECKVERSION').then(function (headline) {
      $scope.checkVersionText = headline;
    });

    $translate('DIRECTION_FRONT').then(function (headline) {
      $scope.frontDir = headline;
    });
    $translate('APP_INFO_TITLE').then(function (headline) {
      $scope.infoTitle = headline;
    });

    $translate('APP_OK_BUTTON').then(function (headline) {
      $scope.okButton = headline;
    });

    $translate('APP_SEE_BUTTON').then(function (headline) {
      $scope.seeButton = headline;
    });

    $translate('APP_START_TOUR_DESCRIPTION').then(function (headline) {
      $scope.startDesc = headline;
    });

    $translate('APP_START_TOUR_TITLE').then(function (headline) {
      $scope.startTitle = headline;
    });

    $translate('SUCCESS_SCHEDULE').then(function (headline) {
      $scope.okSchedule = headline;
    });

    $translate('FAIL_SCHEDULE').then(function (headline) {
      $scope.failSchedule = headline;
    });

    $translate('APP_ACCEPT_BUTTON').then(function (headline) {
      $scope.acceptButton = headline;
    });

    $translate('APP_CANCEL_BUTTON').then(function (headline) {
      $scope.cancelButton = headline;
    });

    $translate('APP_NEXT_SLIDE').then(function (headline) {
      $scope.nextSlide = headline;
    });

    $translate('APP_PREV_SLIDE').then(function (headline) {
      $scope.prevSlide = headline;
    });

    $translate('APP_FIRST_FLOOR').then(function (headline) {
      $scope.firstFloorText = headline;
    });


    $translate('APP_SECOND_FLOOR').then(function (headline) {
      $scope.secondFloorText = headline;
    });

    $translate('APP_UPDATE_DESC').then(function (headline) {
      $scope.updateTitleTextDesc = headline;
    });

    $translate('APP_UPDATE_TITLE').then(function (headline) {
      $scope.updateTitleText = headline;
    });


    /*Init compass and geolocation on startup*/

    /*
     *
     * Compass functions, get bearing....
     *
     *
     * */
    var destinationPosition;
    var destinationBearing;

    var positionTimerId;
    var currentPosition;
    var prevPosition;
    var prevPositionError;

    var compassTimerId;
    var currentHeading;
    var prevHeading;
    var prevCompassErrorCode;
    var compass;
    var distance;
    var distancia;

    $scope.startCompass = function () {

      var success = function (position) {
        console.log("Compass initializing");


        minPositionAccuracy = 50; // Minimum accuracy in metres to accept as a reliable position
        minUpdateDistance = 3; // Minimum number of metres to move before updating distance to destination

        if (window.DeviceOrientationEvent) {
          window.addEventListener('deviceorientation', onDeviceOrientationChange, false);

        }
      };


      var fail = function () {
        $("#compassContainer1").hide();
        $scope.stopCompass();
      };

      navigator.geolocation.watchPosition(success, fail, { timeout: 30000 });


    }


    $scope.stopCompass = function () {
      console.log("Compass stop");

      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', onDeviceOrientationChange, false);
      }

    }


    function onDeviceOrientationChange() {

      var dir = '';
      var alpha;
      //Check for iOS property
      if (event.webkitCompassHeading) {
        alpha = event.webkitCompassHeading;
        currentHeading = alpha;
        //Direction is reversed for iOS
        dir = '-';
      }
      else alpha = event.alpha;
      /*          compass.style.Transform = 'rotate(' + alpha + 'deg)';
       compass.style.WebkitTransform = 'rotate('+dir + alpha + 'deg)';
       compass.style.MozTransform = 'rotate(-' + alpha + 'deg)';*/


      watchPosition();


      // Set destination
      updateDestination();
    }

    function watchPosition() {
      if (positionTimerId) navigator.geolocation.clearWatch(positionTimerId);
      positionTimerId = navigator.geolocation.watchPosition(onPositionUpdate, onPositionError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maxiumumAge: 0
      });
    }

    function onPositionUpdate(position) {


      if (position.coords.accuracy > minPositionAccuracy) return;
      currentPosition = new LatLon(position.coords.latitude, position.coords.longitude);
      prevPosition = currentPosition;
      /*      currentPosition.coords.lat = position.coords.latitude;
       currentPosition.coords.lon = position.coords.longitude;*/


      if (prevPosition && prevPosition.distanceTo(currentPosition) * 1000 < minUpdateDistance) return;

      updatePositions();
    }

    function onPositionError(error) {

      $scope.stopCompass();

      if (prevPositionError && prevPositionError.code == error.code && prevPositionError.message == error.message) return;

      console.log("Error while retrieving current position. <br/>Error code: " + error.code + "<br/>Message: " + error.message);


      prevPositionError = {
        code: error.code,
        message: error.message
      };
    }

    function updateDestination() {
      /*Parada de tranvia 41.6202008,-0.9224543*/
      /*     console.log($rootScope.currentLocationLat);
       console.log(currentPosition);*/
      destinationPosition = new LatLon($rootScope.currentLocationLat, $rootScope.currentLocationLon);
      /*destinationPosition = new LatLon("41.6202008", "-0.9224543");*/
      updatePositions();
    }

    function updatePositions() {
      if (!currentPosition) return;
      $("#compassContainer1").show();

      destinationBearing = Math.round(currentPosition.bearingTo(destinationPosition));
      if (document.getElementById("compassContainerDistance") != undefined) {
        distancia = "" + Math.round(currentPosition.distanceTo(destinationPosition) * 1000) + " m";
        /*console.log(distancia)*/
        distance = document.getElementById('compassContainerDistance');
        distance.innerHTML = distancia;
      }

      /*
       console.log("Distance: "+Math.round(currentPosition.distanceTo(destinationPosition)*1000));
       console.log("Bearing: "+destinationBearing);*/

      updateDifference();
    }

    function updateHeading() {
      /*$heading.html(currentHeading);*/
      updateDifference();
    }

    function updateDifference() {
      var diff = destinationBearing - currentHeading;

      if (document.getElementById("compassContainer") != undefined) {

        compass = document.getElementById('compassContainer');
        compass.style.Transform = 'rotate(' + diff + 'deg)';
        compass.style.WebkitTransform = 'rotate(' + diff + 'deg)';
        compass.style.MozTransform = 'rotate(-' + diff + 'deg)';
        /*$scope.stopCompass();*/
      }
      /*console.log("Bearing: "+destinationBearing);*/
    }


    /*
     *
     *
     * Finish Geolocation Functions!
     *
     *
     * */


    $scope.retryNumber = 0;
    $scope.lastIdMap = 0;

    $scope.slideHasChanged = function (index) {


    };


//    If server fails with update, revert initial app version

    $scope.backupVersion = function () {

      $scope.showLoading();
      dbFactory.loadDB().then(
        // the callback if the request was successfull
        function (response) {
          localStorageService.add('lastVersion', 0);
          $scope.pages = response; //response is the data we sent from the service
          $scope.hideLoading();
          localStorageService.add('lastLanguage', localeLang);
        },
        // the callback if an error occured
        function (response) {
          $scope.hideLoading();
          $scope.unknownError();
        }
      );
    }

    $scope.getUpdate = function () {


      $scope.showLoading();
      dbFactory.downloadUpdate().then(
        // the callback if the request was successfull
        function (response) {
          $scope.pages = response; //response is the data we sent from the service
          $scope.hideLoading();
          if (window.analytics) {
            window.analytics.trackEvent('DownloadUpdate', 'OK', null, null);
            /*window.analytics.trackView("Comparte espacio visitable");*/
          }
          $rootScope.updateAvailable = false;

        },
        // the callback if an error occured
        function (response) {
          // response is the error message we set in the service
          // do something like display the message
          if (window.analytics) {
            window.analytics.trackEvent('DownloadUpdate', 'FAIL', null, null);
            /*window.analytics.trackView("Comparte espacio visitable");*/
          }
          $scope.hideLoading();
          var myPopup = $ionicPopup.show({
            template: $scope.errorDownloading,
            title: $scope.infoTitle,
            subTitle: '',
            scope: $scope,
            buttons: [
              {
                text: $scope.okButton,
                type: 'button-energized',
                onTap: function (e) {
                  $scope.backupVersion();
                  /*alert("OK")*/
                  /*$state.go('app.space', {id: idPage});*/
                }
              },
            ]
          });

        }
      );
    };

    $scope.showLoading = function () {
      $scope.loading = $ionicLoading.show({

        // The text to display in the loading indicator
        content: $translate('LOADING_MSG'),

        // The animation to use
        animation: 'fade-in',

        // Will a dark overlay or backdrop cover the entire view
        showBackdrop: true,

        // The maximum width of the loading indicator
        // Text will be wrapped if longer than maxWidth
        maxWidth: 200,

        // The delay in showing the indicator
        showDelay: 500
      });
    };

    $scope.hideLoading = function () {
      if ($scope.loading)
        $ionicLoading.hide()
    };


    $scope.popupErrorSchedule = function () {
      if ($scope.loading)
        $ionicLoading.hide()
    };

    var promise = $q.all({});


    var lastVersion = localStorageService.get('totalItems');

    if (!lastVersion) {
      /*alert(lastVersion);*/
      $scope.showLoading();
      dbFactory.loadDB().then(
        // the callback if the request was successfull
        function (response) {
          $scope.pages = response; //response is the data we sent from the service
          $scope.hideLoading();
          localStorageService.add('lastLanguage', localeLang);
        },
        // the callback if an error occured
        function (response) {
          $scope.hideLoading();
          $scope.unknownError();
        }
      );
    } else {
      $scope.showLoading();
      var lastLan = localStorageService.get('lastLanguage');
      if (lastLan == localeLang) {
        dbFactory.loadPreviousDB().then(
          // the callback if the request was successfull
          function (response) {
            $scope.pages = response; //response is the data we sent from the service
            $scope.hideLoading();
            $scope.checkLastVersion();
          },
          // the callback if an error occured
          function (response) {

            $scope.retryLoadData();
            // response is the error message we set in the service
            // do something like display the message
          }
        );
      } else {
        dbFactory.loadDB().then(
          // the callback if the request was successfull
          function (response) {
            $scope.pages = response; //response is the data we sent from the service
            $scope.hideLoading();
            localStorageService.add('lastLanguage', localeLang);
          },
          // the callback if an error occured
          function (response) {
            $scope.hideLoading();
            $scope.unknownError();
          }
        );
      }


    }


    $scope.retryLoadData = function () {
      dbFactory.loadPreviousDB().then(
        // the callback if the request was successfull
        function (response) {
          $scope.pages = response; //response is the data we sent from the service
          $scope.hideLoading();
          $scope.checkLastVersion();
        },
        // the callback if an error occured
        function (response) {

          $scope.retryNumber++;
          if ($scope.retryNumber < 10) {
            $scope.retryLoadData();

          } else {
            $scope.hideLoading();
            $scope.unknownError();
          }

          // response is the error message we set in the service
          // do something like display the message
        }
      );
    }


    $scope.unknownError = function () {

      if (window.analytics) {
        window.analytics.trackEvent('unknownError', null, null, null);
        /*window.analytics.trackView("Comparte espacio visitable");*/
      }

      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({

        template: $translate('LOADIN_ERROR'),
        title: $translate('LOADIN_ERROR_TITLE'),
        subTitle: '',
        scope: $scope,
        buttons: [
          {
            text: '<b>Ok</b>',
            type: 'button-energized',
            onTap: function (e) {
              $scope.hideLoading();
            }
          },
        ]
      });

    };
    $scope.page = [];

    $scope.grids = [
      {src: "catolicos.jpg"},
      {src: "ImagenHome33.jpg"},
      {src: "galeria1.jpg"},
      {src: "galeria2.jpg"},
      {src: "galeria3.jpg"},
      {src: "ImagenHome11.jpg"},
      {src: "ImagenHome22.jpg"},
      {src: "informacion.jpg"},
      {src: "marmol1.jpg"},
      {src: "marmol2.jpg"},
      {src: "marmol3.jpg"},
      {src: "oratorio1.jpg"},
      {src: "oratorio2.jpg"},
      {src: "oratorio3.jpg"},
      {src: "palacio1.jpg"},
      {src: "palacio2.jpg"},
      {src: "palacio3.jpg"},
      {src: "patioMartin1.jpg"},
      {src: "patioMartin2.jpg"},
      {src: "perdidos1.jpg"},
      {src: "perdidos2.jpg"},
      {src: "perdidos3.jpg"},
      {src: "salabaja1.jpg"},
      {src: "salabaja2.jpg"},
      {src: "salabaja3.jpg"},
      {src: "salaNorte1.jpg"},
      {src: "salaNorte2.jpg"},
      {src: "salaNorte3.jpg"},
      {src: "salasup1.jpg"},
      {src: "salasup2.jpg"},
      {src: "salasup3.jpg"},
      {src: "santaisabel2.jpg"},
      {src: "santaisabel3.jpg"},
      {src: "trono.jpg"},
      {src: "trono1.jpg"},
      {src: "trono2.jpg"},
      {src: "trovador.jpg"},
      {src: "trovador2.jpg"},
      {src: "visitaguiada.jpg"}
    ];

    $scope.params = $stateParams;

    $scope.goHome = function () {
      $state.go('app.home', { someOtherParam: '' });
      $ionicSideMenuDelegate.toggleLeft();

    }


    $scope.goToMenu = function (idMenu) {
      var res = idMenu.split(":");
      $state.go('app.' + res[0], { id: res[1] });
      /*$state.go(url, { });*/

    };

    $scope.goToSpace = function (id) {
      $rootScope.cameFromList = true;
      $state.go('app.space', { id: id });

    };

    $scope.getPage = function (id) {
      PageDB.read(id).then(function (page) {
        $scope.page = page;

      });

    };


    $scope.scan = function () {
      if (window.cordova && cordova.plugins.barcodeScanner) {

        cordova.plugins.barcodeScanner.scan(
          function (result) {
            if (result.text) {

              var qrPath = result.text.substring(result.text.lastIndexOf("[") + 1, result.text.lastIndexOf("]"));
              /* var id = String(qrPath).replace('#','');
               $location.path(id);*/


              var res = qrPath.split(":");

              $state.go('app.' + res[0], { id: res[1] });
              if (window.analytics) {
                window.analytics.trackEvent('ScanQR', res[1], null, null);
              }

            }
          },
          function (error) {
            alert("No se ha podido escanear, inténtelo más tarde gracias");
          }
        );


      }
    };


    $scope.addToCalendar = function (customDate, customTitle, customDesc) {
      // prep some variables

      var dateOld = new Date(customDate);

      /*console.log(dateOld.toISOString());*/

      var date = dateOld;

      var startDate = new Date(date.getFullYear(), date.getMonth(), date.getDay(), 18, 30, 0, 0, 0); // beware: month 0 = january, 11 = december
      var endDate = new Date(date.getFullYear(), date.getMonth(), date.getDay(), 19, 30, 0, 0, 0);
      var title = customTitle;
      var location = "Palacio de la Aljaferia";
      var notes = customDesc;
      var success = function (message) {
        /*console.log(message);*/

        if (window.analytics) {
          window.analytics.trackEvent('AddCalendar', title, null, null);
          /*window.analytics.trackView("Comparte espacio visitable");*/
        }
        var myPopup = $ionicPopup.show({

          template: $scope.okSchedule,
          title: $scope.infoTitle,
          subTitle: '',
          scope: $scope,
          buttons: [
            {
              text: '<b>Ok</b>',
              type: 'button-energized',
              onTap: function (e) {
                $scope.hideLoading();
              }
            },
          ]
        });


      };
      var error = function (message) {
        var myPopup = $ionicPopup.show({

          template: $scope.failSchedule,
          title: $scope.infoTitle,
          subTitle: '',
          scope: $scope,
          buttons: [
            {
              text: '<b>Ok</b>',
              type: 'button-energized',
              onTap: function (e) {
                $scope.hideLoading();
              }
            },
          ]
        });

      };

      if (window.cordova && window.plugins.calendar) {

        window.plugins.calendar.createEvent(title, location, notes, startDate, endDate, success, error);
      }


    };


    $scope.checkLastVersion = function () {
      $scope.checkVersionUrl = $rootScope.serverUrlAdd + "/api/checklastversion";
      var lastVersion = localStorageService.get('lastVersion');
      $.ajax({
        type: "GET",
        dataType: 'jsonp',
//        url: $rootScope.serverUrlAdd+"/api/allpages"
        url: $scope.checkVersionUrl
      }).done(function (data) {


          if (lastVersion < data[0].lastId) {
            $rootScope.updateAvailable = true;
            var myPopup = $ionicPopup.show({

              template: $scope.updateTitleTextDesc,
              title: $scope.updateTitleText,
              subTitle: '',
              scope: $scope,
              buttons: [
                {text: $scope.cancelButton},
                {
                  text: $scope.acceptButton,
                  type: 'button-positive',
                  onTap: function (e) {
                    /*alert("OK")*/
                    $scope.loading = $ionicLoading.show({

                      // The text to display in the loading indicator
                      content: $scope.checkVersionText,

                      // The animation to use
                      animation: 'fade-in',

                      // Will a dark overlay or backdrop cover the entire view
                      showBackdrop: true,

                      // The maximum width of the loading indicator
                      // Text will be wrapped if longer than maxWidth
                      maxWidth: 200,

                      // The delay in showing the indicator
                      showDelay: 500
                    });

                    localStorageService.add('lastVersion', data[0].lastId);
//            alert("Actualizando nueva version, espere por favor");
                    $scope.getUpdate();
                  }
                },

              ]
            });


          } else {
            console.log("Nada que actualizar, version server " + data[0].lastId)
            $scope.hideLoading();
          }

        })
        .fail(function (xhr, textStatus, errorThrown) {
          $ionicLoading.hide();
        });
    };

    var lastVersionUpdate = localStorageService.get('lastVersion');

    if (!lastVersionUpdate) {
      localStorageService.add('lastVersion', 0);
    }

  })

  .controller('HomeCtrl', function ($window, $timeout, $scope, localStorageService, $rootScope) {

    if (window.analytics) {
      window.analytics.trackView("HomePage");
    }


    var titleHeight = 0;
/*
    *//* Check iOS device and add 20 px because of status bar*//*
    if (ionic.Platform.isIOS()) {
      titleHeight = parseInt($(".title").height() + 20);
    } else {
      titleHeight = parseInt($(".title").height());
    }*/

    titleHeight = parseInt($(".title").height());


    var w = angular.element($window);
    $scope.getHeight = function () {
      return $rootScope.screenHeight;
    };
    $scope.$watch($scope.getHeight, function (newValue, oldValue) {
      $scope.windowHeight = newValue;
      $scope.style = function () {
        return {
          height: (newValue - titleHeight) / 3 + 'px'
        };
      };
    });

    w.bind('resize', function () {
      $scope.$apply();
    });


    var lastVersion = localStorageService.get('totalItems');


    $scope.$on('allpages', function (event, message) {
      $scope.pages = message;
    })


  })

  .controller('FullMapCtrl', function ($translate, $timeout, $scope, localStorageService, $rootScope, $ionicPopup, $state) {
    if (window.analytics) {
      window.analytics.trackView("Map Zoom");
    }

    $('img[usemap]').rwdImageMaps();
    var lastVersion = localStorageService.get('totalItems');


    $timeout(function () {
      var $section = $('#wrap').first();
      $section.find('.panzoom').panzoom({
        eventNamespace: ".panzoom",
        minScale: 0.6,
        maxScale: 3
      });


    }, 1000);


    $scope.openModal = function (idPage) {

      $('#area' + idPage).mouseover();
      $rootScope.lastSpaceVisited = parseInt(idPage, 10);
      $state.go('app.space', {id: idPage});

      if (idPage >= 16) {
        $rootScope.currSlide = 1;
      }

    };

  })

  .controller('MapCtrl', function ($translate, $timeout, $scope, localStorageService, $rootScope, $ionicPopup, $state, $ionicSlideBoxDelegate, $stateParams) {
    if (window.analytics) {
      window.analytics.trackView("Map");
    }

    var lastVersion = localStorageService.get('totalItems');

    $timeout(function () {
      $('img[usemap]').rwdImageMaps();

      $timeout(function () {

        $('img[usemap]').maphilight({ stroke: false, fillColor: 'ff0000', fillOpacity: 0.5 });
        if ($rootScope.lastSpaceVisited) {

          $('#area' + $rootScope.lastSpaceVisited).mouseover();
          $ionicSlideBoxDelegate.update();
        }
      }, 500);
    }, 300);


    $scope.slideChanged = function () {
      $rootScope.currSlide = $ionicSlideBoxDelegate.currentIndex();


    };


    /*Initialize Image map */


    $scope.openModal = function (idPage) {

      $state.go('app.space', {id: idPage});


      /* if(parseInt(idPage,10) != 0){
       $(".activated").mouseout();
       $('#area'+idPage).mouseover();
       $rootScope.lastSpaceVisited= parseInt(idPage,10);
       // An elaborate, custom popup
       var myPopup = $ionicPopup.show({
       template: $rootScope.page.nextSpaceText,
       title: $scope.infoTitle,
       subTitle: '',
       scope: $scope,
       buttons: [
       {
       text: $scope.seeButton,
       type: 'button-energized',
       onTap: function(e) {
       */
      /*alert("OK")*/
      /*
       $state.go('app.space', {id: idPage});
       }
       }
       ]
       });

       }else{


       var myPopup = $ionicPopup.show({
       template: $scope.startDesc,
       title: $scope.infoTitle,
       subTitle: '',
       scope: $scope,
       buttons: [
       {
       text: $scope.okButton,
       type: 'button-energized',
       onTap: function(e) {

       }
       }
       ]
       });
       }*/


    };


    $scope.$on('allpages', function (event, message) {
      $scope.pages = message;
    })


  })

  .controller('GalleryCtrl', function ($scope) {

    if (window.analytics) {
      window.analytics.trackView("Gallery");
    }


    $scope.galleryHeight = 120;


    $scope.showFullImage = function (imageSrc, id) {

      FullScreenImage.showImageURL(imageSrc);

    };


  })

  .controller('ModalCtrl', function ($scope, $stateParams) {


  })
  .controller('PlaylistCtrl', function ($scope, $stateParams) {
  })
  .controller('SpaceCtrl', function (Utils, $window, $translate, $interval, $timeout, $location, $scope, $rootScope, $stateParams, $state, $ionicSlideBoxDelegate, $ionicModal, $ionicPopup) {

    $("#compassContainer1").hide();
    var w = angular.element($window);
    $scope.getHeight = function () {
      return $rootScope.screenHeight;
    };
    $scope.$watch($scope.getHeight, function (newValue, oldValue) {
      $scope.windowHeight = newValue;
      $scope.windowW
      $scope.style = function () {
        return {
          height: newValue + 'px',
          'background-size': newValue + 'px ' + $rootScope.screenWidth + 'px'
        };
      };
    });

    w.bind('resize', function () {
      $scope.$apply();
    });


    if ($rootScope.cameFromList) {
      /*console.log("Came from List"+$rootScope.cameFromList)*/
      $scope.cameFromListScope = true;
      $rootScope.cameFromList = false;
    }
    var idPage = String($stateParams.id).replace(':', '');
    $rootScope.lastSpaceVisited = idPage;


    $scope.imagesSpace = [];

    $data(localeDB).read(idPage).then(function (page) {

      var pagename = "";
      $scope.$apply(function () {
        $scope.page = page;
        $scope.setImages();
        pagename = page.title;
        if (window.analytics) {
          window.analytics.trackView(page.title);
        }
        if (page.latlon) {
          var res = page.latlon.split(",");
          $rootScope.currentLocationLat = res[0];
          $rootScope.currentLocationLon = res[1];


        } else {
          $rootScope.currentLocationLat = 41.65664;
          $rootScope.currentLocationLon = -0.89668;
        }
        /* console.log("Latitud del espacio: "+$rootScope.currentLocationLat+" - Latitud: "+$rootScope.currentLocationLon);*/


        /*        if(page.isAnimated){
         $("#coverAnimated").css('display','block');
         $timeout(function(){

         $("#coverAnimated").css('display','none');
         },parseInt(2500));


         }else{
         $("#coverAnimated").css('display','none');
         }*/


        /*if(id = 1){
         $rootScope.rssFeedUrl = page.rssCultural;
         }*/
        /* analytics.trackView(page.title);*/
      });
    });


    $scope.setImages = function () {

      if ($scope.page.image_name1) {
        Utils.isImage('img/homeImages/' + $scope.page.image_name1).then(function (result) {

          if (result) {


            $scope.imagesSpace.push({ image: $scope.page.image1, mimetype: $scope.page.mimetype1, imageName: $rootScope.imagePath + '' + $scope.page.image_name1});
            /*$scope.imagesSpace.push({ image: $scope.page.image1,mimetype: $scope.page.mimetype1, imageName: "data:"+$scope.page.mimetype1+";base64,"+$scope.page.image1});*/
            $ionicSlideBoxDelegate.update();
          } else {

            $scope.imagesSpace.push({ image: $scope.page.image1, mimetype: $scope.page.mimetype1, imageName: "data:" + $scope.page.mimetype1 + ";base64," + $scope.page.image1});
            $ionicSlideBoxDelegate.update();
          }

        });


      }
      if ($scope.page.image_name2) {

        Utils.isImage($rootScope.imagePath + '' + $scope.page.image_name2).then(function (result) {

          if (result) {

            $scope.imagesSpace.push({ image: $scope.page.image2, mimetype: $scope.page.mimetype2, imageName: $rootScope.imagePath + '' + $scope.page.image_name2});
            /*$scope.imagesSpace.push({ image: $scope.page.image2,mimetype: $scope.page.mimetype2, imageName: "data:"+$scope.page.mimetype2+";base64,"+$scope.page.image2});*/
            $ionicSlideBoxDelegate.update();
          } else {

            $scope.imagesSpace.push({ image: $scope.page.image2, mimetype: $scope.page.mimetype2, imageName: "data:" + $scope.page.mimetype2 + ";base64," + $scope.page.image2});
            $ionicSlideBoxDelegate.update();
          }

        });

        /* $scope.imagesSpace.push({ image: $scope.page.image2,mimetype: $scope.page.mimetype2, imageName: $scope.page.image_name2});*/
      }
      if ($scope.page.image_name3) {

        Utils.isImage($rootScope.imagePath + '' + $scope.page.image_name3).then(function (result) {

          if (result) {

            $scope.imagesSpace.push({ image: $scope.page.image3, mimetype: $scope.page.mimetype3, imageName: $rootScope.imagePath + '' + $scope.page.image_name3});
            /*$scope.imagesSpace.push({ image: $scope.page.image3,mimetype: $scope.page.mimetype3, imageName: "data:"+$scope.page.mimetype3+";base64,"+$scope.page.image3});*/
            $ionicSlideBoxDelegate.update();
          } else {

            $scope.imagesSpace.push({ image: $scope.page.image3, mimetype: $scope.page.mimetype3, imageName: "data:" + $scope.page.mimetype3 + ";base64," + $scope.page.image3});
            $ionicSlideBoxDelegate.update();
          }

        });

        /*$scope.imagesSpace.push({ image: $scope.page.image3 ,mimetype: $scope.page.mimetype3, imageName: $scope.page.image_name3});*/
      }


      $ionicSlideBoxDelegate.update();

      $timeout(function () {
        $scope.startCompass();
      }, 2000);


    }

    $scope.showPopup = function () {
      $scope.data = {}

      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({

        template: $scope.page.nextSpaceText,
        title: $scope.nextSlide,
        subTitle: '',
        scope: $scope,
        buttons: [
          {
            text: $scope.acceptButton,
            type: 'button-energized',
            onTap: function (e) {
              /*alert("OK")*/
              $scope.changePage(1);
            }
          },
        ]
      });
    };

    $scope.goNext = function () {
      $scope.showPopup();

    };

    $scope.showPopupPrev = function () {

      $scope.data = {}

      $scope.changePage(-1);

      // Client request 17-06-2014

      // An elaborate, custom popup

      /*var myPopup = $ionicPopup.show({
       template: $scope.page.prevSpaceText,
       title: $scope.prevSlide,
       subTitle: '',
       scope: $scope,
       buttons: [
       {
       text: $scope.acceptButton,
       type: 'button-energized',
       onTap: function(e) {
       */
      /*alert("OK")*/
      /*
       $scope.changePage(-1);
       }
       }
       ]
       });*/
    };

    $scope.goPrevious = function () {
      $scope.showPopupPrev();

    };

    $ionicModal.fromTemplateUrl('modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;

      });
    $scope.openModal = function () {
      $scope.modal.show();

    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });

    $scope.goToMap = function () {

      var next = parseInt($rootScope.lastSpaceVisited, 10);
      $rootScope.lastSpaceVisited = next;


      $scope.canGo = true;

      if (next <= 15) {
        $rootScope.currSlide = 0;
      } else if (next == 21) {
        $rootScope.currSlide = 0;
      }
      else {
        $rootScope.currSlide = 1;
      }

      $scope.stopCompass();
      $state.go('app.map', { id: 1 });
    };

    if (idPage == 10) {
      $timeout(function () {
        $("#leftNavButton").hide();
      }, 1050)

    }

    if (idPage == 21) {
      $timeout(function () {
        $("#rightNavButton").hide();
      }, 1050);
    }


    $scope.changePage = function (value) {


      var total = parseInt(idPage, 10) + parseInt(value, 10);
      console.log(total);
      if (total == 10) {
        $timeout(function () {
          $("#leftNavButton").hide();
        }, 1050)

      }

      if (total >= 21) {
        $timeout(function () {
          $("#rightNavButton").hide();
        }, 1550)


      }


      var next = parseInt($rootScope.lastSpaceVisited, 10) + parseInt(value, 10);
      $rootScope.lastSpaceVisited = next;

      /*console.log("------LAST----- "+$rootScope.lastSpaceVisited);*/
      $scope.canGo = true;

      if (next < 9) {
        /*console.log("no prev");*/
        $rootScope.lastSpaceVisited = next + 1;
        return;
      }

      if (next > 21) {
        /*console.log("no next")*/
        $rootScope.lastSpaceVisited = next - 1;
        return;
      }


      $data(localeDB).read(next).then(function (page) {

          /*console.log(next+"  -   "+page.type)*/

          if (page.type == 3) {
            $scope.canGo = false;
            $state.go('app.space', { id: next });

          } else {
            var nextNew = value + value;
            $scope.changePage(nextNew);
          }

        },
        function (data) {

          /*console.log(parseInt(value, 10));*/

          if (parseInt(value, 10) >= 0) {
            $scope.changePage(1);
          } else {
            $scope.changePage(-1);
          }

        });


      if (window.cordova && window.cordova.plugins.analytics) {
        window.cordova.plugins.analytics.trackView(page.title);
      }
      /* $data(localeDB).read(next).then(function (page) {

       var pagename = "";
       $scope.$apply(function () {
       $scope.page = page;
       pagename = page.title;

       console.log(pagename);

       $scope.setImages();
       $ionicSlideBoxDelegate.update();
       if(window.cordova && cordova.plugins.analytics){
       cordova.plugins.analytics.trackView(page.title);
       }
       });
       });*/

    };


    $scope.sharePage = function () {
      if (window.analytics) {
        window.analytics.trackEvent('Comparte espacio visitable', $scope.page.title, null, null);
        /*window.analytics.trackView("Comparte espacio visitable");*/
      }
      console.log("--->  " + $scope.page.headerImage);
      console.log($scope.page.title);
      var message = {
        text: $scope.shareSubtextWatching + "" + $scope.page.title + ", " + $scope.shareText,
        subject: $scope.shareSubtext,
        url: $rootScope.shareUrl,
        image: $rootScope.serverUrlAdd + "/preview/www/img/homeImages/" + $scope.page.headerImage
      };
      console.log(message);

      window.plugins.socialsharing.share(message);
      /*window.plugins.socialmessage.send(message);*/


    };


  })
  .controller('PalaceCtrl', function ($window, $timeout, $scope, $stateParams, $state, $ionicSlideBoxDelegate, $rootScope) {

    var titleHeight = 0;
/*
    *//* Check iOS device and add 20 px because of status bar*//*
    if (ionic.Platform.isIOS()) {
      titleHeight = parseInt($(".title").height() + 18.5);
    } else {
      titleHeight = parseInt($(".title").height());
    }*/

    titleHeight = parseInt($(".title").height());


    var w = angular.element($window);
    $scope.getHeight = function () {
      return $rootScope.screenHeight;
    };
    $scope.$watch($scope.getHeight, function (newValue, oldValue) {
      $scope.windowHeight = newValue;
      $scope.style = function () {
        return {
          height: (newValue - titleHeight) / 3 + 'px',
          width: '100%'
        };
      };
    });

    w.bind('resize', function () {
      $scope.$apply();
    });


    $scope.goToEpoca = function (id) {
      $state.go('app.palacelist', { id: id });
    }

    if (window.analytics) {
      window.analytics.trackView("Palace");
    }

  })
  .controller('AboutCtrl', function ($scope, $stateParams, $ionicTabsDelegate) {
    if (window.analytics) {
      window.analytics.trackView("Info");
    }
    $scope.config = {
      width: "100%",
      height: 600,
      autoHide: false,
      autoPlay: true,
      responsive: true,
      theme: {
        url: "css/videogular/videogular.css",
        playIcon: "&#xe000;",
        pauseIcon: "&#xe001;",
        volumeLevel3Icon: "&#xe002;",
        volumeLevel2Icon: "&#xe003;",
        volumeLevel1Icon: "&#xe004;",
        volumeLevel0Icon: "&#xe005;",
        muteIcon: "&#xe006;",
        enterFullScreenIcon: "&#xe007;",
        exitFullScreenIcon: "&#xe008;"
      }
    };


    var idPage = String($stateParams.id).replace(':', '');

    $scope.imagesSpace = [];
    $data(localeDB).read(idPage).then(function (page) {

      var pagename = "";
      $scope.$apply(function () {
        $scope.page = page;
        pagename = page.title;
      });
    });


    $scope.openMap = function () {

      if (window.analytics) {
        window.analytics.trackEvent('OpenMap', window.device.platform, null, null);
        /*window.analytics.trackView("Comparte espacio visitable");*/
      }

      if (window.device.platform === 'iOS') {
        window.open('http://maps.apple.com/?q=Palacio de la Aljafería', '_system', 'location=yes');
      } else {
        window.open('https://www.google.com/maps/place/Palacio+de+la+Aljafer%C3%ADa', '_system', 'location=yes');
      }

    };


    $ionicTabsDelegate.selectedIndex = function (index) {

    };

  })
  .controller('PalaceListCtrl', function ($rootScope, $window, $scope, $stateParams) {

    var titleHeight = 0;
/*

    */
/* Check iOS device and add 20 px because of status bar*//*

    if (ionic.Platform.isIOS()) {
      titleHeight = parseInt($(".title").height() + 16);
    } else {
      titleHeight = parseInt($(".title").height());
    }
*/


    titleHeight = parseInt($(".title").height());

    var w = angular.element($window);
    $scope.getHeight = function () {
      return $rootScope.screenHeight;
    };
    $scope.$watch($scope.getHeight, function (newValue, oldValue) {
      $scope.windowHeight = newValue;
      $scope.style = function () {
        return {
          height: (newValue - titleHeight) / 2 + 'px'
        };
      };
    });

    w.bind('resize', function () {
      $scope.$apply();
    });

    var idPage = String($stateParams.id).replace(':', '');
    $scope.categoryPalace = idPage;
    $scope.imagesSpace = [];

    $data(localeDB).read(idPage).then(function (page) {

      var pagename = "";
      $scope.$apply(function () {
        $scope.page = page;
        pagename = page.title;
        if (window.analytics) {
          window.analytics.trackView(page.title);
        }
      });
    });


  })

  .controller('ScheduleDetailCtrl', function ($scope, $stateParams, $q, $timeout, FeedService, $rootScope) {
    var idPage = String($stateParams.id).replace(':', '');
    $scope.news = $rootScope.feeds[idPage];

    if (window.analytics) {
      window.analytics.trackView("Agenda: " + $scope.news.title);
    }
    $scope.shareNews = function (url, text, description, image) {
      var message = {
        text: text,
        subject: description,
        url: url,
        image: image
      };
      window.plugins.socialsharing.share(message);
      /*window.socialmessage.send(message);*/

      if (window.analytics) {
        window.analytics.trackEvent('ShareNews', text, null, null);
        /*window.analytics.trackView("Comparte espacio visitable");*/
      }


    };


  })
  .controller('ScheduleCtrl', function ($scope, $stateParams, $q, $timeout, FeedService, $rootScope) {

    var promise = $q.all({});

    if (window.analytics) {
      window.analytics.trackView("Schedule");
    }
    if ($rootScope.feeds) {

    } else {
      $scope.showLoading();
      FeedService.parseFeed("" + $rootScope.rssFeedUrl + "").then(function (res) {
        $scope.hideLoading();

        $rootScope.feeds = [];

        var count = res.data.query.results.rss.channel.item.length;

        if (count > 1) {
          angular.forEach(res.data.query.results.rss.channel.item, function (item, i) {

            $rootScope.feeds.push({
              title: item.title,
              description: item.description,
              subtitle: item.category,
              enclosure: item.enclosure.url,
              publishedDate: item.pubDate
            });


            if (res.data.query.results.rss.channel.item.length == i + 1) {
              $scope.hideLoading();
            }

          });
        } else {
          $rootScope.feeds.push({
            title: res.data.query.results.rss.channel.item.title,
            description: res.data.query.results.rss.channel.item.description,
            subtitle: res.data.query.results.rss.channel.item.category,
            enclosure: res.data.query.results.rss.channel.item.enclosure.url,
            publishedDate: res.data.query.results.rss.channel.item.pubDate
          });
          if (!res.data.query.results.rss.channel.item.enclosure.url) {
            $scope.hideLoading();
          }
        }


      });

      $timeout(function () {
        $scope.hideLoading();
      }, 10000);
    }

    $scope.doRefreshPull = function () {

      if (window.analytics) {
        window.analytics.trackEvent('PullToRefresh', null, null, null);
        /*window.analytics.trackView("Comparte espacio visitable");*/
      }

      $scope.newFeeds = [];
      FeedService.parseFeed("" + $rootScope.rssFeedUrl + "").then(function (res) {

        $rootScope.feeds = [];

        var count = res.data.query.results.rss.channel.item.length;

        if (count > 1) {
          angular.forEach(res.data.query.results.rss.channel.item, function (item, i) {

            $rootScope.feeds.push({
              title: item.title,
              description: item.description,
              subtitle: item.category,
              enclosure: item.enclosure.url,
              publishedDate: item.pubDate
            });


            if (res.data.query.results.rss.channel.item.length == i + 1) {
              $scope.hideLoading();
              //Stop the ion-refresher from spinning
              $scope.$broadcast('scroll.refreshComplete');
            }

          });
        } else {
          $rootScope.feeds.push({
            title: res.data.query.results.rss.channel.item.title,
            description: res.data.query.results.rss.channel.item.description,
            subtitle: res.data.query.results.rss.channel.item.category,
            enclosure: res.data.query.results.rss.channel.item.enclosure.url,
            publishedDate: res.data.query.results.rss.channel.item.pubDate
          });

          //Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        }


        $timeout(function () {
          $scope.hideLoading();
          //Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        }, 10000);
      });


    };

  })

  .controller('SearchCtrl', function ($scope, $stateParams, $ionicModal) {
    $ionicModal.fromTemplateUrl('templates/modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
      });
    $scope.openModal = function () {
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });

    $scope.startCompassSearch = function () {
      var compass = document.getElementById('compassContainer');

      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function (event) {
          var dir = '';
          var alpha;
          //Check for iOS property
          if (event.webkitCompassHeading) {
            alpha = event.webkitCompassHeading;
            //Direction is reversed for iOS
            dir = '-';
          }
          else alpha = event.alpha;
          compass.style.Transform = 'rotate(' + alpha + 'deg)';
          compass.style.WebkitTransform = 'rotate(' + dir + alpha + 'deg)';
          compass.style.MozTransform = 'rotate(-' + alpha + 'deg)';
        }, false);
      }
    }


  })
  .filter('unique', function () {
    return function (collection, keyname) {
      var output = [],
        keys = [];

      angular.forEach(collection, function (item) {
        var key = item[keyname];
        if (keys.indexOf(key) === -1) {
          keys.push(key);
          output.push(item);
        }
      });

      return output;
    };
  })
  .directive('repeatDone', function () {
    return function ($scope, $element, $attr) {

      if ($scope.$last) { // all are rendered

        /*var li = $('#mainList');
         li.removeAttr('hidden');*/
        $scope.hideLoading();


      }
    }
  })
  .filter('dateToISO', function () {
    return function (input) {
      input = new Date(input).toISOString();
      return input;
    };
  })
  .directive('gridImage', function () {
    return function ($scope, element, attrs) {
      var url = attrs.gridImage;
      element.css({
        'background-image': 'url(' + url + ')'
      });
    };
  })
  .factory('dbFactory', function ($rootScope, $q, $timeout, $http, localStorageService) {

    var PageDB = $data.define(localeDB, {
      Id: {type: "int", key: true, computed: true, index: {unique: true}},
      type: {type: "int", key: false, computed: false, index: {unique: false}},
      subtitle: String,
      linkMenu: String,
      title: String,
      description: String,
      headerImage: String,
      headerTitle: String,
      iconImage: String,
      rssCultural: String,
      scrollImage1: String,
      scrollImage2: String,
      scrollImage3: String,
      scrollText1: String,
      scrollText2: String,
      scrollText3: String,
      tabText1: String,
      tabText2: String,
      tabText3: String,
      tabDetailText1: String,
      tabDetailText2: String,
      tabDetailText3: String,
      image1: String,
      mimetype1: String,
      image_name1: String,
      image2: String,
      mimetype2: String,
      image_name2: String,
      image3: String,
      mimetype3: String,
      image_name3: String,
      isSortable: Boolean,
      orderGuide: {type: "int", index: {unique: true}},
      thumbImage: String,
      planeHtml1: String,
      planeHtml2: String,
      planeHtml3: String,
      moreThanOnePlane: Boolean,
      floorDesc: String,
      latlon: String,
      timeId: {type: "int", index: {unique: true}},
      isAnimated: String,
      chronology: String,
      nextSpaceText: String,
      prevSpaceText: String
    });

    var lastVersion = localStorageService.get('totalItems');

    console.log(lastVersion);
    var allPages = [];
    var downloadVersionUrl = "";
    if (localeLang != "es") {
      downloadVersionUrl = $rootScope.serverUrlAdd + "/api/allpages/en";
    } else {
      downloadVersionUrl = $rootScope.serverUrlAdd + "/api/allpages";
    }

    return {
      loadPreviousDB: function () {
        console.log("leyendo");
        var deferred = $q.defer();
        PageDB.readAll().then(function (res) {

          allPages = res;


          console.log("Antes de timeout");
          // Your call to the database in place of the $timeout
          $timeout(function () {
            var chance = Math.random() > 0.55;
            console.log("Chance " + chance);
            console.log("All Pages " + allPages.length);
            if (chance && allPages.length > 0) {
              // if the call is successfull, return data to controller
              deferred.resolve(allPages);

            }
            else {
              // if the call failed, return an error message
              deferred.reject("Error");
              console.log("Error carga de base datos, Debo recargar antigua?");
            }
          }, 1000);


        });


        return deferred.promise;

      },
      loadDB: function () {
        var deferred = $q.defer();
        $http.get('res/pages/pages_' + localeLang + '.json').success(function (data) {
          // you can do some processing here

          localStorageService.add('totalItems', data.pages.length);
          PageDB.addMany(data.pages);
          /*$scope.hideLoading();*/
          allPages = data.pages;
          if (allPages.length >= 1) {
            deferred.resolve(allPages);
          } else {
            localStorageService.add('totalItems', data.pages.length);
            PageDB.addMany(data.pages);
            /*$scope.hideLoading();*/
            allPages = data.pages;
            deferred.resolve(allPages);
          }
        }).error(function (data, status, headers, config) {

            console.log("ERROR")
            deferred.reject("Error");
          });


        var deferred = $q.defer();
        // Your call to the database in place of the $timeout
        $timeout(function () {
          var chance = Math.random() > 0.25;
          if (chance) {
            // if the call is successfull, return data to controller
            deferred.resolve(allPages);
          }
          else {
            // if the call failed, return an error message
            deferred.reject("Error");
          }
        }, 5000);


        return deferred.promise;


      },
      getPage: function () {
        var deferred = $q.defer();

        $http.get('some/url').then(function (response) {
          deferred.resolve(response);
        });

        return deferred.promise;
      },
      downloadUpdate: function () {
        var deferred = $q.defer();


        $timeout(function () {
          PageDB.removeAll();
          /* USE OF JSONP TO AVOID CROSS DOMAIN ERROR*/
          $http.jsonp(downloadVersionUrl + '?callback=JSON_CALLBACK').success(function (data) {

            // you can do some processing here
            $('.loading').text("Instalando...");
            /* localStorageService.add('totalItems',data.pages.length);
             var i =0;*/
            PageDB.addMany(data.pages);
            /*$scope.hideLoading();*/
            allPages = data.pages

            $timeout(function () {
              var chance = Math.random() > 0.25;
              if (chance) {
                // if the call is successfull, return data to controller
                deferred.resolve(allPages);
              }
              else {
                // if the call failed, return an error message
                deferred.reject("Error");

              }
            }, 10000);
          }).error(function (data, status, headers, config) {

              console.log("ERROR download Update");

              deferred.reject("Error");


            });


        }, 50);


        return deferred.promise;
      }
    };
  })
  .factory('Utils', function ($q) {
    return {
      isImage: function (src) {

        var deferred = $q.defer();

        var image = new Image();
        image.onerror = function () {
          deferred.resolve(false);
        };
        image.onload = function () {
          deferred.resolve(true);
        };
        image.src = src;

        return deferred.promise;
      }
    };
  })
  .directive('fallbackSrc', function () {
    var fallbackSrc = {
      link: function postLink(scope, iElement, iAttrs) {
        iElement.bind('error', function () {
          angular.element(this).attr("src", iAttrs.fallbackSrc);
        });
      }
    }
    return fallbackSrc;
  })
  .factory('FeedService', ['$http', function ($http) {
    return {
      parseFeed: function (url) {

        var apiUrl = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'";
        apiUrl += encodeURIComponent(url);
        apiUrl += "'&format=json&diagnostics=true&callback=JSON_CALLBACK";
        return $http.jsonp(apiUrl).then(onSuccess, onerror);
        function onSuccess(response) {
          return response;
        }

        function onerror() {

          $scope.unknownError();

        }


      }
    }
  }]);
