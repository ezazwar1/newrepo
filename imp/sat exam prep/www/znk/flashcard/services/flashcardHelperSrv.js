(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('FlashcardHelperSrv', [
        'StorageSrv', '$q', 'EnumSrv', 'OfflineContentSrv', '$rootScope',
        function (StorageSrv, $q, EnumSrv, OfflineContentSrv, $rootScope) {
            var FlashcardHelperSrv = {};

            var flashcardsPath = StorageSrv.appUserSpacePath.concat(['flashcards']);
            function getFlashcards(){
                if(getFlashcards.prom){
                    return getFlashcards.prom;
                }

                var _getFlashcards = StorageSrv.get(flashcardsPath);
                getFlashcards.prom = _getFlashcards.then(function(flashcards){
                    var defaultValues = {
                        cardsStatus:{}
                    };
                    flashcards = angular.extend(defaultValues,flashcards);
                    return flashcards;
                });

                return getFlashcards.prom;
            }

            var childScope = $rootScope.$new(true);
            childScope.$on('auth:logout',function(){//@todo(igor) we need to make general solution for this case
                getFlashcards.prom = null;
            });

            FlashcardHelperSrv.getFlashcardStatusKeyProp = function(id){
                return 'flashcard' + id;
            };

            FlashcardHelperSrv.saveFlashcards = function(){
                return getFlashcards().then(function(newFlashcards){
                    return StorageSrv.syncedSet(flashcardsPath,newFlashcards);
                });
            };

            var keptFlashCards,removedFlashcards,allCards;

            FlashcardHelperSrv.getKeptFlashcards = function(){
                keptFlashCards = removedFlashcards = null;
                if(!keptFlashCards){
                    return getFlashcards().then(function(flashcards){
                        //might be already initialized
                        if(keptFlashCards){
                            return keptFlashCards;
                        }
                        keptFlashCards = [];
                        removedFlashcards = [];
                        var cardStatusEnum = EnumSrv.flashcardStatus;
                        for(var prop in flashcards.cardsStatus){
                            var cardStatus = flashcards.cardsStatus[prop];
                            if(cardStatus.status === cardStatusEnum.keep.enum){
                                keptFlashCards.push('' + cardStatus.id);
                            }else{
                                removedFlashcards.push('' + cardStatus.id);
                            }
                        }
                        return keptFlashCards;
                    });
                }
                return $q.when(keptFlashCards);
            };

            FlashcardHelperSrv.getRemovedFlashcards = function(){
                if(!removedFlashcards){
                    //this function will update both kept and removed flashcards
                    var getKeptFlashcardsProm = FlashcardHelperSrv.getKeptFlashcards();
                    return getKeptFlashcardsProm.then(function(){
                        return removedFlashcards;
                    });
                }
                return $q.when(removedFlashcards);
            };

            FlashcardHelperSrv.getAllFlashcardsIds = function(){
                if(!allCards){
                    var getAllFlashcardIdsProm = OfflineContentSrv.getAllFlashcardIds();
                    return getAllFlashcardIdsProm.then(function(flashcardsIdsArr){
                        allCards = flashcardsIdsArr;
                        return allCards;
                    });
                }
                return allCards;
            };

            FlashcardHelperSrv.getFlashcardsContent = function(idOrIdArr,includeStatus){
                if(includeStatus){
                    var getFlashcardProm = OfflineContentSrv.getFlashcard(idOrIdArr);
                    var allProm = $q.all([getFlashcardProm,getFlashcards()]);
                    return allProm.then(function(res){
                        var flashcardArrOrObject = res[0];
                        var cardsStatus = res[1].cardsStatus;
                        if(angular.isArray(flashcardArrOrObject)){
                            flashcardArrOrObject.forEach(function(flashcard){
                                flashcard.__status = cardsStatus[FlashcardHelperSrv.getFlashcardStatusKeyProp(flashcard.id)];
                            });
                        }else{
                            flashcardArrOrObject.__status = cardsStatus[FlashcardHelperSrv.getFlashcardStatusKeyProp(flashcardArrOrObject.id)];
                        }
                        return flashcardArrOrObject;
                    });
                }else{
                    return OfflineContentSrv.getFlashcard(idOrIdArr);
                }
            };

            FlashcardHelperSrv.getFlashcardsStatus = function(){
                return getFlashcards().then(function(flashcards){
                    return flashcards.cardsStatus;
                });
            };

            FlashcardHelperSrv.setFlashcardStatus = function(status,flashcardId){
                return getFlashcards().then(function(flashcards){
                    if(flashcards.cardsStatus[FlashcardHelperSrv.getFlashcardStatusKeyProp(flashcardId)] && flashcards.cardsStatus[FlashcardHelperSrv.getFlashcardStatusKeyProp(flashcardId)].status === status){
                        return;
                    }

                    var noNeedToRemove;
                    if(!flashcards.cardsStatus[FlashcardHelperSrv.getFlashcardStatusKeyProp(flashcardId)]){
                        noNeedToRemove = true;
                    }

                    var getKeptFlashcardsProm = FlashcardHelperSrv.getKeptFlashcards();
                    return getKeptFlashcardsProm.then(function(keptFlashCards){
                        var removeFromArr,addToArr;
                        if(EnumSrv.flashcardStatus.remove.enum === status){
                            removeFromArr = keptFlashCards;
                            addToArr = removedFlashcards;
                        }else{
                            removeFromArr = removedFlashcards;
                            addToArr = keptFlashCards;
                        }

                        if(!noNeedToRemove){
                            var indexToRemove = removeFromArr.indexOf(flashcardId);
                            //protection in case the index is not in removeFromArr, scenario which should never happen
                            if(indexToRemove !== -1){
                                removeFromArr.splice(indexToRemove,1);
                            }
                        }
                        addToArr.unshift('' + flashcardId);

                        flashcards.cardsStatus[FlashcardHelperSrv.getFlashcardStatusKeyProp(flashcardId)] = {
                            status: status,
                            updateTime: StorageSrv.serverTimeStamp,
                            id: flashcardId
                        };
                        FlashcardHelperSrv.saveFlashcards();

                        return flashcards.cardsStatus[FlashcardHelperSrv.getFlashcardStatusKeyProp(flashcardId)];
                    });

                });
            };

            return FlashcardHelperSrv;
        }
    ]);
})(angular);
