angular.module('HitchedApp')
    .controller('WeddingCtrl', function($scope, $location, $modal, $log, Auth, WeddingInfo) {
        $scope.errors = {};
        $scope.submitted = false;
        $scope.editWedding = false;
        $scope.firstEditWedding = true;
        $scope.chosenPlace;

        $(window).keydown(function(event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                return false;
            }
        });

        var map;
        var mapOptions = {
            zoom: 10,
            center: new google.maps.LatLng(-34.397, 150.644)
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        // Get the wedding information
        Auth.getCurrentUser().$promise.then(function(user) {
            $scope.user = user;
            WeddingInfo.userWedding(user.wedding).$promise.then(function(data) {

                // Load the wedding information into the scope
                $scope.wedding = data;

                // If nothing is completed, start off in edit mode
                if (typeof data.firstName === 'undefined') {
                    $scope.editWedding = true;
                    $scope.wedding.firstName = $scope.user.name;
                }else{
                    $scope.firstEditWedding = false;
                }

                if (typeof $scope.wedding.location !== 'undefined') {
                    var request = {
                        placeId: $scope.wedding.location
                    };

                    service = new google.maps.places.PlacesService(map);
                    service.getDetails(request, callback);

                    function callback(place, status) {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            $scope.$apply(function() {
                                var address = '';
                                if (place.address_components) {
                                    address = [
                                        (place.address_components[0] && place.address_components[0].short_name || '') + ' ' +
                                        (place.address_components[1] && place.address_components[1].short_name || ''), (place.address_components[2] && place.address_components[2].short_name || '') + ', ' +
                                        (place.address_components[3] && place.address_components[3].short_name || ''), (place.formatted_phone_number || '')
                                    ].join('<br />');
                                }

                                $scope.googleplaceURL = place.url;
                                $("#weddingAddress").html('<div><strong>' + place.name + '</strong><br>' + address);

                                mapOptions = {
                                    zoom: 10,
                                    center: place.geometry.location
                                };
                                map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

                                var marker = new google.maps.Marker({
                                    position: place.geometry.location,
                                    map: map,
                                    title: place.name
                                });
                            });
                        }
                    }
                }
            }, function() {}, function() {});
        });

        // Switch to edit mode
        $scope.editWeddingInit = function() {
            $scope.editWedding = true;
        };

        // Cancel out of edit mode
        $scope.cancelWeddingInit = function() {
            $scope.editWedding = false;
        };

        // TODO: Encode the information before passing it across?

        // Save the wedding information
        $scope.saveWedding = function(form) {
            $log.info('Saving Wedding');
            $scope.submitted = true;

            if (form.$valid) {
                WeddingInfo.update($scope.wedding).then(function() {

                    $scope.submitted = false;
                    $scope.editWedding = false;

                    var modalInstance = $modal.open({
                        templateUrl: 'components/alert/alert.html',
                        controller: 'AlertCtrl',
                        windowClass: 'hitched-modal',
                        resolve: {
                            alertTitle: function() {
                                return 'Success!';
                            },
                            alertBody: function() {
                                return 'Your wedding details have been saved!'
                            },
                            alertClass: function() {
                                return 'alert-success'
                            }
                        }
                    });

                    modalInstance.result.then(function(result) {

                    }, function() {
                        $log.info('Modal dismissed at: ' + new Date());
                    });

                }).catch(function(err) {
                    err = err.message;
                    $scope.errors.other = err.message;
                });
            }
        };
    });