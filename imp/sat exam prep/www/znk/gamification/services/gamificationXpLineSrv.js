'use strict';

(function (angular) {

    angular.module('znk.sat').factory('GamificationXpLineSrv', ['LevelsConst', 'XpLineConst', function (LevelsConst , XpLineConst) {

            var GamificationXpLineSrv = {};

            GamificationXpLineSrv.get = function() {

                var newArr = [], tempObj = {};

                angular.forEach(LevelsConst, function(val, index) {

                    tempObj = val;

                    if(val.name === XpLineConst[index].name) {
                       tempObj.middle = XpLineConst[index].middle;
                        tempObj.className = XpLineConst[index].className;
                    }

                    tempObj.nextPoints = (LevelsConst[index+1]) ? LevelsConst[index+1].points : "";

                    newArr.push(tempObj);
                });

                return newArr;

            };

            return GamificationXpLineSrv;

        }]);
})(angular);
