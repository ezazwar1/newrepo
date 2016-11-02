angular.module('starter.controllers')

.controller('ProductListCtrl', function($scope, $ionicModal, $timeout,$rootScope,$stateParams,$ionicScrollDelegate,productsService,eCart,alertmsgService)
{
	$rootScope.cat_id	= $stateParams.catid;
	$rootScope.cat_Name	= $stateParams.catName;
  //console.log($rootScope.cat_Name);
  //$rootScope.cat_Name	= $rootScope.bannerData;
  var categ_name = $scope.cat_Name.categoryName;
  // console.log(" from product list controller");
  // console.log($rootScope.cat_id);
  // console.log($scope.cat_Name);
  // console.log(categ_name);

	//----------Lasy Loading of Products---------------------------
	$scope.loadMoreProducts = function(){
	  //$rootScope.cat_id=1;
		$scope.noRecords = false;
		if(false){//$rootScope.cat_id !=1 && $rootScope.cat_id !=7
		$scope.noProductsAvailable = true;
		$scope.noRecords = true;
		}
		else{
			productsService.getProducts($rootScope.cat_id,$rootScope.cat_Name,$scope.product_page)
			.then(function(response) {
			if(response.data.success){
				$scope.products	= $scope.products.concat(response.data.data);
				$scope.products.forEach(function(prod, index, prods){
	        $scope.products[index].cartQnt=eCart.getProductQty(prod);
				});

        // console.log(" again from product list controller");
        //console.log($scope.products);
				$scope.newProducts	= $scope.newProducts.concat(response.data.latest_products);

				$scope.product_page++;
				$scope.noProductsAvailable = false; // On lasy loading.
				//$scope.$broadcast('scroll.infiniteScrollComplete');
			}else{
				 $scope.noProductsAvailable = true; // Off lasy loading.
				 if($scope.product_page==1)$scope.noRecords = true;
			}

			}, function(error) {
				$scope.noProductsAvailable = true; // Off lasy loading.
			});
		}

	}

   //---------------------------
    //---------------------------
	$rootScope.showProducts = function(cat_id){
	//$scope.category_id =$rootScope.cat_id;
	if(cat_id!='' && typeof(cat_id)!='undefined') $rootScope.cat_id = cat_id;
	$ionicScrollDelegate.scrollTop();
	//$scope.selectedCat = findCategory($rootScope.menuAccordionArray,$rootScope.cat_id);
	//$scope.parentCats  = getParentCat($rootScope.menuAccordionArray,$rootScope.cat_id);

	$scope.noProductsAvailable	= true; // Off lasy loading.
	$scope.product_page = 1;
	$scope.products		   = [];
	$scope.newProducts	   = [];

	$scope.loadMoreProducts();
	}
	$rootScope.showProducts();
    //---------------------------
		//----------Cart Process--------------------
		$scope.selectId='';
		$scope.AddToCart = function(prodObj){
			console.log(prodObj);
			$scope.selectId=prodObj.id;
			$scope.check=prodObj.product_name;
			$timeout(function(){$scope.selectId='';}, 700);
			eCart.addToCart(prodObj);
			$rootScope.cartItems = eCart.cartProducts.length;
			$scope.products[$scope.products.getIndexBy("id", prodObj.id)].cartQnt=eCart.getProductQty(prodObj);
			if(!eCart.isAvailable){
				alertmsgService.showMessage("The product become out of the stock, you can not buy more quantity of this product.");
			}
	 }
	//--------------------------------------------
	// $scope.setObject = function(obj){
  //     holdobj.set(obj);
  //   }

	//------------flib button change class-----
	// $scope.class = "beforeFlip";
	// $scope.highlightedCol = "beforeHighlighted";
  // $scope.changeClass = function(buttonIndex){
	// //	console.log(buttonIndex);
	//
	// 	var divContaineId= 'btndiv-'+buttonIndex;
	// 	var colContainerId= 'coldiv-'+buttonIndex;
	// 	var divContainer=(angular.element(document.querySelector('#'+divContaineId)));
	// 	var colContainer=(angular.element(document.querySelector('#'+colContainerId)));
	// 	if(divContainer.hasClass('beforeFlip') && colContainer.hasClass('beforeHighlighted')){
	// 		divContainer.removeClass('beforeFlip');
	// 		colContainer.removeClass('beforeHighlighted');
	// 		divContainer.addClass('afterFlip');
	// 		colContainer.addClass('afterHighlighted');
	// 	}
	// 	else{
	// 		divContainer.removeClass('afterFlip');
	// 		colContainer.removeClass('afterHighlighted');
	// 		divContainer.addClass('beforeFlip');
	// 		colContainer.addClass('beforeHighlighted');
	// 	}
  //   // if ($scope.class === "beforeFlip" && $scope.highlightedCol === 'beforeHighlighted'){
  //   // //  $scope.class = "afterFlip";
	// 	// //	$scope.highlightedCol = "afterHighlighted";
	// 	// }
  //   // else{
  //   //   //$scope.class = "beforeFlip";
	// 	// //	$scope.highlightedCol = "beforeHighlighted";
	// 	// }
  // };
	//--------counter events
  $scope.decrement = function(prodObj) {
		console.log(prodObj);
      eCart.removeOneProduct(prodObj);
			$scope.products[$scope.products.getIndexBy("id", prodObj.id)].cartQnt=eCart.getProductQty(prodObj);
			$rootScope.cartItems = eCart.cartProducts.length;
			var buttonIndex = prodObj.id;
			var divContaineId= 'btndiv-'+buttonIndex;
			var colContainerId= 'coldiv-'+buttonIndex;
			var divContainer=(angular.element(document.querySelector('#'+divContaineId)));
			var colContainer=(angular.element(document.querySelector('#'+colContainerId)));

			if($scope.products[$scope.products.getIndexBy("id", prodObj.id)].cartQnt <= 0){
				divContainer.removeClass('afterFlip');
				colContainer.removeClass('afterHighlighted');
				divContainer.addClass('beforeFlip');
				colContainer.addClass('beforeHighlighted');
			}
  };
//-----------------------------------------
  $ionicModal.fromTemplateUrl('js/products/modal-sub-product.html', {
      scope: $scope,
      animation: 'slide-in-up',
   }).then(function(modal) {$scope.modal = modal;});
   $scope.openModal = function() { $scope.modal.show();  };
   $scope.closeModal = function() { $scope.modal.hide();  };

})

.controller('craousalCtrl', function($scope, $ionicModal, $timeout)
{

});
