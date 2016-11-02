/*global define*/
define([
    'app'
], function (app) {

    'use strict';

    app.service('groupList', [
        function () {

            this.groupByInitialLetter = function (myList) {
                var list = {
                        letters: []
                    },
                    i = 0;

                angular.forEach(myList, function (myValue) {
                    var itmLetter = myValue.substring(0, 1).toUpperCase();
                    if (!(itmLetter in list)) {
                        list[itmLetter] = [];
                        list.letters.push(itmLetter);
                    }
                    list[itmLetter].push({'name': myValue, 'index': i});
                    i = i + 1;
                });
                delete list.letters;

                return list;
            };
        }
    ]);
});
