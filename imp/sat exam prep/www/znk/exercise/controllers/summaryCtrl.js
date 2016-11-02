
(function (angular) {
    'use strict';

    angular.module('znk.sat').controller('SummaryCtrl', ['$state', '$scope', '$timeout', 'HintSrv', 'EnumSrv','QuestionUtilsSrv', 'MobileSrv', '$ionicHistory', 'PersonalizationStatsSrv', 'CategorySrv', 'SubjectEnum', 'EstimatedScoreSrv', SummaryCtrl]);
    function SummaryCtrl($state, $scope, $timeout, HintSrv, EnumSrv, QuestionUtilsSrv, MobileSrv, $ionicHistory, PersonalizationStatsSrv, CategorySrv, SubjectEnum, EstimatedScoreSrv) {

        var watchSummaryHint = $scope.$watch('injections.exerciseArgs && (!injections.exerciseArgs.xpPointsEnabled || injections.exerciseArgs.xpPoints !== "undefined")',function(newValue) {
                if(newValue){
                    $timeout(function(){
                        HintSrv.triggerSummaryHint();
                        watchSummaryHint();
                    });
                }
            });

        $scope.d = {
            exerciseTypes: EnumSrv.exerciseType,
            isMobile : MobileSrv.isMobile(),
            categoryNameLen: 18,
            summary: {
                correct: 0,
                wrong: 0,
                notAnswered: 0,
                avgCorrect: 0,
                avgWrong: 0,
                avgUnanswered: 0
            },
            gauge:{
                radius: 55,
                stroke : 5
            },
            subjectEnum: SubjectEnum.getEnumArr()
        };

        if($scope.d.isMobile){
            $scope.d.gauge.radius =  43;
            $scope.d.gauge.stroke =  3;
            $scope.d.categoryNameLen = 17;
        }

        $scope.d.categories = CategorySrv.getGeneralCategoriesMapping();

        $scope.injections.questions.map(function (question, index) {
            var answer = $scope.injections.results[index];
            var isAnswered = angular.isDefined(question.answerTypeId === 0 ? answer.userAnswerId : answer.userAnswerText);
            var isAnsweredCorrectly = QuestionUtilsSrv.isAnswerCorrect(question,answer);

            if (isAnsweredCorrectly) {
                $scope.d.summary.correct++;
                $scope.d.summary.avgCorrect+=(answer.timeSpent || 0);

            } else if (isAnswered && !isAnsweredCorrectly) {
                $scope.d.summary.wrong++;
                $scope.d.summary.avgWrong+=(answer.timeSpent || 0);
            } else {
                $scope.d.summary.notAnswered++;
                $scope.d.summary.avgUnanswered+=(answer.timeSpent || 0);
            }
        });

        PersonalizationStatsSrv.getPerformanceData().then(function(res){
            $scope.d.performanceData = res;

            $scope.d.performenceChart = {
                labels:   ['Correct','Wrong','Unanswered'],
                data: [ $scope.d.summary.correct,
                        $scope.d.summary.wrong,
                        $scope.d.summary.notAnswered],
                title: ''
            };

            var subjectCategories = $scope.d.performanceData[$scope.injections.subjectId].category;
            for(var i=0; i<subjectCategories.length; i++){
                subjectCategories[i] = PersonalizationStatsSrv.setCategoryLevel(subjectCategories[i]);
            }

            $scope.d.performanceData.singleSubjectCategory = ($scope.d.performanceData[$scope.injections.subjectId].category.length === 1) ? true : false;

            var peformanceSubject = $scope.d.performanceData[$scope.injections.subjectId];
            peformanceSubject.levelProgress = peformanceSubject.overall.value;
            peformanceSubject = PersonalizationStatsSrv.setCategoryLevel(peformanceSubject);


        });

        EstimatedScoreSrv.getSubjectsDelta($scope.injections.subjectId).then(function(subjectDelta){
            $scope.d.subjectsDelta = subjectDelta.delta;
        });

        $scope.d.goBack = function goHome() {
            if($scope.d.goBack.called){
                return;
            }
            $scope.d.goBack.called = true;

            if($ionicHistory.backView()){
                $ionicHistory.goBack();
            }else{
                $state.go('app.home');
            }
        };
    }

})(angular);
