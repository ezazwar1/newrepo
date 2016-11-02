(function (angular) {
    'use strict';

    angular.module('znk.sat').controller('HomeDailyDetailsModalCtrl', [
        '$scope', '$state', 'EnumSrv', 'MobileSrv', '$window', 'HomeItemStatusEnum', 'FlashcardSrv', 'HintSrv',
        function ($scope, $state, EnumSrv, MobileSrv, $window, HomeItemStatusEnum, FlashcardSrv, HintSrv) {
            $scope.d = {
                screenWidth: $window.innerWidth,
                screenHeight: $window.innerHeight,
                isMobile: MobileSrv.isMobile(),
                showNewUserIntro: false
            };

                HintSrv.triggerHint('new-user-daily-intro', angular.noop, false).then(function(dailyIntro){
                if(angular.isUndefined(dailyIntro)){
                    $scope.d.showNewUserIntro = true;
                }
            });

            $scope.pos.top += $scope.d.isMobile ? 14 : 180;
            if($scope.pos.top < 0){
                $scope.pos.top = 0;
            }

            $scope.pos.left += $scope.d.isMobile ? -27 : -140;
            if($scope.daily.status === HomeItemStatusEnum.ACTIVE.enum){//  $scope.daily.isStarted && !$scope.daily.isCompleted){
                $scope.pos.left += $scope.d.isMobile ? 7 : 10;
            }

            var subjectEnumMap = EnumSrv.subject;
            $scope.d.subjectEnumMap = {};
            $scope.d.subjectEnumMap[subjectEnumMap.math.enum] = 'math-bg';
            $scope.d.subjectEnumMap[subjectEnumMap.reading.enum] = 'reading-bg';
            $scope.d.subjectEnumMap[subjectEnumMap.writing.enum] = 'writing-bg';

            $scope.exerciseClick = function(stateName,id){
                if(stateName === 'flashcards'){
                    var flashcardModalInstance = FlashcardSrv.openFlashcardsModal($scope.daily.flashcards.cards, {}, $scope.daily.dailyOrder);
                    $scope.close(flashcardModalInstance);
                }else{
                    $scope.close();
                    $state.go(stateName,{id: id || $scope.daily.dailyOrder});
                }
            };
        }
    ]);
})(angular);
