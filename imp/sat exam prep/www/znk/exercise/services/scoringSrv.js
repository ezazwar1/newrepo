'use strict';

(function () {

    angular.module('znk.sat').factory('ScoringSrv', ['$q', 'OfflineContentSrv', ScoringSrv]);

    function ScoringSrv($q, OfflineContentSrv) {

        var scores = {
            correct: 1,
            wrong: -0.25
        };
        var subjectScoreSectionNames = {
            0: 'mathScore',
            1: 'readScore',
            2: 'writeScore'
        };

        var getAllSubjectScoreSectionNames = function getAllSubjectScoreSectionNames() {
            return angular.copy(subjectScoreSectionNames);
        };

        var getScoreTable = function getScoreTable() {
            var deferred = $q.defer();

            OfflineContentSrv.getScoreTable().then(function(scoreTable) {
                if (scoreTable) {
                    deferred.resolve(scoreTable);
                } else {
                    deferred.reject();
                }
            });

            return deferred.promise;
        };

        var getAnswerByQuestionId = function getAnswerByQuestionId(questionResults, id) {
            for (var i = 0; i < questionResults.length; i++) {
                if (questionResults[i].questionId === id) {
                    return questionResults[i];
                }
            }

            return undefined;
        };

        var scoreSection = function scoreSection(section, results) {
            var score = 0;

            for (var i = 0; i < section.questions.length; i++) {
                var question = section.questions[i];
                var answer = getAnswerByQuestionId(results.questionResults, question.id);

                if (answer) {

                    if (question.answerTypeId === 0) {
                        if (answer.userAnswerId === question.correctAnswerId) {
                            score += scores.correct;
                        }
                        else if (angular.isDefined(answer.userAnswerId)) {
                            score += scores.wrong;
                        }
                    }
                    else if (question.answerTypeId === 1) {
                        var correct = question.correctAnswerText.some(function(item) {
                            return item.content === answer.userAnswerText;
                        });

                        if (correct) {
                            score += scores.correct;
                        }
                    }
                }
                else {
                    //user did not answer this question
                }
            }

            return score;
        };

        function getScoreEdges(sectionScoreObject) {
            var min = {
                raw: 0,
                estimate: sectionScoreObject[0]
            };
            var max = {
                raw: 0,
                estimate: sectionScoreObject[0]
            };

            for (var rawScore in sectionScoreObject) {
                if (sectionScoreObject.hasOwnProperty(rawScore)) {
                    var curEstimate = sectionScoreObject[rawScore];
                    if (curEstimate < min.estimate) {
                        min.raw = rawScore;
                        min.estimate = curEstimate;
                    } else if (curEstimate > max.estimate) {
                        max.raw = rawScore;
                        max.estimate = curEstimate;
                    }
                }
            }

            return {
                min: min,
                max: max
            };
        }

        var getSubjectScorePropertyName = function getSubjectScorePropertyName(subjectId) {
            return subjectScoreSectionNames[subjectId];
        };

        var scoreSubject = function scoreSubject(subjectId, scoresArray) {

            return getScoreTable().then(function(table) {
                var scoreSectionName = getSubjectScorePropertyName(subjectId);

                var scoresSum = 0;
                for (var i = 0; i < scoresArray.length; i++) {
                    scoresSum += scoresArray[i];
                }
                scoresSum = Math.round(scoresSum);

                // default value is here for debugging purposes
                var estimatedScore = 0;
                if (table[scoreSectionName].hasOwnProperty(scoresSum)) {
                    estimatedScore = table[scoreSectionName][scoresSum];
                } else {
                    var edges = getScoreEdges(table[scoreSectionName]);

                    estimatedScore = (scoresSum < edges.min.raw ? edges.min.estimate : edges.max.estimate);
                }

                return estimatedScore;
            });
        };

        function getScoreByRawScore(subjectId,rawScore){
            return getScoreTable().then(function(scoreTable){
                return scoreTable[subjectScoreSectionNames[subjectId]][rawScore];
            });
        }

        return {
            getAllSubjectScoreSectionNames: getAllSubjectScoreSectionNames,
            scoreSection: scoreSection,
            scoreSubject: scoreSubject,
            getSubjectScorePropertyName: getSubjectScorePropertyName,
            getScoreByRawScore: getScoreByRawScore
        };
    }

})();

