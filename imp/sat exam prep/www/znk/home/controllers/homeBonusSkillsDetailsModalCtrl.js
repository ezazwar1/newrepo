(function (angular) {
    'use strict';

    angular.module('znk.sat').controller('HomeBonusSkillsDetailsModalCtrl', [
        '$scope', 'position', 'FlashcardSrv', 'bonusSkillId', '$q', 'MobileSrv', 'BonusSkillSrv', '$state', 'drill',
        function ($scope, position, FlashcardSrv, bonusSkillId, $q, MobileSrv, BonusSkillSrv, $state, drill) {
            $scope.d = {
                screenWidth: MobileSrv.getScreenWidth(),
                isMobile: MobileSrv.isMobile(),
                drill: drill
            };

            var TABLET_TOP_ALIGNMENT = 170;
            var MOBILE_TOP_ALIGNMENT = 105;
            var topAlignment = $scope.d.isMobile ? MOBILE_TOP_ALIGNMENT : TABLET_TOP_ALIGNMENT;

            var TABLET_LEFT_ALIGNMENT = -28;
            var MOBILE_LEFT_ALIGNMENT = -33;
            var leftAlignment = $scope.d.isMobile ? MOBILE_LEFT_ALIGNMENT : TABLET_LEFT_ALIGNMENT;

            $scope.d.style = {
                top: position.top + topAlignment ,
                left: position.left + leftAlignment
            };

            var getFlashcardsExerciseProm = BonusSkillSrv.getBonusSkillFlashcards(bonusSkillId,true);
            getFlashcardsExerciseProm.then(function(flashcardExercise){
                return flashcardExercise && flashcardExercise.isCompleted;
            }).then(function(isFlashcardsCompleted){
                $scope.d.isFlashcardsCompleted = isFlashcardsCompleted;
            });
            $scope.d.openFlashcards = function(){
                var getFlashcardsExerciseProm = BonusSkillSrv.getBonusSkillFlashcards(bonusSkillId);
                getFlashcardsExerciseProm.then(function(flashcardExercise){
                    defer.resolve(flashcardExercise.cards);
                },function(res){
                    defer.reject(res);
                });
                //firebase promise seems to cause problem when it used inside $q.all
                var defer = $q.defer();
                var flashcardModalInstance = FlashcardSrv.openFlashcardsModal(defer.promise);
                $scope.close(flashcardModalInstance);
            };

            $scope.d.openDrill = function(){
                $scope.close();
                $state.go('app.drill',{id: drill.id});
            };
        }
    ]);
})(angular);
