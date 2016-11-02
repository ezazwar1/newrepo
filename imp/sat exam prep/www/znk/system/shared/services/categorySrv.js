'use strict';

(function () {

    angular.module('znk.sat').factory('CategorySrv', ['OfflineContentSrv', 'EnumSrv', CategorySrv]);

    function CategorySrv(OfflineContentSrv, EnumSrv) {

        var CategorySrv = { };
        var categoriesProm;
        var categories;
        var categorysIconsAndNames = {
            '4': {
                svgIcon: 'numbers-and-operations.html',
                categoryName: 'Numbers & Operations'
            },
            '5': {
                svgIcon: 'algebra-and-functions.html',
                categoryName: 'Algebra & Functions'
            },
            '6': {
                svgIcon: 'geometry-and-measurement.html',
                categoryName:' Geometry & Measurement'
            },
            '7': {
                svgIcon: 'data-analysis.html',
                categoryName: 'Data Analysis, Statistics & Probability'
            },
            '8': {
                svgIcon:'literary-device.html',
                categoryName:'Literary Comprehension'
            },
            '9': {
                svgIcon:'literary-sensitivity.html',
                categoryName:'Literary Sensitivity'
            },
            '10': {
                svgIcon:'literary-device.html',
                categoryName:' Literary Device'
            },
            '11': {
                svgIcon:'logic-vocabulary.html',
                categoryName:'Vocabulary'
            },
            '12': {
                svgIcon:'grammar.html',
                categoryName:'Grammar '
            },
            '13': {
                svgIcon:'style.html',
                categoryName:'Style    '
            },
            '14': {
                svgIcon:'no-error.html',
                categoryName:'No Error'
            },
            '15': {
                svgIcon:'essay.html',
                categoryName:'Essay'
            },
            '114': {
                svgIcon:'error-recognition.html',
                categoryName:'Error Recognition'
            },
            '115': {
                svgIcon:'sentence-improvements.html',
                categoryName:'Sentence Improvement'
            },
            '116': {
                svgIcon:'paragraph-improvement.html',
                categoryName:'Paragraph Improvement'
            },
            '168': {
                svgIcon:'reading-passages.html',
                categoryName:' Reading Passages'
            },
            '172': {
                svgIcon: 'numbers-and-operations.html',
                categoryName:'General Mathematics'
            },
            '173': {
                svgIcon:'reading-passages.html',
                categoryName:'General Reading'
            },
            '174': {
                svgIcon:'paragraph-improvement.html',
                categoryName:'General Writing'
            }
        };

        var get = function get() {
            if(!categoriesProm) {
                categoriesProm = OfflineContentSrv.getCategories();
                categoriesProm.then(function (allCategories) {
                    categories = allCategories;
                    return allCategories;
                });
            }
            return categoriesProm;
        };

        var categoryName = function (categoryId) {
            for (var i = 0; i < categories.length; i++) {
                if (categories[i].id === categoryId) {
                    return categories[i].name;
                }
            }
        };

        CategorySrv.generalCategoryParent = function (categoryId) {
            return get().then(function (categories) {

                for (var i = 0; i < categories.length; i++) {
                    if (categories[i].id === categoryId) {
                        return categoryName(categories[i].parentId);
                    }
                }
            });
        };

        CategorySrv.getLookup = function() {
            return get().then(function(categories) {
                return categories.reduce(function(prev, cur) {
                    prev[cur.id] = cur;
                    return prev;
                }, {});
            });
        };

        CategorySrv.getAllGeneralCategoryWithIcons = function(){
            var allGeneralCategoryObj = {};

            return get().then(function(categories) {
                categories.forEach(function(item) {
                    if(item.typeId == EnumSrv.categoryType.general.enum){

                        item.svgIcon =  categorysIconsAndNames[item.id].svgIcon;
                        allGeneralCategoryObj[item.id] = item;
                    }
                });
                return allGeneralCategoryObj;
            });
        };

        CategorySrv.getGeneralCategoriesMapping = function(){
            return categorysIconsAndNames;
        }

        return CategorySrv;
    }

})();
