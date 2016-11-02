(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('DailyHelperSrv', [
        'StorageSrv', 'OfflineContentSrv', 'DailyResultSrv', 'ExerciseResultSrv', 'EnumSrv', 'GameSrv', 'TutorialSrv',
        function (StorageSrv, OfflineContentSrv, DailyResultSrv, ExerciseResultSrv, EnumSrv, GameSrv, TutorialSrv) {
            var DailyHelperSrv = {};

            var dailyPath = StorageSrv.appUserSpacePath.concat(['daily']);

            DailyHelperSrv.getDailiesData = function () {
                return StorageSrv.get(dailyPath)
                    .then(function (dailiesData) {
                        var defaultValue = {
                            usedCards: [],
                            dailies: []
                        };
                        for (var prop in defaultValue) {
                            if (angular.isUndefined(dailiesData[prop])) {
                                dailiesData[prop] = defaultValue[prop];
                            }
                        }
                        return dailiesData;
                    });
            };

            DailyHelperSrv.saveDailiesData = function (newDailiesData) {
                return StorageSrv.set(dailyPath, newDailiesData);
            };

            DailyHelperSrv.saveDaily = function (daily) {
                return DailyHelperSrv.getDailiesData(true).then(function (dailiesData) {
                    var dailyIndex = (+daily.dailyOrder) - 1;
                    dailiesData.dailies[dailyIndex] = daily;
                    return DailyHelperSrv.saveDailiesData(dailiesData).then(function () {
                        return dailiesData.dailies[dailyIndex];
                    });
                });
            };

            DailyHelperSrv.isExerciseComplete = function (exerciseEnum, exerciseId) {
                return ExerciseResultSrv.get(exerciseEnum,exerciseId).then(function (result) {
                    return !!result.isComplete;
                });
            };

            return DailyHelperSrv;
        }
    ]);
})(angular);
