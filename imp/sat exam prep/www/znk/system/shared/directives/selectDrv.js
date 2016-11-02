/**
 * attrs:
 *  empty-title: title to be displayed when ng model value is undefined, by default is set to empty string
 *  options: drop down options array
 *  view-expr: option view expression , this expression is evaluated against the option object
 *  key-expr: if provided than key formatter will be added
 */
'use strict';

(function (angular) {
    angular.module('znk.sat').directive('selectDrv', [
        '$parse','$document',
        function ($parse,$document) {
            return {
                templateUrl: 'znk/system/shared/templates/selectDrv.html',
                require: ['ngModel','selectDrv'],
                replace: true,
                scope: {
                    emptyTitleGetter: '&emptyTitle',
                    options: '='
                },
                controller:[
                    '$parse','$attrs','$scope',
                    function($parse,$attrs,$scope){
                        this.viewGetter = $parse($attrs.viewExpr);

                        this.optionSelected = function(title){
                            $scope.d.title = title;
                            $scope.d.showDropDown = false;
                        };
                    }
                ],
                link: function (scope, element, attrs, ctrls) {
                    var ngModelCtrl = ctrls[0];
                    var selectDrvCtrl = ctrls[1];

                    scope.d = {};

                    scope.d.ngModelCtrl = ngModelCtrl;

                    ngModelCtrl.$render = function(){
                        if(typeof ngModelCtrl.$viewValue === 'undefined'){
                            var title = scope.emptyTitleGetter();
                            title = typeof title === 'undefined' ? '' : title;
                            scope.d.title = title;
                        }else{
                            scope.d.title = selectDrvCtrl.viewGetter(ngModelCtrl.$viewValue);
                        }
                    };

                    var parser,formatter;
                    if(attrs.keyExpr){
                        parser = function(val){
                            var keyGetter = $parse(attrs.keyExpr);
                            return keyGetter(val);
                        };
                        ngModelCtrl.$parsers.push(parser);

                        formatter = function(val){
                            var keyGetter = $parse(attrs.keyExpr);
                            for(var i in scope.options){
                                var optionItem = scope.options[i];
                                var optionKey = keyGetter(optionItem);
                                if(angular.equals(optionKey,val)){
                                    return optionItem;
                                }
                            }
                            return undefined;
                        };
                        ngModelCtrl.$formatters.push(formatter);
                    }

                    function globalClickHandler(evt){
                        var elem = evt.target;
                        var selectElem = element[0];
                        while(elem){
                            if(elem === selectElem){
                                return;
                            }
                            elem = elem.parentElement;
                        }
                        scope.$apply(function(){
                            scope.d.showDropDown = false;
                        });
                    }
                    $document.on('click',globalClickHandler);

                    scope.$on('$destroy',function(evt){
                        $document.off('click',globalClickHandler);
                    });
                }
            };
        }
    ]);
})(angular);

(function (angular) {
    angular.module('znk.sat').directive('selectOptionDrv', [
        function () {
            return {
                template: '<div ng-click="d.onTap()"></div>',
                require: ['^selectDrv','^ngModel'],
                replace: true,
                scope:{
                    optionGetter: '&option'
                },
                link: function (scope, element, attrs, ctrls) {
                    var selectDrvCtrl = ctrls[0];
                    var ngModelCtrl = ctrls[1];

                    var option = scope.optionGetter();
                    var view = selectDrvCtrl.viewGetter(option);
                    element.text(view);

                    scope.d = {};

                    scope.d.onTap = function(){
                        ngModelCtrl.$setViewValue(option);
                        selectDrvCtrl.optionSelected(view);
                    };

                    if(angular.equals(ngModelCtrl.$viewValue,option)){
                        attrs.$addClass('selected');
                    }
                }
            };
        }
    ]);
})(angular);
