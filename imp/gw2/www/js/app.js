// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

.run(function ($ionicPlatform) {


    $ionicPlatform.ready(function () {

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.backgroundColorByHexString("#353E45");
            //StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $cordovaAppRateProvider) {

        document.addEventListener("deviceready", function () {

            var prefs = {
                language: 'en',
                appName: 'GW2 Event Timers',
                androidURL: 'market://details?id=com.shivammehta.gw2',
            };

            $cordovaAppRateProvider.setPreferences(prefs)

        }, false);

    })
    .controller('myctrl', function ($scope, $interval, $ionicPlatform, $http, $cordovaSplashscreen, $cordovaNetwork, $timeout, $cordovaToast, $cordovaEmailComposer, $cordovaAppRate) {

        $ionicPlatform.ready(function () {
            move.defaults = {
                duration: 400
            };

            // localStorage.clear();
            if (localStorage['config']) {
                $scope.config = JSON.parse(localStorage['config']);
            } else {
                $scope.config = {};
                $scope.config.twentyfour = false;
                $scope.config.langs = [{
                        'name': 'English',
                        'active': true
            },

                    {
                        'name': 'German',
                        'active': false
            },

                    {
                        'name': 'Spanish',
                        'active': false
            }];

            }

            if (localStorage['events']) {
                $scope.events = JSON.parse(localStorage['events']);
                console.log('cached events', $scope.events);
                setSchedules();
                process();
                $interval(function () {
                    process();
                }, 600);
                hidesplash();

            } else {
                loadShit();
            }
        });

        $scope.slideit = function () {

        }

        function showInfo() {

            //$('#infoBox').addClass('bringin');

        }


        function loadShit() {
            $scope.isonline = true;
            if (window.cordova)
                $scope.isonline = $cordovaNetwork.isOnline();
            if ($scope.isonline) {
                url = "https://gw2-timer.firebaseio.com/events.json";
                $http.get(url).success(function (data) {
                    hidesplash();
                    console.log("Downloaded: ", data);
                    $scope.events = data;
                    setSchedules();
                    process();
                    $interval(function () {
                        process();
                    }, 600);
                    localStorage['events'] = JSON.stringify($scope.events);

                });

            } else {
                hidesplash();
                // $scope.toast("Are you sure you're connected to the Internet? Let's retry...");
                $timeout(function () {
                    loadShit();
                }, 2000);
            }
        }

        $scope.changeLang = function (index) {
            for (var a = 0; a < $scope.config.langs.length; a++) {
                $scope.config.langs[a].active = false;
            }
            $scope.config.langs[index].active = true;
        }

        $scope.showSettings = function () {
            console.log('showing settings');
            if (!$scope.settings) {
                $scope.settings = true;
                move('#settingsBtn')
                    .set('background-image', "url('img/close.png')")
                    .end();
                $('#settings').addClass('bringin');
            } else {

                $scope.closeSettings();

            }
        };


        $scope.closeSettings = function () {

            $scope.settings = false;
            console.log('closing settings');
            $('#settings').removeClass('bringin');
            move('#settingsBtn')
                .set('background-image', "url('img/gear.png')")
                .end();

        }

        $scope.openEvent = function (event) {

            if (!$scope.settings) {
                $scope.eventopen = true;
                $scope.event = event;

                $('#details').addClass('slid');
                if (!event.ongoing && event.minutesto > 20) {
                    $('#notifyBtn').addClass('slid');
                }

                $timeout(function () {
                    $('#details img').css('opacity', '1');
                }, 400);

                if (!event.cross) {
                    $('#crossBtn').addClass('slid');
                }
            }

        };

        $scope.closeEvent = function () {
            $scope.eventopen = false;

            $('#details').removeClass('slid');
            $('#crossBtn').removeClass('slid');
            $('#notifyBtn').removeClass('slid');
            $('#details img').css('opacity', '0');

        };

        $scope.eventDone = function (event) {

            $scope.event.cross = true;
            $scope.event.crosstime = Date.create();
            $('#crossBtn').removeClass('slid');
            localStorage['events'] = JSON.stringify($scope.events);

        };


        $scope.clearMarked = function (event) {
            $scope.events.forEach(function (event) {
                if (event.cross) {
                    event.cross = false;
                }
            });
            $scope.closeSettings();
            localStorage['events'] = JSON.stringify($scope.events);
        };

        function process() {

            localStorage['config'] = JSON.stringify($scope.config);
            $scope.events.forEach(function (event) {
                translateShit(event);
                event.ongoing = false;
                event.next = event.sched.next(3);
                event.clocks = [];
                event.timeto = event.next[0].relative($scope.relativestring);
                event.minutesto = event.next[0].minutesFromNow();
                lastEvent = event.sched.prev(1);
                if (lastEvent.minutesAgo() < 15) {
                    event.ongoing = true;
                    event.timeto = lastEvent.relative($scope.relativestring);
                    //console.log(event.name);
                }
                event.next.forEach(function (time) {
                    if ($scope.config.twentyfour) {
                        event.clocks.push(time.format('{HH}:{mm}'));
                    } else {
                        event.clocks.push(time.format('{hh}:{mm}{tt}'));
                    }
                });

                if (event.cross) {
                    if (Date.create('tomorrow').isBefore(event.crosstime)) {
                        event.cross = false;
                        localStorage['events'] = JSON.stringify($scope.events);
                    }

                }
            });
        }

        function setSchedules() {

            $scope.events.forEach(function (event) {
                event.map = event.image.slice(0, -4) + "m.jpg";
                if (event.name.toLowerCase() == 'evolved jungle wurm') {
                    event.map = "img/evolvedwurmm.jpg";
                }
                sched = [];
                event.times.forEach(function (time) {
                    time = time.split(':');
                    hour = parseInt(time[0]);
                    min = parseInt(time[1]);
                    var timing = {
                        h: [hour],
                        m: [min]
                    };
                    sched.push(timing);
                });
                event.sched = later.schedule({
                    schedules: sched
                });
            });
        }

        $ionicPlatform.registerBackButtonAction(function () {
            if ($scope.settings) {
                $scope.closeSettings();
            } else if ($scope.eventopen) {
                $scope.closeEvent();
            } else {
                navigator.app.exitApp();
            }
        }, 100);

        $scope.toggleNotify = function () {
            notifyEvent = $scope.event;
            //console.log(notifyEvent);

            if (!notifyEvent.ongoing && notifyEvent.minutesto > 20) {
                notifyEvent.notify = !notifyEvent.notify;
                localStorage['events'] = JSON.stringify($scope.events);
                if (notifyEvent.notify) {
                    setNotification(notifyEvent);
                } else {
                    cancelNotification(notifyEvent);
                }
            }

            if (!notifyEvent.ongoing && notifyEvent.notify && notifyEvent.minutesto < 20) {
                notifyEvent.notify = !notifyEvent.notify;
                cancelNotification(notifyEvent);
            }


        };

        function setNotification(event) {
            // console.log('Setting Notification');
            minsBefore = 15;
            nottext = ' in 15 minutes';
            timeToEvent = event.minutesto;
            if (timeToEvent > 20) {
                minsBefore = 20;
                nottext = " in 20 minutes";
            }
            if (timeToEvent < 20) {
                notifyEvent.notify = false;
                // alert("Event seems to be near. No reminders set");
                return;
            }
            nottime = (minsBefore).minutesBefore(event.next[0]);
            //console.log(nottext);
            //console.log(timeToEvent + ' minutes to the event. Notify at: ', nottime);

            if (window.cordova) {
                cordova.plugins.notification.local.schedule({
                    id: event.id,
                    title: 'Upcoming Event',
                    text: event.translatedName + nottext,
                    at: nottime
                });
                //toast("Reminder set for " + event.translatedName);
                cordova.plugins.notification.local.on("trigger", function (notification) {
                    if (notification.id !== 1)
                        return;

                });
            }

        }

        function cancelNotification(event) {
            if (window.cordova) {
                cordova.plugins.notification.local.cancel(event.id, function () {
                    // toast('Reminder cancelled for ' + event.translatedName);
                });
            }
        }


        $scope.donate = function () {

            console.log('sd');

        };


        function silentUpdate() {
            $scope.isonline = true;
            if (window.cordova)
                $scope.isonline = $cordovaNetwork.isOnline();
            if ($scope.isonline) {
                var myFirebaseRef = new Firebase("https://gw2-timer.firebaseio.com/");
                myFirebaseRef.once("value", function (snapshot) {
                    console.log('newer', snapshot.val().events);
                    //$scope.timers = snapshot.val().events;
                    excludeNots(snapshot.val().events);
                    localStorage['events'] = JSON.stringify($scope.timers);
                });
            }
        }

        function excludeNots(newEvents) {
            oldEvents = $scope.timers;
            oldEvents.forEach(function (item, index) {
                if (item.notify) {
                    found = newEvents.find({
                        name: item.name
                    });
                    found.notify = true;
                }
            });
            $scope.timers = newEvents;
        }

        function hidesplash() {

            $timeout(function () {
                if (window.cordova)
                    $cordovaSplashscreen.hide();
            }, 100);


        }

        $scope.emailMe = function () {
            var email = {
                to: 'info@shivammehta.com',
                subject: '[Android App] Guild Wars 2 Timer',
                body: 'Hi, ',
                isHtml: true
            };
            $cordovaEmailComposer.open(email).then(null, function () {
                // user cancelled email
            });
        }

        $scope.rateApp = function (language) {
            console.log('Rating app...');
            $cordovaAppRate.navigateToAppStore().then(function (result) {
                // success
            });
        };

        function toast(msg) {
            navigator.notification.alert(
                msg, alertDismissed, 'Reminder', 'ok'
            );
        }

        function alertDismissed() {
            // do something
        }

        function translateShit(event) {

            lang = $scope.config.langs.find({
                active: true
            });

            if (lang.name.toLowerCase() == 'german') {
                event.translatedName = event.german;
                event.translatedZone = event.germanz;
                $scope.relativestring = 'de';
            }
            if (lang.name.toLowerCase() == 'spanish') {
                event.translatedName = event.spanish;
                event.translatedZone = event.spanishz;
                $scope.relativestring = 'es';
            }
            if (lang.name.toLowerCase() == 'english') {
                event.translatedName = event.name;
                event.translatedZone = event.zone;
                $scope.relativestring = 'en';
            }
        }

    });