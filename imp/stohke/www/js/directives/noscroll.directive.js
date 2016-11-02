'use strict';
angular.module('stohke')
.directive('noScroll', function ($document) {
    return {
        restrict: 'A',
        link: function () {
            $document.on('touchmove', function (e) {
                e.preventDefault();
            });
        }
    };
});
