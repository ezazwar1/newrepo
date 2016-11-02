angular.module('controller.item', ['item.services'])
.controller('ItemCtrl', function($state, $sce, $stateParams, FACEBOOK_CONFIG, $cordovaSocialSharing, $ionicActionSheet, $ionicTabsDelegate, $scope, $model, $ionicPlatform, $localstorage, AUTH_EVENTS, GENERAL_CONS, ModalCollectionService, ModalLoginSignupService, LokiDB, Scopes, ItemService) {

	$scope.title = "<div class='general-title'>Details</div>";
	$scope.itemID = "";
	$scope.item = null;

	$ionicPlatform.ready(function(){
		$scope.itemID = $stateParams.itemID;

		//get from DB:
		var item = LokiDB.findItem($scope.itemID);
		if(item == undefined || item == null){
			//get from server:
			ItemService.loadItem($scope.itemID)
			.then(function(result){
				var objItem = new $model.Item(result.data.item);
			    LokiDB.addItem(objItem);
			    $scope.item = objItem;
			});
		}else{
			$scope.item = item;
		}
		
	});

	$scope.$on('$ionicView.enter', function(){});

	$scope.saveStyle = function(itemid){
		if($localstorage.get(AUTH_EVENTS.AUTHENTICATED)){
			ModalCollectionService
		      .init($scope, $scope, itemid)
		      .then(function(modal) {
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

	$scope.reportItem = function(contestid, userid){
		if($localstorage.get(AUTH_EVENTS.AUTHENTICATED)){
			$ionicActionSheet.show({
		      buttons: [
		        { text: 'This photo does not follow the contest theme' },
		        { text: 'This photo shows nudity or pornography' },
		        { text: 'This photo shows graphic violence' },
		        { text: 'This photo contains hate messages or symbols' },
		        { text: 'This photo does not belong to the poster' }
		      ],
		      titleText: 'Report Photo',
		      destructiveText: 'Cancel',
		      buttonClicked: function(index) {
		        var reportId = index + 1;
		        var promise = ItemService.reportInappropiate(reportId, itemid);
		        promise.then(function(result) {
		          if(result){
		            console.log("Successfully added!");
		          }
		        });

		        $ionicPopup.alert({
		                 title: 'Report Photo',
		                 subTitle: 'Thank you for your report. We will remove this photo if it violates our Community Guidelines.'
		        });

		        return true;
		      },
		      destructiveButtonClicked: function() {
		        return true;
		      }
		    });
		}else{
			ModalLoginSignupService
		      .init($scope, false)
		      .then(function(modal) {
		        modal.show();
		      });
		}
	}

	$scope.shareItem = function(itemid){
	    var shareLink = FACEBOOK_CONFIG.SHAREITEMLINK.replace(/{ITEMID}/g, itemid);
	    console.log(shareLink);
	    $cordovaSocialSharing
	    .share(null, null, null, shareLink)
	    .then(function(result) {
	    }, function(err) {
	    });
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

	$scope.goToSingleProduct = function(singleproduct){
		if(singleproduct != null && singleproduct != undefined){
			mixpanel.track("product_click", {
		      "productlink": singleproduct.productUrl,
		      "productname": singleproduct.productName,
		      "productid": singleproduct.productId,
		      "productclick_source": "Mobile"
		    });

		    window.open(singleproduct.productUrl, '_system', 'closebuttoncaption=Done,toolbarposition=top');
		}
	}

	$scope.goToProductViewMore = function(itemid){
	    mixpanel.track("product_view_more", {
	      "itemid": itemid
	    });

	    if($localstorage.get(GENERAL_CONS.TABACTIVE) == 1){
	    	$state.go('tab.item-detail-product-more', {'itemID':itemid});
	    }else if($localstorage.get(GENERAL_CONS.TABACTIVE) == 4){
	    	$state.go('tab.search-item-detail-product-more', {'itemID':itemid});
	    }else if($localstorage.get(GENERAL_CONS.TABACTIVE) == 2){
	    	$state.go('tab.stream-item-detail-product-more', {'itemID':itemid});
	    }else if($localstorage.get(GENERAL_CONS.TABACTIVE) == 5){
	    	$state.go('tab.more-item-detail-product-more', {'itemID':itemid});
	    }
	}

	$scope.trustAsHtml = function(str) {
		var decoded = "";
		if(str != undefined){
			decoded = angular.element('<div />').html(str).text();
		}
    	return $sce.trustAsHtml(decoded);
  	};

});


