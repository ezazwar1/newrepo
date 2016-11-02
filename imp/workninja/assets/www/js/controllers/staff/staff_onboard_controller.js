'use strict';

app.controller('StaffOnboardController', [
    '$scope',
    '$rootScope',
    '$state',
    '$window',
    '$timeout',
    'Auth',
    'Tracker',
    'Session',
    'Event',
    'Location',
    'staff',
 function($scope, $rootScope, $state, $window, $timeout, Auth, Tracker, Session, Event, Location, staff) {

     $scope.staff = staff;
     if ($scope.staff._original === undefined) {
         $scope.staff._original = angular.copy($scope.staff);
     }
     $scope.inSetup = !$scope.staff.isSetupComplete();
     // $scope.inSetup = true;
     $scope.session = Session;

     $scope.title = function() {
         if ($scope.inSetup)
             return "Welcome";
         else
             return "Profile";
     };

     $scope.canUpdate = function() {
         return $scope.staff.isSetupComplete();
     };

     $scope.goMain = function() {
         if ($scope.staff._original !== undefined) {
             angular.copy($scope.staff._original, $scope.staff);
             delete $scope.staff._original;
         }
         $rootScope.clearHistory();
         $state.go('app.staff.main');
     };

     $scope.goOnboard = function(board_num) {
         $rootScope.clearHistory();

         if(ionic.Platform.isAndroid() ) {

             if(board_num==3) {
                 //Event.registerNotify();
                 //Event.locationManagerRegister();
                 Event.subscribe();
                 board_num=5;
             }
         }
         else {
              //push notification allow
              console.log(board_num);

             if (board_num==4 ) {
                 Event.registerNotify();
             }
             else if (board_num==5 ) {
                 Event.locationManagerRegister();
             }

             else if(board_num==6) {
                 console.log("subscribing now");
                 Event.subscribe();
             }
         }
         $state.go('app.staff.onboard'+board_num);

     };

     $scope.updateProfile = function() {
         $scope.staff.use_availability_zones = true;
         $scope.staff.$update().then(function() {
             delete $scope.staff._original;
             $rootScope.clearHistory();
             if($scope.staff.picture_thumb_url === null) {
                //alert("Please upload your profile pic");
                $scope.showAlert('Profile', "Please upload your profile pic");
                //BW Todo remove this
                //$scope.goOnboard(3);
             }
             else {
                $scope.goOnboard(3);
             }
         });
     };

     $scope.editProfilePicture = function() {
         function onSuccess(imageData) {
             $scope.$apply(function() {
                 $scope.staff.picture_url = 'data:image/jpeg;base64,' + imageData;
                 // template uses picture_thumb_url, fake it for display
                 $scope.staff.picture_thumb_url = $scope.staff.picture_url;
             });
         }

         function onFail(message) {
             $scope.showAlert('Camera', message);
         }

         navigator.camera.getPicture(onSuccess, onFail, {
             sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
             quality: 100,
             destinationType: Camera.DestinationType.DATA_URL,
             allowEdit: true,
             encodingType: Camera.EncodingType.JPEG,
             targetWidth: 600,
             targetHeigth: 600,
             correctOrientation: true,
             saveToPhotoAlbum: false,
             cameraDirection: Camera.Direction.BACK
         });
     };

     $scope.onboard_slides = [
         {image: 'img/onboard-staff-07-00.png', description: 'When you\'re ready to work tap \'start standby\''},
         {image: 'img/onboard-staff-07-01.png', description: 'You will start to receive shift offers, so keep an eye out!'},
         {image: 'img/onboard-staff-07-02.png', description: 'When you receive a shift offer confirm if you\'re ready or not' },
         {image: 'img/onboard-staff-07-03.png', description: 'If you are the nearest available ninja, you will be hired and you need to make a move!'},
         {image: 'img/onboard-staff-07-04.png', description: 'When you arrive, introduce yourself, clock on and commence kicking ass'},
         {image: 'img/onboard-staff-07-05.png', description: 'When your shift is over \nsimply tap clock off'},
         {image: 'img/onboard-staff-07-06.png', description: 'You will be emailed your \ntimesheet and asked to \nprovide feedback'}
     ];
     $scope.onboard_direction = 'left';
     $scope.onboard_currentIndex = 0;

     $scope.setCurrentSlideIndex = function (index) {
         $scope.onboard_direction = (index > $scope.onboard_currentIndex) ? 'left' : 'right';
         $scope.onboard_currentIndex = index;
     };

     $scope.isCurrentSlideIndex = function (index) {
         if($scope.onboard_currentIndex> $scope.onboard_slides.length - 1) {
             event.preventDefault();
             $scope.goOnboard(7);
             return;
         }

         return $scope.onboard_currentIndex === index;
     };

     $scope.onboard_prevSlide = function () {

             $scope.onboard_direction = 'left';
             $scope.onboard_currentIndex = ++$scope.onboard_currentIndex;

     };

     $scope.onboard_nextSlide = function () {

         $scope.onboard_direction = 'right';
         $scope.onboard_currentIndex = ($scope.onboard_currentIndex > 0) ? --$scope.onboard_currentIndex : $scope.onboard_slides.length - 1;
     };


}]);
