'use strict';

(function (angular) {
    var scrollPosition;
    angular.module('znk.sat').controller('HomeCtrl', [
        '$scope', 'ZnkModalSrv', '$q', 'UserProfileSrv', 'HomeSrv', 'IapSrv', 'PurchaseContentSrv', '$timeout', '$ionicScrollDelegate', '$window', 'MobileSrv', 'ExpSrv', 'LevelSrv', 'ExerciseUtilsSrv', 'StoreRateSrv', 'GoBackHardwareSrv', 'HomeItemStatusEnum', 'SharedModalsSrv', '$state', 'exerciseEventsConst',
        function ($scope, ZnkModalSrv, $q, UserProfileSrv, HomeSrv, IapSrv, PurchaseContentSrv, $timeout, $ionicScrollDelegate, $window, MobileSrv, ExpSrv, LevelSrv, ExerciseUtilsSrv, StoreRateSrv, GoBackHardwareSrv, HomeItemStatusEnum, SharedModalsSrv, $state, exerciseEventsConst) {
            GoBackHardwareSrv.registerExitAppHandler();

            var homePageScrollDelegate = $ionicScrollDelegate.$getByHandle('homePage'),
                freeDailiesEndedModalInstance,
                spinnerModalInstance;


            $scope.d = {
                xpPointsEnabled: ExpSrv.xpPointsEnabled,
                totalXpPoints: 0,
                showTinyPerformance: false,
                isMobile: MobileSrv.isMobile(),
                homePath: {
                    itemTemplate: 'znk/home/templates/homePathItemTemplate.html'
                },
                onClickGauge: function(subjectId){
                    $state.go('app.performance',{subjectId: subjectId});
                }
            };

            if ($scope.d.xpPointsEnabled) {
                getGamificationObj();
            }

            var getUserProfileProm = $q.when(UserProfileSrv.get());
            getUserProfileProm.then(function (userProfile) {
                $scope.d.userProfile = userProfile;
            });

            if (!$scope.d.allItemsArr) {
                spinnerModalInstance = SharedModalsSrv.showloadingSpinnerModal();
                $scope.d.spinnerStoped = false;
            }

            var getAllItemsProm = HomeSrv.getAllItems();
            var getSubscriptionProm = IapSrv.getSubscription();
            getAllItemsProm = $q.all([getAllItemsProm,getSubscriptionProm ]).then(function (res) {
                var items = res[0];
                var hasSubscription = res[1];

                var isFreeItemPromArr = [];

                items.forEach(function (item) {
                    var prom;
                    if (item.hasOwnProperty('dailyOrder')) {
                        if(item.status === HomeItemStatusEnum.ACTIVE.enum){
                            $scope.d.activeDailyOrder = item.dailyOrder;
                        }
                        if(!hasSubscription){
                            prom = PurchaseContentSrv.isFreeDaily(item.dailyOrder).then(function (res) {
                                item.locked = !res;
                            });
                            isFreeItemPromArr.push(prom);
                        }
                    }
                });

                var itemsLockSetProm = $q.all(isFreeItemPromArr);
                return $q.all([items,itemsLockSetProm]);
            });

            ////determine whether all free dailies are complete
            var allProm = $q.all([getAllItemsProm, getSubscriptionProm]);
            allProm.then(function (res) {
                var items = res[0][0];

                if ($scope.d.hasSubscription) {
                    return items;
                }
                var showFreeDailiesEndedModal = true;
                items.forEach(function (item) {
                    if (!item.locked && item.status !== HomeItemStatusEnum.COMPLETED.enum) {
                        showFreeDailiesEndedModal = false;
                    }
                });
                if (showFreeDailiesEndedModal) {
                    freeDailiesEndedModalInstance = HomeSrv.showFreeDailiesEndedModal();
                }

                return items;
            }).then(function (items) {
                 $scope.d.allItemsArr = items;

                if (spinnerModalInstance) {
                    spinnerModalInstance.close();
                    $scope.d.spinnerStoped = true;
                }

            }).then(function () {
                if(scrollPosition && scrollPosition.top){
                    homePageScrollDelegate.scrollTo(0,scrollPosition.top,false);
                }
            });

            function getGamificationObj(){
                ExpSrv.getGamificationObj().then(function (gamificationObj) {

                    $scope.d.gamificationObj = gamificationObj;

                    if (gamificationObj.exp && gamificationObj.exp.total) {
                        $scope.d.totalXpPoints = gamificationObj.exp.total;
                    }

                    var level = gamificationObj.level;

                    if (!level) {
                        level = LevelSrv.titleByPoints($scope.d.totalXpPoints);
                    }

                    $scope.d.userLevel = level;

                    if (level.notifyLevelChange && level.points !== 0) {
                        level.notifyLevelChange = false;
                        LevelSrv.switchOffNotifications(level);
                        ExerciseUtilsSrv.showLevelChange(level);
                    }

                });
            }

            $scope.onExamDefault = function(id) {
                $scope.d.examIdDefault = id;
            };

            $scope.scrollToActiveDaily = function(activeDailyPos){
                homePageScrollDelegate.scrollTo(0,activeDailyPos -250,false);
            };

            $scope.$on(exerciseEventsConst.flashCard, function () {
                getGamificationObj();
            });

            $scope.$on(IapSrv.SUBSCRIPTION_PURCHASED_EVENT, function (evt, newSubscriptionsDate) {
                if (newSubscriptionsDate) {
                    $scope.d.hasSubscription = true;
                    $scope.d.allItemsArr.forEach(function(item){
                        if(item.locked && item.status !== HomeItemStatusEnum.COMING_SOON.enum){
                            item.locked = false;
                        }
                    });
                }

                if (freeDailiesEndedModalInstance) {
                    freeDailiesEndedModalInstance.close();
                }
            });

            $scope.$on('$destroy', function () {
                scrollPosition = homePageScrollDelegate.getScrollPosition();
                if (freeDailiesEndedModalInstance) {
                    freeDailiesEndedModalInstance.close();
                }
            });
        }
    ]);
})(angular);
