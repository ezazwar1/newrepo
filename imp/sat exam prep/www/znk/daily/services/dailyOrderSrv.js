'use strict';

(function(angular) {

    angular.module('znk.sat').factory('DailyOrderSrv', ['StorageSrv', 'OfflineContentSrv', 'ExerciseResultSrv', 'EnumSrv', 'ExerciseUtilsSrv', DailyOrderSrv]);

    function DailyOrderSrv(StorageSrv, OfflineContentSrv, ExerciseResultSrv, EnumSrv, ExerciseUtilsSrv) {

        var dailyOrderPath = StorageSrv.appUserSpacePath.concat(['dailyOrder']);

        function prefixOrderId(id) {
            return 'orderId' + id;
        }

        function getUserDailyOrder() {
            return StorageSrv.get(dailyOrderPath).then(function(objOrNull) {
                return objOrNull || {};
            });
        }

        function setUserDailyOrder(userDailyOrder) {
            return StorageSrv.set(dailyOrderPath, userDailyOrder);
        }
        //preventing from same personalized daily to be generated more than once
        var personalizationCreationMap = {};
        function _createPersonailizedDaily(id){
            if(!personalizationCreationMap[id]){
                personalizationCreationMap[id] = PersonalizationSrv.createPersonalizedDaily(id);
            }
            return personalizationCreationMap[id];
        }

        function get (id) {
            var prefixedId = prefixOrderId(id);
            return getUserDailyOrder().then(function (userDailies) {

                // this is an object, not an array
                if (angular.isUndefined(userDailies[prefixedId])) {
                    return OfflineContentSrv.getDailyOrder(id).catch(function () {
                        return _createPersonailizedDaily(id);

                    }).then(function (dailyOrder) {
                        userDailies[prefixedId] = dailyOrder;
                        return setUserDailyOrder(userDailies).then(function () {
                            return dailyOrder;
                        });

                    }).then(function (dailyOrder) {
                        // make sure that the tutorial wasn't completed on the list page
                        return ExerciseResultSrv.get(EnumSrv.exerciseType.tutorial.enum, dailyOrder.tutorialId).then(function(tutorialResult) {
                            if (angular.isDefined(tutorialResult.exerciseId)) {
                                return ExerciseUtilsSrv.updateDailyResultChild(dailyOrder.orderId, tutorialResult);
                            }
                        });

                    }).then(function () {
                        return userDailies[prefixedId];
                    });
                }

                return userDailies[prefixedId];

            }).then(function(dailyOrder) {
                var exercises = ['tutorial' + dailyOrder.tutorialId,
                    'practice' + dailyOrder.practiceId,
                    'game' + dailyOrder.gameId
                ];

                return OfflineContentSrv.neverUpdateRevOf(exercises).then(function() {
                    return dailyOrder;
                });
            });
        }

        return {
            get: get
        };
    }

})(angular);
