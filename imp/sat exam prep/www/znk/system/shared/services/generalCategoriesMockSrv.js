'use strict';

(function() {
    angular.module('znk.sat').factory('generalCategoriesMockSrv', ['SubjectEnum',
        function (SubjectEnum){

            var generalCategoriesMockSrv = {};
            var subjectWithCategoriesObj = {};

            var sortByCategoryId = function(category1,category2){
                return category1.id - category2.id;
            }

            generalCategoriesMockSrv.addMisingCategories = function(subjectObj, subjectId){
                if(!subjectObj || !subjectObj.category){
                    return;
                }

                subjectObj.category.sort(sortByCategoryId);

                for(var index = 0; index < subjectWithCategoriesObj[subjectId].category.length; index++){
                    if(!subjectObj.category[index]|| subjectObj.category[index].id > subjectWithCategoriesObj[subjectId].category[index].id){
                        subjectObj.category.splice(index, 0, subjectWithCategoriesObj[subjectId].category[index]);
                    }
                }
            }

            //the category array must be sorted by category id.
            subjectWithCategoriesObj[SubjectEnum.math.enum] = {
                category:[
                    {
                        avgTime: 0,
                        id: 4,
                        levelProgress:0
                    },
                    {
                        avgTime: 0,
                        id: 5,
                        levelProgress:0
                    },
                    {
                        avgTime: 0,
                        id: 6,
                        levelProgress:0
                    },
                    {
                        avgTime: '-',
                        id: 7,
                        levelProgress:0
                    }]
            }

            subjectWithCategoriesObj[SubjectEnum.reading.enum] = {
                category:[
                    {
                        avgTime: 0,
                        id: 11,
                        levelProgress:0
                    },
                    {
                        avgTime: 0,
                        id: 168,
                        levelProgress:0
                    }]
            }

            subjectWithCategoriesObj[SubjectEnum.writing.enum] = {
                category:[
                    {
                        avgTime: 0,
                        id: 15,
                        levelProgress:0
                    },
                    {
                        avgTime: 0,
                        id: 114,
                        levelProgress:0
                    },
                    {
                        avgTime: 0,
                        id: 115,
                        levelProgress:0
                    },
                    {
                        avgTime: 0,
                        id: 116,
                        levelProgress:0
                    }]

            }

            return generalCategoriesMockSrv;
        }

    ]);


})();
