angular.module('starter.controllers')
.controller('CartCtrl', function($scope,$rootScope,$ionicLoading,alertmsgService,$location,eCart)
{
	'use strict';
	$rootScope.cartRefresh  = function(){
		// console.log('inside cart_ctrl.js');
		$scope.cartProducts = eCart.cartProducts;
		$rootScope.cartTotal = eCart.cartTotal();
		if(eCart.cartProducts.length>0)
			$rootScope.cartItems = eCart.cartProducts.length;
		else{
			$rootScope.cartItems = '';
		}
	}

	$rootScope.cartRefresh();

	//------------Update Qty-------------------------------
	$scope.updateQty	= function(prodObj,type){		
		if(type=='add'){
			var newqty = parseInt(prodObj.purchaseQuantity);
			eCart.addOneProduct(prodObj);
		}else{
			eCart.removeOneProduct(prodObj);
			var newqty = parseInt(prodObj.purchaseQuantity);
		}

		if(newqty>0){

			if(eCart.isAvailable){
				$rootScope.cartRefresh();
			}else{
				alertmsgService.showMessage("The product become out of the stock, you can not buy more quantity of this product.");
			}

		}else{
			$scope.removeProduct(prodObj);
		}

		/*if(newqty>0){
			$rootScope.cartRefresh();
		}else{
			$scope.removeProduct(prodObj);
		}*/
	}
	//----------Remove Item---------------------------------
	$scope.removeProduct= function(prodObj){
		eCart.removeProduct(prodObj);
		$rootScope.cartRefresh();
	}
	//--------------------------------------------
	$scope.deliveryAddress	= function(){ $location.path("app/delivery-address"); }


})

.controller('CartDeliveryCtrl', function($scope,$http,$rootScope,$ionicModal,$location,usersService,alertmsgService,eCart) {
	'use strict';

	//------------------------------------
	//$rootScope.billingAddress = '';
	//$rootScope.shipingAddress = '';
	$scope.getBillShipAddress = function(){
	$http.get("data/product/paymentaddress.json").then(function(response) {
		if(response.data.success){
			$scope.billAddresses	= response.data.data.addresses;
			$scope.shipAddresses	= response.data.data.addresses;
		}else{
			$scope.billAddresses = [];
			$scope.shipAddresses = [];
		}
	},
	function(error) {
			$rootScope.tostMsg(error);
	});

	}

	$scope.getBillShipAddress();
	//------------Address Modal----------------------
	$ionicModal.fromTemplateUrl('js/cart/add-address.html', { scope: $scope })
	.then(function(modal) { $scope.addressModal = modal; });
	$scope.AddressClose = function() { $scope.addressModal.hide(); };
	$scope.addAddress = function() {

		$scope.cuntryData = [{country_id:'',name:'-- Select Country --'},{country_id:'99',name:'India'}];
		usersService.getCountries()
		.then(function(response) {
			if(response.success){
				$scope.cuntryData = $scope.cuntryData.concat(response.data);
			}
		});

		$scope.billshipAddress = {firstname:'', lastname:'',country_id:'',address_1:'',city:'',postcode:'',zone_id:'1433'};

		$scope.addressModal.show();
	};
	//-----------Add Billing Address-----------------------
	$scope.saveAddress = function(form){
		if(form.$valid) { $scope.saveBillingAddress($scope.billshipAddress); }
	}

	$scope.saveBillingAddress = function(data,stype){
		$scope.billAddresses.push(data);
		$scope.addressModal.hide();
	}

	$scope.saveShippingAddress = function(data,stype){
		$scope.shipAddresses.push(data);
		$scope.addressModal.hide();
	}
	//----------------------------------
	if(typeof($rootScope.billingAddress)=='undefined')$rootScope.billingAddress = '';
	$scope.selectBillAddress = function(value) {

			$rootScope.billingAddress = value;
			var tmpdata = {payment_address:"existing",address_id:value}
			//$scope.saveBillingAddress(tmpdata,'set');
	};

	//----------------------------------
	if(typeof($rootScope.shippingAddress)=='undefined')$rootScope.shippingAddress = '';
	$scope.selectShipAddress = function(value) {

			$rootScope.shippingAddress = value;
			var tmpdata = {shipping_address:"existing",address_id:value}
			//$scope.saveShippingAddress(tmpdata,'set');
	};
	//----------------------------------
	$scope.deliveryOptions	= function(){

		if($rootScope.billingAddress=='' && $rootScope.shippingAddress==''){
			alertmsgService.showMessage('Select Billing and Shipping Address.');
		}else if($rootScope.billingAddress!='' && $rootScope.shippingAddress==''){
			alertmsgService.showMessage('Select Shipping Address.');
		}else if($rootScope.billingAddress=='' && $rootScope.shippingAddress!=''){
			alertmsgService.showMessage('Select Billing Address.');
		}else{
				$location.path("app/delivery-options");
		}

	}

	//----------------------------------


})

.controller('CartOptionsCtrl', function($scope,$http,$rootScope,ionicDatePicker,$ionicModal,$location,eCart,alertmsgService) {
'use strict';

	$scope.placeOrder	= function(){

			if($rootScope.shppingMethod!=''){
				$location.path("app/place-order");
			}else{
				alertmsgService.showMessage("Select shipping method first to proceed.");
			}


	}


	$http.get("data/product/cart/shippingmethods.json")
	.then(function(response) {
			$scope.shippingData = response.data.shipping_methods;
	});


	if(typeof($rootScope.shppingMethod)=='undefined') $rootScope.shppingMethod = '';
	$scope.selectShipMethod = function(data){
		$rootScope.shppingMethod = data.code;
		$rootScope.shppingMethodData = data;
	}
	//-------------DatePicker---------------------
	var cdate = new Date();
	var nextMonth = cdate.getMonth()+1;
	var monthEnd = new Date(cdate.getFullYear(), nextMonth+1, 0).getDate();

	$scope.currntDate = cdate.getDate()+"-"+(cdate.getMonth()+1)+"-"+cdate.getFullYear();


	var ipObj1 = {
		  callback: function (val) {  //Mandatory
			var sDate = new Date(val);
			$scope.currntDate = sDate.getDate()+"-"+(sDate.getMonth()+1)+"-"+sDate.getFullYear();
		  },
		  disabledDates: [            //Optional
			new Date("04-22-2016"),
			new Date("08-16-2016"),
			new Date(1439676000000)
		  ],
		  from: new Date(), //Optional
		  to: new Date(cdate.getFullYear(), nextMonth, monthEnd), //Optional
		  inputDate: new Date(),      //Optional
		  mondayFirst: true,          //Optional
		  disableWeekdays: [0],       //Optional
		  closeOnSelect: true,       //Optional
		  templateType: 'popup'       //Optional
		};

	$scope.openDatePicker = function(){  ionicDatePicker.openDatePicker(ipObj1);  };
	//----------------------------------


})

.controller('CartOrderCtrl', function($scope,$http,eCart,$rootScope,$ionicModal,$location,$interval,alertmsgService,$cordovaInAppBrowser) {
'use strict';

		$scope.subTotal = $rootScope.cartTotal;
		$scope.grossTotal = parseInt($rootScope.cartTotal)+parseInt($rootScope.shppingMethodData.cost);

		$http.get("data/product/cart/paymentmethods.json")
		.then(function(response) {
			$scope.paymentOptions = response.data.payment_methods;
		}, function(error) {

		});
		//----------------------------------------
		 $scope.discountData = {coupon:''};
		 $scope.getCouponDiscount = function(form){
			   alertmsgService.showMessage("Invalid Coupon Code");

		 }
		//------------Select Payment method----------------------------
		if(typeof($rootScope.paymentMethod)=='undefined') $rootScope.paymentMethod ='';
		$scope.selectPaymentMethod = function(obj){

			var paymentdata = {payment_method:obj.code,agree:"1",comment: obj.title}
			$rootScope.paymentMethod = obj.code;


		}
		//----------------------------------------
		$scope.orderConfirm = function(){
			if($rootScope.paymentMethod==''){
				alertmsgService.showMessage("Please Select Payment Method.");
			}else{
				eCart.cartProducts=[];
				$rootScope.cartTotal='';
				$rootScope.cartItems='';
				$rootScope.paymentMethod = '';
				$rootScope.shppingMethod ='';
				$rootScope.billingAddress ='';
				$rootScope.shippingAddress ='';
				$location.path("app/order-status/1");

			}
		}
		//-----------------------------------------




})

.controller('CartOrderStatusCtrl', function($scope,$stateParams) {
'use strict';
$scope.order_fstatus = $stateParams.status_id;


});
