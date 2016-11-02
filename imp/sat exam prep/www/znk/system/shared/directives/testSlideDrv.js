'use strict';

(function (angular) {
    angular.module('znk.sat').directive('testSlideDrv', ['ExamSrv', 'ExamResultSrv','$q', '$timeout', 'IapSrv', '$state', '$log', 'PurchaseContentSrv',
        function (ExamSrv, ExamResultSrv, $q, $timeout, IapSrv, $state, $log, PurchaseContentSrv) {
            return {
                restrict:'A',
                templateUrl: 'znk/system/shared/templates/testSlideDrv.html',
                transclude: true,
                scope: {
                    examId: "=",
                    diagnostic: "=",
                    examIdDefault: "&",
                    onPopupExamDisable: "&",
                    onChangeTrianglePos: "&",
                    onChangeExam: "&",
                    isHome: "@"
                },
                link: function (scope) {

                    var calcPosObj = {};
                    var examWithResultsCopy;


                    scope.goToExam = function(exam) {
                        if(angular.isDefined(scope.isHome)) {
                            $state.go("app.examPage", { id: exam.id, status: scope.diagnostic.status });
                        } else {
                            scope.clickOnActive(exam);
                        }
                    };


                    scope.onCalcHandler = function(calcScope) {
                        calcPosObj[calcScope.$parent.exam.id] = calcScope.calcPosition;
                    };

                    function isExamSectionFinished(exam, isFree) {

                        var isSectionFinished = false;

                        if((!isFree && !scope.hasSubscription) || angular.isUndefined(exam) || angular.isDefined(exam.writeScore) || angular.isDefined(exam.mathScore) || angular.isDefined(exam.readScore))  {
                           isSectionFinished = true;
                        }


                        return isSectionFinished;
                    }

                    ExamSrv.getAllExams().then(function(exams){

                        $log.log("testSlideDrv: inside: test exam: ", exams);

                        scope.examIdDefault( { id: exams[0].id} );


                        var resultsProm = [];
                        exams.map(function (exam) {
                            resultsProm.push(ExamResultSrv.get(exam.id));
                        });

                        $q.all(resultsProm).then(function(examWithResults){

                            examWithResultsCopy = angular.copy(examWithResults);

                            exams.forEach(function(exam, index){

                                PurchaseContentSrv.isFreeExam(exam.id).then(function(isFree) {
                                    exam.isFree = isFree;
                                });

                                if(scope.examId) {
                                    if(scope.examId == exam.id) {
                                        $timeout(function() {
                                            scope.onChangeTrianglePos( { left: calcPosObj[exam.id] } );
                                        });
                                        exam.isActive = true;
                                        if(!isExamSectionFinished(examWithResultsCopy[index-1], (exams[index-1]) ? exams[index-1].isFree : false )) {
                                            scope.onPopupExamDisable({ type: 'test' });
                                        }
                                    } else {
                                        exam.isActive = false;
                                    }
                                }

                                examWithResults.forEach(function(examResult){
                                    if(examResult.examId === exam.id){
                                        exam.isComplete = examResult.isComplete || false;
                                        exam.score = examResult.score || 0;
                                    }
                                });

                            });
                            scope.exams = exams;
                        });
                    });

                    scope.clickOnActive = function(examActive) {

                        scope.exams.forEach(function(exam, index){

                            if(examActive.id === exam.id) {
                                if(!isExamSectionFinished(examWithResultsCopy[index-1], (scope.exams[index-1]) ? scope.exams[index-1].isFree : false )) {
                                    $timeout(function () {
                                        scope.onPopupExamDisable({ type: 'test' });
                                    });
                                }
                            }

                            exam.isActive = false;

                        });

                        examActive.isActive = true;


                        scope.onChangeTrianglePos( {  left: calcPosObj[examActive.id]  } );
                        scope.onChangeExam({ exam : examActive});

                    };



                    IapSrv.getSubscription()
                        .then(function(hasSubscription){
                            scope.hasSubscription = hasSubscription;
                        });

                    scope.$on(IapSrv.SUBSCRIPTION_PURCHASED_EVENT,function(){
                        scope.hasSubscription = true;
                    });

                }
            };
        }
    ]);
})(angular);
