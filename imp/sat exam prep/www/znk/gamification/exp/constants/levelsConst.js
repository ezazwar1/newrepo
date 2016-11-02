(function (angular) {
    'use strict';

    var LevelsConst = [
        {
            points: 0,
            name: 'Newbie'
        },
        {
            points: 130,
            name: 'Wiz Kid',
            src:'05_wizKid'
        },
        {
            points: 290,
            name: 'Test Rocker',
            src:'10_testRocker',
            zinkoins: 2
        },
        {
            points: 1040,
            name: 'Super Scholar',
            src:'15_superScholar',
            zinkoins: 2
        },
        {
            points: 3540,
            name: 'Mastermind',
            src:'20_mastermind',
            zinkoins: 4
        },
        {
            points: 7730,
            name: 'Grand Zinkerz',
            src:'25_grandZinker',
            zinkoins: 5
        }
    ];

    angular.module('znk.sat').constant('LevelsConst', LevelsConst);
})(angular);


