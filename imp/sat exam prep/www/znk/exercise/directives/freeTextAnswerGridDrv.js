(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('freeTextAnswerGrid', function() {
        return {
            templateUrl: 'znk/exercise/templates/freeTextAnswerGridDrv.html',
            restrict: 'E',
            require: 'ngModel',
            scope: {
                submitClick: '&onSubmitBtn'
            },
            link: function(scope,element,attrs,ngModelCtrl){
                scope.d = {
                    numArr: []
                };

                function updateNgModelViewValue(){
                    var viewValue = scope.d.numArr.join('');
                    ngModelCtrl.$setViewValue(viewValue);
                }

                scope.onClickChar = function (char) {
                    if(attrs.disabled){
                        return;
                    }

                    if(scope.d.numArr.length < 4){
                        scope.d.numArr.push(char);
                        updateNgModelViewValue();
                    }
                };

                scope.onClickErase = function(){
                    if(attrs.disabled){
                        return;
                    }
                    if(scope.d.numArr.length){
                        scope.d.numArr.pop();
                        updateNgModelViewValue();
                    }
                };

                ngModelCtrl.$render = function(){
                    var viewValue = angular.isDefined(ngModelCtrl.$viewValue) ?  ngModelCtrl.$viewValue : '';
                    scope.d.numArr = viewValue.split('');
                };
            }
        };
    });
}(angular));
