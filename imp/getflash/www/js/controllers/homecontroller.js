angular.module('controller.home', ['article.services', 'user.services'])
.controller('HomeCtrl', function($state, $scope, $model, $ionicPlatform, $localstorage, ArticleService, $localstorage, AUTH_EVENTS, ModalLoginSignupService, GENERAL_CONS, LokiDB) {

  $scope.feeds = [];

  $scope.title = "<div class='short-logo'><img src='img/logo-short.png' /> <span>GETFASH</span></div>";
  $scope.feedLoader = true;
  $scope.displayFeedEmpty = false;
  
  //pagination:
  $scope.limit = GENERAL_CONS.DEFAULTLIMIT;
  $scope.f_max_id = "";
  $scope.f_loadmore = true;

  $ionicPlatform.ready(function() {
    //init db
    LokiDB.getArticle().then(function(articles){
      LokiDB.removeAllArticle();

      //first time load data when DB init:
      var promise = ArticleService.loadArticle($scope.f_max_id, $scope.limit);
      promise.then(function(result) {
        if(result != null){
          $scope.feeds = []; //reset

          addFeed(result.data, $scope.feeds);

          manageFeedPagination(result.pagination);

          //deep link to particular article
          /*if($localstorage.get('DEEPLINKCONTEST') != "" && $localstorage.get('DEEPLINKCONTEST') != undefined){
            $state.go('tab.arena-detail', {'contestID':$localstorage.get('DEEPLINKCONTEST'), 'contestName':"" });
            $localstorage.set('DEEPLINKCONTEST', "");
          }*/

        }else{
          $scope.displayFeedEmpty = true;
        }

        $scope.feedLoader = false;
      });

    });
  });

	$scope.$on('$ionicView.beforeEnter', function() {
    if($localstorage.get(AUTH_EVENTS.SKIP) == 0 || $localstorage.get(AUTH_EVENTS.SKIP) == undefined || $localstorage.get(AUTH_EVENTS.SKIP) == null){
      $state.go('intro');
    }

    $localstorage.set(GENERAL_CONS.TABACTIVE, 1);
  });

  var addFeed = function(feeds, arraytopush){
    for(var i = 0; i < feeds.length; i++){
      var objToAdd = new $model.Article(feeds[i]);
      LokiDB.addArticle(objToAdd);
      arraytopush.push(objToAdd);
    }
    if(feeds.length > 0){
      $scope.displayFeedEmpty = false;
    }
  };

  var manageFeedPagination = function(pagination){
    if(pagination != undefined){
      $scope.f_max_id = pagination.next_max_id;

      if($scope.f_max_id != ""){
        $scope.f_loadmore = true;
      }
    }
  }

  $scope.doReloadFeed = function(){
    var promise = ArticleService.loadArticle("", $scope.limit);
    promise.then(function(result) {
      if(result != null){
        LokiDB.removeAllArticle();
        //reset
        $scope.feeds = [];
        $scope.f_max_id = "";
        $scope.f_status = 0;
        $scope.f_contesttype = 0;
        $scope.f_loadmore = true;

        addFeed(result.data, $scope.feeds);
        manageFeedPagination(result.pagination);

      }else{
        $scope.displayFeedEmpty = true;
      }

      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.loadMore = function(type){
    $scope.f_loadmore = false;
    if($scope.f_max_id != ""){
      var promise = ArticleService.loadArticle($scope.f_max_id, $scope.limit);
      promise.then(function(result) {
        if(result != null){
          addFeed(result.data, $scope.feeds);
          manageFeedPagination(result.pagination);
        }

        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }else{
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }
  }

  $scope.goToDetail = function(articleid, type, link){
    if(type == 3){
      window.open(link, '_system', 'closebuttoncaption=Done,toolbarposition=top');
    }else{
      $state.go('tab.article-detail', {'articleID':articleid});
    }
  }

  $scope.goToCategory = function(catid){
    if($localstorage.get(GENERAL_CONS.TABACTIVE) == 1){
      $state.go('tab.article-category', {'catID':catid});
    }
  }

});


