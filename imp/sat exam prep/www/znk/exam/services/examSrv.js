'use strict';

(function () {

    angular.module('znk.sat').factory('ExamSrv', ['$q', 'OfflineContentSrv', 'ExerciseProgressSrv', 'ExamResultSrv', 'EnumSrv', 'StorageSrv', 'HomeItemStatusEnum', '$rootScope', 'PopUpSrv', ExamSrv]);

    function ExamSrv($q, OfflineContentSrv, ExerciseProgressSrv, ExamResultSrv, EnumSrv, StorageSrv, HomeItemStatusEnum, $rootScope, PopUpSrv) {
        var examPath = StorageSrv.appUserSpacePath.concat(['exam']);

        function getExamKeyProp(id) {
            return 'exam' + id;
        }

        function _getExamsData() {
            return StorageSrv.get(examPath).then(function (examsData) {
                var defValues = {
                    exams: {}
                };
                for (var prop in defValues) {
                    if (!examsData.hasOwnProperty(prop)) {
                        examsData[prop] = defValues[prop];
                    }
                }
                return examsData;
            }, function (err) {
                throw err;
            });
        }

        function _saveExamsData(newExamsData) {
            return StorageSrv.set(examPath, newExamsData);
        }

        function getExam(id, getFullData, __dontSave) {
            if (!getFullData) {
                var examKeyProp = getExamKeyProp(id);
                var getExamResultProm = ExamResultSrv.get(id);
                return _getExamsData().then(function (examsData) {
                    var exam = examsData.exams[examKeyProp];
                    var setExamProm;
                    if (!exam) {
                        setExamProm = OfflineContentSrv.getExam(id).then(function(exam){
                            examsData.exams[examKeyProp] = {
                                id: exam.id
                            };
                        });
                    }
                    return $q.all([examsData, getExamResultProm, setExamProm]);
                }).then(function (res) {
                    var examsData = res[0];
                    var examResult = res[1];

                    var exam = examsData.exams[examKeyProp];

                    if(exam.id === 13 && exam.status !== HomeItemStatusEnum.COMPLETED.enum){
                        var sectionStatus = examResult.sectionComplete || {};
                        if(sectionStatus.math && sectionStatus.read && sectionStatus.write){
                            exam.status = HomeItemStatusEnum.COMPLETED.enum;
                        }else{
                            exam.status = HomeItemStatusEnum.ACTIVE.enum;
                        }
                    }


                    if (!__dontSave) {
                        _saveExamsData(examsData);
                    }

                    return exam;
                });
            } else {
                return OfflineContentSrv.getExam(id);
            }
        }

        function getAllExams(getFullData) {
            return OfflineContentSrv.getExamsOrder().then(function (examsOrder) {
                var getExamPromArr = [];
                examsOrder.forEach(function (examOrder) {
                    var getExamProm = getExam(examOrder.examId, getFullData, true);
                    getExamPromArr.push(getExamProm);
                });
                var getExamsDataProm = _getExamsData();
                var getUpdatedExamsProm = $q.all(getExamPromArr);
                var getCompletedIdsProm = ExerciseProgressSrv.getCompletedExamIds();
                return $q.all([getUpdatedExamsProm, getExamsDataProm, getCompletedIdsProm]).then(function (resArr) {
                    var updateExamsArr = resArr[0];
                    var examData = resArr[1];
                    var completedIds = resArr[2];

                    if (getFullData) {
                        return updateExamsArr;
                    }

                    for (var i in updateExamsArr) {
                        var updatedExam = updateExamsArr[i];
                        updatedExam.status = completedIds.indexOf(updatedExam.id) === -1 ? HomeItemStatusEnum.NEW.enum : HomeItemStatusEnum.COMPLETED.enum;
                        var examKeyProp = getExamKeyProp(updatedExam.id);
                        examData.exams[examKeyProp] = angular.copy(updatedExam);
                    }
                    _saveExamsData(examData);
                    return updateExamsArr;
                });
            }, function (err) {
                throw err;
            });
        }

        var get = function get(id) {
            var deferred = $q.defer();

            OfflineContentSrv.getExam(id).then(function (exam) {
                if (exam) {
                    deferred.resolve(exam);
                } else {
                    deferred.reject();
                }
            });

            return deferred.promise;
        };

        function markAsSeen(id) {
            return OfflineContentSrv.neverUpdateRevOf('exam' + id);
        }

        var getCompletedResults = function getCompletedResults() {
            return ExerciseProgressSrv.getCompletedExamIds().then(function (ids) {
                var promises = ids.map(function (examId) {
                    return ExamResultSrv.get(examId);
                });
                return $q.all(promises);
            });
        };

        function getUserExamsAverage(subjectId) {
            var subjectIdToSubjectScore = {};
            subjectIdToSubjectScore[EnumSrv.subject.math.enum] = 'mathScore';
            subjectIdToSubjectScore[EnumSrv.subject.reading.enum] = 'readScore';
            subjectIdToSubjectScore[EnumSrv.subject.writing.enum] = 'writeScore';

            var getCompletedResultsProm = $q.when(getCompletedResults());
            return getCompletedResultsProm.then(function (completedExamsResults) {
                if (!completedExamsResults || !completedExamsResults.length) {
                    return undefined;
                }
                var totalScore = 0;
                completedExamsResults.forEach(function (exam) {
                    if (angular.isDefined(subjectId)) {
                        totalScore += exam[subjectIdToSubjectScore[subjectId]];
                    } else {
                        for (var prop in subjectIdToSubjectScore) {
                            var subjectScorePropName = subjectIdToSubjectScore[prop];
                            totalScore += exam[subjectScorePropName];
                        }
                    }
                });
                return Math.round(totalScore / completedExamsResults.length);
            });
        }

        $rootScope.$on('content:updated', function() {
            _getExamsData().then(function(examsData){
                delete examsData.exams;
                _saveExamsData(examsData);
            })
        });

        function openRateOpenSectionsPopup(){
            var btnArr = [];
            btnArr.push(new PopUpSrv.BaseButton('Rate',null,'rate'));
            btnArr.push(new PopUpSrv.BaseButton('Cancel','btn-outline',null,'cancel'));

            return PopUpSrv.basePopup(
                'rate-open-section',
                'ion-ios-unlocked',
                '',
                'Want to UNLOCK <br>2 more sections for FREE?</br><span class="rate-us-text">Rate us!</span>',
                btnArr
            ).promise;
        }

        return {
            get: get,
            getExam: getExam,
            getAllExams: getAllExams,
            markAsSeen: markAsSeen,
            getUserExamsAverage: getUserExamsAverage,
            openRateOpenSectionsPopup: openRateOpenSectionsPopup
        };
    }

})();
