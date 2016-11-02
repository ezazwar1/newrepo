angular.module('welzen').factory('PurchaseInfoService', purchaseInfoService);

function purchaseInfoService(userService, $timeout, $http, WelzenAPI){


	var purchaseInfoService = {
		informPurchase : informPurchase
	};

	return purchaseInfoService;


	function informPurchase(product){		
		$timeout(function() {
			var currentUser = userService.getCurrentUser();
  			var isAndroid = ionic.Platform.isAndroid();
  			if (isAndroid){
  				console.log("PurchaseInfoService. Android");
  				informAndroid(currentUser, product);
  			}else{
  				window.storekit.refreshReceipts(function(receiptsBase64){
					console.log("PurchaseInfoService. IOS. OK");
					informIOS(currentUser, product, receiptsBase64);
				}, function(error){
					console.error("PurchaseInfoService. IOS. Error in get refreshReceipts" + JSON.stringify(error));
				});
	  		}    		
    	}, 100);
	}

	function informAndroid(currentUser, product){
		var info = {
			user : currentUser._id,
			platform : 'Android',
			purchaseToken : product.transaction.purchaseToken,
			product : product

		}
		inform(info);
	}

	function informIOS(currentUser, product, receiptsBase64){
		var info = {
			user : currentUser._id,
			platform : 'IOS',
			receiptsBase64 : receiptsBase64,
			product : product
		}
		inform(info);
	}

	function inform(data){
		console.log( " se va a informar la siguiente data : "  + JSON.stringify(data));
		var req = {
			method: "POST",
			url: WelzenAPI.URL_INFO_PURCHASE,
			headers: {
				"Content-Type": "application/json; charset=utf-8"
			},
			data: data
		};

		$http(req)
			.then(function(res){
				if (res.status === 200 || res.status === 201){
					console.log("PurchaseInfoService. Info saved ok.")
				}else{
					console.log("PurchaseInfoService. Error in server.")
				}	
				}, function(error){
					console.log("PurchaseInfoService. Error calling server. " + JSON.stringify(error));
				}
		);
	}

}