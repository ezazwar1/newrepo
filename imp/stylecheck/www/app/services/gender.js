/*global define*/
define([
    'app'
], function (app) {

    'use strict';

    var service = [
        function () {
            this.filterList = function (myList, userGender) {
                var list = [];
                angular.forEach(myList, function (gender, item) {
                    if (gender === userGender || gender === true) {
                        list.push(item);
                    }
                });
                return list;
            };
        }
    ];

    app.service('gender', service);

    return service;
});
