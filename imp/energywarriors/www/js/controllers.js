angular.module('starter.controllers', [])
// .constant("dykUrl", "http://192.168.1.111:3000/api/v1/dyk/")
// .constant("profileUrl", "http://192.168.1.111:3000/api/v1/profiles/")

.constant("dykUrl", "http://104.131.76.178:3000/api/v1/dyk/")
.constant("profileUrl", "http://104.131.76.178:3000/api/v1/profiles/")

// .run(function($http) {
//   $http.defaults.headers.common.Authorization = 'Basic YmVlcDpib29w';
// })
/////////////////
/**
 * Chats/Stories
 */
 ///////////////
.controller('ChatsCtrl', function($rootScope, $scope, $state, $http, Chats) {

  Chats.getChats()
  .then(function(chats){
    $scope.chats = chats;
	});

  $scope.direct = function(id) {
    $scope.getById = Chats.get(id);

    if ($scope.getById.type === 'video') {
      $scope.videoPath = window.open($scope.getById.videoLink,'_blank','location=no');return false;
    } else {
      Chats.setChatId($scope.getById._id);
      $state.go('tab.chat-detail');
    }

  };

})

//stories details controller
.controller('ChatDetailCtrl', function($rootScope, $scope, $stateParams, $ionicModal, Chats) {

  //$scope.chat = Chats.get($stateParams.chatId);
  var tempId = Chats.getChatId();
  $scope.chat = Chats.get(tempId);

  // $scope.story = false;
  // $scope.dyk = false;

  if ($scope.chat.type === 'story') {
    $scope.story = true;
  }
  if ($scope.chat.type === 'dyk') {
    $scope.dyk = true;
  }

  $scope.contents = $scope.chat.content;

  // $scope.allImages = [{
  //   'src' : 'http://www.splicedevelop.com/holding/ewp/roberts.jpg'
  // }, {
  //   'src' : 'http://www.splicedevelop.com/holding/ewp/roberts.jpg'
  // }, {
  //   'src' : 'http://www.splicedevelop.com/holding/ewp/roberts.jpg'
  // }];
  //
  // $scope.showImages = function(index) {
  //   $scope.activeSlide = index;
  //   $scope.showModal('templates/image-popover.html');
  // };
  //
  // $scope.clipSrc = 'https://www.youtube.com/embed/7mWTQ1LTzs0?list=PLDQ1SztOjkOmfrTw7Pgt8sP_bmyT9Xlvr';
  //
  // $scope.playVideo = function() {
  //   $scope.showModal('templates/video/video-popover.html');
  // };
  //
  // $scope.showModal = function(templateUrl) {
  //   $ionicModal.fromTemplateUrl(templateUrl, {
  //     scope: $scope,
  //     animation: 'slide-in-up'
  //   }).then(function(modal) {
  //     $scope.modal = modal;
  //     $scope.modal.show();
  //   });
  // };
  //
  // // Close the modal
  // $scope.closeModal = function() {
  //   $scope.modal.hide();
  //   $scope.modal.remove();
  // };


})

/////////////////
/**
 * Profiles
 */
 ///////////////
 //main profile controller
.controller('ProfileCtrl', function($scope, $state, $ionicViewSwitcher, $ionicLoading, ProfileDetails) {

  $scope.loadingIndicator = $ionicLoading.show({
	    content: 'Loading Data',
	    animation: 'fade-in',
	    noBackdrop: false,
	    maxWidth: 200,
	    showDelay: 100
	});
  //$scope.chats = ProfileDetails.allProfiles();

  ProfileDetails.getProfiles()
  .then(function(profiles){
    $scope.profiles = profiles;
    //console.log($scope.chats[1]._id);
    $ionicLoading.hide();
	});

  $scope.director = function(id) {
    ProfileDetails.setProfileId(id);
    //$ionicViewSwitcher.nextDirection('up');
    $state.go('tab.profileDetail');

  };
})
//profile details controller
.controller('ProfileDetailCtrl', function($scope, $state, $ionicViewSwitcher, $ionicModal, $ionicPlatform, $ionicPopup, ProfileDetails) {

  $scope.profile = ProfileDetails.allProfiles();

  //$scope.interview = ProfileDetails.allInterviews();

  $scope.ind = ProfileDetails.getProfileId();

  $scope.interviewById = ProfileDetails.getInterviewsById($scope.ind);

  $scope.interview = $scope.interviewById[0];

  $scope.playVid = function(path) {
    window.open(path,'_blank','location=no');return false;
  };

  //$scope.videoPath = window.open('https://youtu.be/R_3tGKTUg1I?list=PLDQ1SztOjkOmfrTw7Pgt8sP_bmyT9Xlvr','_blank','location=no');return false;


  // $scope.playVideo = function() {
  //   $scope.showModal('templates/video/video-popover-profiles.html');
  // };
  //
  // $scope.showModal = function(templateUrl) {
  //   $ionicModal.fromTemplateUrl(templateUrl, {
  //     scope: $scope,
  //     animation: 'slide-in-up'
  //   }).then(function(modal) {
  //     $scope.modal = modal;
  //     $scope.modal.show();
  //   });
  // };
  //
  // // Close the modal
  // $scope.closeModal = function() {
  //   $scope.modal.hide();
  //   $scope.modal.remove();
  // };

  // $ionicPlatform.registerBackButtonAction(function () {
  //     // event.preventDefault();
  //     // event.stopPropagation();
  //     $scope.controlVideo();
  //   // alert('going back');
  // }, 100);


})

/////////////////
/**
 * Connect
 */
 ///////////////
 //main connect controller
.controller('ConnectCtrl', function($scope, $ionicModal) {

  //TODO: corodova add the email composer plugin
  // $scope.sendEmail= function() {
  //       if(window.plugins && window.plugins.emailComposer) {
  //           window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
  //               console.log("Response -> " + result);
  //           },
  //           "Feedback for your App", // Subject
  //           "",                      // Body
  //           ["test@example.com"],    // To
  //           null,                    // CC
  //           null,                    // BCC
  //           false,                   // isHTML
  //           null,                    // Attachments
  //           null);                   // Attachment Data
  //       }
  //   };



});
