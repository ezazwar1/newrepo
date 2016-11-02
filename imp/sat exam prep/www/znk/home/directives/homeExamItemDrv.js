/**
 * attrs:
 */

(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('homeExamItem', [
        '$state', 'HomeItemStatusEnum',
        function ($state, HomeItemStatusEnum) {
            return {
                templateUrl: 'znk/home/templates/homeExamItemDrv.html',
                restrict: 'E',
                scope:{
                    positionGetter: '&position',
                    examGetter: '&exam'
                },
                link: function (scope, element, attrs) {
                    var pos = scope.positionGetter();
                    var exam = scope.examGetter();
                    var transformCssProp = 'translate3d(' + pos.left + 'px, ' + pos.top + 'px,0)';
                    element[0].style['-webkit-transform'] = transformCssProp;

                    scope.d = {};

                    switch (exam.status){
                        case HomeItemStatusEnum.NEW.enum:
                            scope.d.row1 = 'TRY FULL';
                            scope.d.row2 = 'SAT';
                            break;
                        case HomeItemStatusEnum.COMPLETED.enum:
                            scope.d.row1 = '<i class="correct-answer-white"></i>';
                            scope.d.row2= 'FULL SAT';
                            break;
                        case HomeItemStatusEnum.COMING_SOON.enum:
                            scope.d.row1 = 'Coming Soon';
                            element.addClass('coming-soon');
                            break;
                        default :
                            scope.d.row1 = '<i class="correct-answer-white"></i>';
                            scope.d.row2= 'FULL SAT';
                    }

                    function clickHandler(){
                        if(!attrs.disabled){
                            $state.go('app.examPage',{id: exam.id});
                        }
                    }
                    element.on('click',clickHandler);

                    scope.$on('$destroy',function(){
                        element.off('click',clickHandler);
                    });
                }
            };
        }
    ]);
})(angular);

