(function (angular,ionic) {
    'use strict';

    angular.module('znk.sat').factory('MediaSrv', [ 'UserSettingsSrv', '$q',
        function (UserSettingsSrv, $q) {
            var mediaOptions = { playAudioWhenScreenIsLocked : false };
            var MediaSrv = {};

            var userSettingsProm =  UserSettingsSrv.getUserSettings().then(function(soundSettings) {
                    MediaSrv.soundsEnabled = soundSettings.soundEnabled;
            });

            function getSoundEnabled(){
                if(angular.isUndefined(MediaSrv.soundsEnabled)){
                    userSettingsProm.then(function(){
                        return MediaSrv.soundsEnabled;
                    })

                }else{
                    return $q.when(MediaSrv.soundsEnabled);
                }
            }

            MediaSrv.enableSounds = function enableSounds(shouldEnable){
                MediaSrv.soundsEnabled = shouldEnable;
            };

            MediaSrv.loadMedia = function loadMedia(src, elementId, statusCallback) {
                var prefix = '';

                // if (!src.startsWith('http') && window.device && window.device.platform && window.device.platform.toLowerCase() == 'android') {
                //     prefix = '/android_asset/www/';
                // }

                if (window.Media) {
                    return new Media(prefix + src,
                        function getMediaSuccess() {

                            //
                        },
                        function getMediaFailure() {

                            //
                        },
                        statusCallback);
                }
                else if (elementId) {

                    var el = document.getElementById(elementId);

                    if (el){
                        el.src = src;
                    }

                    return el;
                }
            };

            function setVolume(media, volume) {

                if (!MediaSrv.soundsEnabled){
                    return;
                }

                if (media.setVolume) {
                    media.setVolume(volume);
                }
                else {
                    media.volume = volume;
                }
            };

           function playMedia(media, options) {

                if (!MediaSrv.soundsEnabled) {
                    return;
                }

                if (typeof window.Media === 'undefined') {
                    media.load();
                    media.play();
                }
                else {
                    if (!options){
                        options = mediaOptions;
                    }

                    media.play(options);
                }
            };

            function playSound(soundSrc,elementId){

                getSoundEnabled().then(function(soundEnabled){
                    if(ionic.Platform.isAndroid()){
                        soundSrc = '/android_asset/www/' + soundSrc;
                    }
                    if(!soundEnabled){
                        return;
                    }

                    var audioSelector = 'audio#' + elementId;
                    if(!document.querySelector(audioSelector)){
                        var bodyElement = angular.element(document.querySelector('body'));
                        var template = '<audio id="%elementId%" webkit-playsinline><source src="%src%" type="audio/mpeg"></audio>';
                        template = template.replace('%elementId%',elementId);
                        template = template.replace('%src%',soundSrc);
                        bodyElement.append(template);
                    }
                    var soundAudio = MediaSrv.loadMedia(soundSrc, elementId);
                    setVolume(soundAudio, 0.1);
                    playMedia(soundAudio);
                })
            }

            MediaSrv.playWrongAnswerSound = playSound.bind(MediaSrv,'assets/sounds/wrong.mp3', 'wrong-answer-sound');

            MediaSrv.playCorrectAnswerSound = playSound.bind(MediaSrv,'assets/sounds/correct.mp3','correct-answer-sound');

            return MediaSrv;
        }
    ]);
})(angular,ionic);
