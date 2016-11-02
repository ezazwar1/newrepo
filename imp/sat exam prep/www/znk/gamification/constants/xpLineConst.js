(function (angular) {
    'use strict';

    var xpLineConst = [
        {
            middle: [30, 65],
            name: 'Newbie',
            className: 'avatar-newbie'
        },
        {
            middle: [180, 230],
            name: 'Wiz Kid',
            className: 'avatar-wizKid'
        },
        {
            middle: [480, 840],
            name: 'Test Rocker',
            className: 'avatar-testRocker'
        },
        {
            middle: [1800, 2600],
            name: 'Super Scholar',
            className: 'avatar-superScholar'
        },
        {
            middle: [5000, 6300],
            name: 'Mastermind',
            className: 'avatar-mastermind'
        },
        {
            middle: false,
            name: 'Grand Zinkerz',
            className: 'avatar-grandZink'

        }
    ];

    angular.module('znk.sat').constant('XpLineConst', xpLineConst);
})(angular);


