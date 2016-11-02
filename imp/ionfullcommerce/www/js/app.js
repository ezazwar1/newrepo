'use strict';

/*
 * app.js
 *
 * point of entry for the app
 *
 * (c) 2014 Mark Adesina http://developerslearnit.com
 *
 */
 (function(){


  angular.module('underscore', [])
  .factory('_', function() {
    return window._; 
  });

  angular.module('eCommerce', ['ionic.contrib.drawer','ionic'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {

      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {

        StatusBar.styleDefault();
      }
    });
  })
  .constant('API_URL', 'data/products.js')
  .constant('CAT_URL', 'data/categories.js')
  .constant('APP_API_URL', 'http://localhost:3000/api/v1/');

})()


