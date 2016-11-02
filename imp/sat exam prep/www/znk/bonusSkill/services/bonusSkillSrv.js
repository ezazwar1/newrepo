(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('BonusSkillSrv', [
        'BonusSkillHelperSrv', 'FlashcardSrv', '$q', 'DrillSrv',
        function (BonusSkillHelperSrv, FlashcardSrv, $q, DrillSrv) {
            var BonusSkillSrv = {};

            function _generateBonusSkillDrill(bonusSkillId){
                var getUnusedDrillsProm = BonusSkillHelperSrv.getUnusedDrills(bonusSkillId);
                return getUnusedDrillsProm.then(function(unusedDrillsArr){
                    if(!unusedDrillsArr || !unusedDrillsArr.length){
                        throw 'no unused drills remained';
                    }
                    var unusedDrillLength = unusedDrillsArr.length;
                    var randomIndex = Math.floor(Math.random() * unusedDrillLength);
                    var randomDrillId = unusedDrillsArr.splice(randomIndex,1)[0];
                    BonusSkillHelperSrv.setDrillsAsUsed(randomDrillId);
                    var bonusSkillDrill = {
                        id: randomDrillId
                    };
                    return bonusSkillDrill;
                },function(err){
                    throw err;
                });
            }

            BonusSkillSrv.getBonusSkillDrill = function(bonusSkillId){
                var getBonusSkillDrillProm = BonusSkillHelperSrv.getBonusSkillDrill(bonusSkillId);
                return getBonusSkillDrillProm.then(function(bonusSkillDrill){
                    if(!bonusSkillDrill){
                        var generateBonusSkillDrillProm = _generateBonusSkillDrill(bonusSkillId);
                        return generateBonusSkillDrillProm.then(function(generatedBonusSkillDrill){
                            BonusSkillHelperSrv.saveBonusSkillDrill(bonusSkillId,generatedBonusSkillDrill);
                            return generatedBonusSkillDrill;
                        },function(err){
                            throw err;
                        });
                    }
                    return bonusSkillDrill;
                });
            };

            function _lotCardOutOfCardsArray(generatedCardsArr,cardsArr){
                var randomIndex = Math.floor(Math.random() * cardsArr.length);
                var chosenCardId = cardsArr.splice(randomIndex,1)[0];
                generatedCardsArr.push(chosenCardId);
                return {
                    randomIndex: randomIndex,
                    chosenCardId: chosenCardId
                };
            }

            var GENERATED_KEPT_CARDS = 11;
            var GENERATED_NEW_CARDS = 4;
            var EXERCISE_CARDS_NUM = 15;

            function _generateBonusSkillFlashcards(){
                var generatedFlashcardsExercise = {
                    cards: []
                };
                var getKeptFlashcardsProm = FlashcardSrv.getKeptFlashcards();
                var getNewFlashcardsProm = BonusSkillHelperSrv.getNewFlashcards();
                var getUsedPristineFlashcardsProm = BonusSkillHelperSrv.getUsedPristineFlashcards();
                var getRemovedFlashcardsProm = FlashcardSrv.getRemovedFlashcards();
                var customizedLotCardOutOfCardsArrFn = _lotCardOutOfCardsArray.bind(BonusSkillSrv,generatedFlashcardsExercise.cards);

                var allProm = $q.all([getKeptFlashcardsProm,getNewFlashcardsProm]);
                return allProm.then(function(res){
                    var keptFlashcards = res[0];
                    var newFlashcards = res[1];

                    var i;
                    for(i=0; keptFlashcards.length && i<GENERATED_KEPT_CARDS; i++){
                        customizedLotCardOutOfCardsArrFn(keptFlashcards);
                    }

                    var cardsToSetAsUsed = [];
                    for(i=0; newFlashcards.length && (i<GENERATED_NEW_CARDS || generatedFlashcardsExercise.cards.length < EXERCISE_CARDS_NUM); i++){
                        var randomCardLot = customizedLotCardOutOfCardsArrFn(newFlashcards);
                        cardsToSetAsUsed.push(randomCardLot.chosenCardId);
                    }
                    BonusSkillHelperSrv.setCardsAsUsed(cardsToSetAsUsed);

                    if(generatedFlashcardsExercise.cards.length < EXERCISE_CARDS_NUM){
                        return getUsedPristineFlashcardsProm.then(function(usedPristineFlashcards){
                            while(generatedFlashcardsExercise.cards.length < EXERCISE_CARDS_NUM && usedPristineFlashcards.length){
                                customizedLotCardOutOfCardsArrFn(usedPristineFlashcards);
                            }

                            if(generatedFlashcardsExercise.cards.length < EXERCISE_CARDS_NUM){
                                return getRemovedFlashcardsProm.then(function(removedFlashcards){
                                    while(generatedFlashcardsExercise.cards.length < EXERCISE_CARDS_NUM && removedFlashcards.length){
                                        customizedLotCardOutOfCardsArrFn(removedFlashcards);
                                    }
                                    return generatedFlashcardsExercise;
                                });
                            }else{
                                return generatedFlashcardsExercise;
                            }
                        });
                    }else{
                        return generatedFlashcardsExercise;
                    }
                });
            }
            BonusSkillSrv._generateBonusSkillFlashcards = _generateBonusSkillFlashcards;

            BonusSkillSrv.getBonusSkillFlashcards = function(bonusSkillId,dontGenerateNew){
                var getBonusSkillFlashcards = BonusSkillHelperSrv.getBonusSkillFlashcards(bonusSkillId);
                return getBonusSkillFlashcards.then(function(bonusSkillFlashcards){
                    if(!bonusSkillFlashcards && !dontGenerateNew){
                        var generateBonusSkillFlashcardsProm = _generateBonusSkillFlashcards(bonusSkillId);
                        return generateBonusSkillFlashcardsProm.then(function(generatedBonusSkillFlashcards){
                            BonusSkillHelperSrv.saveBonusSkillFlashcards(bonusSkillId,generatedBonusSkillFlashcards);
                            return generatedBonusSkillFlashcards;
                        });
                    }
                    return bonusSkillFlashcards;
                });
            };

            BonusSkillSrv.isBonusSkillComplete = function(bonusSkillId){
                var getPersonalizedBonusSkillProm = BonusSkillHelperSrv.getPersonalizedBonusSkill(bonusSkillId);
                var getFlashcardsStatusProm = FlashcardSrv.getFlashcardsStatus();

                var allProm = $q.all([getPersonalizedBonusSkillProm,getFlashcardsStatusProm]);
                return allProm.then(function(resArr){
                    var personalizedBonusSkill = resArr[0];
                    var flashcardsStatus = resArr[1];

                    if(!personalizedBonusSkill || !personalizedBonusSkill.drill || !personalizedBonusSkill.flashcards){
                        return false;
                    }

                    if(personalizedBonusSkill.isCompleted){
                        return true;
                    }

                    if(!personalizedBonusSkill.flashcards.isCompleted){
                        var flashcardExerciseCards = personalizedBonusSkill.flashcards.cards;
                        for(var i in flashcardExerciseCards){
                            var flashcardId = flashcardExerciseCards[i];
                            if(!flashcardsStatus[FlashcardSrv.getFlashcardStatusKeyProp(flashcardId)] || angular.isUndefined(flashcardsStatus[FlashcardSrv.getFlashcardStatusKeyProp(flashcardId)].status)){
                                return false;
                            }
                        }
                        personalizedBonusSkill.flashcards.isCompleted = true;
                        BonusSkillHelperSrv.saveBonusSkillFlashcards(bonusSkillId,personalizedBonusSkill.flashcards);
                    }

                    var isDrillCompleteProm = DrillSrv.isDrillComplete(personalizedBonusSkill.drill.id);
                    return isDrillCompleteProm.then(function(isDrillComplete){
                        if(isDrillComplete && personalizedBonusSkill.flashcards.isCompleted){
                            BonusSkillHelperSrv.markBonusSkillsAsCompleted(bonusSkillId);
                            return true;
                        }
                        return false;
                    });
                });
            };

            return BonusSkillSrv;
        }
    ]);
})(angular);
