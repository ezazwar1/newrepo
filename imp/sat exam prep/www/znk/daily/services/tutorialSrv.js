'use strict';

(function(angular) {

    angular.module('znk.sat').factory('TutorialSrv', ['OfflineContentSrv','ExerciseProgressSrv', 'ExerciseResultSrv', '$q', 'EnumSrv', TutorialSrv]);

    function TutorialSrv(OfflineContentSrv, ExerciseProgressSrv, ExerciseResultSrv, $q, EnumSrv) {

        function get (id) {
            return OfflineContentSrv.getTutorial(id).then(function (tutorial) {
                return tutorial;
            });
        }

        function markAsSeen(id) {
            return OfflineContentSrv.neverUpdateRevOf('tutorial' + id);
        }

        function getAll(includeProgress){
            var getTutorialsProm = OfflineContentSrv.getTutorials();

            if(!includeProgress){
                return getTutorialsProm;
            }

            var getCompletedTutorialsProm = ExerciseProgressSrv.getCompletedTutorialIds();
            var allProm = $q.all([getTutorialsProm,getCompletedTutorialsProm]);
            return allProm.then(function(resArr){
                var allTutorials = resArr[0];
                var completedTutorials = resArr[1];

                var updateStatusPromArr = [];
                for(var i in allTutorials){
                    var tutorial = allTutorials[i];
                    if(completedTutorials.indexOf(tutorial.id) !== -1){
                        // anonymous function was added to remain the correct order in which the tutorials updated
                        var updateStatusProm = (function(tutorial){
                            var getResultProm = ExerciseResultSrv.get(EnumSrv.exerciseType.tutorial.enum, tutorial.id);
                            return getResultProm.then(function(tutorialResult){
                                tutorial.status = EnumSrv.entityStatus.completed.enum;
                                tutorial.endedTime = tutorialResult.endedTime;
                            });
                        })(tutorial);
                        updateStatusPromArr.push(updateStatusProm);
                    }else{
                        tutorial.status = EnumSrv.entityStatus.notStarted.enum;
                    }
                }
                var allProm = $q.all(updateStatusPromArr);
                return allProm.then(function(){
                    return allTutorials;
                });
            });
        }

        return {
            get: get,
            markAsSeen: markAsSeen
        };
    }
})(angular);
