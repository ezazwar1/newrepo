angular.module('controller.search', ['article.services', 'user.services', 'search.services'])
.controller('SearchCtrl', function($state, $scope, $model, $ionicPlatform, $localstorage, ArticleService, SearchService, $localstorage, AUTH_EVENTS, ModalLoginSignupService, GENERAL_CONS, LokiDB) {

  $scope.feeds = [];
  $scope.model = {
    search: ''
  }

  //pagination:
  $scope.limit = 2;
  $scope.max_id = "";
  $scope.loadmore = true;
  $scope.searchLoader = false;
  $scope.displayEmptySearch = false;
  $scope.displayListCategory = true;
  $scope.title = "<div class='short-logo'><img src='img/logo-short.png' /> SEARCH</div>";
  
  $ionicPlatform.ready(function() {
    //do something
    $scope.feeds = [];
  });

  $scope.onTextChanged = function(){
    //search contest here:
    $scope.searchLoader = true;
    $scope.displayEmptySearch = false;
    $scope.feeds = []; //reset

    if($scope.model.search.trim() != ""){
      var promise = SearchService.searchArticle($scope.model.search, $scope.max_id, $scope.limit);
      promise.then(function(result) {
        if(result != null){
          addFeed(result.data);

          manageFeedPagination(result.pagination);
        }else{
          $scope.displayEmptySearch = true;
        }

        $scope.searchLoader = false;
      });
      $scope.displayListCategory = false;
    }else{
      $scope.searchLoader = false;
      $scope.displayEmptySearch = false;
      $scope.displayListCategory = true;
    }
  };

   var addFeed = function(feeds){
    for(var i = 0; i < feeds.length; i++){
      var objToAdd = new $model.Article(feeds[i]);
      //check curr db:
      var curr = LokiDB.findArticle(feeds[i]._id.$oid);
      if(curr == null){
        LokiDB.addArticle(objToAdd)
      }
      $scope.feeds.push(objToAdd);
    }

    if($scope.feeds.length < 1){
      $scope.displayEmptySearch = true;
    }
  };

  var manageFeedPagination = function(pagination){
    if(pagination != undefined){
      $scope.max_id = pagination.next_max_id;

      if($scope.f_max_id != ""){
        $scope.loadmore = true;
      }
    }
  }

  $scope.loadMore = function(type){
    $scope.loadmore = false;
    if($scope.max_id != ""){
      var promise = SearchService.searchArticle($scope.model.search, $scope.max_id, $scope.limit);
      promise.then(function(result) {
        if(result != null){
          addFeed(result.data);

          manageFeedPagination(result.pagination);
        }else{
          $scope.displayEmptySearch = true;
        }

        $scope.searchLoader = false;
      });
    }else{
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }
  }

  $scope.goToCategory = function(cat) {
    $state.go('tab.search-article-category', {'catID':cat});
  }

  $scope.goToArticle = function(articleid, type, link){
      if(type == 3){
        window.open(link, '_blank', 'closebuttoncaption=Done,toolbarposition=top');
      }else{
        $state.go('tab.search-article-detail', {'articleID':articleid});
      }
  };

  $scope.$on('$ionicView.beforeEnter', function() {
    $localstorage.set(GENERAL_CONS.TABACTIVE, 4);
  });

});


