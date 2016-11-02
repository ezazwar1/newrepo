myApp
.controller('NewsCtrl', function($scope, $state, $stateParams, $ionicPlatform, $ionicGesture, Feed) {

    $scope.showReturn();
    $scope.setPageEvent(true);

    Feed.getById($stateParams.id).then(function(newsResp) {
        $scope.news = newsResp;

        $scope.initView();
        $scope.setCurrentItem($scope.news);

        var date = $scope.news.created.split(' ');
        var dateNews = new Date(date[0]);
        $scope.news.dateNews = dateNews.toISOString();

    }, function(error) {
        console.error('impossible de recuperer cette news');
    });

});
