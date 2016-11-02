'use strict';

app.controller('SignupController', [
    '$rootScope',
    '$scope',
    '$state',
    '$window',
    '$q',
    '$http',
    '$ionicPopup',
    '$ionicModal',
    '$timeout',
    '$ionicLoading',
    'CONFIG',
    'Session',
    'Auth',
    'Event',
    'Location',
    'Customer',
    function($rootScope, $scope, $state, $window, $q, $http, $ionicPopup, $ionicModal, $timeout, $ionicLoading, CONFIG, Session, Auth, Event, Location, Customer) {
        //Dummy scope for form
        $scope.forms = {};
        $scope.addressValid = false;


        $scope.setForm = function(signup_form) {
            console.log('form init');
            $scope.signup_form = signup_form;
        };

        $rootScope.$on('signupModalOpened', function() {
            console.log('clear form');
            $scope.customer = new Customer({
                timezone: "Australia/Sydney",
                contact_email: ""
            });
            $scope.addressValid = false;
            $scope.signup_form.$setPristine();
        });

        $scope.goFirst = function() {
            $scope.customer = {};
            $rootScope.firstModal.show();
            $rootScope.signupModal.hide();
        };

        $scope.logUserIn = function() {
            //        $rootScope.user_email = $scope.customer.contact_email;
            //        $rootScope.user_password = $scope.customer.password;
            //        $rootScope.$broadcast('loginNew');
            $rootScope.signupModal.hide();
            $rootScope.loginModal.show();
        };


        $scope.serviceAvailable = false;

        $scope.subtitle = "Please enter your business details below to get started";

        $scope.customer = new Customer({
            timezone: "Australia/Sydney"
        });

        $scope.showTerms = function() {
            $rootScope.termsModal.show();
        };

        $scope.showPolicy = function() {
            $rootScope.policyModal.show();
        };

        $scope.goApplySite = function() {
            $window.open(CONFIG.apply_url, '_system');
        };

        $scope.cancel = function() {
            $scope.modal.dismiss('cancel');
        };


        $scope.signup = function() {

            var customer = angular.copy($scope.customer);
            $scope.errors = null;

            if ($scope.addressIsValid) {
                customer.password_confirmation = customer.password;
                try {
                    Customer.signup(customer,
                        function(customer) {
                            var message = "Thanks for signing up, <br/>you are ready to get hiring!"
                            $scope.showLogin('YOU\'RE READY TO GO!', message);

                        }, function(error) {
                            console.log(error.data);
                            $rootScope.notificationMessage = null;

                            if (error.data.code == 'SERVICE_NOT_AVAILABLE') {

                                var message = "Looks like we don't service your area yet. But don't worry we are growing very rapidly and expanding to new areas everyday. We will reach out to you as soon as service becomes available in your area.";
                                $scope.showAlert('ARGH CRIKEY...', message);

                            } else if (error.data.code == 'USER_ALREADY_REGISTERED') {

                                var message = 'Looks like you have account with us already! Simply email support@workninja.com and we can help.';
                                $scope.showAlert('ARGH CRIKEY...', message);

                            } else if (error.data.error == "RecordInvalid") {
                                var message = "Customer record cannot be created something's wrong with the data.";

                                if (error.data.info.address_1) {
                                    message = "We couldn't validate your address";
                                } else if (error.data.info.password) {
                                    message = "Your password needs to be at least 6 characters";
                                } else {

                                }



                                $scope.showAlert('ARGH CRIKEY...', message);
                            } else {
                                var message = 'There is a problem with your signup, please try again';
                                $scope.showAlert('ARGH CRIKEY...', message);
                            }

                        });

                } catch (e) {
                    $scope.showAlert('ARGH CRIKEY...', 'Looks like something is not quite right, please check your entry and try again');
                }
            } else {
                $scope.addressValid = true;
            }

        };

        // Business autocompletion by name

        $scope.autocompleteService = new google.maps.places.AutocompleteService();
        $scope.getBusinesses = function(value) {
            var deferred = $q.defer();
            $scope.autocompleteService.getPlacePredictions({
                input: value,
                types: ['establishment'],
                componentRestrictions: {
                    country: 'au'
                }
            }, function(results, status) {
                if (status === 'OK') {

                    deferred.resolve(results);
                } else {
                    deferred.resolve([]);
                }
            });

            return deferred.promise;
        };

        function getComponent(components, name) {
            if (!angular.isArray(components)) return null;

            for (var i = 0; i < components.length; i++) {
                var c = components[i];
                var found = false;

                for (var j = 0; j < c.types.length; j++) {
                    var t = c.types[j];
                    if (t == name) {
                        found = true;
                        break;
                    }
                }

                if (found) {
                    return c.long_name;
                }
            }

            return null;
        }

        $scope.selectBusiness = function(item, model, label) {
            $scope.customer.business_name = item.terms[0].value;

            var dummy = document.getElementById('map-dummy');
            var service = new google.maps.places.PlacesService(dummy);
            service.getDetails({
                placeId: item.place_id
            }, function(result, status) {

                if (status === 'OK') {
                    $scope.$apply(function() {
                        $scope.customer.address_1 = result.formatted_address;
                        $scope.customer.suburb = getComponent(result.address_components, 'locality');
                        $scope.customer.postcode = getComponent(result.address_components, 'postal_code');
                        $scope.addressIsValid = true;
                        $scope.addressValid = false;
                    });
                }
            });
        }


        // Address autocompletion by name
        $scope.autocompleteAddressService = new google.maps.places.AutocompleteService();
        $scope.getAddresses = function(value) {

            var deferred = $q.defer();
            $scope.addressIsValid = false;
            $scope.autocompleteService.getPlacePredictions({
                input: value,
                types: ['geocode'],
                componentRestrictions: {
                    country: 'au'
                }
            }, function(results, status) {
                if (status === 'OK') {

                    deferred.resolve(results);
                } else {
                    deferred.resolve([]);
                }
            });

            return deferred.promise;
        };

        function getComponent(components, name) {
            if (!angular.isArray(components)) return null;

            for (var i = 0; i < components.length; i++) {
                var c = components[i];
                var found = false;

                for (var j = 0; j < c.types.length; j++) {
                    var t = c.types[j];
                    if (t == name) {
                        found = true;
                        break;
                    }
                }

                if (found) {
                    return c.long_name;
                }
            }

            return null;
        }




        $scope.selectAddress = function(item, model, label) {
            $scope.customer.address_1 = item.terms[0].value;

            var dummy = document.getElementById('map-dummy');
            var service = new google.maps.places.PlacesService(dummy);
            service.getDetails({
                placeId: item.place_id
            }, function(result, status) {

                if (status === 'OK') {
                    $scope.$apply(function() {
                        $scope.customer.address_1 = result.formatted_address;
                        $scope.customer.suburb = getComponent(result.address_components, 'locality');
                        $scope.customer.postcode = getComponent(result.address_components, 'postal_code');
                        $scope.addressIsValid = true;
                        $scope.addressValid = false;
                    });
                }
            });
        };

        $scope.showLogin = function(title, message, cb) {
            if (!$scope.popup) {
                $scope.popup = $ionicPopup.alert({
                    template: message,
                    title: title,
                    okText: 'Login',
                    okType: 'button-assertive'
                });
                $scope.popup.then(function() {
                    if (cb) cb();
                    $scope.logUserIn();
                    delete $scope.popup;
                });
            }
        };


        $scope.showAlert = function(title, message, cb) {
            if (!$scope.popup) {
                $scope.popup = $ionicPopup.alert({
                    template: message,
                    title: title,
                    okText: 'OK',
                    okType: 'button-assertive'
                });
                $scope.popup.then(function() {
                    if (cb) cb();
                    delete $scope.popup;
                });
            }
        };

        $scope.termsAndConditions = function() {
            $window.open(CONFIG.terms_and_conditions_url, '_system');
        };

        $scope.privacyPolicy = function() {
            $window.open(CONFIG.privacy_policy_url, '_system');
        };
    }
]);
