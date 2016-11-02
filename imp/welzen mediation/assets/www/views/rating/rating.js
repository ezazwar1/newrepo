'use strict';

angular.module('welzen')

.controller('RatingController', function($scope){

  $scope.popUpActive = false;
  $scope.togglePopUpActive = function() {
   $scope.popUpActive = !$scope.popUpActive;
  };

  $scope.ratingsObject = {
        iconOn: 'ion-ios-star',    //Optional
        iconOff: 'ion-ios-star-outline',   //Optional
        iconOnColor: 'rgb(255, 150, 81)',  //Optional
        iconOffColor:  'rgb(255,255,255)',    //Optional
        rating:  2, //Optional
        minRating:1,    //Optional
        readOnly: true, //Optional
        callback: function(rating) {    //Mandatory
          $scope.ratingsCallback(rating);
        }
      };

  $scope.ratingsCallback = function(rating) {
    console.log('Selected rating is : ', rating);
  };

})

;
