angular.module('starter.services')

.service('LocationService', function($q){
  var autocompleteService = new google.maps.places.AutocompleteService();
  var detailsService = new google.maps.places.PlacesService(document.createElement("input"));
  return {
    searchAddress: function(input) {
      var deferred = $q.defer();

      autocompleteService.getPlacePredictions({
        input: input
      }, function(result, status) {
        if(status == google.maps.places.PlacesServiceStatus.OK){
          deferred.resolve(result);
        }else{
          deferred.reject(status)
        }
      });

      return deferred.promise;
    },
    getDetails: function(placeId) {
      var deferred = $q.defer();
      detailsService.getDetails({placeId: placeId}, function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }
  };
})



.directive('locationBox',function(){
	return {
		scope: {
		  pholder:'@',	
		  resetfun:'&',
		  query:'=',
		  location:'='	
		},
		restrict: 'E',
		controller:function($scope,$rootScope,$timeout) {
			var utils = this;
			$scope.btnLocClose = false;
			$scope.$watch("location", function(tmval){ if(typeof(tmval)!='undefined')$scope.btnLocClose = true; });
			
			$scope.resetMaster = function(){ 
				$scope.btnLocClose = false; 
				$scope.$broadcast("clear-input");
				$scope.resetfun({data:''});
			};

		},
		template:'<div  class="item-input-wrapper searchWrapper">'
			+'<i class="icon ion-search placeholder-icon"></i>'
			+'<input type="text" placeholder="{{pholder}}" location-suggestion location="location" ng-model="query">'
			+'<i ng-if="btnLocClose" ng-click="resetMaster();" class="icon ion-ios-close placeholder-icon"></i> '
			+'</div>',
		replace: true
	};
})

.directive('locationSuggestion', function($ionicModal,$timeout, LocationService){
  return {
    restrict: 'A',
    scope: {
      location: '=',
	  getlocation:'&'
    },
    link: function($scope, element,locationCtrl){
      //console.log('locationSuggestion started!');
      $scope.search = {};
      $scope.search.suggestions = [];
      $scope.search.query = "";
      $ionicModal.fromTemplateUrl('js/location/location.html', {
        scope: $scope,
        focusFirstInput: true
      }).then(function(modal) {
        $scope.modal = modal;
      });
      element[0].addEventListener('focus', function(event) {
        $scope.open();
      });
	  element[0].addEventListener('click', function(event) {
        $scope.open();
      });
      $scope.$watch('search.query', function(newValue) {
        if (newValue) {
          LocationService.searchAddress(newValue).then(function(result) {
            $scope.search.error = null;
            $scope.search.suggestions = result;
			$scope.btngLocClose = true;
          }, function(status){
            $scope.search.error = "There was an error :( " + status;
          });
        };
        $scope.open = function() {  $scope.modal.show();  };
        $scope.close = function() { $scope.modal.hide();  };

        $scope.choosePlace = function(place) {
          LocationService.getDetails(place.place_id).then(function(location) {
			$scope.getlocation({data:location});
            $scope.location = location;
			$scope.search.query =  $scope.location.formatted_address ;
            $scope.close();
			
          });
        };
      });
	
	  	$scope.$on("clear-input", function(){ element[0].value=''; 	});
    },
	controller:function($scope,$timeout) {
		$scope.resetGlocation = function(){
			$scope.search.query='';
			$scope.search.suggestions = '';
			$scope.btngLocClose = false;
		}
	}
  }
});
