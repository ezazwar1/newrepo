myApp
.controller('SelectionCtrl', function($scope, $state, $ionicGesture, $stateParams, $ionicPlatform, Boards) {

    $scope.showReturn();
    $scope.setPageEvent(false);

    Boards.getOneById($stateParams.id).then(function(boardsResp) {
    	$scope.board = boardsResp;
        $scope.items = boardsResp.likes;
        $timeout( function() {
            document.querySelectorAll('.top').style.width = '100%';
            document.querySelectorAll('.top h1').style.width = '100%';
        }, 200);
    });

    $scope.goFeed = function(id) {
        $state.go('feed', {
            controller : encodeURIComponent('like/selection/' + $stateParams.id),
            current : id,
            options : ''
        });
    };
});
