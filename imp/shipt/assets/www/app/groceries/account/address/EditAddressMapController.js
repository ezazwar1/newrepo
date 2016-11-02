/**
 * Created by Shipt
 */

angular.module('shiptApp').controller('EditAddressMapController', [
    '$scope',
    '$state',
    'UIUtil',
    'LogService',
    EditAddressMapController]);

function EditAddressMapController($scope,
                                  $state,
                                  UIUtil,
                                  LogService) {

    $scope.$on('$ionicView.afterEnter', function(){
        getLocation();
    });

    $scope.title = "Edit Address";
    $scope.map = {
        zoom: 14
    };

    $scope.options = {
        scrollwheel: false,
        mapTypeControl: false,
        zoomControl: false,
        streetViewControl: false
    };

    $scope.marker = {
        id: 0,
        options: {draggable: false}
    }


    var events = {
        places_changed: function(searchBox) {
            var place = searchBox.getPlaces();
            $scope.place = place;

            // todo: need to check for place
            $scope.map.center = {latitude: place[0].geometry.location.lat(),longitude: place[0].geometry.location.lng()}
            $scope.marker.coords = {latitude: place[0].geometry.location.lat(),longitude: place[0].geometry.location.lng()}
        }
    }

    $scope.searchbox = {
        template: 'searchbox.tpl.html',
        events:events,
        position: "TOP_CENTER"
     };

    $scope.saveMapLocation = function(){

        if ($scope.place){
            var address = parsePlace();
            confirmAddress(address);
        } else {
            LogService.info({
                message: 'saveMapLocation Error',
                address: address
            });
            var errorMessage = 'Please find an address on the map';
            UIUtil.showErrorAlert(errorMessage);
        }
     };

    function confirmAddress(address){
       $state.go('app.addEditAddress', {address: angular.toJson(address)});
    }

    function getLocation(){

       UIUtil.showLoading("Loading Map");
       navigator.geolocation.getCurrentPosition(function(pos) {
           $scope.map.center = {latitude: pos.coords.latitude,longitude: pos.coords.longitude}
           $scope.marker.coords = {latitude: pos.coords.latitude,longitude: pos.coords.longitude}
           UIUtil.hideLoading();
        })
    }

    function parsePlace(){
        var address = {};
        var ourAddress = {};
        var addressForm = {
            street_number: 'short_name',
            route: 'long_name',
            locality: 'long_name',
            administrative_area_level_1: 'long_name',
            postal_code: 'short_name'
        };

        var thePlace = $scope.place[0];
        for(let i of thePlace.address_components){
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
    }

};
