'use strict';

app.controller('CustomerAddWorkplaceController', [
  '$scope',
  '$rootScope',
  '$state',
  '$window',
  '$q',
  '$timeout',
  'Auth',
  'Tracker',
  'customer',
  'Customer',
  'CustomerWorkplace',
  'Workplace',
  'toaster',
function($scope, $rootScope, $state, $window, $q, $timeout, Auth, Tracker, customer, Customer, CustomerWorkplace, Workplace, toaster) {

    var bCheck = false;
 
    // Business autocompletion by name
    $scope.autocompleteService = new google.maps.places.AutocompleteService();
    $scope.geocoder = new google.maps.Geocoder();

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
                }
                else {
                    deferred.resolve([]);
                }
            }
        );

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
        $scope.workplace.name = item.terms[0].value;

        var dummy = document.getElementById('map-dummy');
        var service = new google.maps.places.PlacesService(dummy);
        service.getDetails({
            placeId: item.place_id
        }, function(result, status) {
            console.log(result.address_components);
            if (status === 'OK') {
                $scope.$apply(function() {
                    $scope.workplace.address_1 = result.formatted_address;
                    $scope.workplace.suburb = getComponent(result.address_components, 'locality');
                    $scope.workplace.postcode = getComponent(result.address_components, 'postal_code');
                    $scope.workplace.state = getComponent(result.address_components, 'administrative_area_level_1', true);
                    $scope.workplace.state_id = $scope.getStateId($scope.workplace.state);
                    $scope.workplace.country_id = 13;
                    $scope.addressIsValid = true;
                    $scope.addressValid = false;
                });
            }
        });
    };

    $scope.getAddress_1 = function(s) {
        var arr = s.split(',');
        console.log(arr[0]);
        return arr[0];
    };
    
    
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
                }
                else {
                    deferred.resolve([]);
                }
            }
        );

        return deferred.promise;
    };

    function getComponent(components, name, short) {
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
                if(short) {
                    return c.short_name;
                } else {
                    return c.long_name;
                }
                
            }
        }

        return null;
    } 
     
    
    $scope.selectAddress = function(item, model, label) {
        $scope.workplace.address_1 = item.terms[0].value;

        var dummy = document.getElementById('map-dummy');
        var service = new google.maps.places.PlacesService(dummy);
        service.getDetails({
            placeId: item.place_id
        }, function(result, status) {
            if (status === 'OK') {
                $scope.$apply(function() {
                    $scope.workplace.address_1 = result.formatted_address;
                    $scope.workplace.suburb = getComponent(result.address_components, 'locality');
                    $scope.workplace.postcode = getComponent(result.address_components, 'postal_code');
                    $scope.workplace.state = getComponent(result.address_components, 'administrative_area_level_1', true);
                    $scope.workplace.state_id = $scope.getStateId($scope.workplace.state);
                    $scope.workplace.country_id = 13;
                });
            }
        });
    };

    $scope.getStateId = function (st) {
        switch (st) {
          case "ACT":
            return 1;
            break;
          case "NSW":
            return 2;
            break;
          case "NT":
            return 3;
            break;
          case "QLD":
            return 4;
            break;
          case "SA":
            return 5;
            break;
          case "TAS":
            return 6;
            break;
          case "VIC":
            return 7;
            break;
          case "WA":
            return 8;
            break;
          default:
            return 2;
        }
    };

    $scope.getLatLng = function (address) {
        $scope.geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            console.log(results[0].geometry.location);
            $scope.workplace.latitude = results[0].geometry.location.lat();
            $scope.workplace.longitude = results[0].geometry.location.lng();
            $scope.callAPI();
          } else {
            $scope.callAPI();
          }
        });
    };

    $scope.callAPI = function () {
        if($rootScope.workplaceEditUpdate) {
            Workplace.update({workplaceId: $scope.workplace.id}, $scope.workplace, function(res){
                if(res.id !== null) {
                    //$scope.showToast('Workplace added');
                    $state.go('app.customer.organisation');
                } else {
                    //failed to add
                    $scope.showToast('Crikey, something went wrong');
                }
            }); 
            $state.go('app.customer.organisation');

        } else {
           Customer.addWorkplace({customerId: customer.id}, $scope.workplace, function(res){
                if(res.id !== null) {
                    //$scope.showToast('Workplace added');
                    $state.go('app.customer.organisation');
                } else {
                    //failed to add
                    $scope.showToast('Crikey, something went wrong');
                }
            }); 
        }
        
    };

    $scope.addWorkplace = function () {
        $scope.getLatLng($scope.workplace.address_1);
        $scope.workplace.address_1 = $scope.getAddress_1($scope.workplace.address_1);
        
    };

    $scope.canAddWorkplace = function () {
        if($scope.workplace.name.length>0 && $scope.workplace.address_1.length>2) {
            return true;
        } else {
            return false;
        };
    };

    $scope.showToast = function(message) {
        $timeout(function() {
          toaster.pop('info', null, message, 7000);
        }, 1000);
    };


    if($rootScope.workplaceEditUpdate) {
        $scope.workplace = $rootScope.workplaceEdit;
        $scope.update = $rootScope.workplaceEditUpdate;
        $scope.btnMsg = "UPDATE";
        $scope.workplaceMsg = "UPDATE WORKPLACE";
    } else {
        $scope.workplace = {
                       address_1: "",
                       name: "",
                       suburb: "",
                       postcode: "",
                       country_id:-1,
                       role_ids: $rootScope.allRoles,
                       manager_ids: $rootScope.allManagers
                      };
        $scope.btnMsg = "ADD WORKPLACE";
        $scope.workplaceMsg = "ADD NEW WORKPLACE";
    }
  
}]);
