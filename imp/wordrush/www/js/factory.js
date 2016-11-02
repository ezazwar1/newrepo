angular.module('wordrush.factory', [])

.factory('NetworkService', ['$cordovaNetwork',
    function($cordovaNetwork) {
        var NETWORK = {
            isOnline: function() {
                return $cordovaNetwork.isOnline();
            },
            isOffline: function() {
                return $cordovaNetwork.isOffline();
            }
        };

        return NETWORK;
    }
])

.factory('RankService', ['storageService', 'APP_CONSTANT', 'localStorageService', '$q',
    function(storageService, APP_CONSTANT, localStorageService, $q) {


        // function makeRandomChildKey() {
        //     var text = "";
        //     var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        //     for (var i = 0; i < 20; i++)
        //         text += possible.charAt(Math.floor(Math.random() * possible.length));
        //     return text;
        // }
        var setDataToLS = function(key, data) {
            localStorageService.set(key, data);
        }

        var getDatafromLS = function(key) {
            return localStorageService.get(key);
        }
        // var submit = function(dbRef, bestscore) {
        //     dbRef.setWithPriority({
        //         'name': getName(),
        //         'score': bestscore
        //     }, bestscore);
        // }



        var FirebaseDB = new Firebase('https://wordrush.firebaseio.com/');
        var submitCallback = function(error) {
            if (!error) {
                // console.log('score successfully updated...');
                storageService.setDataToLS(APP_CONSTANT.BEST_CHECK_LS_KEY, {
                    'bestscore_submitted': true
                });
            } else {
                // console.log('score not successfully updated...');
            }
        }

            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

        var generateRandomName = function() {
            return 'USER-' + getRandomInt(1000, 10000);
        }

        var getName = function() {
            var username = storageService.getDatafromLS(APP_CONSTANT.USERNAME_LS_KEY) || generateRandomName();
            return username;
        }

        var RANK = {

            submitScore: function(bestscore) {
                var getChildPath = getDatafromLS(APP_CONSTANT.FB_CHILD_LS_KEY);
                var dbRef;

                if (getChildPath) {
                    FirebaseDB = new Firebase(getChildPath);
                    FirebaseDB.setWithPriority({
                        'name': getName(),
                        'score': bestscore
                    }, bestscore, submitCallback);
                } else {
                    //FirebaseDB = new Firebase('https://wordrush.firebaseio.com/');
                    dbRef = FirebaseDB.push();
                    setDataToLS(APP_CONSTANT.FB_CHILD_LS_KEY, dbRef.toString())
                    dbRef.setWithPriority({
                        'name': getName(),
                        'score': bestscore
                    }, bestscore, submitCallback);
                }
            },

            getUserName: function() {

                return getName();

            },

            rankThem: function(scoreArr) {

                var prevScore = scoreArr[0].score;
                var prevRank = 1;
                var actualRank = 1;
                for (var i = 1; i < scoreArr.length; i++) {
                    if (prevScore == scoreArr[i].score) {
                        scoreArr[i].rank = prevRank;
                        actualRank++;
                    } else {
                        actualRank++;
                        scoreArr[i].rank = actualRank;
                        prevScore = scoreArr[i].score;
                        prevRank = actualRank;
                    }
                }
                return scoreArr;
            }


        };
        return RANK;
    }
])

.factory('storageService', ['localStorageService',
    function(localStorageService) {

        var LOCALSTORAGE = {

            setDataToLS: function(key, data) {
                localStorageService.set(key, data);
            },

            getDatafromLS: function(key) {
                return localStorageService.get(key);
            }

        };

        return LOCALSTORAGE;
    }
])


.factory('LocalStorageService', ['storageService', 'APP_CONSTANT', 'RankService', 'NetworkService',
    function(storageService, APP_CONSTANT, RankService, NetworkService) {

        var LOCALSTORAGE = {

            isBestScoreSubmitted: function() {
                var bestSubmittedObj = storageService.getDatafromLS(APP_CONSTANT.BEST_CHECK_LS_KEY);
                return bestSubmittedObj ? bestSubmittedObj.bestscore_submitted : true;
            },

            getBest: function() {
                var bestObj = storageService.getDatafromLS(APP_CONSTANT.BEST_LS_KEY);
                return bestObj ? bestObj.bestscore : 0;
            },

            setBest: function(bestScore) {
                storageService.setDataToLS(APP_CONSTANT.BEST_LS_KEY, {
                    'bestscore': bestScore
                });
                storageService.setDataToLS(APP_CONSTANT.BEST_CHECK_LS_KEY, {
                    'bestscore_submitted': false
                });

                if(NetworkService.isOnline()){ // sync only when there is a proper net connection
                    RankService.submitScore(bestScore);
                }
            },

            getMusicSetting: function() {
                var musicSetting = storageService.getDatafromLS(APP_CONSTANT.MUSIC_LS_KEY);
                return musicSetting ? musicSetting.musicOn : true;
            },

            setMusicSetting: function(value) {
                storageService.setDataToLS(APP_CONSTANT.MUSIC_LS_KEY, {
                    'musicOn': value
                });
            },

            isNameChanged: function(){
                return storageService.getDatafromLS(APP_CONSTANT.USERNAME_LS_KEY) ? true: false;
            },

            isFirstRun: function(){
                var firstRun = storageService.getDatafromLS(APP_CONSTANT.FIRSTRUN_LS_KEY);
                return firstRun ? false : true;
            },

            setFirstRun: function(){
                storageService.setDataToLS(APP_CONSTANT.FIRSTRUN_LS_KEY, {
                    'firstrundone': true
                });
            }

        };

        return LOCALSTORAGE;
    }
])


.factory('VibrateService', ['$cordovaVibration',
    function($cordovaVibration) {

        var VIBRATE = {

            short: function() {
                $cordovaVibration.vibrate(50);
            },

            medium: function() {
                $cordovaVibration.vibrate(200);
            },

            long: function(text, timeout) {
                $cordovaVibration.vibrate(500);
            }

        };
        return VIBRATE;
    }
])

.factory('Loader', ['$ionicLoading', '$timeout',
    function($ionicLoading, $timeout) {

        var LOADERAPI = {

            showLoading: function(text) {
                text = text || 'Loading...';
                $ionicLoading.show({
                    template: text
                });
            },

            hideLoading: function(timeout) {

                $timeout(function() {
                    $ionicLoading.hide();
                }, timeout || 500);
            },

            toggleLoadingWithMessage: function(text, timeout) {
                var self = this;

                self.showLoading(text);

                $timeout(function() {
                    self.hideLoading();
                }, timeout || 6000);
            }

        };
        return LOADERAPI;
    }
])

// .factory('popupProvider', ['$rootScope', '$ionicPopup', '$timeout',
//     function($rootScope, $ionicPopup, $timeout) {


//         return {
//             showAlert: function(title, msg) {
//                 // An alert dialog

//                 var alertPopup = $ionicPopup.alert({
//                     title: title,
//                     template: msg
//                 });
//                 alertPopup.then(function(res) {
//                     // console.log('Thank you for not eating my delicious ice cream cone');
//                 });

//             },
//             showConfirm: function(title, message) {
//                 var confirmPopup = $ionicPopup.confirm({
//                     title: title,
//                     template: message,
//                     buttons: [{
//                         text: 'Okay',
//                         type: 'button button-balanced'
//                     }]
//                 });

//                 return confirmPopup;

//             }
//         };

//     }
// ])

// .factory('toastProvider', ['$rootScope', '$cordovaToast',
//     function($rootScope, $cordovaToast) {

//         //http://ngcordova.com/docs/plugins/toast/
//         return {
//             showShortBottom: function(msg) { // toast

//                 $cordovaToast.showShortBottom(msg).then(function(success) {
//                     // success
//                 }, function(error) {
//                     // error
//                 });

//             },

//             showLongBottom: function(msg) { // toast

//                 $cordovaToast.showLongBottom(msg).then(function(success) {
//                     // success
//                 }, function(error) {
//                     // error
//                 });

//             }
//         };

//     }
// ])