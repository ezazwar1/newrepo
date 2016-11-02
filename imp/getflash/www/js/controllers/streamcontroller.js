angular.module('controller.stream', [])
.controller('StreamCtrl', function($state, $sce, $stateParams, $cordovaSocialSharing, $ionicTabsDelegate, FACEBOOK_CONFIG, $scope, $model, $ionicPlatform, $localstorage, AUTH_EVENTS, GENERAL_CONS, LokiDB, Scopes, StreamService) {

  $scope.title = "<div class='short-logo'><img src='img/logo-short.png' /> STYLE STREAM</div>";
  $scope.feedLoader = true;
  $scope.displayFeedEmpty = false;
  $scope.feeds = [];

  //pagination:
  $scope.limit = GENERAL_CONS.DEFAULTLIMIT;
  $scope.max_id = "";
  $scope.loadmore = false;

  $ionicPlatform.ready(function(){
    LokiDB.getItemStream()
    .then(function(rs) {
      StreamService.loadStream()
      .then(function(result){
        if(result != null){
          $scope.feeds = []; //reset

          addFeed(result.data.streams);
          manageFeedPagination(result.pagination);
        }else{
          $scope.displayFeedEmpty = true;
        }

        $scope.feedLoader = false;
      });
    });
    
  });

  var addFeed = function(dt){
    for(var i = 0; i < dt.length; i++){
      var objToAdd = new $model.Item(dt[i]);
      LokiDB.addItemStream(objToAdd);
      $scope.feeds.push(objToAdd);
    }

    if($scope.feeds.length > 0){
      $scope.displayFeedEmpty = false;
    }
  };

  var manageFeedPagination = function(pagination){
    if(pagination != undefined){
      $scope.max_id = pagination.next_max_id;

      if($scope.max_id != ""){
        $scope.loadmore = true;
      }
    }
  }

  $scope.loadMore = function(){
    $scope.loadmore = false;
    if($scope.max_id != ""){
      var promise = StreamService.loadStream($scope.max_id, $scope.limit);
      promise.then(function(result) {
        if(result != null){
          addFeed(result.data.streams);
          manageFeedPagination(result.pagination);
        }

        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }else{
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }
  }

  $scope.goToZoomIn = function(itemid){
    $state.go('tab.stream-item-detail', {'itemID':itemid});
  }

	$scope.$on('$ionicView.beforeEnter', function(){
    $localstorage.set(GENERAL_CONS.TABACTIVE, 2);
  });

})