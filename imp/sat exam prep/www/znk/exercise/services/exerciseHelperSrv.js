// jshint unused:false
'use strict';

(function(angular) {

    angular.module('znk.sat').factory('ExerciseHelperSrv', ['$q', ExerciseHelperSrv]);

    function ExerciseHelperSrv($q) {

        function ExerciseHelper () {

            this.isDaily = false;
            this.isTutorial = false;
            this.isPractice = false;
            this.isGame = false;
            this.isExam = false;
            this.isDrill = false;

            this.createDefaultChapter = function createDefaultChapter (questions) {
                return {
                    index: 0,
                    name: 'default',
                    length: questions.length,
                    firstQuestionIndex: 0,
                    lastQuestionIndex: questions.length - 1,
                    visited: true,
                    canGoBack: true,
                    canSkipQuestions: true
                };
            };

            this.goToQuestion = function goToQuestion(index) {
                return;
            };

            this.getBasicFinishDialog = function getBasicFinishDialog(unansweredCount) {
                var canStay = (unansweredCount > 0);

                return {
                    options: {
                        type: (canStay ? 'info' : 'success'),//@todo(igor) is type 'info' reachable
                        title: (canStay ? 'Finish?' : 'PRACTICE DONE!'),
                        content: (canStay ? 'You\'ve left some questions unanswered..' : 'You\'re awesome!'),
                        showCancelButton: true,
                        confirmButtonText: 'Summary',
                        cancelButtonText: (canStay ? 'Stay' : 'Home')
                    },
                    cancelFinish: canStay
                };
            };

            this.onQuestionAnswered = function onQuestionAnswered(index, isCorrect) {
                return;
            };

            this.onMoveToQuestion = function onMoveToQuestion(index) {
                return index;
            };

            this.getFinishDialog = function getFinishDialog(unansweredCount) {
                return $q.when(this.getBasicFinishDialog(unansweredCount));
            };

            this.onFinish = function onFinish() {
                return;
            };

            this.doNextExercise = function doNextExercise() {
                return;
            };

            this.onToggleFavoriteAndSave = function onToggleFavoriteAndSave() {
                return;
            };

            this.onLeaveUnfinished = function onLeaveUnfinished() {
                return;
            };

            this.requestFinish = function requestFinish (force) {
                return;
            };
        }

        function DailyHelper () {

            this.getFinishDialog = function getFinishDialog(exerciseTypeId) {
                // placeholder - probably not interesting
                return new ExerciseHelper().getBasicFinishDialog(0);
            };

            this.onFinish = function onFinish() {
                return;
            };
        }

        return {
            ExerciseHelper: ExerciseHelper,
            DailyHelper: DailyHelper
        };

    }

})(angular);
