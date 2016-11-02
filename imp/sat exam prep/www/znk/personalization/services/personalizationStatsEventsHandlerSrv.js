(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('PersonalizationStatsEventsHandlerSrv', [
        '$rootScope','exerciseEventsConst', 'PersonalizationStatsSrv', 'QuestionUtilsSrv', 'ExerciseTypeEnum', 'drillEventsConst', 'examEventsConst', '$log',
        function ($rootScope, exerciseEventsConst, PersonalizationStatsSrv, QuestionUtilsSrv, ExerciseTypeEnum, drillEventsConst, examEventsConst, $log) {
            var PersonalizationStatsEventsHandlerSrv = {};

            var childScope = $rootScope.$new(true);

            function _eventHandler(exerciseType, evt, exercise, results){
                var newStats  = {};

                results.questionResults.forEach(function(result,index){
                    var question = exercise.questions[index];
                    var categoryId = question.categoryId;

                    if(isNaN(+categoryId) || categoryId === null){
                        $log.error('PersonalizationStatsEventsHandlerSrv: _eventHandler: bad category id for the following question: ',question.id,categoryId);
                        return;
                    }

                    if(!newStats[categoryId]){
                        newStats[categoryId] = new PersonalizationStatsSrv.BaseStats();
                    }
                    var newStat = newStats[categoryId];

                    newStat.totalQuestions++;

                    newStat.totalTime += result.timeSpent || 0;

                    if(result.isAnsweredCorrectly){
                        newStat.correct++;
                    }else if(QuestionUtilsSrv.isQuestionAnswered(question,result)){
                        newStat.wrong++;
                    }else{
                        newStat.unanswered++;
                    }
                });

                PersonalizationStatsSrv.updateStats(exerciseType,newStats);
            }
            var eventsToRegister = [
                {
                    evt: exerciseEventsConst.tutorial.FINISH,
                    exerciseType: ExerciseTypeEnum.tutorial.enum
                },
                {
                    evt: exerciseEventsConst.game.FINISH,
                    exerciseType: ExerciseTypeEnum.game.enum
                },
                {
                    evt: drillEventsConst.FINISH,
                    exerciseType: ExerciseTypeEnum.drill.enum
                },
                {
                    evt: examEventsConst.SECTION_FINISH,
                    exerciseType: ExerciseTypeEnum.section.enum
                }
            ];
            eventsToRegister.forEach(function(evtConfig){
                childScope.$on(evtConfig.evt,_eventHandler.bind(PersonalizationStatsEventsHandlerSrv,evtConfig.exerciseType));
            });
            //added in order to load the service
            PersonalizationStatsEventsHandlerSrv.init = angular.noop;

            return PersonalizationStatsEventsHandlerSrv;
        }
    ]);
})(angular);
