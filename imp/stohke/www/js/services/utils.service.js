/*global Camera, document, navigator*/
'use strict';
angular.module('stohke')
    .service('Utils', ['lodash', function(_) {
        var serverBaseUrl = 'http://stohke.com';
        return {
            getServerBaseUrl: function () {
                return serverBaseUrl;
            },
            getStohkeUrl: function (type, user, item) {
                var externalStohkeUrl;
                // What kind of share... profile, media, etc
                switch (type) {
                    case 'profile':
                        externalStohkeUrl = serverBaseUrl + ((user.Type  === 0 || user.Type  === 'user') ? '/user/' : '' || (user.Type  === 1 || user.Type  === 'company') ? '/company/' : '' ) + ( user.Alias || item.UserId );

                        break;
                    case 'media':
                        // http://stohke.com/{User.Type}/{UserId}/videos/{MediaId}
                        // Base url
                        externalStohkeUrl = serverBaseUrl + ((user.Type  === 0 || user.Type  === 'user') ? '/user/' : '' || (user.Type  === 1 || user.Type  === 'company') ? '/company/' : '' ) + ( user.Alias || item.UserId );
                        externalStohkeUrl += (item.Type  === 1 ? '/photos/' : '' || item.Type  === 2 ? '/videos/' : '') + item.Id;
                        break;
                }
                return externalStohkeUrl;
            },
            encodeImageUri: function (imageUri)
            {
                 var c = document.createElement('canvas');
                 var ctx = c.getContext("2d");
                 var img = new Image();
                 img.onload = function(){
                   c.width = this.width;
                   c.height = this.height;
                   ctx.drawImage(img, 0,0);
                 };
                 img.src = imageUri;
                 var dataURL = c.toDataURL("image/jpeg");
                 return dataURL;
            },
            openExternalUrl: function (url, options) {
                var defaultOptions = {
                    location: 'no'
                };

                options = _.defaults(defaultOptions, options);

                if (url.indexOf('http') === -1) {
                    url = 'http://' + url;
                }
                return window.open(url, '_blank', 'location='+ (options.location));
            },
            shuffle: function (array) {
                var currentIndex = array.length,
                    temporaryValue,
                    randomIndex;

                // While there remain elements to shuffle...
                while (0 !== currentIndex) {

                // Pick a remaining element...
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;

                    // And swap it with the current element.
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }

                return array;
            },
            prettyCount: function (count, format) {
                var countLength = count.toString().length,
                    countMod;
                    
                // count = count * (Math.random()* 10000);

                if (format) {
                    return numeral(count).format(format);
                }

                if (countLength <= 4) {
                    countMod = numeral(count).format('0a');
                // 1000 -> 999999
                } else if (countLength > 4 && countLength <= 6 ) {
                    countMod = window.numeral(count).format('0.00a');
                    // console.log(window.numeral(count).format('0.0a'));
                // 1,000,000 -> ∞
                } else if (countLength > 6) {
                    countMod = window.numeral(count).format('0.00a');
                } else {
                    countMod = count;
                }
                return countMod;
            }
        };
    }])
    .service('analyticsService', ['STOHKE_CONFIG', '$q', '$timeout', function(_STOHKE, $q, $timeout){
        console.log('analyticsService');
        var loggingEnabled = false;
        var analyticsDefered = $q.defer();
        
        var onSuccess = function (results) {
            if (loggingEnabled) {
                console.log('LYTICS: success handler');
                console.log(results);
            }
        };
        var onError = function (results) {
            if (loggingEnabled) {
                console.error('LYTICS: error handler');
                console.log(results);
            }
        };
        var log = function (message) {
            if (loggingEnabled) {
                console.log(message);
            }
        }
        return {
            startTracker: function () {

                // called within after deviceready
                window.analytics.startTrackerWithId(_STOHKE.googleAnalyticIDs, onSuccess, onError);
                log('LYTICS: tracker started on id: ' + _STOHKE.googleAnalyticIDs);
                $timeout( function () {
                    analyticsDefered.resolve();
                }, 0);
            },
            setUserId: function (id) {
                $q.when(analyticsDefered.promise).then(function () {
                    log('LYTICS: setUserId:' + id);
                    window.analytics.setUserId(id, onSuccess, onError);
                });
            },
            debugMode: function () {
                $q.when(analyticsDefered.promise).then(function () {
                    window.analytics.debugMode(onSuccess, onError);
                    log('LYTICS: debugMode set');
                });
            },
            trackView: function (viewString) {
                if (!viewString) {
                    log('cannot track view of undefined');
                    return false;
                }
                $q.when(analyticsDefered.promise).then(function () {
                    log('LYTICS: track view: [' + viewString + ']');
                    window.analytics.trackView(viewString, onSuccess, onError);
                });
            },
            trackEvent: function (category, action, label, value) {
                // label and value optional
                $q.when(analyticsDefered.promise).then(function () {
                    log('LYTICS: trackEvent: ' + category + ' ' + action);
                    window.analytics.trackEvent(category, action, label, (value || undefined), onSuccess, onError);
                });
            },
            // 
            trackTiming: function (category, intervalInMilliseconds, name, label) {
                $q.when(analyticsDefered.promise).then(function () {
                    log('LYTICS: trackTiming: ');
                    window.analytics.trackTiming(category, intervalInMilliseconds, name, label, onSuccess, onError);
                });
            },
            trackException: function (description, fatal) {
                log('LYTICS: trackException: ' + description);
                window.analytics.trackException(description, fatal || false, onSuccess, onError);
            }
        };
    }])
    .service('sharingService', ['$cordovaSocialSharing', 'ngNotify', 'analyticsService', '$stateParams', '$location', function($cordovaSocialSharing, ngNotify, analyticsService, $stateParams, $location) {
        return {
            share: function (message, subject, file, link) {
                // base the share url on current $location.
                console.log($stateParams, $location);
                // debugger;
                // var linkShareType = $location.path().split('/')[1];

                // switch (linkShareType) {
                //     case 'profile' :
                //         break;

                //     case 'explore' :
                //         break;
                // } 
                var trueLink = link;
                if (link.indexOf('beta.stohke') >= 0) {
                    trueLink = link.replace('beta.stohke.com', 'stohke.com');
                }
                $cordovaSocialSharing
                .share(message, subject, file, trueLink) // Share via native share sheet
                .then(function(result) {
                    // console.log(result);
                    analyticsService.trackEvent('Media', 'Shared', (file + ' | ' + link),  undefined);
                }, function(err) {
                    console.error(err);
                  // An error occured. Show a message to the user
                    ngNotify.set('Share failed', {
                        type:'error',
                        duration: 2000,
                        position: 'bottom'
                    });
                });
            }
        };
    }])
    .factory('Camera', ['$q', 'lodash', function($q, _) {

        var defaultOptions; 
        if (window.Camera) {
            console.log(Camera);
            defaultOptions = { 
                quality : 75,
                destinationType : Camera.DestinationType.FILE_URI,
                sourceType : Camera.PictureSourceType.CAMERA,
                allowEdit : true,
                encodingType: Camera.EncodingType.JPEG,
                correctOrientation : true,
                // targetWidth: 2080,
                // targetHeight: 0,
                saveToPhotoAlbum: false
            };
        }

        return {
            getPicture: function(source, options) {
                switch (source) {
                case 1: 
                    defaultOptions.sourceType = Camera.PictureSourceType.CAMERA;
                    defaultOptions.saveToPhotoAlbum = true;
                    break;
                case 2: 
                    defaultOptions.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                    defaultOptions.saveToPhotoAlbum = false;
                }

                options = _.defaults(options, defaultOptions);
                console.log(options);

                var q = $q.defer();
                if (navigator.camera) {

                    navigator.camera.getPicture(function(result) {
                        console.log(result);
                        q.resolve(result);
                    }, function(err) {
                        q.reject(err);
                    }, 
                        options
                    );

                    return q.promise;
                }
            }
        };
    }]);