angular.module('swMobileApp').controller('HelpCtrl', function ($scope, $translate, UserService, AccessService, FirebaseService, $log) {
    $scope.$on('$ionicView.enter', function () {
        angular.element(document.getElementsByClassName('bar-header')).addClass('blue-bar');
    });

    AccessService.isActiveSubscription()
        .then(function (isActiveSubscription) {
            $scope.isActiveSubscription = isActiveSubscription;
        });

    AccessService.isLegacyPro()
        .then(function (isLegacyPro) {
            $scope.isLegacyPro = isLegacyPro;
        });

    $scope.sendFeedback = function () {
        if (ionic.Platform.isAndroid()) {
            $scope.appVersion = '6.5.08'
        } else {
            $scope.appVersion = '4.5.3'
        }
        var premiumAccess = $scope.isActiveSubscription ? 'Premium' : '';
        var legacyAccess = $scope.isLegacyPro ? 'Legacy' : '';
        var userID = FirebaseService.getUserUID() ? 'User ID: ' + FirebaseService.getUserUID() : 'No UserID';
        var emailBody = "<p>" + $translate.instant('DEVICE') + ": " + device.model + "</p><p>" + $translate.instant('PLATFORM') + ": " + device.platform + " " + device.version + "- " + PersonalData.GetUserSettings.preferredLanguage + "-" + premiumAccess + legacyAccess + "</p>" + "<p>" + $translate.instant('APP_VERSION') + ": " + $scope.appVersion + "</p><p>" + userID + "</p><p>" + $translate.instant('FEEDBACK') + ": </p>";
        cordova.plugins.email.isAvailable(
            function (isAvailable) {
                if (isAvailable) {
                    cordova.plugins.email.open({
                        to: ['contact@sworkit.com'],
                        subject: $translate.instant('FEEDBACK') + ': Sworkit',
                        body: emailBody,
                        isHtml: true
                    }, function (result) {
                        $log.info('EmailComposer result: ' + result);
                    });
                } else {
                    navigator.notification.alert(
                        'It appears you may not have an email app setup for us to read. Either way, please send you support request to us directly at contact@sworkit.com',  // message
                        function() {

                        },
                        'Email Required',            // title
                        'Done'                  // buttonName
                    );
                }
            }
        );
    };
    $scope.askTrainer = function () {
        var emailBody = "<p>" + $translate.instant('NAME') + ": " + PersonalData.GetUserProfile.firstName + ' ' + PersonalData.GetUserProfile.lastName + ' ' + "</p><p>" + $translate.instant('USERID') + ": " + PersonalData.GetUserProfile.uid + "</p></br>";
        cordova.plugins.email.open({
            to: ['trainer@sworkit.com'],
            subject: $translate.instant('ASKSWORKIT'),
            body: emailBody,
            isHtml: true
        }, function (result) {
            $log.info('EmailComposer result: ' + result);
        });
    };
    $scope.openFitnessFAQ = function () {
        window.open('http://sworkit.com/trainfaq', '_blank', 'location=no,AllowInlineMediaPlayback=yes,toolbarposition=top');
    };
    $scope.openTOS = function () {
        window.open('http://m.sworkit.com/TOS.html', '_blank', 'location=no,AllowInlineMediaPlayback=yes,toolbarposition=top');
    };
    $scope.openPrivacy = function () {
        window.open('http://m.sworkit.com/privacy.html', '_blank', 'location=no,AllowInlineMediaPlayback=yes,toolbarposition=top');
    };
    $scope.openFAQ = function () {
        var helpdesk = window.open('http://help.sworkit.com', '_blank', 'location=no,AllowInlineMediaPlayback=yes,toolbarposition=top');
        helpdesk.addEventListener('loadstop', function () {
            helpdesk.insertCSS({code: ".request-nav { display:none }"});
        });
    };
    $scope.shareTwitter = function () {
        if (device) {
            var tweetText = $translate.instant('FOR_CUSTOM');
            window.plugins.socialsharing.shareViaTwitter(tweetText, null, 'http://sworkit.com', function () {
                logActionSessionM('Share')
            }, function (error) {
                if (error == "not available") {
                    window.open('http://twitter.com/sworkit', '_blank', 'location=no,AllowInlineMediaPlayback=yes,toolbarposition=top');
                }
            })
        }
    };
    $scope.shareFacebook = function () {
        var facebookText = $translate.instant('FOR_CUSTOM');
        if (device) {
            window.plugins.socialsharing.shareViaFacebook(facebookText, null, 'http://sworkit.com', function () {
                logActionSessionM('Share')
            }, function (error) {
                if (error == "not available") {
                    window.open('http://facebook.com/sworkitapps', '_blank', 'location=no,AllowInlineMediaPlayback=yes,toolbarposition=top');
                }
            })
        }
    };
    $scope.shareEmail = function () {
        var emailText = '<p>' + $translate.instant('FOR_CUSTOM') + '</p><br><p><a href="http://get.sworkit.com">http://get.sworkit.com</a></p>';
        cordova.plugins.email.open({
            to: [],
            subject: $translate.instant('CHECK_OUT'),
            body: emailText,
            isHtml: true
        }, function (result) {
            $log.info('EmailComposer result: ' + result);
        });
    };
    $scope.rateSworkit = function () {
        if (device.platform.toLowerCase() == 'ios') {
            window.open('http://itunes.apple.com/app/id527219710', '_system', 'location=no,AllowInlineMediaPlayback=yes');
        } else if (isAmazon()) {
            window.appAvailability.check('com.amazon.venezia', function () {
                    window.open('amzn://apps/android?p=sworkitapp.sworkit.com', '_system')
                }, function () {
                    window.open(encodeURI("http://www.amazon.com/gp/mas/dl/android?p=sworkitapp.sworkit.com"), '_system');
                }
            );
        } else {
            window.open('market://details?id=sworkitapp.sworkit.com', '_system');
        }
    };
    $scope.launchGear = function () {
        window.open('http://www.ntensify.com/sworkit', '_blank', 'location=no,AllowInlineMediaPlayback=yes,toolbarposition=top');
    };
    //var hiddenURL = window.open('http://sworkit.com/app', '_blank', 'hidden=yes,AllowInlineMediaPlayback=yes');

    $scope.$on('$ionicView.leave', function () {
        angular.element(document.getElementsByClassName('bar-header')).removeClass('blue-bar');
    });
});
