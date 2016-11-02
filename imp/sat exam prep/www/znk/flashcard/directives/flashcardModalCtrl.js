(function (angular) {
    'use strict';

    angular.module('znk.sat').controller('FlashcardModalCtrl', [
        '$scope', '$rootScope', 'exerciseFlashcardsIds', 'FlashcardSrv', 'EnumSrv', '$timeout', '$q', 'flashcardsConfig', '$analytics', 'exerciseEventsConst', 'HintSrv', 'expRulesConst',
        function ($scope, $rootScope, exerciseFlashcardsIds, FlashcardSrv, EnumSrv, $timeout, $q, flashcardsConfig, $analytics, exerciseEventsConst, HintSrv, expRulesConst) {
            var getFlashcardsIdsArrProm = $q.when(exerciseFlashcardsIds);
            $scope.d = {};

            function setCurrCard(currFlashcard){
                //was added in order to render the same question when there is only 1 flashcard
                if(exerciseFlashcardsIds && exerciseFlashcardsIds.length === 1){
                    $timeout(function(){
                        $scope.d.renderedCards = [currFlashcard];
                    });
                }else{
                    $scope.d.renderedCards = [currFlashcard];
                }
                $scope.d.hideActions = false;
            }

            var getFlashcardsContentProm = FlashcardSrv.getFlashcardsContent(exerciseFlashcardsIds.slice(0,1),true);
            getFlashcardsContentProm.then(function(flashCards){
                if(flashCards && flashCards.length && flashCards[0]){
                    setCurrCard(flashCards[0]);
                }
            },function(err){
                throw 'FlashcardModalCtrl flashcard is missing ' + err;
            });

            $scope.d.cardsIds = exerciseFlashcardsIds;
            $scope.d.currIndex = exerciseFlashcardsIds.length ? 0 : -1;

            function calculateIndexAndReorder(index){
                //reorder flashcards
                if(exerciseFlashcardsIds && exerciseFlashcardsIds.length && (index % exerciseFlashcardsIds.length === 0)){
                    getFlashcardsIdsArrProm = FlashcardSrv.getFlashcardsStatus()
                        .then(function(flashcardsStatus){
                            exerciseFlashcardsIds.sort(function(flashcardId1,flashcardId2){
                                var flashcard1 = flashcardsStatus[FlashcardSrv.getFlashcardStatusKeyProp(flashcardId1)];
                                var flashcard2 = flashcardsStatus[FlashcardSrv.getFlashcardStatusKeyProp(flashcardId2)];
                                if((!flashcard1 && !flashcard2) ||//both statuses not exists
                                    (flashcard1 && flashcard2 && flashcard1.status === flashcardId2.status)){
                                    return 0;
                                }
                                switch(flashcard1.status){
                                    case undefined:
                                        return 1;
                                    case EnumSrv.flashcardStatus.keep.enum:
                                        return -1;
                                    case EnumSrv.flashcardStatus.remove.enum:
                                        return flashcard2.status === EnumSrv.flashcardStatus.keep.enum ? 1 : -1;
                                }
                            });
                            return exerciseFlashcardsIds;
                        });
                }
                return exerciseFlashcardsIds.length ? index % exerciseFlashcardsIds.length : -1;
            }

            var isSwitchingCards;
            $scope.d.cardDestroyed = function(status){
                if(isSwitchingCards){
                    return;
                }

                if(status === EnumSrv.flashcardStatus.remove.enum && flashcardsConfig.deleteCardFromArrOnRemove){
                    exerciseFlashcardsIds.splice($scope.d.currIndex,1);
                    $scope.d.currIndex = calculateIndexAndReorder($scope.d.currIndex);
                }else{
                    $scope.d.currIndex = calculateIndexAndReorder(++$scope.d.currIndex);
                }

                var getFlashcardContentProm;
                if(exerciseFlashcardsIds.length){
                    getFlashcardContentProm = getFlashcardsIdsArrProm.then(function(exerciseFlashcardsIds){
                        var flashcardIdToLoad = exerciseFlashcardsIds[$scope.d.currIndex];
                        return FlashcardSrv.getFlashcardsContent(flashcardIdToLoad,true);
                    });
                }else{
                    getFlashcardContentProm = $q.when(null);
                }

                $scope.d.renderedCards.pop();
                getFlashcardContentProm.then(function(currFlashcard){
                    if(currFlashcard){
                        setCurrCard(currFlashcard);
                    }
                    isSwitchingCards = false;
                });
            };

            function setFlashcardStatus(status){
                var flashcardId = exerciseFlashcardsIds[$scope.d.currIndex];

                $analytics.eventTrack('flashcard-status-set', {
                    category: 'flashcards',
                    eventType: 'click-' + ((EnumSrv.flashcardStatus.remove.enum === status) ? 'removed' : 'saved'),
                    label: '' + flashcardId
                });

                var currentRenderedCard = $scope.d.renderedCards[0];

                if(currentRenderedCard.__status && currentRenderedCard.__status.status === status){
                    $scope.d.cardDestroyed();
                    return;
                }
                var setFlashcardStatusProm = FlashcardSrv.setFlashcardStatus(status,flashcardId);
                return setFlashcardStatusProm.then(function(newStatus){
                    currentRenderedCard.__status = newStatus;
                    $scope.d.cardDestroyed(status);
                });
            }
            $scope.d.removeCard = setFlashcardStatus.bind(FlashcardSrv,EnumSrv.flashcardStatus.remove.enum);
            $scope.d.keepCard = setFlashcardStatus.bind(FlashcardSrv,EnumSrv.flashcardStatus.keep.enum);

            $scope.d.swipeStart = function(){
                $scope.d.hideActions = true;
                $scope.d.countSwipes--;


                if($scope.d.cardsIds.length === ($scope.d.currIndex+1)){
                    HintSrv.triggerHint('flashCards_' + flashcardsConfig.dailyOrder, angular.noop, false).then(function(isPointsAdd){
                        //broadcast that flashCards was finish
                        if(angular.isUndefined(isPointsAdd)){
                            $rootScope.$broadcast(exerciseEventsConst.flashCard,{});
                            $scope.d.practiceScore =  expRulesConst.flashCard.complete;
                        }
                        else{
                            $scope.d.practiceScore = undefined;
                        }
                    });
                }
            };

            $scope.d.countSwipes = $scope.d.cardsIds.length;
            $scope.d.practiceAgain = function(){
                    $scope.d.countSwipes = $scope.d.cardsIds.length;
            };

        }
    ]);
})(angular);
