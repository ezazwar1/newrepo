'use strict';

(function (angular) {
    angular.module('znk.sat').directive('masterLevelVideoDrv', ['LevelsConst',

        function (LevelsConst) {

            return {
                replace: true,
                scope: {
                    level: '='
                },
                link: function (scope, element) {

                    var videoFileName = scope.level.src, posterFileName =  scope.level.src;
                    var videoTag;

                    if(!videoFileName) {
                        angular.forEach(LevelsConst, function(value) {
                            if(scope.level.name === value.name){
                                videoFileName = posterFileName = value.src;
                            }
                        });
                    }

                    videoTag = '<video id="bgvid" loop webkit-playsinline autoplay="autoplay" src="assets/videos/'+videoFileName+'.mp4"  poster="assets/videos/posters/' + posterFileName + '.png"></video>';
                    angular.element(element).html(videoTag);
                }
            };
        }
    ]);
})(angular);

