/**
 * attrs:
 */

(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('flashcardItem', [
        '$animate', 'EnumSrv',
        function ($animate, EnumSrv) {
            return {
                templateUrl: 'znk/flashcard/templates/flashcardItemDrv.html',
                restrict: 'E',
                scope: {
                    flashcardGetter: '&flashcard'
                },
                link: function (scope, element, attrs) {
                    attrs.$addClass('flip-animation');

                    scope.d = {};

                    scope.d.flashcard = scope.flashcardGetter();

                    function buildReadingFlashcard(){
                        var readingFlashcardPartTypeEnum = EnumSrv.readingFlashcardPartType;
                        var partToRelevantPropMap = {};
                        partToRelevantPropMap[readingFlashcardPartTypeEnum.example.enum] = 'example';
                        partToRelevantPropMap[readingFlashcardPartTypeEnum.synonym.enum] = 'synonym';
                        partToRelevantPropMap[readingFlashcardPartTypeEnum.lexical.enum] = 'lexical';

                        scope.d.flashcard.parts.forEach(function(part){
                            scope.d.flashcard[partToRelevantPropMap[part.type]] = part.markup;
                        });
                    }

                    var subjectEnum = EnumSrv.subject;

                    switch(+scope.d.flashcard.subjectId){
                        case +subjectEnum.math.enum:
                            attrs.$addClass('math');
                            buildReadingFlashcard();
                            break;
                        case +subjectEnum.reading.enum:
                            attrs.$addClass('reading');
                            buildReadingFlashcard();
                            break;

                    }

                    var animationProm;
                    element.on('click',function(){
                        scope.$apply(function(){
                            if(animationProm){
                                return;
                            }

                            if(element.hasClass('flip')){
                                animationProm = $animate.removeClass(element,'flip');
                            }else{
                                animationProm = $animate.addClass(element,'flip');
                            }

                            animationProm.then(function(){
                                animationProm = null;
                            });
                        });
                    });
                }
            };
        }
    ]);
})(angular);

