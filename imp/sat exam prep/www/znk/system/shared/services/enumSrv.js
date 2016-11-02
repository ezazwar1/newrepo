'use strict';
(function (angular) {
    angular.module('znk.sat').factory('EnumSrv', [
        function () {
            var EnumSrv = {};

            function BaseEnum(enumsArr) {
                var NAME_INDEX = 0;
                var ENUM_INDEX = 1;
                var VALUE_INDEX = 2;
                var self = this;
                enumsArr.forEach(function (item) {
                    self[item[NAME_INDEX]] = {
                        enum: item[ENUM_INDEX],
                        val: item[VALUE_INDEX]
                    };
                });
            }
            EnumSrv.BaseEnum = BaseEnum;

            BaseEnum.prototype.getEnumMap = function getEnumMap() {
                var enumsObj = this;
                var enumMap = {};
                var enumsPropKeys = Object.keys(enumsObj);
                for (var i in enumsPropKeys) {
                    var prop = enumsPropKeys[i];
                    var enumObj = enumsObj[prop];
                    enumMap[enumObj.enum] = enumObj.val;
                }
                return enumMap;
            };

            BaseEnum.prototype.getEnumArr = function getEnumArr() {
                var enumsObj = this;
                var enumArr = [];
                for (var prop in enumsObj) {
                    var enumObj = enumsObj[prop];
                    if (angular.isObject(enumObj)) {
                        enumArr.push(enumObj);
                    }
                }
                return enumArr;
            };

            EnumSrv.entityStatus = new BaseEnum([
                ['notStarted', 'N', ''],
                ['active', 'A', 'Active'],
                ['completed', 'C', 'Completed']
            ]);

            EnumSrv.gameTypes = new BaseEnum([
                ['oddball', 1, 'Oddball'],
                ['wordWise', 2, 'Word Wise'],
                ['speedRun', 3, 'Speed Run'],
                ['checkpoint', 4, 'Check Point'],
                ['perfection', 5, 'Perfection'],
                ['pushIt', 6, 'Push It'],
                ['passageFlip', 7, 'Passage Flip'],
                ['masterEdit', 8, 'Master Edit']
            ]);

            EnumSrv.practiceDifficulty = new BaseEnum([
                ['easy', 1, 'Easy'],
                ['medium', 2, 'Medium'],
                ['hard', 3, 'Hard']
            ]);
            /** @deprecated - use SubjectEnum instead * */
            EnumSrv.subject = new BaseEnum([
                ['math', 0, 'Mathematics'],
                ['reading', 1, 'Critical Reading'],
                ['writing', 2, 'Writing']
            ]);

            EnumSrv.categoryType = new BaseEnum([
                ['general', 6, 'General Category'],
                ['specific', 7, 'Specific Tactic']
            ]);
            /** @deprecated - use ExerciseTypeEnum instead * */
            EnumSrv.exerciseType = new BaseEnum([
                ['tutorial', 1, 'Tutorial'],
                ['practice', 2, 'Practice'],
                ['game', 3, 'Game'],
                ['section', 4, 'Section'],
                ['drill', 5, 'Drill']
            ]);

            EnumSrv.exerciseViewMode = new BaseEnum([
                ['answerWithResult', 1, 'Answer Wtih Result'],
                ['answerOnly', 2, 'Answer Only'],
                ['review', 3, 'Review']
            ]);

            EnumSrv.questionAnswerType = new BaseEnum([
                ['select', 0, 'Select Answer'],
                ['freeText', 1, 'Free Text']
            ]);

            EnumSrv.readingFlashcardPartType = new BaseEnum([
                ['example', 0, 'Example'],
                ['synonym', 1, 'Synonym'],
                ['lexical', 3, 'Lexical']
            ]);

            EnumSrv.flashcardStatus = new BaseEnum([
                ['keep', 0, 'Keep'],
                ['remove', 1, 'Remove']
            ]);

            return EnumSrv;
        }
    ]);
})(angular);
