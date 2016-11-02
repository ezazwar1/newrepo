

'use strict';

(function (angular) {
    angular.module('znk.sat').directive('animatedRaccoonDrv', ['$timeout', 'MobileSrv', 'EnumSrv', function ($timeout, MobileSrv, EnumSrv) {
        return {
            replace: true,
            scope: {
                correctAnswers: '=',
                objectType: '=',
                isPerfect: '='
            },
            link: function (scope, element) {

                var imageByObject = function imageByObject(){
                    var imageName = '';
                    if(scope.objectType === EnumSrv.exerciseType.tutorial.enum ||
                        scope.objectType === EnumSrv.exerciseType.practice.enum ||
                        scope.objectType === EnumSrv.exerciseType.game.enum)
                    {
                        var _practiceIcon = imageMap.daily[scope.correctAnswers - 1];
                        if(!_practiceIcon)  {
                            _practiceIcon = imageMap.daily[0];
                        }
                        imageName = _practiceIcon.icon;
                    }
                    else if(scope.objectType === EnumSrv.exerciseType.drill.enum ){
                        var _drillIcon = imageMap.drill[scope.correctAnswers - 1];
                        if(!_drillIcon)  {
                            _drillIcon = imageMap.drill[0];
                        }
                        imageName = _drillIcon.icon;
                    }
                    else{
                        imageName = imageMap.exam.icon;
                    }

                    if(scope.isPerfect){
                        imageName = 'awesome';
                    }

                    return 'raccoon-' + imageName + '.gif?' + Date.now();
                };

                var imageMap={
                    daily: [
                        {icon:'complete'},
                        {icon:'complete'},
                        {icon:'good'},
                        {icon:'good'},
                        {icon:'awesome'}
                    ],
                    drill:[
                        {icon:'complete'},
                        {icon:'complete'},
                        {icon:'complete'},
                        {icon:'complete'},
                        {icon:'complete'},
                        {icon:'good'},
                        {icon:'good'},
                        {icon:'good'},
                        {icon:'awesome'},
                        {icon:'awesome'}
                    ],
                    exam: {icon:'awesome'}
                };

                var imageFolder ='assets/img/animated/';
                if (MobileSrv.isMobile()) {
                    imageFolder += 'mobile/';
                }

                var imageSrc = imageFolder + imageByObject();
                var imageTag = '<img src="' + imageSrc +'" >';

                $timeout(function () {
                    angular.element(element).append(imageTag);
                },500);
            }
        };
    }]);
})(angular);
