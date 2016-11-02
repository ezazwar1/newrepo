/**
 * attrs-
 *  question: question
 *  ng-model: selected question number
 */
(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('questionDrv', [
        '$compile', 'HintSrv', 'EnumSrv',
        function ($compile, HintSrv, EnumSrv) {
            return {
                templateUrl: 'znk/exercise/templates/questionDrv.html',
                require: ['^znkExerciseDrv','ngModel'],
                scope: {
                    questionGetter: '&question'
                },
                controller: [
                    '$scope','ZnkModalSrv', 'ExerciseUtilsSrv',
                    function($scope, ZnkModalSrv, ExerciseUtilsSrv){
                        var self = this;

                        self.question = $scope.questionGetter();

                        self.showSolution = ExerciseUtilsSrv.showWrittenSolution.bind(ZnkModalSrv,self.question.writtenSln,self.question.quid, self.question.videos, self.question.id);

                        self.getViewMode = function getViewMode() {
                            return $scope.znkExerciseCtrl.settings.viewMode;
                        };

                    }
                ],
                link:function(scope, element, attrs, ctrls){
                    var znkExerciseCtrl = ctrls[0];
                    var ngModelCtrl = ctrls[1];

                    scope.d = {};

                    scope.znkExerciseCtrl = znkExerciseCtrl;

                    scope.d.question = scope.questionGetter();

                    if(scope.d.question.__article){

                        element.addClass('has-article');
                        var $articleWrapper = angular.element(element[0].querySelector('.article-wrapper'));
                        var articleHtmlStr = '<div article-drv content="d.question.__article.content"></div>';
                        $articleWrapper.html(articleHtmlStr);
                        $compile($articleWrapper.contents())(scope);
                    }

                    function showHintChangeListener(){
                        if(znkExerciseCtrl.settings.viewMode === EnumSrv.exerciseViewMode.answerWithResult.enum && angular.isDefined(ngModelCtrl.$viewValue)){
                            HintSrv.triggerWrittenSlnHint();
                        }
                    }
                    ngModelCtrl.$viewChangeListeners.push(showHintChangeListener);

                }
            };
        }
    ]);
})(angular);
