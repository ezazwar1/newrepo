'use strict';

(function (angular) {

    angular.module('znk.sat').factory('ExerciseProgressSrv', ['StorageSrv', 'OfflineContentSrv', '$q', ExerciseProgressSrv]);

    function ExerciseProgressSrv(StorageSrv, OfflineContentSrv, $q) {

        var progressPath = StorageSrv.appUserSpacePath.concat(['exerciseProgress']);

        function getExerciseProgress() {

            return StorageSrv.get(progressPath).then(function (progress) {
                if (!Object.keys(progress).length) {
                    progress = {
                        daily: {
                            id: 1,
                            started: false,
                            completedIds: [],
                            nextIds: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
                        },
                        exam: {
                            activeIds: [7],
                            completedIds: [],
                            nextIds: [8, 6, 9]
                        },
                        drill: {
                            completedIds: []
                        },
                        tutorial: {
                            completedIds: []
                        }
                    };

                    return updateProgress(progress);
                }

                return progress;
            }).then(function(progress){
                // HACK: firebase doesn't store empty array, so until we actually have something inside this is what we do..
                progress.daily.completedIds = progress.daily.completedIds || [];
                progress.daily.nextIds = progress.daily.nextIds || [];
                progress.exam.activeIds = progress.exam.activeIds || [];
                progress.exam.completedIds = progress.exam.completedIds || [];
                progress.exam.nextIds = progress.exam.nextIds || [];
                progress.drill = progress.drill || {completedIds: []};
                progress.tutorial = progress.tutorial || {completedIds: []};

                return progress;
            });

        }

        function updateProgress(newProgress) {
            return StorageSrv.set(progressPath, newProgress).then(function () {
                return newProgress;
            });
        }

        function getDailyProgress() {
            return getExerciseProgress().then(function (progress) {
                return angular.copy(progress.daily);
            });
        }

        function continueToNextDaily() {
            return getExerciseProgress().then(function (progress) {
                progress.daily.completedIds.push(progress.daily.id);
                // shift() will return undefined if we're out of dailies, should this remain the desired behavior?
                progress.daily.id = progress.daily.nextIds.shift() || null;
                progress.daily.started = false;
                updateProgress(progress);

                return angular.copy(progress.daily);
            });
        }

        function getDailiesNum(){
            return OfflineContentSrv.getExerciseOrder().then(function(exerciseOrder){
                return exerciseOrder.dailyCount;
            });
        }

        function getActiveExamIds() {
            return getExerciseProgress().then(function (progress) {
                return progress.exam.activeIds.slice(0);
            });
        }

        function getCompletedExamIds() {
            return getExerciseProgress().then(function (progress) {
                return progress.exam.completedIds.slice(0);
            });
        }

        function getCompletedTutorialIds() {
            return getExerciseProgress().then(function (progress) {
                return progress.tutorial.completedIds.slice(0);
            });
        }

        function getOldestActiveExamId() {
            return getExerciseProgress().then(function (progress) {
                if (progress.exam.activeIds.length) {
                    return progress.exam.activeIds[0];
                }

                // by design
                return undefined;
            });
        }

        function activateNewExam(examId) {
            return getExerciseProgress().then(function (progress) {
                var nextId;

                if (angular.isDefined(examId)) {
                    var index = progress.exam.nextIds.indexOf(examId);
                    if (index > -1) {
                        nextId = examId;
                        progress.exam.nextIds.splice(index, 1);
                    }
                } else {
                    nextId = progress.exam.nextIds.shift();
                }

                if (angular.isDefined(nextId)) {
                    progress.exam.activeIds.push(nextId);
                    updateProgress(progress);
                }

                return nextId;
            });
        }

        function markExamAsCompleted(examId) {
            var prog;
            return getExerciseProgress().then(function (progress) {
                prog = progress;
                var index = progress.exam.completedIds.indexOf(examId);

                if (index < 0) {
                    progress.exam.completedIds.push(examId);

                }

                index = progress.exam.nextIds.indexOf(examId);
                if (index !== -1) {
                    progress.exam.nextIds.splice(index,1);
                }

                index = progress.exam.activeIds.indexOf(examId);
                if(index !== -1){
                    progress.exam.activeIds.splice(index,1);
                }
                return updateProgress(prog);
            }).then(function(progress){
                // make sure we have at least one active exam
                if(!progress.exam.activeIds.length){
                    return activateNewExam();
                }
            }).then(function () {
                return angular.copy(prog.exam);
            });
        }

        function markDrillAsCompleted(drillId) {
            return getExerciseProgress().then(function (progress) {
                var index = progress.drill.completedIds.indexOf(drillId);

                if (index < 0) {
                    progress.drill.completedIds.push(drillId);
                    updateProgress(progress);
                }

                return angular.copy(progress.drill);
            });
        }

        function markTutorialAsCompleted(tutroialID) {
            return getExerciseProgress().then(function (progress) {
                var index = progress.tutorial.completedIds.indexOf(tutroialID);

                if (index < 0) {
                    progress.tutorial.completedIds.push(+tutroialID);
                    updateProgress(progress);
                }

                return angular.copy(progress.tutorial);
            });
        }

        function getDrillProgress() {
            return getExerciseProgress().then(function (progress) {
                return angular.copy(progress.drill);
            });
        }

        function getExamProgress(){
            return getExerciseProgress().then(function (progress) {
                return angular.copy(progress.exam);
            });
        }

        function setActiveDaily(activeDailyOrder){
            $q.all([getExerciseProgress(),getDailiesNum()]).then(function(res){
                var exerciseProgress = res[0];
                var dailyProgress = exerciseProgress.daily;
                var dailiesNum = res[1];

                dailyProgress.nextIds = [];
                dailyProgress.completedIds = [];

                for(var i=1; i <= dailiesNum; i++){
                    dailyProgress.nextIds.push(i);
                }

                if(!activeDailyOrder){
                    activeDailyOrder = dailiesNum + 1;
                }

                dailyProgress.completedIds = dailyProgress.nextIds.splice(0,activeDailyOrder-1);
                dailyProgress.id = dailyProgress.nextIds.shift() || null;
                updateProgress(exerciseProgress);
            });
        }

        return {
            getDailyProgress: getDailyProgress,
            continueToNextDaily: continueToNextDaily,
            getDailiesNum: getDailiesNum,
            getActiveExamIds: getActiveExamIds,
            getCompletedExamIds: getCompletedExamIds,
            getOldestActiveExamId: getOldestActiveExamId,
            markExamAsCompleted: markExamAsCompleted,
            markDrillAsCompleted: markDrillAsCompleted,
            getDrillProgress: getDrillProgress,
            markTutorialAsCompleted: markTutorialAsCompleted,
            getCompletedTutorialIds: getCompletedTutorialIds,
            getExamProgress: getExamProgress,
            setActiveDaily: setActiveDaily
        };
    }

})(angular);
