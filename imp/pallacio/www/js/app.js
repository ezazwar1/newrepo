// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','LocalStorageModule','pascalprecht.translate'])
  .config(['$translateProvider',function($translateProvider) {
    $translateProvider.translations('en', {
      APP_SHARE_TEXT_WATCHING: 'I´m visiting ',
      APP_SHARE_TEXT: 'discover The Aljaferia´s Palace.',
      APP_SHARE_SUBTEXT: 'Discover The Aljaferia´s Palace',
      HORARIOS: 'Timetable',
      TARIFAS: 'Prices',
      MAPA: 'Map',
      APP_NEXT_SPACE: 'Next',
      APP_PREV_SPACE: 'Previous',
      APP_BACKBUTTON: 'Back',
      APP_TITLE: 'Aljafería Palace',
      APP_INFO_TITLE: 'Information',
      APP_SEE_BUTTON:'<b>Go</b>',
      APP_YES_BUTTON:'Yes',
      APP_NO_BUTTON:'No',
      APP_OK_BUTTON:'<b>Ok</b>',
      APP_ACCEPT_BUTTON:'<b>Accept</b>',
      APP_CANCEL_BUTTON:'<b>Cancel</b>',
      APP_START_TOUR_DESCRIPTION:'<p>Tour guide start point</p>',
      APP_START_TOUR_TITLE:'<p>Start door</p>',
      LOADING_MSG: 'Loading...',
      LOADING_ERROR:'<p>We can not get data, please try later</p>',
      LOADIN_ERROR_TITLE: 'Uppss!',
      MAP_TITLE:'Map',
      MAP_ZOOM_TITLE:'Map/Zoom',
      PALACE_MENU_NAME:'The Palace',
      VISIT_MENU_NAME:'Visit/Itinerary',
      CULTURAL_MENU_NAME:'Schedule',
      GALLERY_MENU_NAME:'Gallery',
      INFO_MENU_NAME:'Information',
      SCHEDULE_TITLE: 'Schedule',
      BACKBUTTON_EXIT: 'Tap again to exit app',
      SUCCESS_SCHEDULE: 'Event added to your calendar, thanks!',
      FAIL_SCHEDULE: 'This event couldnt be added, sorry :(',
      DIRECTION_FRONT: '<p>Go straight ahead, to the next space.</p>',
      ERROR_DOWNLOADING : 'Sorry, update can not be downloaded, please try again later, thanks!',
      APP_NEXT_SLIDE : '<b>Next space</b>',
      UPDATE_AVAILABLE: '<p>There is a new update, would you like to install?</p>',
      APP_UPDATE_TITLE: 'Update available',
      APP_UPDATE_DESC: '<p>There is a new update, would you like to install?</p>',
      APP_FIRST_FLOOR: 'First floor',
      APP_SECOND_FLOOR: 'Upper floors',
      TAIFAL_PALACE: 'Taifal Palace',
      TAIFAL_PALACE_TEXT: 'The construction of this palace dates back to the second half of the 11th century, during the reign of the Taifa monarch of Zaragoza, Abu Yafar al Muqtadir Billah.',
      MEDIEVAL_PALACE: 'Mediaeval Palace',
      MEDIEVAL_PALACE_TEXT: 'In 1118, Alfonso I El Batallador (The Warrior) won back the city of Zaragoza.  It was then, when the Aljaferia became a Christian fortified palace.',
      CATHOLIC_PALACE: 'Catholic Monarchs Palace',
      CATHOLIC_PALACE_TEXT:'Ordered to be built by the Catholic Monarchs during the last lustrums of the 15th century – between 1488 and 1496 - over the northern wing of the Islamic enclosure.'

    })
      .translations('es', {
        APP_SHARE_TEXT_WATCHING: 'Estoy visitando ',
        APP_SHARE_TEXT: 'descubre el Palacio de la Aljafería.',
        APP_SHARE_SUBTEXT: 'Descubre el Palacio de la Aljafería',
        HORARIOS: 'Horarios',
        TARIFAS: 'Tarifas',
        MAPA: 'Mapa',
        APP_NEXT_SPACE: 'Siguiente',
        APP_PREV_SPACE: 'Anterior',
        APP_BACKBUTTON: 'Volver',
        APP_TITLE: 'Palacio de la Aljafería',
        APP_INFO_TITLE: '<b>Información</b>',
        APP_SEE_BUTTON:'<b>Ver</b>',
        APP_YES_BUTTON:'Si',
        APP_NO_BUTTON:'No',
        APP_OK_BUTTON:'<b>Ok</b>',
        APP_ACCEPT_BUTTON:'<b>Aceptar</b>',
        APP_CANCEL_BUTTON:'<b>Cancelar</b>',
        APP_START_TOUR_DESCRIPTION: "Este es inicio de la visita guiada",
        APP_START_TOUR_TITLE:'Puerta principal',
        LOADING_MSG: 'Cargando...',
        LOADING_ERROR:'<p>No hemos podido recuperar los datos, prueba más tarde por favor.</p>',
        LOADIN_ERROR_TITLE: 'Problemas',
        MAP_TITLE:'Mapa',
        MAP_ZOOM_TITLE:'Mapa/Zoom',
        PALACE_MENU_NAME:'El Palacio',
        VISIT_MENU_NAME:'Visita / Itinerario',
        CULTURAL_MENU_NAME:'Agenda Cultural',
        GALLERY_MENU_NAME:'Galería',
        INFO_MENU_NAME:'Información',
        SCHEDULE_TITLE: 'Agenda',
        BACKBUTTON_EXIT: 'Pulse otra vez para salir de la aplicación',
        SUCCESS_SCHEDULE: 'El evento se ha añadido a tu agenda, muchas gracias!',
        FAIL_SCHEDULE: 'No se ha podido añadir el evento, lo sentimos :(',
        DIRECTION_FRONT: '<p>Sigue hacia delante, entra en la siguiente sala.</p>',
        ERROR_DOWNLOADING : 'No se ha podido descargar la actualización, inténtelo más tarde, gracias',
        APP_NEXT_SLIDE : '<b>Siguiente</b>',
        APP_PREV_SLIDE : '<b>Anterior</b>',
        APP_UPDATE_TITLE: 'Actualización disponible',
        APP_UPDATE_DESC: '<p>Existe una nueva actualización, ¿Desea instalar la nueva versión?</p>',
        APP_FIRST_FLOOR: 'Planta baja',
        APP_SECOND_FLOOR: 'Plantas superiores',
        TAIFAL_PALACE: 'Palacio Taifal',
        TAIFAL_PALACE_TEXT: 'The construction of this palace dates back to the second half of the 11th century, during the reign of the Taifa monarch of Zaragoza, Abu Yafar al Muqtadir Billah.',
        MEDIEVAL_PALACE: 'Cristiano Medieval',
        MEDIEVAL_PALACE_TEXT: 'In 1118, Alfonso I El Batallador (The Warrior) won back the city of Zaragoza.  It was then, when the Aljaferia became a Christian fortified palace.',
        CATHOLIC_PALACE: 'Reyes Católicos',
        CATHOLIC_PALACE_TEXT:'Ordered to be built by the Catholic Monarchs during the last lustrums of the 15th century – between 1488 and 1496 - over the northern wing of the Islamic enclosure.'


      });
    $translateProvider.preferredLanguage('es');
  }])
  .run(function($ionicPlatform,$rootScope) {

    $rootScope.rssFeedUrl = 'http://www.cortesaragon.es/index.php?eID=tx_carss_pi2&tx_carss_pi2[rss]=APPALJAFERIA';
//    $rootScope.rssFeedUrl = 'http://www.heraldo.es/index.php/mod.portadas/mem.rss';
    $rootScope.serverUrlAdd = 'http://aljaferia.proyectos.keensoft.es';
//    $rootScope.serverUrlAdd = 'http://192.168.14.76:8888';
    $rootScope.shareUrl = 'http://www.cortesaragon.es/apps/palacio-aljaferia/';
    $rootScope.imagePath = 'img/homeImages/';
    $rootScope.isSaving =false;
    $rootScope.mapLoaded =false;
    $rootScope.shouldUseSpaceLoc =false;
    $rootScope.titleHeight = 43;
    $rootScope.cameFromList = false;
    $rootScope.pages =[];
    $rootScope.spacesPages =[];
    $rootScope.thirdImagesPalace = ['salaNorte1.jpg','salabaja1.jpg','tronoView.jpg'];
    $rootScope.currSlide=0;
    $rootScope.lastSpaceVisited = 10;
    $rootScope.screenHeight = "";
    $rootScope.currentLocationLat = "";
    $rootScope.currentLocationLon = "";
    $rootScope.geoPositionMessage = "No hemos podido localizar su posición, ¿desea utilizar la posición de la sala donde se encuentra?";
    $rootScope.updateAvailable = false;
    /*Change to use in simulator*/
    $rootScope.updateAvailableSimulator=false;

    $ionicPlatform.ready(function() {

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      /*if(window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }*/
      if(window.cordova){
        console.log("analitycs")
        /*Cuenta de alberto.munoz@keensoft.es*/
        /*window.analytics.startTrackerWithId('UA-50000851-1');*/

        window.analytics.startTrackerWithId('UA-322805-7');
      }
    
      if (navigator.splashscreen) {
        console.log("Hidding splash!");
        // We're done initializing, remove the splash screen
        navigator.splashscreen.hide();
      }


    });
  })
  .config(['$sceDelegateProvider', function($sceDelegateProvider,$rootScope) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://aljaferia.proyectos.keensoft.es', 'http://aljaferia.proyectos.keensoft.es/**']);

  }])


  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
      })

      .state('app.gallery', {
        url: "/gallery/:id",
        views: {
          'menuContent' :{
            templateUrl: "templates/gallery.html",
            controller: 'GalleryCtrl'
          }
        }
      })
      .state('app.palace', {
        url: "/palace/:id",
        views: {
          'menuContent' :{
            templateUrl: "templates/palace.html",
            controller: 'PalaceCtrl'
          }
        }
      })

      .state('app.palacelist', {
        url: "/palacelist/:id",
        views: {
          'menuContent' :{
            templateUrl: "templates/palacelist.html",
            controller: 'PalaceListCtrl'
          }
        }
      })
      .state('app.space', {
        url: "/space/:id",
        views: {
          'menuContent' :{
            templateUrl: "templates/space.html",
            controller: 'SpaceCtrl'
          }
        }
      })

      .state('app.map', {
        url: "/map/:id",
        views: {
          'menuContent' :{
            templateUrl: "templates/map.html",
            controller: 'MapCtrl'
          }
        }
      })

      .state('app.fullmap', {
        url: "/fullmap/:id",
        views: {
          'menuContent' :{
            templateUrl: "templates/fullMap.html",
            controller: 'FullMapCtrl'
          }
        }
      })

      .state('app.schedule', {
        url: "/schedule/:id",
        views: {
          'menuContent' :{
            templateUrl: "templates/schedule.html",
            controller: 'ScheduleCtrl'
          }
        }
      })
      .state('app.scheduleDetail', {
        url: "/scheduleDetail/:id",
        views: {
          'menuContent' :{
            templateUrl: "templates/scheduleDetail.html",
            controller: 'ScheduleDetailCtrl'
          }
        }
      })

      .state('app.about', {
        url: "/about/:id",
        views: {
          'menuContent' :{
            templateUrl: "templates/about.html",
            controller: 'AboutCtrl'
          }
        }
      })

      .state('app.search', {
        url: "/search",
        views: {
          'menuContent' :{
            templateUrl: "templates/search.html",
            controller: 'SearchCtrl'
          }
        }
      })

      .state('app.browse', {
        url: "/browse",
        views: {
          'menuContent' :{
            templateUrl: "templates/browse.html"
          }
        }
      })
      .state('app.home', {
        url: "/home",
        views: {
          'menuContent' :{
            templateUrl: "templates/home.html",
            controller: 'HomeCtrl'
          }
        }
      })

      .state('app.single', {
        url: "/playlists/:playlistId",
        views: {
          'menuContent' :{
            templateUrl: "templates/playlist.html",
            controller: 'PlaylistCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');

  })
  .run(function($rootScope,$ionicPlatform,$translate){
    $translate('BACKBUTTON_EXIT').then(function (headline) {
      $rootScope.exitApp = headline;
    });

    $ionicPlatform.registerBackButtonAction(function(e){
      if ($rootScope.backButtonPressedOnceToExit) {
        ionic.Platform.exitApp();
      }
      else if ($rootScope.$viewHistory.backView) {
        $rootScope.$viewHistory.backView.go();
      }
      else {
        $rootScope.backButtonPressedOnceToExit = true;
        window.plugins.toast.showShortCenter(
          $rootScope.exitApp,function(a){},function(b){}
        );
        setTimeout(function(){
          $rootScope.backButtonPressedOnceToExit = false;
        },2000);
      }
      e.preventDefault();
      return false;
    },101);

  });

