angular.module('starter.controllers')

.controller('ProductDetailCtrl', function($scope,$rootScope, $ionicModal, $timeout,$ionicPopover,$ionicSlideBoxDelegate,$stateParams,$state,productsService,eCart,alertmsgService)
	{
	$scope.sizes=['S','M','L','XL'];
	$scope.productParticular = $stateParams.prId;
	$rootScope.cat_id	= $stateParams.catid;
	$rootScope.cat_Name	= $stateParams.catName;
	$scope.products		   = [];
	// console.log($scope.productParticular);
	// console.log($rootScope.cat_id);

	productsService.getProducts($rootScope.cat_id,$rootScope.cat_Name,$scope.product_page)
	.then(function(response) {
	if(response.data.success){
		$scope.products	= $scope.products.concat(response.data.data);
		$scope.specificProducts = $scope.products[$scope.products.getIndexBy("id", $scope.productParticular)]
		$scope.specificProducts.cartQnt= eCart.getProductQty($scope.specificProducts);
		$scope.class = ($scope.specificProducts.cartQnt<=0)?"beforeFlip":"afterFlip";
	} // On lasy loading.
		//$scope.$broadcast('scroll.infiniteScrollComplete');
	});


	if(!$stateParams.prId){
		$state.go('app.dashboard');
	}

	$ionicPopover.fromTemplateUrl('popover.html', {
	scope: $scope
	}).then(function(popover) {	$scope.popover = popover;	});

   $scope.openPopover = function($event) {  $scope.popover.show($event);  };

   $scope.closePopover = function() {  $scope.popover.hide();  };

  //delivery option modal
	$ionicModal.fromTemplateUrl('delivery-option-modal.html', {
	  id: '1', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      backdropClickToClose: true,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal1 = modal;
   });
//modal or the image slide box section
   $ionicModal.fromTemplateUrl('image-slider-option-modal.html', {
	  id: '2', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      backdropClickToClose: true,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal2 = modal;
   });
   $scope.openModal = function(index) {
	if(index == 1){
	$scope.oModal1.show();
	}
	else if(index == 2){
	$scope.oModal2.show();
	}

	};
    $scope.closeModal = function(index) {
	  if(index == 1){
	   $scope.oModal1.hide();
	  }
	  else if(index == 2){
	   $scope.oModal2.hide();
	  }

	};

	$scope.nextSlide = function() { $ionicSlideBoxDelegate.next();  }
  $scope.previousSlide = function() {  $ionicSlideBoxDelegate.previous();  }

  // productsService.getProductDetail($stateParams.proid)
	// 	.then(function(response) {
	// 		$scope.productDetail = response.data;
	// 		console.log($scope.productDetail)	;
	//
	// 	}, function(error) {
	// 		alert("Error proudcts : "+error);
	// 	});

		//-------------------------------
		//----------Cart Process--------------------
	 $scope.selectId='';
	 $scope.AddToCart = function(prodObj){
		 //console.log(prodObj);
		 // console.log('from add to cart process');
		 // console.log(prodObj);
		 $scope.selectId=prodObj.id;
		 // console.log($scope.selectId);
		 $scope.check=prodObj.product_name;
		 // console.log($scope.check);
		 $timeout(function(){$scope.selectId='';}, 700);
		 eCart.addToCart(prodObj);
		 // console.log('Cart value is ');
		 // console.log($rootScope.cartItems);
		 $rootScope.cartItems = eCart.cartProducts.length;
		 $scope.specificProducts.cartQnt= eCart.getProductQty(prodObj);


 		 $scope.class = ($scope.specificProducts.cartQnt<=0)?"beforeFlip":"afterFlip";
		 if(!eCart.isAvailable){
			 alertmsgService.showMessage("The product become out of the stock, you can not buy more quantity of this product.");
		 }
		 //console.log($scope.specificProducts);
		 // console.log('Cart value is ');
		 // console.log($rootScope.cartItems);
	}
 //--------------------------------------------
 //------------flib button change class-----
 //--------counter events-------
	$scope.decrement = function(prodObj) {
		eCart.removeOneProduct(prodObj);
		$rootScope.cartItems = eCart.cartProducts.length;
		$scope.specificProducts.cartQnt= eCart.getProductQty(prodObj);
		$scope.class = ($scope.specificProducts.cartQnt<=0)?"beforeFlip":"afterFlip";
		console.log(prodObj);
	};

	//ionicMaterialInk.displayEffect();

})
