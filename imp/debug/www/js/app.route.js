angular.module('photoshare')
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    cache: false,
    url: '/app',
    abstract: true,
    templateUrl: 'templates/shared/sidemenu.html',
    controller:'appCtrl',
    onEnter:function(sessionService,$state){
      if(!sessionService.isLoggedIn()){
        $state.go('welcome');
      }
    }
  })
  .state('welcome', {
    url: '/welcome',
    templateUrl: 'templates/auth/welcome.html',
    controller:'landingCtrl'
  })

  .state('app.feeds', {
    cache: false,
    url: '/feeds',
    views: {
      'menuContent': {
        templateUrl: 'templates/feeds/feeds.html',
        controller:'feedsCtrl'
      }
    }
  })
  .state('app.circles', {
    cache: false,
    url: '/circles',
    views: {
      'menuContent': {
        templateUrl: 'templates/photocircle/circle.html',
        controller:'circleCtrl'
      }
    }
  })
  .state('app.posts', {
    cache: false,
    url: '/posts',
    views: {
      'menuContent': {
        templateUrl: 'templates/feeds/allphotos.html',
        controller:'allPostsCtrl'
      }
    }
  })

  .state('app.newfeeds', {
    cache: false,
    url: '/newfeeds',
    views: {
      'menuContent': {
        templateUrl: 'templates/feeds/newfeeds.html',
        controller:'newFeedsCtrl'
      }
    }
  })

  .state('app.profile', {
    cache: false,
    url: '/profile/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile/profile.html',
        controller:'profileCtrl'
      }
    }
  })
  .state('app.editprofile', {
    cache: false,
    url: '/editprofile/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile/editprofile.html',
        controller:'profileEditCtrl'
      }
    }
  })
  .state('app.friends', {
    cache: false,
    url: '/friends/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/friends/online-friends.html'
      }
    }
  })
  

  //


  ;
  
  $urlRouterProvider.otherwise('/app/posts');
});
