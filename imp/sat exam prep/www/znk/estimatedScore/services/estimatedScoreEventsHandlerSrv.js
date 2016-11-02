(function (angular) {
    'use strict';

    angular.module('znk.sat').service('EstimatedScoreEventsHandlerSrv', [
        '$rootScope', 'examEventsConst', 'ExamTypeEnum', 'diagnosticScoresConst', 'EstimatedScoreSrv', 'SubjectEnum',
        'ExerciseTypeEnum', 'rawPointsConst', 'ExerciseAnswerStatusEnum', 'drillEventsConst', 'exerciseEventsConst',
        function ($rootScope, examEventsConst, ExamTypeEnum, diagnosticScoresConst, EstimatedScoreSrv, SubjectEnum,
                  ExerciseTypeEnum, rawPointsConst, ExerciseAnswerStatusEnum, drillEventsConst, exerciseEventsConst) {
            var EstimatedScoreEventsHandlerSrv = this;

            var childScope = $rootScope.$new(true);

            function _basePointsGetter(pointsMap,answerStatus,withinAllowTime){
                if(answerStatus === ExerciseAnswerStatusEnum.unanswered.enum){
                    key = 'unanswered';
                }else{
                    var key = answerStatus === ExerciseAnswerStatusEnum.correct.enum ? 'correct' : 'wrong';
                    key += withinAllowTime ? 'Within' : 'After';
                }
                return pointsMap[key];
            }

            function _getDiagnosticQuestionPoints(question,result){
                var pointsMap = diagnosticScoresConst[question.difficulty];
                var answerStatus = result.isAnsweredCorrectly ? ExerciseAnswerStatusEnum.correct.enum : ExerciseAnswerStatusEnum.wrong.enum ;
                return _basePointsGetter(pointsMap,answerStatus,true);
            }

            function diagnosticSectionCompleteHandler(section,sectionResult){
                var score = 0;

                var questions = section.questions;
                for(var i in sectionResult.questionResults){
                    var question = questions[i];
                    var result = sectionResult.questionResults[i];
                    score += _getDiagnosticQuestionPoints(question,result);
                }
                EstimatedScoreSrv.setDiagnosticSectionScore(score,ExerciseTypeEnum.section.enum,section.subjectId,section.id);
            }

            function _getQuestionRawPoints(exerciseType,result){
                var isAnsweredWithinAllowedTime;
                var answerStatus;

                //answered after allowed time
                if(angular.isDefined(result.answerAfterTime)){
                    isAnsweredWithinAllowedTime = false;
                    answerStatus = result.answerAfterTime;
                }else{//answered within allowed time
                    isAnsweredWithinAllowedTime = true;
                    answerStatus = ExerciseAnswerStatusEnum.convertSimpleAnswerToAnswerStatusEnum(result.isAnsweredCorrectly);
                }

                var rawPointsMap = rawPointsConst[exerciseType];
                return _basePointsGetter(rawPointsMap,answerStatus,isAnsweredWithinAllowedTime);
            }

            function calculateRawScore(exerciseType,results){
                var rawPoints = {
                    total: results.length * rawPointsConst[exerciseType].correctWithin,
                    earned: 0
                };
                results.forEach(function(result){
                    rawPoints.earned += _getQuestionRawPoints(exerciseType,result)
                });
                return rawPoints;
            }

            childScope.$on(examEventsConst.SECTION_FINISH,function(evt,section,sectionResult,exam){
                var isDiagnostic = exam.typeId === ExamTypeEnum.diagnostic.enum;
                if(isDiagnostic){
                    diagnosticSectionCompleteHandler(section,sectionResult);
                }
                var rawScore = calculateRawScore(ExerciseTypeEnum.section.enum,sectionResult.questionResults);
                EstimatedScoreSrv.addRawScore(rawScore,ExerciseTypeEnum.section.enum,section.subjectId,section.id,isDiagnostic);
            });

            function _baseExerciseFinishHandler(exerciseType,evt,exercise,exerciseResult){
                var rawScore = calculateRawScore(exerciseType,exerciseResult.questionResults);
                EstimatedScoreSrv.addRawScore(rawScore,exerciseType,exercise.subjectId,exercise.id);
            }

            var exercisesHandledByBaseExerciseFinishHandler = [
                {
                    name: drillEventsConst.FINISH,
                    type: ExerciseTypeEnum.drill.enum
                },
                {
                    name: exerciseEventsConst.tutorial.FINISH,
                    type: ExerciseTypeEnum.tutorial.enum
                },
                {
                    name: exerciseEventsConst.game.FINISH,
                    type: ExerciseTypeEnum.game.enum
                }
            ];
            exercisesHandledByBaseExerciseFinishHandler.forEach(function(evt){
                $rootScope.$on(evt.name,_baseExerciseFinishHandler.bind(EstimatedScoreEventsHandlerSrv,evt.type));
            });

            EstimatedScoreEventsHandlerSrv.init = angular.noop;
        }
    ]);
})(angular);
