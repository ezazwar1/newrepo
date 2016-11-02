'use strict';

angular.module('znk.sat')

    .config(['$stateProvider','googleAnalyticsCordovaProvider', '$urlRouterProvider', '$httpProvider', 'localStorageServiceProvider', 'ENV', '$provide', '$analyticsProvider', '$compileProvider', '$ionicConfigProvider', 'ChartJsProvider', 'IapSrvProvider','$logProvider',
        function ($stateProvider,googleAnalyticsCordovaProvider, $urlRouterProvider, $httpProvider, localStorageServiceProvider, ENV, $provide, $analyticsProvider, $compileProvider, $ionicConfigProvider, ChartJsProvider, IapSrvProvider,$logProvider) {

        $logProvider.debugEnabled(ENV.debug);

        $analyticsProvider.firstPageview(true);
        $analyticsProvider.settings.bufferFlushDelay = 2500;
        $analyticsProvider.settings.developerMode = !ENV.enableAnalytics;

        $compileProvider.debugInfoEnabled(ENV.debug);

        if (ENV.gaTrackingId) {
            googleAnalyticsCordovaProvider.trackingId = ENV.gaTrackingId;
            googleAnalyticsCordovaProvider.period = 25; //(in seconds)
            googleAnalyticsCordovaProvider.debug = ENV.debug;
        }

        var authResolveObj = ['AuthSrv', '$state', '$q', function (AuthSrv, $state, $q) {
            if (!AuthSrv.authentication.isAuth) {
                // will be cought in run.js on $stateChangeError
                return $q.reject('auth:error');
            }
        }];

        $stateProvider
            .state('welcome', {
                url: '/welcome',
                templateUrl: 'znk/auth/templates/welcome.html',
                controller: 'WelcomeCtrl',
                onEnter:[
                    '$cordovaSplashscreen','ENV',
                    function($cordovaSplashscreen, ENV){
                        if (ENV.isDevice) {
                            $cordovaSplashscreen.hide();
                        }
                    }
                ]
            })
            .state('login', {
                url: '/login',
                templateUrl: 'znk/auth/templates/login.html',
                controller: 'LoginCtrl'
            })
            .state('forgotPassword', {
                url: '/forgotPassword',
                templateUrl: 'znk/auth/templates/forgotPassword.html',
                controller: 'ForgotPasswordCtrl'
            })
            .state('signup', {
                url: '/signup',
                controller: 'SignupCtrl',
                templateUrl: 'znk/auth/templates/signup.html'
            })
            .state('logout', {
                url: '/logout',
                controller: 'LogoutCtrl'
            })
            .state('termsOfUse', {
                url: '/termsOfUse',
                templateUrl: 'znk/settings/templates/termsOfUse.html'
            })
            .state('support', {
                url: '/support',
                templateUrl: 'znk/settings/templates/support.html',
                controller: 'SupportCtrl'
            })
            .state('app.faq', {
                url: '/faq',
                templateUrl: 'znk/settings/templates/faq.html'
            })
            .state('privacyPolicy', {
                url: '/privacyPolicy',
                templateUrl: 'znk/settings/templates/privacyPolicy.html'
            })
            .state('app', {
                url: '/app',
                abstract: true,
                template: '<ion-view><ion-content scroll="false"><ion-nav-view></ion-nav-view></ion-content></ion-view>',
                resolve: {
                    auth: authResolveObj
                }
            })
            .state('app.changePassword', {
                url: '/changePassword',
                templateUrl: 'znk/auth/templates/changePassword.html',
                controller: 'ChangePasswordCtrl'
            })
            .state('app.home', {
                url: '/home',
                templateUrl: 'znk/home/templates/home.html',
                controller: 'HomeCtrl',

                onEnter:[
                    '$cordovaSplashscreen','ENV',
                    function($cordovaSplashscreen, ENV){
                        if (ENV.isDevice) {
                            $cordovaSplashscreen.hide();
                        }
                    }
                ]
            })
            .state('app.profile', {
                url: '/profile',
                templateUrl: 'znk/userProfile/templates/profile.html',
                controller: 'UserProfileCtrl'
            })
            .state('app.aboutUs', {
                url: '/aboutUs',
                templateUrl: 'znk/settings/templates/aboutUs.html',
                controller: 'AboutUsCtrl',
                controllerAs: 'aboutUsCtrl'
            })
            .state('app.examPage', {
                url: '/examPage/:id/:status',
                templateUrl: 'znk/exam/templates/examPage.html',
                controller: 'ExamPageCtrl'
            })
            .state('app.settings', {
                url: '/settings',
                templateUrl: 'znk/settings/templates/settings.html',
                controller: 'SettingsCtrl',
                resolve:{
                    userData:[
                        'UserProfileSrv','IapSrv', '$q', 'UserSettingsSrv', 'StorageSrv',
                        function(UserProfileSrv, IapSrv, $q, UserSettingsSrv, StorageSrv) {
                            var userProfile = UserProfileSrv.get();
                            var subscription = IapSrv.getSubscription();
                            var soundEnabled =  UserSettingsSrv.soundEnabled();
                            var iap = StorageSrv.get('iap');
                            return $q.all([userProfile,subscription, soundEnabled, iap]).then(function(res){
                                return {
                                    userProfile: res[0],
                                    subscription: res[1],
                                    soundEnabled: res[2],
                                    iap: res[3]
                                };
                            });
                        }
                    ]
                }
            })
            .state('app.dailyTutorial', {
                url: '/dailyTutorial/:id',
                templateUrl: 'znk/exercise/templates/tutorialExercise.html',
                controller: 'DailyTutorialCtrl'
            })
            .state('app.dailyPractice', {
                url: '/dailyPractice/:id',
                templateUrl: 'znk/exercise/templates/practiceExercise.html',
                controller: 'DailyPracticeCtrl'
            })
            .state('app.dailyGame', {
                url: '/dailyGame/:id',
                templateUrl: 'znk/exercise/templates/gameExercise.html',
                controller: 'DailyGameCtrl'
            })
            .state('app.drill', {
                url: '/drill/:id',
                templateUrl: 'znk/exercise/templates/drillExercise.html',
                controller: 'DrillExerciseCtrl'
            })
            .state('app.exam', {
                url: '/exam/:id/:sectionId/:showCountdown',
                templateUrl: 'znk/exercise/templates/examExercise.html',
                controller: 'ExamExerciseCtrl'
            })
            .state('app.gamification', {
                url: '/gamification',
                templateUrl: 'znk/gamification/templates/gamification.html',
                controller: 'GamificationCtrl as gamification'
            })
            .state('app.performance', {
                url: '/performance/?subjectId',
                templateUrl: 'znk/performance/templates/performance.html',
                controller: 'performanceCtrl',
                resolve:{
                    performanceData:[
                        'EstimatedScoreSrv', 'PersonalizationStatsSrv', '$q',
                        function(EstimatedScoreSrv, PersonalizationStatsSrv, $q) {
                            var getEstimatedScoreRangesProm = EstimatedScoreSrv.getEstimatedScoreRanges();
                            var getPerformanceDataProm = PersonalizationStatsSrv.getPerformanceData();
                            return $q.all([getEstimatedScoreRangesProm,getPerformanceDataProm]).then(function(res){
                                var estimatedScoreRanges = res[0];
                                var performanceData = res[1];
                                performanceData.total = estimatedScoreRanges.total;
                                return performanceData;
                            });
                        }
                    ],
                    estimatedScoreTimeLineData : [
                        'EstimatedScoreSrv',
                        function(EstimatedScoreSrv) {
                            return EstimatedScoreSrv.getEstimatedScores();
                        }
                    ]
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');

        //$httpProvider.interceptors.push('AuthInterceptorSrv');

        localStorageServiceProvider.setPrefix('znk.sat');

        $provide.decorator('$exceptionHandler', ['$delegate', '$window', 'ENV', '$injector', '$analytics', function ($delegate, $window, ENV, $injector, $analytics) {
            return function (exception, cause) {
                var email;
                var version;
                var api;

                var AuthSrv = $injector.get('AuthSrv');

                if (AuthSrv.authentication) {
                    email = AuthSrv.authentication.email;
                    if (!email) {
                        email = 'Not logged in';
                    }
                }

                if (ENV.appVersion) {
                    version = ENV.appVersion;
                }
                else {
                    version = 'Not a device';
                }

                if (ENV.apiEndpoint) {
                    api = ENV.apiEndpoint;
                }

                if ($window.device) {

                    var label = '';
                    if(exception && exception.message){
                        label = (exception.message).substr(0, 100) + ', ';
                    }
                    label += 'ver:' + version;

                    $analytics.eventTrack('exception', {
                        category: 'exception',
                        label: label
                    });

                    if ($window.atatus) {
                        $window.atatus.setVersion('' + version);
                        $window.atatus.notify(exception, { version: version, api: api ,email: email});
                    }
                }

                $delegate(exception, cause);
            };
        }]);

        /* log decorator - disable the logs if debug is false */
        $provide.decorator('$log', ['$delegate','ENV', function ($delegate, ENV) {

            if(!ENV.debug) {

                var log = {
                    debug:  function() {},
                    error:  function() {},
                    info:   function() {},
                    log:    function() {},
                    warn:   function() {}
                };

                return log;
            }

            return $delegate;

        }]);

        $ionicConfigProvider.views.transition('none');

        $ionicConfigProvider.views.maxCache(0);

        $ionicConfigProvider.backButton.icon('back-arrow-icon');

        $ionicConfigProvider.views.swipeBackEnabled(false);

        ChartJsProvider.setOptions({
            colours: ['#87ca4d', '#ff6766', '#ebebeb'],
            responsive: true,
            showTooltips: false
        });

        ChartJsProvider.setOptions('Doughnut', {
            animateScale: false,
            segmentShowStroke: false,
            percentageInnerCutout : 90,
            segmentStrokeWidth : 2,
            animationEasing: "linear",
            animationSteps: 1
        });

        var iapFallbackProducts = [
            {'appStoreId':'com.zinkerz.zinkerzsat.sub1month','appStoreType':'paid subscription','length':1,'playStoreUid':'com.zinkerz.zinkzerzsat.sub1month.m', 'playStoreType':'consumable'},
            {'appStoreId':'com.zinkerz.zinkerzsat.sub3months','appStoreType':'paid subscription','length':3, 'playStoreUid':'com.zinkerz.zinkerzsat.sub3months.m','playStoreType':'consumable'},
            {'appStoreId':'com.zinkerz.zinkerzsat.sub1year','appStoreType':'paid subscription','length':12,'playStoreUid':'com.zinkerz.zinkerzsat.sub1year.m','playStoreType':'consumable'}
        ];
        IapSrvProvider.setProductsFallback(iapFallbackProducts);
    }]);
