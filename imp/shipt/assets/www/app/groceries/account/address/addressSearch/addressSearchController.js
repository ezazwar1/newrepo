/**
 * Created by Shipt
 */

angular.module('shiptApp').controller('addressSearchController', [
    '$scope',
    '$state',
    'UIUtil',
    'LogService',
    'PlacesAutocomplete',
    '$log',
    '$timeout',
    '$cordovaKeyboard',
    'Geolocator',
    '$stateParams',
    addressSearchController]);

function addressSearchController($scope,
                                  $state,
                                  UIUtil,
                                  LogService,
                                  PlacesAutocomplete,
                                  $log,
                                  $timeout,
                                  $cordovaKeyboard,
                                  Geolocator,
                                  $stateParams) {
    var viewModel = this;
    $scope.search = {searchText: ""};
    viewModel.loadingSpinner = false;
    $scope.$on('$ionicView.afterEnter', function(){
        $('input.typeAheadAddressSearchTextBox').focus();
        viewModel.fromCheckout = angular.fromJson($stateParams.fromCheckout);
    });


    viewModel.resultClick = function(result) {
        try {
            if(result.other){
                confirmAddress(null);
            } else {
                var place = result;
                result.loadingSpinner = true;
                $log.info('place click', place);
                if(place.address_components){
                    viewModel.placeDetails = {result:place};
                    $log.info('placeDetails:',place)
                    var address = parsePlace(viewModel.placeDetails);
                    confirmAddress(address);
                    result.loadingSpinner = false;
                } else {
                    PlacesAutocomplete.getPlaceDetails(place)
                        .then(function(placeDetails){
                            viewModel.placeDetails = placeDetails;
                            $log.info('placeDetails:',placeDetails)
                            var address = parsePlace(viewModel.placeDetails);

                            if (address.street1.includes("undefined")) {
                                address.street1 = place.terms[0].value
                            }

                            confirmAddress(address);
                            result.loadingSpinner = false;
                        },function(error){
                            confirmAddress(null);
                        })
                }

            }
        } catch (e) {
            $log.error(e);
            result.loadingSpinner = false;
            errorSoHandleAsManualEntry();
        }
    };

    function errorSoHandleAsManualEntry() {
        UIUtil.showAlert('An Error Occurred','Please enter you address manually.')
            .then(function(){
                viewModel.resultClick({other: true})
            })
    }

    function confirmAddress(address){
       $state.go('app.addEditAddress', {fromCheckout: angular.toJson(viewModel.fromCheckout),address: angular.toJson(address)});
    }

    function parsePlace(place){
        try {
            var address = {};
            var ourAddress = {};
            var addressForm = {
                street_number: 'short_name',
                route: 'long_name',
                locality: 'long_name',
                administrative_area_level_1: 'long_name',
                postal_code: 'short_name'
            };
            var thePlace = place;
            if (!thePlace.result) {
                thePlace = {
                    result: place
                }
            }
            for(let i of thePlace.result.address_components){
                var addressType = i.types[0];
                if(addressForm[addressType]){
                    var val = i[addressForm[addressType]];
                    address[addressType] = val;
                }
            }
            ourAddress.street1 = address.street_number + ' ' + address.route
            ourAddress.city = address.locality
            ourAddress.state = address.administrative_area_level_1
            ourAddress.zip_code = address.postal_code
            return ourAddress;
        } catch(e) {
            $log.error(e);
            errorSoHandleAsManualEntry();
            return null;
        }
    }

    $scope.$watch('viewModel.search.searchQuery', function (val) {
        if(viewModel.search.searchQuery && viewModel.search.searchQuery != ""){
            viewModel.searchForAddress()
        }
    });

    viewModel.searchForAddress = function() {
        try {
            if(viewModel.search.searchQuery && viewModel.search.searchQuery != ""){
                viewModel.loadingSpinner = true;
                PlacesAutocomplete.searchText(viewModel.search.searchQuery)
                    .then(function(results){
                        $log.info('RESULTS: ', results);
                        viewModel.results = results.predictions;
                        viewModel.loadingSpinner = false;
                        if(viewModel.results == null){
                            viewModel.results = [];
                        }
                    }, function(error) {
                        viewModel.results = [];
                        viewModel.loadingSpinner = false;
                        $log.info('ERROR: ', error);
                    });
            }
        } catch (e) {
            viewModel.results = [];
            viewModel.loadingSpinner = false;
        }
    }

    viewModel.currentLocationClick = function() {
        try {
            viewModel.loadingSpinner = true;
            Geolocator.getCurrentPosition(true)
                .then(function(){
                    var lat = Geolocator.latitude();
                    var long = Geolocator.longitude();
                    PlacesAutocomplete.reverseGeolocationSearch(lat, long)
                        .then(function(data){
                            $log.info('CURRENT LOCATION RESULTS:', data);
                            viewModel.resultClick(data.results[0]);
                            viewModel.loadingSpinner = false;
                        },function(error){
                            UIUtil.showAlert('Error Getting Current Address','')
                        })
                });
        } catch (e){
            $log.error(e);
            viewModel.loadingSpinner = false;
            errorSoHandleAsManualEntry();
        }
    }

    function confirmAddress(address){
       $state.go('app.addEditAddress', {fromCheckout: angular.toJson(viewModel.fromCheckout), fromSearch: angular.toJson(true), address: angular.toJson(address)});
    }

    angular.element('#searchAddressListContent').on('touchstart' , function(){
        $log.info('#searchAddressListContent touchstart');
        $timeout(function () {
            $log.info('#searchAddressListContent timeout');
            if(window.cordova) {
                $log.info('#searchAddressListContent window.cordova');
                if($cordovaKeyboard.isVisible()) {
                    $log.info('#searchAddressListContent cordovaKeyboard.close');
                    $cordovaKeyboard.close();
                }
            }
        }, 1);
    });

};
