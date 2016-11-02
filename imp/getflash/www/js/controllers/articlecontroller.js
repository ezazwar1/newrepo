angular.module('controller.article', ['item.services'])
.controller('ArticleCtrl', function($state, $sce, $stateParams, $cordovaSocialSharing, $ionicTabsDelegate, FACEBOOK_CONFIG, $scope, $model, $ionicPlatform, $localstorage, AUTH_EVENTS, GENERAL_CONS, LokiDB, Scopes, ItemService, ModalJoinContestService, ArticleService) {

  Scopes.store('ArticleCtrl', $scope);

  $scope.title = "";
  $scope.articleID = "";
  $scope.mainCategory = "";
  $scope.feedLoader = true;
  $scope.displayFeedEmpty = false;
  $scope.feeds = [];
  $scope.displayItem = true;
  $scope.blogHtml  = "";
  $scope.isJoined = false;

  $ionicPlatform.ready(function(){
    $scope.articleID = $stateParams.articleID;

    var detail = LokiDB.findArticle($scope.articleID);
    
    if(detail == null){
      ArticleService.loadArticleDetail($scope.articleID)
      .then(function(data){
        var objToAdd = new $model.Article(data.article);
        LokiDB.addArticle(objToAdd);
        $scope.articleDetail = objToAdd;

        //main category:
        if($scope.articleDetail.articleCategories.length > 0){
          $scope.mainCategory = $scope.articleDetail.articleCategories[0].category;
        }else{
          $scope.mainCategory = "category";
        }

        if($scope.articleDetail.articleType == "1" || $scope.articleDetail.articleType == "2"){
          $scope.displayItem = true;
          //get item from server:
          LokiDB.getItem().then(function(itm){
            //remove all records in DB:
            LokiDB.removeAllArticleItem($scope.articleID);

            //first time load data when DB init:
            var promise = ItemService.loadArticleItems($scope.articleID);
            promise.then(function(result) {
              if(result != null){
                $scope.isJoined = result.isjoined;
                addFeed(result.data);
              }else{
                $scope.displayFeedEmpty = true;
              }

              $scope.feedLoader = false;
            });
          });
        }else{
          $scope.displayItem = false;
          $scope.feedLoader = false;
        }
      });
    }else{
      $scope.articleDetail = detail;
      //main category:
      if($scope.articleDetail.articleCategories.length > 0){
        $scope.mainCategory = $scope.articleDetail.articleCategories[0].category;
      }else{
        $scope.mainCategory = "category";
      }

      if($scope.articleDetail.articleType == "1" || $scope.articleDetail.articleType == "2"){
        $scope.displayItem = true;
        //get item from server:
        LokiDB.getItem().then(function(itm){
          //remove all records in DB:
          LokiDB.removeAllArticleItem($scope.articleID);

          //first time load data when DB init:
          var promise = ItemService.loadArticleItems($scope.articleID);
          promise.then(function(result) {
            if(result != null){
              $scope.isJoined = result.isjoined;
              addFeed(result.data);
            }else{
              $scope.displayFeedEmpty = true;
            }

            $scope.feedLoader = false;
          });
        });
      }else{
        $scope.displayItem = false;
        $scope.feedLoader = false;
      }
    }

  });

  var addFeed = function(data){
    $scope.feeds = [];
    for(var i = 0; i < data.length; i++){
      var objToAdd = new $model.Item(data[i]);
      LokiDB.addItem(objToAdd);
      $scope.feeds.push(objToAdd);
    }

    if($scope.feeds.length < 1){
      $scope.displayFeedEmpty = false;
    }
  };

  $scope.openArticleWeb = function(articleLink){
    window.open(articleLink, '_system', 'closebuttoncaption=Done,toolbarposition=top');
  }

  $scope.trustAsHtml = function(string) {
    return $sce.trustAsHtml(string);
  };

  $scope.goToZoomIn = function(itemid){
    if($localstorage.get(GENERAL_CONS.TABACTIVE) == 1){
      $state.go('tab.item-detail', {'itemID':itemid});
    }else if($localstorage.get(GENERAL_CONS.TABACTIVE) == 4){
      $state.go('tab.search-item-detail', {'itemID':itemid});
    }else if($localstorage.get(GENERAL_CONS.TABACTIVE) == 5){
      $state.go('tab.more-item-detail', {'itemID':itemid});
    }
  }

  $scope.goToCategory = function(catid){
    if($localstorage.get(GENERAL_CONS.TABACTIVE) == 1){
      $state.go('tab.article-category', {'catID':catid});
    }
  }

  $scope.doReloadArticle = function(){
    $scope.feedLoader = true;

    //remove all records in DB:
    LokiDB.removeAllArticleItem($scope.articleID);

    //first time load data when DB init:
    var promise = ItemService.loadArticleItems($scope.articleID);
    promise.then(function(result) {
      if(result != null){
        $scope.isContest = result.isjoined;
        addFeed(result.data);
      }else{
        $scope.displayFeedEmpty = true;
      }

      $scope.feedLoader = false;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.shareArticle = function(slug){
    var shareLink = FACEBOOK_CONFIG.SHAREARTICLELINK.replace(/{CATEGORY}/g, $scope.mainCategory).replace(/{SLUG}/g, slug);
    $cordovaSocialSharing
    .share(null, null, null, shareLink)
    .then(function(result) {
    }, function(err) {
    });
  }

  $scope.joinContest = function(){
    if($localstorage.get(AUTH_EVENTS.AUTHENTICATED)){
      ModalJoinContestService
          .init($scope, $scope.articleID)
          .then(function(modal){
            modal.show();
          });
    }else{
      ModalLoginSignupService
          .init($scope, false)
          .then(function(modal) {
            modal.show();
          });
    }
  }

	$scope.$on('$ionicView.afterEnter', function(){
  });

})
.controller('ArticleCategoryCtrl', function($state, $sce, $stateParams, $ionicTabsDelegate, $scope, $model, $ionicPlatform, $localstorage, AUTH_EVENTS, GENERAL_CONS, LokiDB, Scopes, ArticleService) {

  $scope.title = "";
  $scope.categoryID = "";

  $scope.feedLoader = true;
  $scope.displayFeedEmpty = false;
  
  //pagination:
  $scope.limit = GENERAL_CONS.DEFAULTLIMIT;
  $scope.f_max_id = "";
  $scope.f_loadmore = true;

  $ionicPlatform.ready(function(){
    $scope.categoryID = $stateParams.catID;
    $scope.title = $scope.categoryID;
    
    //load:
    //first time load data when DB init:
    var promise = ArticleService.loadArticleCategory($scope.categoryID, $scope.f_max_id, $scope.limit);
    promise.then(function(result) {
      if(result != null){
        $scope.feeds = []; //reset

        addFeed(result.data, $scope.feeds);

        manageFeedPagination(result.pagination);
      }else{
        $scope.displayFeedEmpty = true;
      }

      $scope.feedLoader = false;
    });
  });

  var addFeed = function(feeds, arraytopush){
    for(var i = 0; i < feeds.length; i++){
      var objToAdd = new $model.Article(feeds[i], false);
      LokiDB.removeArticleById(objToAdd.articleId);
      LokiDB.addArticle(objToAdd);

      arraytopush.push(objToAdd);
    }
    if(arraytopush.length > 0){
      $scope.displayFeedEmpty = false;
    }else{
      $scope.displayFeedEmpty = true;
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
    var promise = ArticleService.loadArticleCategory($scope.categoryID, "", $scope.limit);
    promise.then(function(result) {
      if(result != null){

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
      var promise = ArticleService.loadArticleCategory($scope.categoryID, $scope.f_max_id, $scope.limit);
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
      if($localstorage.get(GENERAL_CONS.TABACTIVE) == 1){
        $state.go('tab.article-detail', {'articleID':articleid});
      }else if($localstorage.get(GENERAL_CONS.TABACTIVE) == 4){
        $state.go('tab.search-article-detail', {'articleID':articleid});
      }
    }
  }

  $scope.goToCategory = function(catid){
    console.log(catid);
    if($localstorage.get(GENERAL_CONS.TABACTIVE) == 1){
      $state.go('tab.article-category', {'catID':catid});
    }else if($localstorage.get(GENERAL_CONS.TABACTIVE) == 5){
      $state.go('tab.more-article-category', {'catID':catid});
    }
  }

});


