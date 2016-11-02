'use strict';
/*
   child of app.examPage - examPageTestsCtrl
 */
(function (angular) {
    angular.module('znk.sat').controller('ExamPageCtrl', ['$scope', '$stateParams', 'ExamSrv', 'ScoringSrv', 'ExerciseResultSrv', 'ExamResultSrv', 'MobileSrv', 'PurchaseContentSrv', 'IapSrv', '$q', '$timeout', '$state', 'EnumSrv', 'StoreRateSrv', 'AppRateStatusEnum', ExamPageCtrl]);

    function ExamPageCtrl($scope, $stateParams, ExamSrv, ScoringSrv, ExerciseResultSrv, ExamResultSrv, MobileSrv, PurchaseContentSrv, IapSrv, $q, $timeout, $state, subjectEnum, StoreRateSrv, AppRateStatusEnum) {

        $scope.triangle = {};

        var lastExam = parseInt($stateParams.id);

        var _sectionIdDictionary = {}, _sectionDataArray = [];

        /* helper functions for upadteTest */
        function updateSection(resultKey) {
            return ExerciseResultSrv.getByKey(resultKey).then(function (result) {
                var data = _sectionIdDictionary[result.exerciseId];
                data.isComplete = result.isComplete;
                data.isStarted = angular.isDefined(result.startedTime);
                data.score = result.score;
                if (result.duration) {
                    data.timeLeft = Math.floor((data.time - result.duration) / (1000 * 60));
                }

                result.questionResults.forEach(function (questionResult) {
                    if (angular.isDefined(questionResult.userAnswerId) ||
                        angular.isDefined(questionResult.userAnswerText)) {
                        data.answeredCount++;
                    }
                    if(angular.isDefined(questionResult.isAnsweredCorrectly) && questionResult.isAnsweredCorrectly) {
                        data.correctAnswersCount++;
                    }
                });

                if (data.isComplete) {
                    if(!$scope.d.avgTime) { $scope.d.avgTime = {}; }
                    if(!$scope.d.avgTime[data.subjectId]) { $scope.d.avgTime[data.subjectId] = 0; }
                    $scope.d.avgTime[data.subjectId] += result.duration / result.questionResults.length;
                    $scope.d.showSubjectScores = true;
                    $scope.d.newData = data;
                }
            });
        }

        function facebookShare(score) {
            if(score) {
                $scope.d.facebookShare = {
                    description : 'Hurray! I completed a full SAT simulation on Zinkerz SAT​ app and got '+score+'.' +
                    ' Think you can do better? Download the app and check http://zinkerz.com/sat/#zinkerz',
                    link: 'http://zinkerz.com/sat/#zinkerz',
                    picture: 'www/assets/img/share/sat-post-test-score.png',
                    className: ionic.Platform.isIOS() ? 'ion-ios-upload-outline' : 'ion-android-share-alt'
                }
            } else {
                $scope.d.facebookShare = false;
            }
        }

        function updateSubjectsAndTotalScore(examResult) {

            var data = {};

            data.subjectScores = {};
            data.subjectScores[subjectEnum.subject.math.enum] = examResult.mathScore || false;
            data.subjectScores[subjectEnum.subject.reading.enum] = examResult.readScore || false;
            data.subjectScores[subjectEnum.subject.writing.enum] = examResult.writeScore || false;
            data.score = examResult.score || false;

            facebookShare(data.score);

            return data;
        }

        function accordionHandler() {
            if($scope.d.isMobile) {
                for(var prop in $scope.d.generalScores.subjectScores) {
                    if(!$scope.d.generalScores.subjectScores[prop]) {
                        $scope.d.accordion.expand(prop);
                    } else {
                        $scope.d.accordion.collapse(prop);
                    }
                }
            }
        }

        function textPopup(type) {
            switch(type) {
                case 'test':
                    $scope.d.openPopup = 'In order to unlock this test, complete at least one subject on the previous test.';
                break;
                case 'diagnostic':
                    $scope.d.openPopup = 'To access this test, finish your diagnostic test.';
                break;
                case 'close':
                    $scope.d.openPopup = void(0);
                break;
            }
        }

        /* define initial data for test */

        $scope.subjects = [{
            id: 0,
            name: 'Mathematics'
        },
            {
                id: 1,
                name: 'Reading'
            },
            {
                id: 2,
                name: 'Writing'
            }];

        $scope.d = {
            isMobile: MobileSrv.isMobile(),
            examReady: false,
            accordion: {}
        };

        $scope.d.examInfo = { examId: $stateParams.id, diagnosticObj: { status: $stateParams.status} };

        $scope.d.avgTimeToDate = function(subjectId) {
            var avg = $scope.d.avgTime[subjectId];
            var date = new Date(avg*1000);
            var seconds = date.getSeconds();
            return seconds+ 'sec';
        };

        var getAppRateStatusProm = StoreRateSrv.getAppRateStatus();
        /* the updateTest call loads the test, getting called every time someone clicks on the nav above */

        function updateTest(exam) {

            textPopup('close');
            _sectionIdDictionary = {};

            $scope.d.examReady = false;
            $scope.d.animateScore = true;

            $scope.examId = (exam) ? exam.id : $stateParams.id;
            $scope.inIntro = { in: true };
            $scope.d.sectionsData = [];

            function loadMocking() {

                var data;
                var subjectInc = 0;
                var subjectArray = [];

                for(var i = 0, ii = 9; i < ii; i++) {

                    data = {
                        id: i,
                        isMocking: true,
                        subjectId: (i % 3 === 0 && i !== 0) ? subjectInc = subjectInc+1 : subjectInc
                    };

                    subjectArray.push(data);
                }

                $scope.d.sectionsData = subjectArray;
                $scope.d.examReady = true;
            }

            loadMocking();

            if ($scope.examId !== undefined) {
                if(parseInt($stateParams.status) !== 2) {
                    textPopup('diagnostic');
                    return;
                }
                /* change the state param to neew exam for ionic back history button */
                $state.go('app.examPage', {id: $scope.examId, status: $stateParams.status }, {notify: false});

                ExamSrv.markAsSeen($scope.examId);
                ExamSrv.get($scope.examId).then(function (exam) {

                    _sectionDataArray = [];

                    $scope.examName = exam.name;

                    exam.sections.forEach(function (section) {

                        var data = {
                            id: section.id,
                            subjectId: section.subjectId,
                            time: section.time,
                            timeLeft: Math.floor(section.time / (1000 * 60)),
                            questionsCount: section.questions.length,
                            answeredCount: 0,
                            correctAnswersCount: 0
                        };

                        _sectionIdDictionary[data.id] = data;
                        _sectionDataArray.push(data);

                        PurchaseContentSrv.isFreeSection(exam.id,section.id).then(function(isFree){
                            data.isFree = isFree;
                        });
                    });

                    ExamResultSrv.get($scope.examId).then(function (examResult) {

                        if (angular.isDefined(examResult.examId)) {

                            var updateSectionPromArr = [];

                            $scope.d.avgTime = {};

                            for (var sectionId in examResult.sectionResults) {
                                updateSectionPromArr.push(updateSection(examResult.sectionResults[sectionId]));
                            }

                            $q.all(updateSectionPromArr).then(function(){

                                $scope.d.generalScores = updateSubjectsAndTotalScore(examResult);

                                $scope.d.sectionsData = _sectionDataArray;

                                $q.all([getAppRateStatusProm,getSubscriptionProm]).then(function(all){
                                    var status = all[0];
                                    var hasSubscription = all[1];

                                    PurchaseContentSrv.isFreeApp($scope.examId).then(function(isFree) {
                                        if (!isFree){
                                            if(!hasSubscription && (!status || status === AppRateStatusEnum.later.enum)){
                                                for(var i in _sectionDataArray){
                                                    var sectionData = _sectionDataArray[i];
                                                    if(sectionData.isFree && sectionData.isComplete){
                                                        ExamSrv.openRateOpenSectionsPopup().then(function(){
                                                            StoreRateSrv.rate();
                                                        });
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    });
                                });

                                //skip one digest in order to let the dom to be rendered before displaying it
                                $timeout(function(){
                                    $scope.d.animateScore = false;
                                    $scope.d.examReady = true;
                                    accordionHandler();
                                });

                            });

                        } else{

                            $scope.d.generalScores = updateSubjectsAndTotalScore(examResult);

                            $scope.d.sectionsData = _sectionDataArray;

                            $timeout(function(){
                                $scope.d.animateScore = false;
                                $scope.d.examReady = true;
                                accordionHandler();
                            });
                        }

                        $scope.examScore = examResult.score;
                        var scorePropNames = ScoringSrv.getAllSubjectScoreSectionNames();

                        $scope.subjects.forEach(function (subject) {
                            var prop = scorePropNames[subject.id];
                            subject.score = examResult[prop];
                        });
                    });
                });
            }

        }

        /* initial load of test */

        updateTest();


        /* helper functions on the scope, and events */

        var getSubscriptionProm = IapSrv.getSubscription().then(function(hasSubscription){
            $scope.d.hasSubscription = hasSubscription;
            return hasSubscription;
        });

        $scope.$on(IapSrv.SUBSCRIPTION_PURCHASED_EVENT,function(){
            $scope.d.hasSubscription = true;
        });

        $scope.onPopupExamDisable = function(val) {
            textPopup(val);
        };

        $scope.onChangeTrianglePos = function(left) {
            $scope.triangle.left = 'translate3d('+left+'px,0,0)';
            $scope.triangle.display = 'block';
        };

        $scope.onChangeExam = function(exam) {
            if(exam.id !== lastExam) {
                lastExam = exam.id;
                updateTest(exam);
            }
        };

        $scope.goBack = function goBack() {
            $state.go('app.home');
        };

        $scope.$on(PurchaseContentSrv.FREE_CONTENT_CHANGED,function(){
            var keys = Object.keys(_sectionIdDictionary);
            keys.forEach(function(sectionId){
                PurchaseContentSrv.isFreeSection($scope.examId, sectionId).then(function (isFree) {
                    _sectionIdDictionary[sectionId].isFree = isFree;
                });
            });
        });
    }
})(angular);
