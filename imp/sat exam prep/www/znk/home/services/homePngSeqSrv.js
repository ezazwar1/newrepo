(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('HomePngSeqSrv', ['MobileSrv',
        function (MobileSrv) {
            var pngSeqSettings = {};
            var isMobile = MobileSrv.isMobile();

            pngSeqSettings.numberOfImages = {
                'Newbie1': 60,
                'Newbie2': 60,
                'Wiz Kid1': 48,
                'Wiz Kid2': 48,
                'Test Rocker1': 86,
                'Test Rocker2': 66,
                'Super Scholar1': 44,
                'Super Scholar2': 63,
                'Mastermind1': 107,
                'Mastermind2': 125,
                'Grand Zinkerz1': 120,
                'Grand Zinkerz2': 80
            }

            pngSeqSettings.classesToRemove = function(){
                var strOfClasses = '';

                for(var className in  pngSeqSettings.numberOfImages){
                    strOfClasses += ' left-' +className.replace(/\s/g,"-");
                    strOfClasses += ' right-' +className.replace(/\s/g,"-");
                }
                return strOfClasses;
            }

            pngSeqSettings.getWorkout1PngSeqSettings = function(){
                return {
                    startImgIndex:0,
                    endImgIndex:280,
                    imgData: 'assets/img/homeRaccoonAnimation/workout1/',
                    classToAdd:'workout1PngSeq',
                    leftOffset: isMobile ? -119 : -96,
                    topOffset: isMobile ? -163 : -146,
                    onTapCloseModal:false,
                    autoClose: true
                }
            }

            pngSeqSettings.getWeakestSubjectPngSeqSettings = function(imgPath){
                return {
                    startImgIndex: 0,
                    endImgIndex: 111,
                    imgData: 'assets/img/homeRaccoonAnimation/weakest subject/' + imgPath +'/',
                    classToAdd: 'weakestSubjectPngSeq',
                    leftOffset: isMobile ? -101 : -77,
                    topOffset: isMobile ? -26 : 17,
                    rotateLeftOffset: isMobile ? 98 : 120,
                    onTapCloseModal: true,
                    autoClose: false
                }
            }

            return pngSeqSettings;
        }
    ]);
})(angular);
