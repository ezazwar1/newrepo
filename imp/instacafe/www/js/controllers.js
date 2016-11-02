angular.module('instacafe.controllers', [])

.controller('HomeCtrl', function ($scope, $ionicPlatform, $cordovaGeolocation,
                                  $cordovaAppRate, $ionicPopup, $ionicModal, $state,
                                  CafeApi, defaultPoint, locationErrorMessaage) {
    $scope.cafes = [];
    $scope.hasMore = false;
    var offset = 0;

    $ionicPlatform.ready(function () {
        $cordovaGeolocation.getCurrentPosition({
                timeout: 5000,
                maximumAge: 0,
                enableHighAccuracy: true
            }).then(function (location) {
                $scope.point = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                };
                CafeApi.getNear($scope.point, offset).then(function (response) {
                    if (response.next !== null) {
                        $scope.hasMore = true;
                    }
                    offset += 30;
                    $scope.cafes = response.results;

                    // google map
                    $scope.location = {
                        id: 1,
                        latitude: $scope.point.latitude,
                        longitude: $scope.point.longitude
                    };

                    var latLng = new google.maps.LatLng(
                        $scope.location.latitude,
                        $scope.location.longitude
                    );

                    $scope.center = latLng;
                    $scope.options = {
                        map: {
                            center: latLng,
                            zoom: 14,
                            disableDefaultUI: true,
                            styles: [{
                                featureType: "poi",
                                stylers: [
                                    { "visibility": "off" }
                                ]
                            }]
                        }
                    };

                }, function (err) {
                    $scope.message = 'Network Error';
                });

        }, function () {
            $ionicPopup.alert(locationErrorMessaage);
            $scope.point = defaultPoint;

            CafeApi.getNear(defaultPoint, offset).then(function (response) {
                if (response.next !== null) {
                    $scope.hasMore = true;
                }
                $scope.cafes = response.results;
                offset += 20;

                // google map
                $scope.location = {
                    id: 1,
                    latitude: $scope.point.latitude,
                    longitude: $scope.point.longitude
                };

                var latLng = new google.maps.LatLng(
                    $scope.location.latitude,
                    $scope.location.longitude
                );
                $scope.center = latLng;
                $scope.options = {
                    map: {
                        center: latLng,
                        zoom: 14,
                        disableDefaultUI: true,
                        styles: [{
                            featureType: "poi",
                            stylers: [
                                { "visibility": "off" }
                            ]
                        }]
                    }
                };
            }, function (err) {
                $scope.message = 'Network Error';
            });
        });
    });


    $scope.loadMore = function () {
        CafeApi.getNear($scope.point, offset).then(function (response) {
            if (response.next === null) {
                $scope.hasMore = false;
            }

            angular.forEach(response.results, function (cafe) {
                $scope.cafes.push(cafe);
            });

            offset += 30;

            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

    $scope.selectCafe = function(cafe) {
        if ($scope.cafe) {
            $scope.cafe.selected = false;
        }
        $scope.cafe = cafe;
        $scope.cafe.selected = true;
        $scope.cafeShow = true;

        $scope.$broadcast('gmMarkersUpdate', 'cafes');
    };

    $scope.dragHandler = function () {
        $scope.cafeShow = false;
    };

    $scope.openMap = function () {
        $scope.showMapModal();
    };

    $ionicModal.fromTemplateUrl('templates/modal/map.html', {
         'scope': $scope
    }).then(function (modal) {
        $scope.mapModal = modal;
    });

    $scope.showMapModal = function () {
        $scope.mapModal.show();
        $scope.$broadcast('gmMapResize', 'google-map');
    };

    $scope.closeMapModal = function () {
        $scope.mapModal.hide();
    };

    /* Destroy modal */
    $scope.$on('$destroy', function() {
        $scope.mapModal.remove();
    });

    $scope.openDetail = function (cafe_id) {
        $state.go('tab.home-cafe-detail', { cafeId: cafe_id });
    };

    // GoogleAnalytics
    $ionicPlatform.ready(function() {
        if (typeof analytics !== 'undefined') {
            analytics.trackView('Home');
        }
    });
})

.controller('CafeDetailCtrl', function ($scope, $stateParams, $ionicPlatform,
                                        $cordovaInAppBrowser, CafeApi, $state) {

    $scope.mapId = $state.current.data.mapId;

    CafeApi.getDetail($stateParams.cafeId).then(function (cafe) {
        $scope.cafe = cafe;

        // google map
        $scope.location = {
            id: 1,
            latitude: cafe.point.coordinates[0],
            longitude: cafe.point.coordinates[1]
        };

        var latLng = new google.maps.LatLng(
            $scope.location.latitude,
            $scope.location.longitude
        );

        $scope.center = latLng;
        $scope.zoom = 15;
        $scope.options = {
            map: {
                center: latLng,
                zoom: 15,
                disableDefaultUI: true,
                styles: [{
                    featureType: "poi",
                    stylers: [
                        { "visibility": "off" }
                    ]
                }]
            }
        };

        // GoogleAnalytics
        $ionicPlatform.ready(function () {
            if (typeof analytics !== 'undefined') {
                analytics.trackView('Detail: ' + $scope.cafe.name + ' - ' + $scope.cafe.country);
            }
        });
    });

    $scope.openBrowser = function (url) {
        $ionicPlatform.ready(function() {
            $cordovaInAppBrowser.open(url, '_blank');
        });
    };

    $scope.openPhoto = function (cafe) {
        $state.go($state.current.data.photoLink, {
            cafeId:cafe.id,
            cafe_name: cafe.name,
            country_name: cafe.country
        });
    };

    $scope.$on('$ionicView.afterEnter', function() {
        $scope.$broadcast('gmMapResize', $state.current.data.mapId);
    });
})

.controller('CafePhotoCtrl', function ($scope, $stateParams, $ionicModal, $ionicPlatform, CafeApi) {

    $scope.cafe_id = $stateParams.cafeId;
    $scope.photos = [];
    $scope.hasMore = false;
    var offset = 0;

    CafeApi.getPhotos($scope.cafe_id, offset).then(function (response) {
        if (response.next !== null) {
            $scope.hasMore = true;
        }

        $scope.photos = response.results;
        offset += 30;

    }, function (err) {
        $scope.message = 'Network Error';
    });

    $scope.loadMore = function () {
        CafeApi.getPhotos($scope.cafe_id, offset).then(function (response) {

            if (response.next === null) {
                $scope.hasMore = false;
            }

            angular.forEach(response.results, function (photo) {
                $scope.photos.push(photo);
            });

            offset += 30;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

    // GoogleAnalytics
    $ionicPlatform.ready(function () {
        if (typeof analytics !== 'undefined') {
            analytics.trackView('Photos: ' + $stateParams.cafe_name + ' - ' + $stateParams.country_name);
        }
    });
})

.controller('FavoriteCtrl', function ($scope, Favorite, CafeApi, $ionicPlatform) {

    $scope.cafes = [];
    $scope.hasMore = false;

    var offset = 0;
    $scope.favoriteCafeIds = Favorite.getAll();

    if ($scope.favoriteCafeIds.length !== 0) {
        CafeApi.favorite($scope.favoriteCafeIds, offset).then(function (response) {
            if (response.next !== null) {
                $scope.hasMore = true;
            }
            $scope.cafes = response.results;
            offset += 50;
        });
    }

    $scope.loadMore = function () {
        CafeApi.favorite($scope.favoriteCafeIds, offset).then(function (response) {

            if (response.next === null) {
                $scope.hasMore = false;
            }

            angular.forEach(response.results, function (cafe) {
                $scope.cafes.push(cafe);
            });

            offset += 50;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

    $scope.openDetail = function (cafe_id) {
        $state.go('tab.favorite-cafe-detail', { cafeId: cafe_id });
    };

    $scope.deleteFavorite = function (id, index) {
        Favorite.removeById(id);
        $scope.cafes.splice(index, 1);
    };

    // GoogleAnalytics
    $ionicPlatform.ready(function () {
        if (typeof analytics !== 'undefined') {
            analytics.trackView('Favorite');
        }
    });
})

.controller('DiscoverCtrl', function ($scope, CafeApi, $ionicPlatform) {
    $scope.cafes = [];
    $scope.hasMore = false;
    var offset = 0;

    CafeApi.discover(offset).then(function (response) {
        if (response.next !== null) {
            $scope.hasMore = true;
        }

        $scope.cafes = response.results;
        offset += 30;

    }, function (err) {
        $scope.message = 'Network Error';
    });

    $scope.loadMore = function () {
        CafeApi.discover(offset).then(function (response) {

            if (response.next === null) {
                $scope.hasMore = false;
            }

            angular.forEach(response.results, function (cafe) {
                $scope.cafes.push(cafe);
            });

            offset += 30;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

    $scope.openDetail = function (cafe_id) {
        $state.go('tab.search-cafe-detail', { cafeId: cafe_id });
    };

    // GoogleAnalytics
    $ionicPlatform.ready(function () {
        if (typeof analytics !== 'undefined') {
            analytics.trackView('Discover');
        }
    });
})

.controller('SelectCountryCtrl', function ($scope, LocationApi, $ionicPlatform) {
    $scope.countries = [];

    LocationApi.getCountries().then(function (countries) {
        $scope.countries = countries;
    }, function (err) {
        $scope.message = 'Network Error';
    });

    // GoogleAnalytics
    $ionicPlatform.ready(function () {
        if (typeof analytics !== 'undefined') {
            analytics.trackView('Select Country');
        }
    });
})

.controller('SelectCityCtrl', function ($scope, $stateParams, LocationApi,
                                        $ionicPlatform) {

    LocationApi.getCities($stateParams.countryId).then(function (cities) {
        $scope.total_count = $stateParams.total_count;
        $scope.cities = cities;
        $scope.country_id = $stateParams.countryId;
        $scope.country_name = $stateParams.country_name;

    }, function (err) {
        $scope.message = 'Network Error';
    });

    // GoogleAnalytics
    $ionicPlatform.ready(function () {
        if (typeof analytics !== 'undefined') {
            analytics.trackView('Select City: ' + $stateParams.country_name);
        }
    });
})

.controller('SearchResultCtrl', function ($scope, $stateParams, CafeApi, $ionicPlatform) {

    $scope.cafes = [];
    $scope.hasMore = false;
    var offset = 0;

    CafeApi.search($stateParams.countryId, $stateParams.cityId, offset).then(function (response) {
        if (response.next !== null) {
            $scope.hasMore = true;
        }

        $scope.cafes = response.results;
        offset += 50;

    }, function (err) {
        $scope.message = 'Network Error';
    });

    $scope.loadMore = function () {
        CafeApi.search($stateParams.countryId, $stateParams.cityId, offset).then(function (response) {
            if (response.next === null) {
                $scope.hasMore = false;
            }

            angular.forEach(response.results, function (cafe) {
                $scope.cafes.push(cafe);
            });

            offset += 50;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

    // GoogleAnalytics
    $ionicPlatform.ready(function () {
        if (typeof analytics !== 'undefined') {
            analytics.trackView('Search Result: ' + $stateParams.city_name + ' - ' + $stateParams.country_name);
        }
    });
})

.controller('OptionsCtrl', function ($scope, $cordovaSocialSharing, $cordovaAppVersion, $ionicModal,
                                     $ionicPlatform, $cordovaAppRate, shareMessage, FeedbackApi,
                                     iosAppUrl, androidAppUrl,
                                     $ionicPopup) {

    $ionicPlatform.ready(function () {
        $cordovaAppVersion.getAppVersion().then(function (version) {
            $scope.appVersion = version;
        });
    });

    $scope.socialShare = function () {
        var appUrl;
        if (ionic.Platform.isIOS()) {
            appUrl = iosAppUrl;
        } else {
            appUrl = androidAppUrl;
        }
        $cordovaSocialSharing.share(shareMessage, 'InstaCafe', null, appUrl) // Share via native share sheet
            .then(function (result) {
                if (typeof analytics !== 'undefined') {
                    analytics.trackEvent('Social Share', 'app');
                }
            });
    };

    $scope.leaveReview = function () {
        $ionicPlatform.ready(function () {
            $cordovaAppRate.navigateToAppStore().then(function (result) {
                if (typeof analytics !== 'undefined') {
                    analytics.trackEvent('Review', 'options');
                }
            });
        });
    };

    $scope.formData = {};

    $scope.submit = function (formData) {
        FeedbackApi.send(formData).then(function () {
            $ionicPopup.alert({
                title: 'Thank you for your Feedback',
                template: 'Your Feedback has been sent successfully'
            }).then(function () {
                $scope.closeFeedback();
                $scope.formData.message = '';
            });
        });
    };

    $scope.openFeedback = function () {
        $scope.feedbackModal.show();
    };

    $ionicModal.fromTemplateUrl('templates/modal/feedback.html', {
         scope: $scope,
         animation: 'slide-in-up',
         focusFirstInput: true
    }).then(function (modal) {
        $scope.feedbackModal = modal;
    });

    $scope.closeFeedback = function () {
        $scope.feedbackModal.hide();
        $scope.formData = {};
    };

    /* Destroy modal */
    $scope.$on('$destroy', function() {
        $scope.feedbackModal.remove();
    });

    // GoogleAnalytics
    $ionicPlatform.ready(function () {
        if (typeof analytics !== 'undefined') {
            analytics.trackView('options');
        }
    });
});
