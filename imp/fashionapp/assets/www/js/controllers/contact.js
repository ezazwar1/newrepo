myApp
.controller('ContactCtrl', function($scope, $state, $ionicGesture, $stateParams, $ionicPlatform, Profile) {
    $scope.setPageEvent(true);
    $scope.changeMenuLabel('contact');

    Profile.getLikesProfile().then(function(contactResp) {
        $scope.contacts = contactResp;
    });
});
