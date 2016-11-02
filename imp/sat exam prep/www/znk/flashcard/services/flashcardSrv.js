(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('FlashcardSrv', [
        'ZnkModalSrv', 'FlashcardHelperSrv', 'GoBackHardwareSrv',
        function (ZnkModalSrv, FlashcardHelperSrv, GoBackHardwareSrv) {
            var FlashcardSrv = {};

            var flashcardModalInstance;
            FlashcardSrv.openFlashcardsModal = function(exerciseFlashcardsIds,flashcardsConfig, dailyOrder){
                if(flashcardModalInstance){
                    return;
                }

                flashcardsConfig = flashcardsConfig || {};
                flashcardsConfig.dailyOrder = dailyOrder;

                var options = {
                    templateUrl: 'znk/flashcard/templates/flashcardsModal.html',
                    wrapperClass: 'flashcard show-animation',
                    blurMainContent: true,
                    showCloseBtn: true,
                    dontCloseOnBackdropTouch: true,
                    dontCentralize: true,
                    ctrl: 'FlashcardModalCtrl',
                    resolve:{
                        exerciseFlashcardsIds: exerciseFlashcardsIds,
                        flashcardsConfig: flashcardsConfig
                    }
                };

                flashcardModalInstance = ZnkModalSrv.modal(options);
                flashcardModalInstance.promise.then(function(){
                    flashcardModalInstance = null;
                });
                GoBackHardwareSrv.registerBaseModalHandler(flashcardModalInstance);
                return flashcardModalInstance;
            };

            var fnToBindFromHelper = [
                'getFlashcardsContent',
                'setFlashcardStatus',
                'getKeptFlashcards',
                'getRemovedFlashcards',
                'getAllFlashcardsIds',
                'getFlashcardsStatus',
                'getFlashcardStatusKeyProp'
            ];
            fnToBindFromHelper.forEach(function(fnName){
                FlashcardSrv[fnName] = FlashcardHelperSrv[fnName].bind(FlashcardHelperSrv);
            });

            return FlashcardSrv;
        }
    ]);
})(angular);
