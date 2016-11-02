'use strict';

(function(angular) {

    angular.module('znk.sat').factory('QuestionUtilsSrv', ['EnumSrv', QuestionUtilsSrv]);

    function QuestionUtilsSrv(EnumSrv) {

        function isAnswerCorrect(question,result){
            var questionAnswerType = EnumSrv.questionAnswerType;

            var isCorrect,answer;
            switch(question.answerTypeId) {
                case questionAnswerType.select.enum:
                    answer = '' + result.userAnswerId;
                    isCorrect = ('' + question.correctAnswerId) === answer;
                    break;
                case questionAnswerType.freeText.enum:
                    answer = '' + result.userAnswerText;
                    var answersIdsMap = question.correctAnswerText.map(function(answer){
                        return '' + answer.content;
                    });
                    isCorrect = answersIdsMap.indexOf(answer) !== -1;
                    break;
            }

            return isCorrect;
        }

        function getCorrectAnswersNum(questions,results){
            var correctAnswerNum = 0;
            for(var i=0; i<questions.length; i++){
                if(isAnswerCorrect(questions[i],results[i])){
                    correctAnswerNum++;
                }
            }
            return correctAnswerNum;
        }

        function areAllAnswersCorrect(questions,results){
            var numOfCorrectAnswer = getCorrectAnswersNum(questions,results);
            return{
                correctAnswers: numOfCorrectAnswer,
                allCorrect: numOfCorrectAnswer === questions.length
            };
        }

        function isQuestionAnswered(question,result){
            var questionAnswerType = EnumSrv.questionAnswerType;
            var answer = question.answerTypeId === questionAnswerType.select.enum ? result.userAnswerId : result.userAnswerText;
            return angular.isDefined(answer);
        }

        return {
            isAnswerCorrect: isAnswerCorrect,
            getCorrectAnswersNum: getCorrectAnswersNum,
            areAllAnswersCorrect: areAllAnswersCorrect,
            isQuestionAnswered: isQuestionAnswered
        };
    }

})(angular);
