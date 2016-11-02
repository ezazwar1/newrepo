
(function (angular) {
    'use strict';

    //filter to crop string to specific length

    angular.module('znk.sat').filter('subString', [function () {

        return function (str, length, onlyFullWords) {

            if (!str) return '';
            if (str.length < length) return str;

            var words = str.split(' ');
            var newStr = '';

            if(onlyFullWords){
                for (var i = 0; i < words.length; i++) {
                    if (newStr.length + words[i].length <= length) {
                        newStr = newStr + words[i] + ' ';
                    }
                    else break;
                }
            }
            else{
                newStr = str.substr(0, length);
            }


            return newStr + '...';
        }
    }]);
})(angular);
