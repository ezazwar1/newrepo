angular.module('ionic.metApp.routes', [])
    .config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$httpProvider',
        function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
            $httpProvider.interceptors.push(function($rootScope) {
                return {
                    request: function(config) {
                        $rootScope.$broadcast('loading:show')
                        return config;
                    },
                    response: function(response) {
                        $rootScope.$broadcast('loading:hide')
                        return response
                    }
                }
            });
            // ionic configs
            // $ionicConfigProvider.tabs.position('bottom');
            $ionicConfigProvider.backButton.previousTitleText(false);
            $ionicConfigProvider.backButton.icon('ion-ios-arrow-left');
            $ionicConfigProvider.backButton.text('Back');
            // $ionicConfigProvider.backButton.text('Back');
            // Enable native scrolls for Android platform only,
            // as you see, we're disabling jsScrolling to achieve this.
            if (ionic.Platform.isAndroid()) {
                $ionicConfigProvider.backButton.icon('ion-arrow-left-c');
                // $ionicConfigProvider.scrolling.jsScrolling(false);
            }
            // $ionicConfigProvider.scrolling.jsScrolling(false);

            //app routes
            $stateProvider
                .state('app', {
                    abstract: true,
                    url: "/app",
                    templateUrl: "app/layout/menu-layout.html"
                })

            .state('app.home', {
                url: '/home',
                // cache: false,
                // reload: true,
                views: {
                    //this is a nested view. It is shown in the Ion-Nav-View in the menu-layout.html
                    'mainContent': {
                        templateUrl: "app/home/home.html"
                    }
                }
            })

            .state('app.bago', {
                url: '/home/bago',
                views: {
                    'mainContent': {
                        templateUrl: 'app/home/bago.html'
                    }
                }
            })

            .state('app.bullettins', {
                url: '/bullettins/:id',
                cache: false,
                views: {
                    'mainContent': {
                        templateUrl: "app/bullettins/bullettins.html"
                    }
                }
            })

            .state('app.warnings', {
                url: '/warnings/:id',
                cache: false,
                views: {
                    'mainContent': {
                        templateUrl: "app/warnings/warnings.html"
                    }
                }
            })

            .state('app.about', {
                url: '/about',
                views: {
                    'mainContent': {
                        templateUrl: 'app/about/about.html',
                        controller: 'aboutCtrl'
                    }
                }
            })

            .state('app.services', {
                url: '/services',
                views: {
                    'mainContent': {
                        templateUrl: "app/services/services.html"
                    }
                }
            })

            .state('app.services.home', {
                url: "/services/home",
                views: {
                    'servicesContent': {
                        templateUrl: "app/services/service_main.html"
                    }
                }
            })

            .state('app.services.radars', {
                url: "/radars",
                // abstract: true,
                views: {
                    'servicesContent': {
                        templateUrl: "app/services/aviation.html"
                    }
                }
            })

            .state('app.services.radar_loop', {
                url: "/radar_loop",
                views: {
                    'servicesContent': {
                        templateUrl: "app/services/radar/radar_loop.html"
                    }
                }
            })

            .state('app.services.radar_150', {
                url: "/radar_150",
                views: {
                    'servicesContent': {
                        templateUrl: "app/services/radar/radar_150.html"
                    }
                }
            })

            .state('app.services.radar-detail', {
                url: "/radar_detail/:id",
                views: {
                    'servicesContent': {
                        templateUrl: "app/services/radar/radar-detail.html",
                        controller: 'RadarDetailCtrl as rdc',
                    }
                }
            })

            .state('app.services.radar_250', {
                url: "/radar_250",
                views: {
                    'servicesContent': {
                        templateUrl: "app/services/radar/radar_250.html"
                    }
                }
            })

            .state('app.services.radar_400', {
                url: "/radar_400",
                views: {
                    'servicesContent': {
                        templateUrl: "app/services/radar/radar_400.html",
                    }
                }
            })

            .state('app.services.climate', {
                url: "/climate",
                views: {
                    'servicesContent': {
                        templateUrl: "app/services/climate.html"
                    }
                }
            })

            .state('app.forecast', {
                url: '/forecast',
                views: {

                    'mainContent': {
                        templateUrl: "app/forecast/forecast.html"
                    }
                }
            })

            .state('app.forecast_home', {
                url: '/forecast_home',
                views: {

                    'mainContent': {
                        templateUrl: "app/forecast/forecast-home.html"
                    }
                }
            })

            .state('app.metars_trin', {
                url: '/metars',
                views: {
                    'mainContent': {
                        templateUrl: 'app/home/metars-trin.html'
                    }
                }
            })

            .state('app.metars_bago', {
                url: '/metars',
                views: {
                    'mainContent': {
                        templateUrl: 'app/home/metars-bago.html'
                    }
                }
            })


            .state('app.uv_index', {
                url: '/home/uv_index',
                views: {

                    'mainContent': {
                        templateUrl: "app/home/uv_index.html"
                    }
                }
            })

            .state('app.bulletinsev', {
                url: '/bulletinsev',
                views: {
                    'mainContent': {
                        templateUrl: "app/bullettins/severe.html"
                    }
                }
            })

            .state('app.services.marine', {
                url: "/marine",
                views: {
                    'servicesContent': {
                        templateUrl: "app/services/marine.html"
                    }
                }
            })

            .state('app.services.winds', {
                url: "/winds",
                views: {
                    'servicesContent': {
                        templateUrl: "app/services/winds.html"
                    }
                }
            })


            .state('app.services.aws', {
                url: "/aws",
                views: {
                    'servicesContent': {
                        templateUrl: "app/services/aws.html"
                    }
                }
            })

            .state('app.services.agriculture', {
                //abstract: true,
                url: "/agriculture",
                views: {
                    'servicesContent': {
                        templateUrl: "app/services/agriculture.html"
                    }
                }

            })

            .state('app.contact', {
                url: "/contact",
                views: {
                    'mainContent': {
                        templateUrl: "app/contact.html"
                    }
                }
            })


            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/home');
        }
    ])
