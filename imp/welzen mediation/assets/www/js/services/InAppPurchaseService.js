angular.module('welzen').factory('InAppPurchaseService', inAppPurchaseService);

function inAppPurchaseService(userService, $state, $ionicAnalytics, $rootScope, PurchaseInfoService){


	var inAppPurchaseService = {
		initialize : initialize,
		buyProduct : buyProduct,
		getAllProducts : getAllProducts,
		isOwnerAnyProduct : isOwnerAnyProduct,
		isPopularProduct : isPopularProduct,
		canCancelProduct : canCancelProduct,
		restoreProduct : restoreProduct
	};
	var products = [];


	return inAppPurchaseService;


	function initialize(callback){
		console.log("Welzen. InAppPurchase. initialize service");
		setTimeout( function() {
			if (products === undefined || products.length === 0){
				initStore(callback);
			}else{
				callback(products);
			}
      	}, 10);
	}

	function buyProduct(product){
	    console.log("Welzen. InAppPurchase. Calling buyProduct");
	    store.order(product);	
	}

	function getAllProducts(){
		return products;
	}

	function isOwnerAnyProduct(){
		return userService.isPaid();
	}


	function registerEvents(){
		store.when("product").updated(function (product) {
			console.log("Welzen. InAppPurchase update product. " + JSON.stringify(product));
			update(product);
    	});

    	store.when("product").approved(function (product) {
			console.log("Welzen. Buy a product " + JSON.stringify(product));
    		product.finish();
	    	console.log("welzen. Current user. " + userService.getCurrentUser());
	    	if (userService.getCurrentUser() == null){
	    		return;
	    	}
	    	console.log("welzen. User logged ... " + userService.isLogged());
	    	if (!userService.isLogged()){
	    		return;
	    	}
	    	console.log("welzen, User paid ... " + userService.isPaid());
	    	if (userService.isPaid()){
	    		return;
	    	}
	    	product.email = userService.getCurrentUser().email;
	    	$ionicAnalytics.track("InAppPurchase", product);
	    	userService.upgradeMembrecy(product.alias);
    		update(product);
    		PurchaseInfoService.informPurchase(product);
   			$state.go("success");	
    		
		});

		store.when("product").cancelled(function (product) {
			console.log("Welzen. User cancelled it " + JSON.stringify(product));
	    	$ionicAnalytics.track("InAppPurchase", product);
			update(product);
		});

		store.when("product").error(function (error) {
			console.log("Welzen. Error in buy a product " + JSON.stringify(error));
	    	$ionicAnalytics.track("InAppPurchase", error);
		});


		store.when("refreshed", function() {
			console.log('se ejecutó el refreshed');
		});

		store.when("refresh-failed", function() {
			console.log('se ejecutó el refresh-failed');
		});

		store.when("refresh-completed", function() {
			console.log('se ejecutó el refresh-completed');
			$rootScope.$broadcast('inapp-refresh-completed');
		});

		store.error(function(e){
	        console.log("ERROR InAppPurchase " + e.code + ": " + e.message);
	    });
		
	}

	function registerProducts(){

  		var isAndroid = ionic.Platform.isAndroid();
  		var idMonthly = '08';
  		var idYearly =  '07';
  		if  (isAndroid){
  			idMonthly = '01';
  			idYearly =  '06';
  		}

		store.register({
	        id:    idMonthly,
	        alias: 'Monthly',
	        type:   store.PAID_SUBSCRIPTION
	    });

		if  (! isAndroid){
			store.register({
	       		id:    '03',
	        	alias: 'Forever',
	        	type:   store.NON_CONSUMABLE
	    	});			
		}

	    store.register({
	        id:    idYearly,
	        alias: 'Yearly',
	        type:   store.PAID_SUBSCRIPTION
	    });

	}

	function initStore(callback){
		console.log("Welzen. InAppPurchase. Init InAppPurchase");

	    if (!window.store) {
	    	console.log("Welzen. InAppPurchase. Store is unavailable");
	        return;
	    }
	    // Enable maximum logging level
	    store.verbosity = store.DEBUG;

	    // Enable remote receipt validation
	    store.validator = null;//this.validator;

		console.log("Welzen. InAppPurchase. Register products");
	    registerProducts();

		console.log("Welzen. InAppPurchase. Register events");
	    registerEvents();
	    
	    store.ready(callback(getProducts()));

	    console.log("Welzen. InAppPurchase. Calling refresh");
	    store.refresh();
	}

	function getProducts(){
		products.push(store.get('Monthly'));
		products.push(store.get('Yearly'));
		if(!ionic.Platform.isAndroid()){
			products.push(store.get('Forever'));	
		}
	    console.log("Welzen. InAppPurchase. Calling getProducts ");
		return products;
	}

	function update(product){
		for (var i = 0; i < products.length; i++) {
			if (products[i].id === product.id){
				angular.extend(products[i],product);
				return;
			}
		}
		products.push(product);
	}

	function isPopularProduct(product){
		if (product.alias === 'Yearly'){
			return true;
		}
		return false;
	}

	function canCancelProduct(){
		for (var i = 0; i < products.length; i++) {
			if (products[i].owned && products[i].alias === 'Forever'){
				return false;
			}
		};
		return true;	
	}

	function restoreProduct(){
		console.log("Retore products ...")
		store.refresh();	
	}

	function isRenewable(product){
		if (product.alias === 'Forever'){
			return false;
		}
		return true;
	}

	
    // {"id":"com.welzen.test3",
    // "alias":"MI_ANDROID",
    // "type":"paid subscription",
    // "state":"valid",
    // "title":"Test App (Welzen)",
    // "description":"Test APP",
    // "price":"$7.99",
    // "currency":"USD",
    // "loaded":true,
    // "canPurchase":true,
    // "owned":false,
    // "transaction":null,
    // "valid":true}



}
