angular.module('instacafe.config', [])

// ionic config
.config(function ($ionicConfigProvider, $httpProvider) {
    $ionicConfigProvider.backButton
        .text('')
        .icon('ion-ios-arrow-left')
        .previousTitleText(false);

    $ionicConfigProvider.tabs
        .position('bottom')
        .style('standard');

    $ionicConfigProvider.navBar
        .positionPrimaryButtons('left')
        .alignTitle('center');

    //$ionicConfigProvider.scrolling.jsScrolling(false)
})

.config(function (RestangularProvider, apiUrl) {
    RestangularProvider.setBaseUrl(apiUrl);
    RestangularProvider.setRequestSuffix('/');
    RestangularProvider.setDefaultHttpFields({
        timeout: 10000
    })
})

.config(function ($cordovaAppRateProvider) {
    document.addEventListener("deviceready", function () {
        var prefs = {
            language: 'en',
            appName: 'Instacafe',
            iosURL: '1003017693',
            androidURL: 'market://details?id=me.instacafe',
            usesUntilPrompt: 10,
            promptForNewVersion: true,
        };
        $cordovaAppRateProvider.setPreferences(prefs);
    }, false);
})

.config(function ($cordovaInAppBrowserProvider) {
    document.addEventListener("deviceready", function () {
        var options = {
            location: 'no',
            clearcache: 'yes',
            toolbar: 'yes',
            EnableViewPortScale: 'yes',
            closebuttoncaption: 'close',
            toolbarposition: 'top'
        };
        $cordovaInAppBrowserProvider.setDefaultOptions(options);
    }, false);
})

.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })

    .state('tab.home', {
        url: '/home',
        views: {
            'tab-home': {
                templateUrl: 'templates/tab-home.html',
                controller: 'HomeCtrl'
            }
        }
    })

    .state('tab.home-cafe-detail', {
        url: '/home/:cafeId',
        views: {
            'tab-home': {
                templateUrl: 'templates/cafe-detail.html',
                controller: 'CafeDetailCtrl'
            }
        },
        data: {
            mapId: 'home-google-map',
            photoLink: 'tab.home-cafe-photo'
        }
    })

    .state('tab.home-cafe-photo', {
        url: '/home/:cafeId/photos',
        params: {
            cafe_name: null,
            country_name: null,
        },
        views: {
            'tab-home': {
                templateUrl: 'templates/cafe-photo.html',
                controller: 'CafePhotoCtrl'
            }
        }
    })

    .state('tab.favorite', {
        url: '/favorite',
        cache: false,
        views: {
            'tab-favorite': {
                templateUrl: 'templates/tab-favorite.html',
                controller: 'FavoriteCtrl'
            }
        }
    })
    .state('tab.favorite-cafe-detail', {
        url: '/favorite/:cafeId',
        views: {
            'tab-favorite': {
                templateUrl: 'templates/cafe-detail.html',
                controller: 'CafeDetailCtrl'
            }
        },
        data: {
            mapId: 'favorite-google-map',
            photoLink: 'tab.favorite-cafe-photo'
        }
    })
    .state('tab.favorite-cafe-photo', {
        url: '/favorite/:cafeId/photos',
        params: {
            cafe_name: null,
            country_name: null,
        },
        views: {
            'tab-favorite': {
                templateUrl: 'templates/cafe-photo.html',
                controller: 'CafePhotoCtrl'
            }
        }
    })
    .state('tab.discover', {
        url: '/discover',
        views: {
            'tab-discover': {
                templateUrl: 'templates/tab-discover.html',
                controller: 'DiscoverCtrl'
            }
        }
    })
    .state('tab.select-country', {
        url: '/search',
        views: {
            'tab-discover': {
                templateUrl: 'templates/select-country.html',
                controller: 'SelectCountryCtrl'
            }
        }
    })
    .state('tab.select-city', {
        url: '/search/:countryId',
        params: {
            total_count: null,
            country_name: null,
        },
        views: {
            'tab-discover': {
                templateUrl: 'templates/select-city.html',
                controller: 'SelectCityCtrl'
            }
        }
    })
    .state('tab.search-result', {
        url: '/search/:countryId/:cityId',
        params: {
            country_name: null,
            city_name: null,
        },
        views: {
            'tab-discover': {
                templateUrl: 'templates/search-result.html',
                controller: 'SearchResultCtrl'
            }
        }
    })
    .state('tab.search-cafe-detail', {
        url: '/search/:cafeId',
        views: {
            'tab-discover': {
                templateUrl: 'templates/cafe-detail.html',
                controller: 'CafeDetailCtrl'
            }
        },
        data: {
            mapId: 'search-google-map',
            photoLink: 'tab.search-cafe-photo'
        }
    })
    .state('tab.search-cafe-photo', {
        url: '/search/:cafeId/photos',
        params: {
            cafe_name: null,
            country_name: null,
        },
        views: {
            'tab-discover': {
                templateUrl: 'templates/cafe-photo.html',
                controller: 'CafePhotoCtrl'
            }
        }
    })
    .state('tab.options', {
        url: '/options',
        views: {
            'tab-options': {
                templateUrl: 'templates/tab-options.html',
                controller: 'OptionsCtrl'
            }
        }
    });

    $urlRouterProvider.otherwise('/tab/home');
});
