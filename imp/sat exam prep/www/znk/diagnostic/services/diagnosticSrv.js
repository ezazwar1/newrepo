'use strict';

(function (angular) {

    angular.module('znk.diagnostic').factory('DiagnosticSrv', ["DiagnosticConst","$q", "ExamSrv", "ExamResultSrv", "ExerciseResultSrv", "EnumSrv", DiagnosticSrv]);

    function DiagnosticSrv(DiagnosticConst, $q, ExamSrv, ExamResultSrv, ExerciseResultSrv, EnumSrv) {

        var DiagnosticSrv = {};

        DiagnosticSrv.currentData = {};

        DiagnosticSrv.setCurrentData = function(name, val) {
            this.currentData[name] = val;
        };

        DiagnosticSrv.getCurrentData = function(name) {
            if(!this.currentData[name]) {
                return void(0);
            }
            return this.currentData[name];
        };

        DiagnosticSrv.getAllData = function() {

            var _this = this;
            var currentSubject;
            var currentSection;
            var deferred = $q.defer();

            _this.getFullExam().then(function(diagnosticDataPromisesArr) {

                currentSubject = _this._getCorrectSection(diagnosticDataPromisesArr[1]);
                currentSection = diagnosticDataPromisesArr[0].sections[currentSubject] || diagnosticDataPromisesArr[0].sections[0];

                DiagnosticSrv.getExerciseResult(currentSection.id).then(function(resp) {
                    deferred.resolve({
                        exam: diagnosticDataPromisesArr[0],
                        examResult: diagnosticDataPromisesArr[1],
                        examExerciseResult: resp,
                        currentSubject: currentSubject
                    });
                });

            });

            return deferred.promise;
        };

        DiagnosticSrv.getFullExam = function() {

            var _this = this;
            var promises = [];


            var deferred = $q.defer();

            ExamSrv.get(DiagnosticConst.examId).then(function(response) {
                // sort data to make sure the section are in the right order
                var sortedData = _this._sortData(response);
                deferred.resolve(sortedData);
            });

            promises.push(deferred.promise);


            promises.push(ExamResultSrv.get(DiagnosticConst.examId));


            return $q.all(promises);

        };

        DiagnosticSrv.getState = function(diagnosticDataPromisesObject) {

            var deferred = $q.defer();
            var questionsResult = diagnosticDataPromisesObject.examExerciseResult.questionResults;

            var info = { state: "app.home", params: {} };

            if(diagnosticDataPromisesObject.examExerciseResult.isComplete) {
                info.state = "app.diagnostic.summary";
                deferred.resolve(info);
            }

            if(questionsResult) {

                if(angular.isDefined(questionsResult[questionsResult.length - 1])) {
                    this.setCurrentData("difficulty", questionsResult[questionsResult.length - 1].difficulty);
                }

                info = { state: "app.diagnostic.exercise", params: { subjectId: diagnosticDataPromisesObject.currentSubject,
                    questionId: (questionsResult.length + 1) } };
                deferred.resolve(info);


            } else {
                this.setCurrentData("difficulty", 3);
                info = { state: "app.diagnostic.intro", params: { subjectId: diagnosticDataPromisesObject.currentSubject } };
                deferred.resolve(info);
            }

            return deferred.promise;

        };

        DiagnosticSrv.getExerciseResult = function(id) {
            return ExerciseResultSrv.get(EnumSrv.exerciseType.section.enum, id);
        };

        DiagnosticSrv.setMapQuestions = function(questions, questionId, results) {

            var questionsCopy = angular.copy(questions);
            var questionObj = {};

            angular.forEach(questionsCopy, function(question) {

                var flag = false;

                if(!questionObj[question.order]) {
                    questionObj[question.order] = {};
                }

                if(questionId > 1) {
                    for(var i = 0, ii = results.length; i < ii; i++) {
                        if(results[i].questionId === question.id) {
                            flag = true;
                            break;
                        }
                    }
                }

                questionObj[question.order][question.difficulty] = { question: question, flag:flag };

            });

            this.setCurrentData("mapQuestions", questionObj);

            return questionObj;
        };

        DiagnosticSrv.getMapQuestions = function(isCorrect, questionDate, sectionSaveQuestion, questionId, firstTime) {

            var _this = this;
            var questionTimeEnd;
            var questionTimeOver = false;
            var difficulty = parseInt(_this.getCurrentData("difficulty"));
            var deferred = $q.defer();

            if(questionDate) {
                questionTimeEnd = questionDate - Date.now();
                if(questionTimeEnd > DiagnosticConst.time) {
                    questionTimeOver = true;
                }
            }

            

            if(!difficulty) {
                difficulty = 3;
            }

            if(difficulty && angular.isDefined(isCorrect) && !firstTime) {
                if(!questionTimeOver) {
                    if(isCorrect) {
                        difficulty = (difficulty === 5) ? 5 : difficulty + 1;
                    } else {
                        difficulty = (difficulty === 1) ? 1 : difficulty - 1;
                    }
                }
            }

             
             
             

            if(sectionSaveQuestion) {

                angular.forEach(_this.currentData["mapQuestions"][questionId], function(value) {

                    if(value.question.id === sectionSaveQuestion.id) {

                        _this.setCurrentData("difficulty", sectionSaveQuestion.difficulty);
                        
                        deferred.resolve(value);
                    }

                });

            } else {

                _this.setCurrentData("difficulty", difficulty);

                _this._getItemArr(difficulty, questionId, function(newItem) {
                    deferred.resolve(newItem);
                });

            }


            return deferred.promise;
        };

        DiagnosticSrv.setExamResults = function(questions)  {
            var questionsCopy = angular.copy(questions);
            var newArr = questionsCopy.map(function(question) {
                return {questionId: question.id};
            });

            this.setCurrentData("mapExamResults", newArr);

            return newArr;
        };

        DiagnosticSrv._sortData = function(data) {

            var dataArr = [];

            angular.forEach(data.sections, function(value) {
                dataArr[EnumSrv.subject.getEnumArr()[value.subjectId].enum] = value;
            });

            data.sections = dataArr;

            return data;
        };

        DiagnosticSrv._getCorrectSection = function(data) {

            var currentSubject;

            if(angular.isUndefined(data.sectionComplete)) {
                currentSubject = 0;
                return currentSubject;
            }

            if(!data.sectionComplete.math) {
                currentSubject = 0;
                return currentSubject;
            }

            if(!data.sectionComplete.read) {
                currentSubject = 1;
                return currentSubject;
            }

            if(!data.sectionComplete.write) {
                currentSubject = 2;
                return currentSubject;
            }

            return currentSubject;
        };

        DiagnosticSrv._getItemArr = function(difficulty, questionId, cb)  {

            var _this = this;
            var obj = this.currentData["mapQuestions"][questionId][difficulty];
            var item;
            var difficultyMinMax;

            if(obj) {
                obj.flag = true;
                item = obj;
            }

            if(angular.isUndefined(item)) {
                setTimeout(function() {
                    difficultyMinMax = (difficulty - 1 > 0) ? difficulty - 1 : difficulty + 1;
                    _this._getItemArr(difficultyMinMax, questionId, cb);
                }, 25);
            } else {
                cb(item);
            }
        };

        return DiagnosticSrv;

    }

})(angular);
