// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers','ionic-ratings'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })

   .state('login', {
        url: "/login",
        
        templateUrl: "templates/login.html",
        controller: 'login'
    })
	
	.state('app.home', {
        url: "/home",
        views: {
            'menuContent': {
                templateUrl: "templates/home.html",
                controller: 'Home'
            }
        }
    })
	
	.state('app.search', {
        url: "/search",
        views: {
            'menuContent': {
                templateUrl: "templates/search.html",
                controller: 'search'
            }
        }
    })
	.state('app.filter', {
        url: "/filter",
        views: {
            'menuContent': {
                templateUrl: "templates/filter.html",
                controller: 'filter'
            }
        }
    })
	
	
	.state('login_page', {
        url: "/login_page",
				
                templateUrl: "templates/login.html",
                controller: 'login_page'
            
    })
	.state('app.register', {
        url: "/register",
        views: {
            'menuContent': {
                templateUrl: "templates/register.html",
                controller: 'register'
            }
        }
    })
	
	
	
	
	
	.state('app.discover', {
        url: "/discover",
        views: {
            'menuContent': {
                templateUrl: "templates/discover.html",
                controller: 'discover'
				}
        }
    })
        .state('app.detail', {
            url: "/detail",
            views: {
                'menuContent': {
                    templateUrl: "templates/detail.html",
                    controller: 'detail'
                }
            }
        });
		
		
		
		
		


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
});
