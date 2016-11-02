(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('BonusSkillHelperSrv', [
        'StorageSrv', '$q', 'DrillSrv', 'FlashcardSrv', '$rootScope', 'EnumSrv',
        function (StorageSrv, $q, DrillSrv, FlashcardSrv, $rootScope, EnumSrv) {
            var BonusSkillHelperSrv = {};
            var bonusSkillsPath = StorageSrv.appUserSpacePath.concat(['bonusSkills']);
            var unusedDrills;
            var newCards,usedPristineCards;

            function getBonusSkills(){
                if(getBonusSkills.prom){
                    return getBonusSkills.prom;
                }
                var _getBonusSkillsProm = StorageSrv.get(bonusSkillsPath);
                getBonusSkills.prom = _getBonusSkillsProm.then(function(bonusSkills){
                    var defaultValues = {
                        personalization: {},
                        usedDrills: [],
                        usedCards: []
                    };
                    bonusSkills = angular.extend(defaultValues,bonusSkills);
                    return bonusSkills;
                });
                return getBonusSkills.prom;
            }
            var childScope = $rootScope.$new(true);
            childScope.$on('auth:logout',function(){//@todo(igor) we need to make general solution for this case
                getBonusSkills.prom = null;
            });

            function bonusSkillIdToBonusSkillIdProp(id){
                return 'bonusSkill' + id;
            }

            BonusSkillHelperSrv.getPersonalizedBonusSkill = function(bonusSkillId){
                var getBonusSkillsProm = getBonusSkills();
                return getBonusSkillsProm.then(function(bonusSkills){
                    var bonusSkillIdProp = bonusSkillIdToBonusSkillIdProp(bonusSkillId);
                    return bonusSkills.personalization[bonusSkillIdProp];
                });
            };

            BonusSkillHelperSrv.getBonusSkillDrill = function(bonusSkillId){
                var getPersonalizedBonusSkillProm = BonusSkillHelperSrv.getPersonalizedBonusSkill(bonusSkillId);
                return getPersonalizedBonusSkillProm.then(function(personalizedBonusSkill){
                    return personalizedBonusSkill && personalizedBonusSkill.drill;
                });
            };

            BonusSkillHelperSrv.getUsedDrillIds = function(){
                var getBonusSkillsProm = getBonusSkills();
                return getBonusSkillsProm.then(function(bonusSkills){
                    return bonusSkills.usedDrills;
                });
            };

            BonusSkillHelperSrv.getUnusedDrills = function(){
                if(unusedDrills){
                    return $q.when(unusedDrills);
                }
                var getAllDrillsIdsProm = DrillSrv.getAllDrillsIds();
                var getUsedDrillIdsProm = BonusSkillHelperSrv.getUsedDrillIds();
                var allProm = $q.all([getAllDrillsIdsProm,getUsedDrillIdsProm]);
                return allProm.then(function(resArr){
                    var allDrillsIds = resArr[0];
                    if(!allDrillsIds || !allDrillsIds.length){
                        throw 'Failed to retrieve all drills ids';
                    }
                    var usedDrillsIds = resArr[1] || [];
                    unusedDrills = allDrillsIds.filter(function(drillId){
                        return usedDrillsIds.indexOf(drillId) === -1;
                    });
                    return unusedDrills;
                });
            };

            BonusSkillHelperSrv.getBonusSkillFlashcards = function(bonusSkillId){
                var getPersonalizedBonusSkillProm = BonusSkillHelperSrv.getPersonalizedBonusSkill(bonusSkillId);
                return getPersonalizedBonusSkillProm.then(function(personalizedBonusSkill){
                    return personalizedBonusSkill && personalizedBonusSkill.flashcards;
                });
            };

            BonusSkillHelperSrv.getNewFlashcards = function(){
                if(!newCards){
                    var getBonusSkillsProm = getBonusSkills();
                    var getAllFlashcardsIdsProm = FlashcardSrv.getAllFlashcardsIds();
                    var allProm = $q.all([getBonusSkillsProm,getAllFlashcardsIdsProm]);
                    return allProm.then(function(res){
                        var bonusSkills = res[0];
                        var allFlashcardsIds = res[1];

                        newCards = [];

                        allFlashcardsIds.forEach(function(flashcardId){
                            if(bonusSkills.usedCards.indexOf(flashcardId) === -1){
                                newCards.push(flashcardId);
                            }
                        });


                        return FlashcardSrv.getFlashcardsContent(newCards)
                            .then(function(flashCardsContent){
                                newCards = newCards.filter(function(cardId,index){
                                    return flashCardsContent[index].subjectId === EnumSrv.subject.reading.enum;
                                });
                                return newCards;
                            });
                    });
                }
                return $q.when(newCards);
            };

            BonusSkillHelperSrv.getUsedPristineFlashcards = function(){
                if(!usedPristineCards){
                    var getBonusSkillsProm = getBonusSkills();
                    var getKeptFlashcardsProm = FlashcardSrv.getKeptFlashcards();
                    var getRemovedFlashcardsProm = FlashcardSrv.getRemovedFlashcards();
                    var allProm = $q.all([getBonusSkillsProm,getKeptFlashcardsProm,getRemovedFlashcardsProm]);
                    return allProm.then(function(res){
                        var bonusSkills = res[0];
                        var keptFlashCards = res[1];
                        var removedFlashcards = res[2];
                        var usedPristineCards = angular.copy(bonusSkills.usedCards);

                        usedPristineCards = usedPristineCards.filter(function(usedFlashcardId){
                            //keptFlashCards & removedFlashcards are updated for sure since FlashcardHelperSrv.getKeptFlashcards promise was resolved
                            return keptFlashCards.indexOf(usedFlashcardId) === -1 && removedFlashcards.indexOf(usedFlashcardId) === -1;
                        });
                        return usedPristineCards;
                    });
                }
                return $q.when(usedPristineCards);
            };

            var saveProm = $q.when(null);
            BonusSkillHelperSrv.saveBonusSkills = function(newBonusSkills){
                saveProm = saveProm.then(function(){
                    return StorageSrv.syncedSet(bonusSkillsPath,newBonusSkills);
                });
                return saveProm;
            };

            function _saveBonusSkillItem(itemName, bonusSkillId, item){
                var getBonusSkillsProm = getBonusSkills();
                return getBonusSkillsProm.then(function(bonusSkills){
                    var bonusSkillIdProp = bonusSkillIdToBonusSkillIdProp(bonusSkillId);
                    if(!bonusSkills.personalization[bonusSkillIdProp]){
                        bonusSkills.personalization[bonusSkillIdProp] = {};
                    }
                    bonusSkills.personalization[bonusSkillIdProp][itemName] = item;
                    BonusSkillHelperSrv.saveBonusSkills(bonusSkills);
                    return bonusSkills;
                });
            }

            BonusSkillHelperSrv.saveBonusSkillDrill = _saveBonusSkillItem.bind(BonusSkillHelperSrv,'drill');

            BonusSkillHelperSrv.saveBonusSkillFlashcards = _saveBonusSkillItem.bind(BonusSkillHelperSrv,'flashcards');

            function _setItemsAsUsed(usedItemsArrName,newUsedItems){
                if(angular.isUndefined(newUsedItems)){
                    return;
                }

                if(!angular.isArray(newUsedItems)){
                    newUsedItems = [newUsedItems];
                }

                var getBonusSkillsProm = getBonusSkills();
                return getBonusSkillsProm.then(function(bonusSkills){
                    bonusSkills[usedItemsArrName] = bonusSkills[usedItemsArrName].concat(newUsedItems);
                    BonusSkillHelperSrv.saveBonusSkills(bonusSkills);
                    return bonusSkills[usedItemsArrName];
                });
            }

            BonusSkillHelperSrv.setDrillsAsUsed = _setItemsAsUsed.bind(BonusSkillHelperSrv,'usedDrills');

            BonusSkillHelperSrv.setCardsAsUsed = _setItemsAsUsed.bind(BonusSkillHelperSrv,'usedCards');

            BonusSkillHelperSrv.markBonusSkillsAsCompleted = function(bonusSkillId){
                var getBonusSkillsProm = getBonusSkills();
                return getBonusSkillsProm.then(function(BonusSkills){
                    var bonusSkillIdProp = bonusSkillIdToBonusSkillIdProp(bonusSkillId);
                    if(!BonusSkills.personalization[bonusSkillIdProp]){
                        BonusSkills.personalization[bonusSkillIdProp] = {};
                    }
                    BonusSkills.personalization[bonusSkillIdProp].isCompleted = true;
                    BonusSkillHelperSrv.saveBonusSkills(BonusSkills);
                });
            };

            return BonusSkillHelperSrv;
        }
    ]);
})(angular);
