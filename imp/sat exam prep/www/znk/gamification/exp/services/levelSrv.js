(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('LevelSrv', [
        'StorageSrv', '$q', 'LevelsConst', 'ExpSrv',
        function (StorageSrv, $q, LevelsConst, ExpSrv) {

            var LevelSrv = {
                levelEnabled : true
            };

            LevelSrv.levelByPoints = function levelByPoints (points){
                 return this.titleByPoints(points);
            };

            LevelSrv.titleByPoints = function(points) {
                var title;
                for(var i = 0, ii = LevelsConst.length; i < ii; i++) {
                    var plusOne = (LevelsConst[i+1]) ? LevelsConst[i+1].points : points + 100;
                    if(LevelsConst[i].points <= points && plusOne > points) {
                        title = angular.copy(LevelsConst[i]);
                        break;
                    }
                }

                return title;
            };

            var saveLevel = function saveLevel(userLevel){
                var path = StorageSrv.appUserSpacePath.concat(['gamification']);
                return ExpSrv.getGamificationObj().then(function(gamificationObj){
                    gamificationObj.level = gamificationObj.level || {};
                    angular.extend(gamificationObj.level, userLevel);
                    return StorageSrv.syncedSet(path, gamificationObj);
                });
            };

            LevelSrv.getUserLevel = function getUserLevel() {
                return ExpSrv.getGamificationObj().then(function(gamificationObj){
                    var returnObj;
                    if(!gamificationObj.level){
                        returnObj = {
                            points:  LevelsConst[0].points,
                            name: LevelsConst[0].name,
                            notifyLevelChange: false
                        };
                    } else {
                        returnObj = {
                            points:  gamificationObj.level.points,
                            name: gamificationObj.level.name,
                            notifyLevelChange: gamificationObj.level.notifyLevelChange
                        };
                    }
                    return returnObj;
                });
            };

            LevelSrv.setUserLevel = function setUserLevel(xpObject){
                return LevelSrv.getUserLevel().then(function(userTitle){
                    var defer = $q.defer();

                    if(!xpObject){
                        xpObject = {};
                    }

                    if(!xpObject.total){
                        xpObject.total = 0;
                    }

                    var newTitle = LevelSrv.titleByPoints(xpObject.total);

                    if(newTitle.name !== userTitle.name){

                        userTitle = {
                            points:  newTitle.points,
                            name:  newTitle.name,
                            notifyLevelChange: true,
                            src: newTitle.src || ''
                        };

                        saveLevel(userTitle).then(function(responseTitle){
                            defer.resolve(responseTitle);
                        });
                    }
                    else{
                        defer.resolve(userTitle);
                    }

                    return defer.promise;
                });
            };

            LevelSrv.switchOffNotifications = function switchOffNotifications(userLevel){
                return saveLevel(userLevel);
            };

            LevelSrv.nextLevel = function(currentLevel, currentLevelName, cuurentPoints){

                var level;

                for(var i=0; i<LevelsConst.length; i++){
                    if(LevelsConst[i].name === currentLevelName){
                        if(LevelsConst[i+1]) {
                            level = angular.copy(LevelsConst[i+1]);
                            level.maxPoints = level.points;
                            level.points = level.points - cuurentPoints;
                            level.lastLevel = false;
                            break;
                        } else {
                            level = angular.copy(LevelsConst[i]);
                            level.maxPoints = level.points;
                            level.points = cuurentPoints;
                            level.lastLevel = true;
                        }
                    }
                }

                return level;
            };

            return LevelSrv;
        }
    ]);
})(angular);


