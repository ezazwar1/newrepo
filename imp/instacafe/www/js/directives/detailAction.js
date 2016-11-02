angular.module('instacafe.directives')
.directive('detailAction', function ($cordovaActionSheet, $ionicPlatform, $ionicActionSheet,
                                     $cordovaAppAvailability, $cordovaSocialSharing,
                                     Favorite, iosAppUrl, androidAppUrl) {
    return {
        restrict: 'A',
        scope: {
            cafe: '='
        },
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                openActionSheet(scope.cafe);
            });
        }
    };

    function openActionSheet (cafe) {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Open Map App' },
                { text: 'Add to Favorite' },
                { text: 'Share This Cafe' }
            ],
            titleText: 'What do you want with this cafe?',
            cancelText: 'Cancel',
            buttonClicked: function(index) {
                if (index == 0) {
                    _openMap(cafe);
                    hideSheet();
                } else if (index == 1) {
                    _addToFavorite(cafe);
                    hideSheet();
                } else if (index == 2) {
                    _shareCafe(cafe);
                    hideSheet();
                }
            }
        });
    }

    function _openMap(cafe) {
        var latlng = cafe.point.coordinates.join(',');
        $ionicPlatform.ready(function () {
            if (typeof analytics !== 'undefined') {
                analytics.trackEvent('Open Map', cafe.name);
            }

            if (ionic.Platform.isIOS()) {
                $cordovaAppAvailability.check('comgooglemaps://').then(function () {
                    var url = 'comgooglemaps://?q=' + cafe.name + '&center=' + latlng + '&zoom=14';
                    location.href = url;
                }, function () {
                    var url = 'maps://maps.apple.com/?q=' + cafe.name + '&ll=' + latlng;
                    location.href = url;
                });
            } else {
                window.plugins.webintent.startActivity({
                    action: window.plugins.webintent.ACTION_VIEW,
                    url: 'geo:' + latlng + '?q=' + cafe.name
                },
                function() {},
                function() {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: "Failed to open Map"
                    });
                });
            }
        });
    }

    function _addToFavorite(cafe) {
        Favorite.setById(cafe.id);
        if (typeof analytics !== 'undefined') {
            analytics.trackEvent('Add to Favorite', cafe.name);
        }
    }

    function _shareCafe(cafe) {
        var appUrl;
        if (ionic.Platform.isIOS()) {
            appUrl = iosAppUrl;
        } else {
            appUrl = androidAppUrl;
        }
        var cafeUrl = cafe.website ? cafe.website : appUrl;
        var message = _composeMessage(cafe);

        $ionicPlatform.ready(function () {
            $cordovaSocialSharing.share(message, 'InstaCafe', null, cafeUrl).then(function (result) {
                if (typeof analytics !== 'undefined') {
                    analytics.trackEvent('Social Share', cafe.name);
                }
            });
        });
    }

    function _composeMessage(cafe) {
        var address = [cafe.address, cafe.city, cafe.country].join(' ').trim();
        return cafe.name + ': ' + address;
    }
});
