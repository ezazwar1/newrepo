/*global angular*/
'use strict';

angular.module('stohke', [
    'ionic',
    'ionic.service.core',
    // 'ionic.service.deploy',
    'stohke.controllers',
    'ngLodash',
    'ionicLazyLoad',
    'ngStorage',
    'ngCordova',
    'ngNotify'
])
.constant('STOHKE_CONFIG', {
    'fbScope': 'public_profile,user_friends,email',
    'defaultImg': 'img/placeholder.jpg',
    'defaultQuantities': {
        'images': 10,
        'videos': 6
    },
    'sports': [
        'Adventure',
        'Aerial',
        'Bike',
        'Climb',
        'Endurance',
        'Kayak',
        'Kite',
        'Moto',
        'Skate',
        'Ski',
        'Snowboard',
        'Snowmobile',
        'Surf',
        'Wake'
    ],
    'menuPreSports' : [
        'Featured'
    ],
    'menuPostSports': [
        'Associations',
        'Brands', // old companies category
        'Destinations',
        'Events',
        'Films',
        'Media',
        'Music',
        'Non-Profits',
        'Photography',
        'Progression',
        'Technology',
        'Travel',
        'Videography',
        'Video Series'
    ],
    'googleAnalyticIDs': 'UA-43663197-4'
})
.run([
    '$ionicPlatform',
    '$location',
    'authService',
    'analyticsService',
    '$ionicPopup',
    '$rootScope',
    '$localStorage',
    '$timeout',
    'homeService',
    function(
        $ionicPlatform,
        $location,
        authService,
        analyticsService,
        $ionicPopup,
        $rootScope,
        $localStorage,
        $timeout,
        homeService
    ) {

        $ionicPlatform.ready(
            function () {
                $timeout(function() {

                // if (window.branch) {
                //     // initiate Branch SDK
                //     branch.init("key_live_fjoRaEiIUpLxOay25ln0PdjnszmyTOUK", function(err, data) {
                //         app.initComplete(err, data);
                //     });
                // }
                // cordova-plugin-screen-orientation plugin
                if (window.screen && window.screen.orientation && window.screen.lockOrientation) {
                    console.log(window.screen.orientation);
                    $timeout(function(){
                        window.screen.lockOrientation('portrait-primary');
                    }, 100);
                }

                    authService.socialLogin('Facebook', true)
                        .then(
                            function() {
                                authService.authentication();
                            }
                        );
                }, 0);

                // Hide the accessory bar by default
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                    // // keyboard scrolls content causing side menu to close when searching
                    // window.cordova.plugins.Keyboard.disableScroll(true);
                }
                // Analytics - Start tracking
                if (window.analytics) {
                    // analyticsService.debugMode();
                    analyticsService.startTracker();
                    analyticsService.setUserId(window.device.uuid);
                }

                if (window.StatusBar && window.StatusBar.style) {
                    // org.apache.cordova.statusbar required
                    $timeout(function(){
                        window.StatusBar.style(1);
                    }, 0);
                }

                // if (window.ionic.Platform.isIOS()) {
                //     console.log('is IOS');
                //     $rootScope.checkForUpdates = function() {
                //         console.log('Ionic Deploy: Checking for updates');
                //         $ionicDeploy.check().then(
                //             function (hasUpdate) {
                //                 console.log('Ionic Deploy: Update available: ' + hasUpdate);
                //                 $rootScope.updateAvailable = hasUpdate;
                //             }, function(err) {
                //                 console.error('Ionic Deploy: Unable to check for updates', err);
                //             }
                //         );
                //     };
                //     $rootScope.updateApp = function() {
                //         $ionicDeploy.download().then(
                //             function() {
                //                 // Extract the updates
                //                 $ionicDeploy.extract().then(function() {
                //                     $rootScope.updateAvailable = false;
                //                     // Load the updated version
                //                     $ionicDeploy.load();
                //                 }, function(error) {
                //                     // Error extracting
                //                     console.error('extraction', error);
                //                     analyticsService.trackEvent('App Updates', 'Errors', 'Extraction error');
                //                 }, function(progress) {
                //                     console.log('extraction:', progress);
                //                     // Do something with the zip extraction progress
                //                     $rootScope.extraction_progress = progress;
                //                 });
                //             },
                //             function(error) {
                //                 console.error(error);
                //                 analyticsService.trackEvent('App Updates', 'Errors', 'download error');
                //                 // Error downloading the updates
                //             },
                //             function(progress) {
                //                 console.log('download:', progress);
                //                 // Do something with the download progress
                //                 $rootScope.download_progress = progress;
                //             }
                //         );
                //     };

                //     $ionicDeploy.check().then(
                //         function(response) {

                //             // response will be true/false
                //             if (response) {

                //                 $rootScope.updateAvailable = true;

                //                 // Check the latest update against this build date.

                //                 // Download the updates
                //                 var confirmPopup = $ionicPopup.confirm({
                //                     title: 'App Update Available',
                //                     template: 'Install and run the latest & greatest?'
                //                 });
                //                 confirmPopup.then(function(res) {
                //                     if (res) {
                //                         analyticsService.trackEvent('App Update', 'Installed');
                //                         $rootScope.updateApp();
                //                     } else {
                //                         console.log('didn\'t want the latest...');
                //                         analyticsService.trackEvent('App Update', 'Skipped');
                //                         $rootScope.updateAvailable = true;
                //                         $ionicDeploy.load();
                //                     }
                //                 });
                //             } else {
                //                 $rootScope.updateAvailable = false;
                //                 // No updates, load the most up to date version of the app
                //                 $ionicDeploy.load();
                //             }
                //         },
                //         function(error) {
                //             // Error checking for updates
                //             console.error(error);
                //         }
                //     );

                // // End is IOS
                // } else {
                // }
                $rootScope.updateAvailable = false;

            });

    }
])

.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$compileProvider', '$sceDelegateProvider', '$ionicAppProvider', function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider, $sceDelegateProvider, $ionicAppProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://*.youtube.com/**',
        'http://*.vimeo.com/**',
        'http://*.stohke.com/**'
    ]);

    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

    $ionicAppProvider.identify({
        // The App ID for the server
        app_id: '7108696e',
        // The API key all services will use for this app
        api_key: 'c1a90fb250e6e0a8d61823e5a13365ef703bab97d836bf97'
    });

    $ionicConfigProvider.backButton.previousTitleText(false).text('');
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.form.checkbox('circle');

    $stateProvider
        .state('app', {
            url: '',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppController'
        })
    .state('app.home', {
            url: '/home',
            views: {
                'main-content': {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeController'
                }
            },
            data: {
                exitPromptOnBack: true
            }
        })
    .state('app.explore', {
            url: '/explore',
            abstract: true,
            views: {
                'main-content': {
                    templateUrl: 'templates/explore-wrapper.html'
                }
            }
        })
        .state('app.explore.list', {
            url: '',
            views: {
                'explore-view': {
                    templateUrl: 'templates/explore-list.html',
                    controller: 'ExploreController'
                }
            },
            data: {
                exitPromptOnBack: true
            }
        })
        .state('app.explore.list.category', {
            url: '/category/:category',
            views: {
                'explore-view': {
                    templateUrl: 'templates/explore-list.html',
                    controller: 'ExploreController'
                }
            },
            data: {
                exitPromptOnBack: true
            }
        })
        .state('app.explore.list.search', {
            url: '/search/:query',
            views: {
                'explore-view': {
                    templateUrl: 'templates/explore-list.html',
                    controller: 'ExploreController'
                }
            },
        })
        .state('app.explore.user', {
            url: '/user/:alias/{mediaType}/{mediaId}',
            
            views: {
                'explore-view': {
                    templateUrl: 'templates/explore-user-profile.html',
                    controller: 'ExploreProfileController'
                }
            },
            data: {
                exitPromptOnBack: false
            },
            resolve: {
                user: function($stateParams, userService, analyticsService) {
                    console.log('trying to get user details');
                    return userService.getUserDetails($stateParams.alias, 'user').then(function(results) {
                        analyticsService.trackView('User Profile:' + results.data.FirstName + ' ' + results.data.LastName);
                        return results.data;
                    });
                }
            }
        })
        .state('app.explore.user.media', {
            url: '/:mediaType/:mediaId',
            views: {
                'explore-view': {
                    templateUrl: 'templates/explore-user-profile.html',
                    controller: 'ExploreProfileController'
                }
            },
            data: {
                exitPromptOnBack: false
            }
        })
        .state('app.explore.company', {
            url: '/company/:alias',
            views: {
                'explore-view': {
                    templateUrl: 'templates/explore-company-profile.html',
                    controller: 'ExploreProfileController'
                }
            },
            data: {
                exitPromptOnBack: false
            },
            resolve: {
                user: function($stateParams, userService, analyticsService) {
                    return userService.getUserDetails($stateParams.alias, 'company').then(function(results) {
                        analyticsService.trackView('Company Profile:' + results.data.Title);
                        return results.data;
                    });
                }
            }
        })
        .state('app.explore.company.media', {
            url: '/:mediaType/:mediaId',
            views: {
                'explore-view': {
                    templateUrl: 'templates/explore-company-profile.html',
                    controller: 'ExploreProfileController'
                }
            },
            data: {
                exitPromptOnBack: false
            },
            resolve: {
                user: function($stateParams, userService, analyticsService) {
                    return userService.getUserDetails($stateParams.alias, 'company').then(function(results) {
                        analyticsService.trackView('Company Profile:' + results.data.Title);
                        return results.data;
                    });
                }
            }
        })
        .state('app.discover', {
            url: '/discover/:type',
            views: {
                'main-content': {
                    templateUrl: 'templates/discover.html',
                    controller: 'DiscoverController'
                }
            }
        })
        .state('app.profile', {
            url: '/profile',
            views: {
                'main-content': {
                    templateUrl: 'templates/profile.html',
                    controller: 'ProfileController'
                }
            },
            data: {
                exitPromptOnBack: false
            }
        })
        .state('app.profile-edit', {
            url: '/profile/edit',
            views: {
                'main-content': {
                    templateUrl: 'templates/profile-edit.html',
                    controller: 'ProfileEditController'
                }
            },
            data: {
                exitPromptOnBack: false
            },
        })
        .state('app.static', {
            url: '/info',
            abstract: true,
            views: {
                'main-content': {
                    templateUrl: 'templates/static-wrapper.html'
                }
            }
        })
        .state('app.about', {
            url: '/about',
            views: {
                'main-content': {
                    templateUrl: 'templates/info/about.html',
                    controller: 'StaticController'
                }
            },
            data: {
                exitPromptOnBack: true
            }
        })
        .state('start', {
            url: '/start',

            templateUrl: 'templates/start.html',
            controller: 'StartController',
            data: {
                exitPromptOnBack: true
            }
        });

    $urlRouterProvider.otherwise('/start');

}]);