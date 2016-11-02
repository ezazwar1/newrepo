angular.module('instacafe.directives')
.directive('photoAction', function ($cordovaActionSheet, $ionicPlatform, $cordovaFileTransfer,
                                    $cordovaAppAvailability, $ionicModal, $ionicActionSheet,
                                    $ionicPopup, $cordovaInAppBrowser, ReportApi) {
    return {
        restrict: 'A',
        scope: {
            photo: '='
        },
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                scope.openActionSheet(scope.photo);
            });

            scope.showReportModal = function () {
                scope.reportModal.show();
            };

            scope.closeReportModal = function () {
                scope.reportModal.hide();
            };

            scope.sendReport = function (category) {
                ReportApi.send(category, scope.photo.id).then(function () {
                    if (typeof analytics !== 'undefined') {
                        analytics.trackEvent('Report Photo', scope.photo.standard);
                    }
                    $ionicPopup.alert({
                        title: 'Thank you for your report',
                        template: 'The photo will be removed.'
                    }).then(function () {
                        scope.closeReportModal();
                    });
                });
            };

            scope.openActionSheet = function (photo) {
                var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        { text: 'Open Instagram' },
                        { text: 'Save this photo' },
                    ],
                    titleText: 'What do you want with this photo?',
                    destructiveText: 'Report',
                    cancelText: 'Cancel',
                    buttonClicked: function(index) {
                        console.log(index);
                        if (index === 0) {
                            _openInstagram(photo.account.name);
                            hideSheet();
                        } else if (index === 1) {
                            _saveImage(photo.standard);
                            hideSheet();
                        }
                    },
                    destructiveButtonClicked: function () {
                        scope.showReportModal();
                        hideSheet();
                    }
                });
            };

            $ionicModal.fromTemplateUrl('templates/modal/report.html', {
                 'scope': scope
            }).then(function (modal) {
                scope.reportModal = modal;
            });

            scope.$on('$destroy', function() {
                scope.reportModal.remove();
            });
        }
    };

    function _openInstagram (username) {
        $ionicPlatform.ready(function() {
            if (typeof analytics !== 'undefined') {
                analytics.trackEvent('Instagram', username);
            }
            if (ionic.Platform.isIOS()) {
                $cordovaAppAvailability.check('instagram://')
                    .then(function () {
                        var url = 'instagram://user?username=' + username;
                        location.href = url;
                    }, function () {
                        var url = 'https://instagram.com/' + username;
                        $cordovaInAppBrowser.open(url, '_blank');
                    });
            } else {
                var url = 'https://instagram.com/' + username;
                $cordovaInAppBrowser.open(url, '_blank');
            }
        });
    }
    function _saveImage (url) {
        if (typeof analytics !== 'undefined') {
            analytics.trackEvent('Save Image', url);
        }
        if (ionic.Platform.isIOS()) {
            PhotoLibrary.saveImage(url, function (successMessage) {
                $ionicPopup.alert({
                    title: successMessage
                });
            }, function (errorMessage) {
                $ionicPopup.alert({
                    title: 'Error',
                    template: errorMessage
                });
            });
        } else {
            $ionicPlatform.ready(function () {
                var filename = url.split("/").pop();
                var targetPath = cordova.file.externalRootDirectory + 'instacafe/' + filename;
                $cordovaFileTransfer.download(url, targetPath)
                    .then(function(result) {
                        $ionicPopup.alert({
                            title: 'The photo has been saved.'
                        });
                    }, function(err) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: "The operation couldn't be completed"
                        });
                    });

            });
        }
    }
});
