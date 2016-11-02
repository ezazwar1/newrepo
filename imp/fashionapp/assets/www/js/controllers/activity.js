myApp
.controller('ActivityCtrl', function($scope, $state, $stateParams, $ionicPlatform, $ionicGesture, Profile) {

    $scope.hideReturn();
    $scope.setPageEvent(false);
    $scope.changeMenuLabel('activity');

    Profile.getActivity().then(function(activityResp){

        if (activityResp.length <= 0) {
            activityResp = 'No activity';
        }

        $scope.activities = activityResp;
    });
});
