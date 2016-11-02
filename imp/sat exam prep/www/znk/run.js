'use strict';

angular.module('znk.sat')
    .run([
        'ENV', '$window',
        function (ENV, $window) {
            ENV.isDevice = !!$window.cordova;
        }
    ])
    .run(['AuthSrv', 'NetworkSrv', 'ENV', '$analytics', '$window', 'StorageSrv', 'OfflineContentSrv', 'LocalDatabaseSrv', 'EnumSrv', '$q', function (AuthSrv, NetworkSrv, ENV, $analytics, $window, StorageSrv, OfflineContentSrv, LocalDatabaseSrv, EnumSrv, $q) {

        //StorageSrv is injected so that it bootstrap too
        //$animate.enabled(false);

        AuthSrv.fillAuthData();
        NetworkSrv.init();

        LocalDatabaseSrv.onDeviceReady();

        if (AuthSrv.authentication.isAuth) {

            StorageSrv.get(StorageSrv.appUserSpacePath.concat(['contentSync'])).then(function (contentSyncObj) {
                if (!contentSyncObj.publicationId) {
                    // make sure that previous content isn't updated past the point the user has seen
                    var seenContentArr = [],
                        dailyProgressPath = StorageSrv.appUserSpacePath.concat(['exerciseProgress', 'daily']),
                        examProgressPath = StorageSrv.appUserSpacePath.concat(['exerciseProgress', 'exam']),
                        activeDailyId;

                    var dailyPromise = StorageSrv.get(dailyProgressPath).then(function (dailyProgress) {
                        activeDailyId = dailyProgress.id;
                        return StorageSrv.get(StorageSrv.appUserSpacePath.concat(['dailyOrder']));
                    }).then(function (dailyOrders) {
                        for (var i = 1; i <= dailyOrders.length; i++) {
                            var daily = dailyOrders['orderId' + activeDailyId];
                            if (daily) {
                                seenContentArr = seenContentArr.concat(['tutorial' + daily.tutorialId, 'practice' + daily.practiceId, 'game' + daily.gameId]);
                            }
                        }
                    });

                    // get exams that the user started
                    var examsPromise = StorageSrv.get(examProgressPath).then(function (examProgress) {
                        var allIds = (examProgress.completedIds || []).concat(examProgress.activeIds || []);
                        seenContentArr = seenContentArr.concat(allIds.map(function (examId) {
                            return 'exam' + examId;
                        }));
                    });

                    var exercisesPromise = StorageSrv.get(StorageSrv.appUserSpacePath.concat(['exerciseResults'])).then(function (exerciseResults) {
                        if (!Object.keys(exerciseResults).length) {
                            return;
                        }

                        var types = [
                            {enum: EnumSrv.exerciseType.tutorial.enum, prefix: 'tutorial'},
                            {enum: EnumSrv.exerciseType.practice.enum, prefix: 'practice'},
                            {enum: EnumSrv.exerciseType.game.enum, prefix: 'game'},
                            {enum: EnumSrv.exerciseType.drill.enum, prefix: 'drill'}
                        ];

                        types.forEach(function (type) {
                            var exercisesOfCurType = exerciseResults[type.enum];
                            if (exercisesOfCurType) {
                                for (var key in exercisesOfCurType) {
                                    // firebase reads this object as an array, so make sure we have values..
                                    if (exercisesOfCurType[key]) {
                                        seenContentArr.push(type.prefix + key);
                                    }
                                }
                            }
                        });
                    });

                    return $q.all([dailyPromise, examsPromise, exercisesPromise]).then(function () {
                        return OfflineContentSrv.neverUpdateRevOf(seenContentArr);
                    });
                }
            }).then(function () {
                OfflineContentSrv.checkForNewContent({silent: true});
            });
        }

        $analytics.eventTrack('Application started', {category: 'application', label: ionic.Platform.platform()});

        if ($window.atatus) {
            $window.atatus.config(ENV.atatusApiKey).install();
            $window.atatus.enableOffline(true);
        }

        
    }])
    .run([
        '$document', '$rootScope',
        function ($document, $rootScope) {
            var doc = angular.element($document)[0];

            doc.addEventListener('pause', function () {
                $rootScope.$broadcast('pause');
            });

            doc.addEventListener('resume', function () {
                $rootScope.$broadcast('resume');
            });
        }
    ])
    .run([
        '$window','localStorageService', 'AuthSrv', '$analytics', '$rootScope', 'ENV', 'ZnkModalSrv',
        function ($window, localStorageService, AuthSrv, $analytics, $rootScope, ENV, ZnkModalSrv) {

            var upgradeVersionPopupOptions = {
                templateUrl: 'znk/system/shared/templates/upgradeMessageModal.html',
                wrapperClass: 'upgrade-version-popup show-animation-v2',
                dontCentralize: false,
                showCloseBtn: true
            };

            if ($window.cordova && $window.cordova.getAppVersion) {
                $window.cordova.getAppVersion(function (version) {
                    var currentVersion = localStorageService.get('appVersion');

                    if (typeof currentVersion !== 'undefined' && currentVersion !== null) {
                        // identify version update
                        if (currentVersion !== version ) {

                            var currentVersionDigitArr = currentVersion.match(/\d+/g); //assuming the format version is   'x.y.z'
                            if(angular.isDefined(currentVersionDigitArr) && angular.isDefined(currentVersionDigitArr[0]) && angular.isDefined(currentVersionDigitArr[1]) && +currentVersionDigitArr[0] < 2 && +currentVersionDigitArr[1] < 5){
                                ZnkModalSrv.singletonModalFn(upgradeVersionPopupOptions)();
                            }

                            $analytics.eventTrack('Application upgraded', {category: 'application', label: version});
                            //new version
                        }
                    }
                    else {
                        //1st installation
                        $analytics.eventTrack('First time application installion', {category: 'application'});
                    }

                    $analytics.eventTrack('Application version', {category: 'application', label: version});

                    ENV.appVersion = version;
                    localStorageService.set('appVersion', version);
                });
            }
            else {
//PC

            }

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if ($window.cordova && $window.cordova.plugins && $window.cordova.plugins.Keyboard) {
                $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                $window.cordova.plugins.Keyboard.disableScroll(true);
            }

            if ($window.cordova && $window.plugins && $window.plugins.AppleAdvertising) {

                window.plugins.AppleAdvertising.getIdentifiers(
                    function (identifiers) {
                        $analytics.eventTrack('Advertising', {category: 'idfa', label: identifiers.idfa});
                        $analytics.eventTrack('Advertising', {category: 'idfv', label: identifiers.idfv});
                        $analytics.eventTrack('Advertising', {
                            category: 'trackingEnabled',
                            label: identifiers.trackingEnabled
                        });
                    }
                );
            }
        }
    ])
    .run([
        'IapSrv', '$window', 'AuthSrv',
        function (IapSrv, $window, AuthSrv) {
            window._store = window.store;
            if (!ionic.Platform.isIOS() && !ionic.Platform.isAndroid()) {
                IapSrv.noStore();
            } else {
                if ($window.store) {
                    IapSrv.init();
                } else {
                    IapSrv.noStore();
                }

                if ($window.plugins && $window.plugins.matPlugin) {
                    $window.plugins.matPlugin.init('182516', '184b6a84c10b7b8c37297e2d43df0501');

                    if (AuthSrv.authentication.isAuth) {
                        $window.plugins.matPlugin.setUserEmail(AuthSrv.authentication.email);
                        $window.plugins.matPlugin.setUserId(AuthSrv.authentication.uid);
                        $window.plugins.matPlugin.setExistingUser(true);
                    }
                    $window.plugins.matPlugin.measureSession();
                }
            }
        }
    ])
    .run([
        'ExpEventsHandlerSrv',
        function (ExpEventsHandlerSrv) {
            //start the exp service
            ExpEventsHandlerSrv.init();
        }
    ])
    .run([
        'LocalNotificationSrv',
        function (LocalNotificationSrv) {
                    LocalNotificationSrv.initNotification();
        }
    ])
    .run([
        '$rootScope', '$state','StatusBarSrv','MobileSrv','$window','ENV', '$analytics','StorageSrv',
        function ($rootScope, $state, StatusBarSrv, MobileSrv, $window, ENV, $analytics, StorageSrv) {
            var childScope = $rootScope.$new();

            if (MobileSrv.isMobile()){
                StatusBarSrv.hide();
            }
            else{
                childScope.$on('$stateChangeSuccess', function (event, toState) {
                    StatusBarSrv.handleStateChange(toState.name);
                });
            }
            childScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, err) {
                if (err === 'auth:error') {
                    $state.go('welcome');
                }
            });
            childScope.$on('auth:login', function(){
                if ($window.device) {

                    ENV.deviceModel = $window.device.model.replace(/[^a-z A-Z0-9_-]/g,'');
                    ENV.deviceUuid  = $window.device.uuid.replace(/[^a-z A-Z0-9_-]/g,'');
                    $analytics.eventTrack(ENV.deviceModel, {category: 'device-model', label: ENV.deviceUuid});
                    StorageSrv.registerDevice(ENV.deviceModel, ENV.deviceUuid);
                }

            });
        }])
    .run([
        function () {
            //Fix for header bar, the android platform is added only after the header bar already calculated left buttons size
            if (ionic.Platform.isAndroid()) {
                angular.element(document.querySelector('body')).addClass('platform-android');
            }
        }
    ]).run([
        'PersonalizationStatsEventsHandlerSrv',
        function(PersonalizationStatsEventsHandlerSrv){
            //added in order to load the service
            PersonalizationStatsEventsHandlerSrv.init();
        }
    ]).run([
        'EstimatedScoreEventsHandlerSrv',
        function(EstimatedScoreEventsHandlerSrv){
            //added in order to load the service
            EstimatedScoreEventsHandlerSrv.init();
        }
    ]);


    window.handleOpenURL = function(url) {

        

        if (url){
            if (url.indexOf('purchase')>0){
                var iapSrv = angular.element(document.querySelector('body')).injector().get('IapSrv');
                if (iapSrv){
                    iapSrv.getSubscription().then(function(expiryDate){
                        
                        if (expiryDate === null){
                            var modal = angular.element(document.querySelector('body')).injector().get('SharedModalsSrv');
                            if (modal){
                                
                                modal.showIapModal();
                            }
                            else{
                                
                            }
                        }
                    });
                }
                else{
                    
                }
            }
        }
    };
