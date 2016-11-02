angular.module('ionic.viewApp', [
  'ionic',
  'ionic.viewApp.controllers',
  'ionic.viewApp.services',
  'ionic.viewApp.directives',
  'ionic.viewApp.filters',
  'ionic.viewApp.config',
  'ngAnimate'
])

.config(function(
  $stateProvider, $urlRouterProvider, $httpProvider, $provide, $animateProvider,
  $ionicConfigProvider,
  HOST_NAME
) {
  $stateProvider
    .state('AccountView',
    {
      url: '/',
      templateUrl: 'templates/account.html',
      controller: 'AccountCtrl'
    })
    .state('SignupView',
    {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'SignupCtrl'
    })
    .state('LoginView',
    {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .state('UserAppsView',
    {
      url: '/userapps',
      templateUrl: 'templates/userapps.html',
      controller: 'UserAppsCtrl'
    })
    .state('UserAppsViewEmpty',
    {
      url: '/noapps',
      templateUrl: 'templates/userapps.empty.html',
      controller: 'UserAppsEmptyCtrl'
    })
    .state('InstructionsView',
    {
      url: '/instructions',
      templateUrl: 'templates/instructions.html',
      controller: 'InstructionsCtrl'
    })
    .state('PrivacyView',
    {
      url: '/privacy',
      templateUrl: 'templates/privacy.html'
    })
    .state('TOSView',
    {
      url: '/tos',
      templateUrl: 'templates/tos.html'
    })
    .state('SettingsView',
    {
      url: '/settings',
      templateUrl: 'templates/settings.html',
      controller: 'SettingsCtrl'
    })
    .state('LoadAppView',
    {
      url: '/loadapp',
      templateUrl: 'templates/loadapp.html',
      controller: 'LoadAppCtrl'
    })

  $urlRouterProvider.otherwise('/')
  $animateProvider.classNameFilter(/\bng-animate-enable\b/)
  $ionicConfigProvider.views.forwardCache(true)
})

// call LoadingService so it gets instantiated, don't have flicker on first load
/* eslint-disable no-unused-vars */
.run(function(LoadingService) {
  ionic.Platform.ready(function() {
    if (ionic.Platform.isWebView() && ionic.Platform.isIOS() === 'iOS') {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
      cordova.plugins.Keyboard.disableScroll(true)
    }
  })
})
