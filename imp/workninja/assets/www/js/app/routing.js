// Routing

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('splash', {
      url: '/splash',
      templateUrl: 'templates/splash.html',
      controller: 'SplashController'
    })
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppController'
    })

    .state('app.share', {
      url: '/share',
      views: {
        'content@app': {
          templateUrl: 'templates/share.html',
          controller: 'ShareController'
        }
      }
    })

    .state('app.about', {
      url: '/about',
      views: {
        'content@app': {
          templateUrl: 'templates/about.html',
          controller: 'AboutController'
        }
      }
    });

  // default route
  $urlRouterProvider.otherwise('/splash');
});
