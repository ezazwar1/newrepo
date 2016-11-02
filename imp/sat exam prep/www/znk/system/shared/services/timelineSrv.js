(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('TimelineSrv', ['EnumSrv', 'EstimatedScoreSrv', '$q', '$timeout', function(EnumSrv, EstimatedScoreSrv, $q, $timeout) {

        var TimelineSrv = {};

        var timelineImages = {
            drill: 'assets/img/svg/icons/timeline-drills-icon.svg' ,
            game: 'assets/img/svg/icons/timeline-mini-challenge-icon.svg' ,
            tutorial: 'assets/img/svg/icons/timeline-tips-tricks-icon.svg' ,
            section: 'assets/img/svg/icons/timeline-diagnostic-test-icon.svg' ,
            practice: 'assets/img/svg/icons/timeline-test-icon.svg'
        };

        TimelineSrv.getImages = function() {

            var imgObj = {};

            for(var key in EnumSrv.exerciseType) {
                if(EnumSrv.exerciseType.hasOwnProperty(key)) {
                    imgObj[EnumSrv.exerciseType[key].enum] = { icon: timelineImages[key] };
                }
            }

            return imgObj;
        };

        TimelineSrv.getEstimatedScores = function(exerciseId, subjectId) {

            var deferred = $q.defer();
            var _this = this;

            $timeout(function() {
                _this._getEstimetedScoresCallback(exerciseId, subjectId, function (estimatedScores) {
                    deferred.resolve(estimatedScores);
                });
            });

            return deferred.promise;

        };


        TimelineSrv._getEstimetedScoresCallback = function(exerciseId, subjectId, cb) {

            var dirty = false;
            var _this = this;

            EstimatedScoreSrv.getEstimatedScores().then(function(estimatedScores) {
                 angular.forEach(estimatedScores[subjectId], function(value) {
                     if(value.exerciseId === exerciseId) {
                         dirty = true;
                     }
                 });

                 if(dirty) {
                         cb(estimatedScores);
                 } else {
                     $timeout(function() {
                         _this._getEstimetedScoresCallback(exerciseId, subjectId, cb);
                     }, 25);
                 }
            });
        };

        return TimelineSrv;

    }]);

})(angular);
