'use strict';

(function(angular) {

    angular.module('znk.sat').factory('PracticeSrv', ['OfflineContentSrv', 'PersonalizationSrv', PracticeSrv]);

    function PracticeSrv(OfflineContentSrv, PersonalizationSrv) {
        var get = function get (id) {
            return OfflineContentSrv.getPractice(id).then(function (practice) {
                return practice;
            });
        };

        function getPersonalizedPracticeQuestions(practiceId){
            return PersonalizationSrv.getPersonalizedPracticeQuestions(practiceId);
        }
        return {
            get: get,
            getPersonalizedPracticeQuestions: getPersonalizedPracticeQuestions
        };
    }

})(angular);
