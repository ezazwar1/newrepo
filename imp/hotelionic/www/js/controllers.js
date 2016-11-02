angular.module('starter.controllers', [])
.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $http) {
    // Form data for the login modal
	
})

.controller('logout', function ($scope, $http) {

 window.localStorage.clear();
    window.location = "#/login/login";

})
.controller('first', function ($scope, $http) {

$timeout( function(){ window.location = "#/app/home"; }, 3000);
  
})

.controller('Home', function ($scope, $http,$location) {
  	
})


.controller('search', function ($scope, $http,$location) {
	$scope.navTitle='<center> <label style="border:none;background-color: rgba(0, 0, 0, 0.24);font-size: 16px;height: 27px;margin-top: 10px;border-radius: 14px;" class="item item-input"><i class="ion-ios-search-strong"></i><input style="color: white;" type="text" placeholder="City, area hotel name "></label></center>';
	// date picker //
	$(function() {	
		$( ".datepicker" ).datepicker({
			inline: true,
			showOtherMonths: true
		});
	});
	// end date picker //
	
	// guests count //
		$scope.count=1;
	  $scope.increment=function(){
	   $scope.count=$scope.count+1;
	  }
	  $scope.decrement=function(){
	   if($scope.count>1)
	   $scope.count=$scope.count-1;
	  }
  // Guests count end //
  
  // room count //
		$scope.room=1;
	  $scope.increment2=function(){
	   $scope.room=$scope.room+1;
	  }
	  $scope.decrement2=function(){
	   if($scope.room>1)
	   $scope.room=$scope.room-1;
	  }
  // room count end //
  
})
.controller('filter', function ($scope, $http,$location) {
	$scope.ratingsObject = {
        iconOn : 'ion-ios-star',
        iconOff : 'ion-ios-star',
        iconOnColor: 'rgb(248, 194, 39)',
        iconOffColor:  '#d4d5d9',
        rating:  2,
        minRating:1,
        callback: function(rating) {
          $scope.ratingsCallback(rating);
        }
      };

      $scope.ratingsCallback = function(rating) {
        console.log('Selected rating is : ', rating);
      };

		      $(function() {
				var icons = {
				  header: "ui-icon-circle-arrow-e",
				  activeHeader: "ui-icon-circle-arrow-s"
				};
				$( "#accordion" ).accordion({
				  icons: icons
				});
				$( "#toggle" ).button().click(function() {
				  if ( $( "#accordion" ).accordion( "option", "icons" ) ) {
					$( "#accordion" ).accordion( "option", "icons", null );
				  } else {
					$( "#accordion" ).accordion( "option", "icons", icons );
				  }
				});
			  });

})
.controller('discover', function ($scope, $http,$location) {
	$scope.count=1;
  $scope.increment=function(){
   $scope.count=$scope.count+1;
  }
  $scope.decrement=function(){
   if($scope.count>1)
   $scope.count=$scope.count-1;
  }
	$scope.addshow=function(){
	
		if($scope.address==true)
			$scope.address=false;  
		else
			$scope.address=true;  
	}
	
  	$scope.ratingsObject = {
        iconOn : 'ion-ios-star',
        iconOff : 'ion-ios-star',
        iconOnColor: 'rgb(248, 194, 39)',
        iconOffColor:  '#d4d5d9',
        rating:  2,
        minRating:1,
        callback: function(rating) {
          $scope.ratingsCallback(rating);
        }
      };

      $scope.ratingsCallback = function(rating) {
        console.log('Selected rating is : ', rating);
      };
	
})
.controller('detail', function ($scope, $http,$location) {
	$scope.ratingsObject = {
        iconOn : 'ion-ios-star',
        iconOff : 'ion-ios-star',
        iconOnColor: 'rgb(248, 194, 39)',
        iconOffColor:  '#d4d5d9',
        rating:  2,
        minRating:1,
        callback: function(rating) {
          $scope.ratingsCallback(rating);
        }
      };

      $scope.ratingsCallback = function(rating) {
        console.log('Selected rating is : ', rating);
      };
})
.controller('login', function ($scope, $http,$location) {
 
})

.controller('main_page', function ($scope, $http,$location) {
 
})
.controller('register', function ($scope, $http,$location) {
 
})










