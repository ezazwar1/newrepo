angular.module('controller.itemproduct', ['item.services'])
.controller('ItemProductCtrl', function($state, $stateParams, $scope, $ionicViewSwitcher, $model, $ionicPlatform, $localstorage, AUTH_EVENTS, ItemProductService, GENERAL_CONS, LokiDB) {

  $scope.title = "More Products";
  $scope.products = [];

  //pagination:
  $scope.limit = GENERAL_CONS.DEFAULTLIMIT;
  $scope.max_id = "";
  $scope.loadMore = true;

  $scope.itemProductFirstTimeLoader = true;
  $scope.displayItemProductEmpty = false;

  $ionicPlatform.ready(function() {
    $scope.itemId = $stateParams.itemID;

    var promise = ItemProductService.loadItemProduct($scope.itemId);
    promise.then(function(result) {
      $scope.itemProductFirstTimeLoader = false;

      if(result != null){
        addFeed(result.data);

        managePagination(result.pagination);
        $scope.displayItemProductEmpty = false;
      }else{
        //show no records found here
        $scope.displayItemProductEmpty = true;
      }
    });
  });

  var managePagination = function(pagination){
    if(pagination != undefined){
      $scope.max_id = pagination.next_max_id;

      if($scope.max_id != ""){
        $scope.loadMore = true;
      }
    }
  }

  $scope.doReloadItemProduct = function(){
      var promise = ItemProductService.loadItemProduct($scope.itemId);
      promise.then(function(result) {
        if(result != null){
          $scope.products = []; //reset
          $scope.max_id = "";
          $scope.loadMore = true;

          addFeed(result.data);
          managePagination(result.pagination);

          $scope.displayItemProductEmpty = false;
        }else{
          //show no records found here
          $scope.displayItemProductEmpty = true;
        }

        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  $scope.doLoadMore = function(){
      $scope.loadMore = false;
      if($scope.max_id != ""){
        var promise = ItemProductService.loadItemProduct($scope.itemId, $scope.max_id, $scope.limit);
        promise.then(function(result) {
          if(result != null){
            addFeed(result.data);
            managePagination(result.pagination);
          }

          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      }else{
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
  };

  var addFeed = function(feeds){
    for(var i = 0; i < feeds.length; i++){
      var merchantname = "";
      if(feeds[i].merchantname != undefined && feeds[i].merchantname != "" && feeds[i].merchantname != null){
        merchantname = feeds[i].merchantname;
      }

      var objToAdd = new $model.Product(feeds[i].productid.$oid, feeds[i].isaffiliate, feeds[i].basecurrency, feeds[i].price, feeds[i].name, feeds[i].imageurl, feeds[i].producttype, feeds[i].promoprice, $scope.mediaId, feeds[i].affiliatelink, merchantname, feeds[i].recommendedsize);
        $scope.products.push(objToAdd);
    }
  }

  $scope.goToProduct = function(url, productid, productname){
    mixpanel.track("product_click", {
      "productlink": url,
      "productname": productname,
      "productid": productid,
      "productclick_source": "Mobile"
    });

    window.open(url, '_system', 'closebuttoncaption=Done,toolbarposition=top');
  }

	$scope.$on('$ionicView.enter', function(){});

});


