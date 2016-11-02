(function(angular) {
  //Service Module for ionic-shop
  var app = angular.module('ionicShop.services', ['ionic']);
  //PRODUCT SERVICE HOLDING ALL ITEMS
  app.service('eCart',['$http', function($http){

    this.galleryProducts = [];
    this.cartProducts = [];
    this.checkout = {};
	this.isAvailable = true;

    this.addToCart = function(product){
      // console.log('inside cart.js service');
      // console.log(product);
	  this.isAvailable = true;
      var productInCart = false;
      this.cartProducts.forEach(function(prod, index, prods){
        if (prod.id === product.id) {
          productInCart = prod;
          return;
        }
      });

      if (productInCart) {
        this.addOneProduct(productInCart);
      } else {
        product.purchaseQuantity = 0;
        product.total = '<i class="icon ion-social-usd" >'+(parseFloat(product.actual_price)*1)+'</i>';
        this.addOneProduct(product);
        this.cartProducts.push(product);
      }
    };

    this.removeProduct = function(product) {
      this.cartProducts.forEach(function(prod, i, prods){
        if (product.id === prod.id) {
          this.cartProducts.splice(i, 1);
          this.updateTotal();
        }
      }.bind(this));
    };

    this.addOneProduct = function(product) {

		if(product.quantity>0){
			this.isAvailable = true;
			--product.quantity;
			++product.purchaseQuantity;
			product.total = '<i class="icon ion-social-usd" >'+(parseFloat(product.actual_price)*parseInt(product.purchaseQuantity)).toFixed(2)+'</i>';
		 //product.total = '<i class="icon ion-social-usd" >'+parseFloat(parseFloat(product.actual_price)*parseInt(product.purchaseQuantity))+'</i>';


     //console.log(product.total);
    }else{
			this.isAvailable = false;
		}

      this.updateTotal();
    };

    this.removeOneProduct = function(product) {
      this.cartProducts.forEach(function(prod, index, prods){
		  if (prod.id === product.id) {
			 product=prod;
		  }
      });
	  this.isAvailable = true;
      ++product.quantity;
      --product.purchaseQuantity;
	   product.total = '<i class="icon ion-social-usd" >'+(parseFloat(product.actual_price)*parseInt(product.purchaseQuantity))+'</i>';

	  	if(product.purchaseQuantity<=0)this.removeProduct(product);

      this.updateTotal();
    };

    this.cartTotal = function() {
      var total = 0;
	  if(this.cartProducts.length>0){
		  this.cartProducts.forEach(function(prod, index, prods){
			total += prod.actual_price * prod.purchaseQuantity;
		  });
	  }

      return formatTotal(total);
    };

	 this.getProductQty = function(product) {
      var qty = 0;
      this.cartProducts.forEach(function(prod, index, prods){
		  if (prod.id === product.id) {
			 qty = prod.purchaseQuantity;
		  }
      });

      return qty;
    };

    var formatTotal = function(total) {
      //return total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      return total.toFixed(2);

    };


    this.updateTotal = function(){
      this.total = this.cartTotal();
    }.bind(this);

    this.updateTotal();

    this.getProducts = function(callback){
      $http.get('/admin/panel/products')
      .success(function(products){
        this.galleryProducts = products;
        if (callback) {callback();}
      }.bind(this));
    };

  }]);




})(angular);



(function(angular) {

  //IONIC CART DIRECTIVE
  var app = angular.module('ionicShop.directives', ['ionic', 'ionicShop.services']);

  app.directive('ionCart',['Products','$templateCache', function(Products, $templateCache){
    var link = function(scope, element, attr) {
      scope.$watch('products.length', function(newVal, oldVal){
        Products.updateTotal();
        scope.emptyProducts = newVal > 0 ? false : true;
      });

      scope.emptyProducts = scope.products.length ? false : true;

      scope.addProduct = function(product) {
        Products.addOneProduct(product);
      };

      scope.removeProduct = function(product){
          product.purchaseQuantity <= 1 ? Products.removeProduct(product) : Products.removeOneProduct(product);
      };
    };

    return {
      restrict: 'AEC',
      templateUrl: 'cart-item.html',
      link: link,
      scope: {
        products: '='
      }
    };
  }]);



  // IONIC CHECKOUT DIRECTIVE
  app.directive('ionCartFooter',['$state', '$templateCache', function($state, $templateCache){
    var link = function(scope, element, attr) {

      element.addClass('bar bar-footer bar-dark');
      element.on('click', function(e){
        if (scope.path) {
          $state.go(scope.path);
        }
      });

      element.on('touchstart', function(){
        element.css({opacity: 0.8});
      });

      element.on('touchend', function(){
        element.css({opacity: 1});
      });
    };

    return {
      restrict: 'AEC',
      templateUrl: 'cart-footer.html',
      scope: {
        path : '=path'
      },
      link: link
    };
  }]);

  // IONIC PURCHASE DIRECTIVE
  app.directive('ionCheckout',['Products','$templateCache', function(Products, $templateCache){
    var link = function(scope, element, attr) {
      scope.$watch(function(){
        return Products.total;
      }, function(){
        scope.total = Products.total;
      });

      scope.checkout = Products.checkout;
      //*** Total sum of products in usd by default ***\\
      scope.total = Products.total;

      //*** Add address input fields when has-address attribute is on ion-purchase element ***\\
      if (element[0].hasAttribute('has-address')) {scope.hasAddressDir = true;}

      //*** Add email input field when has-email attribute is on ion-purchase element ***\\
      if (element[0].hasAttribute('has-email')) { scope.hasEmailDir = true; }

      //*** Add name input fields when has-name attribute is on ion-purchase element ***\\
      if (element[0].hasAttribute('has-name')) { scope.hasNameDir = true;}
    };

    return {
      restrict: 'AEC',
      templateUrl: 'checkout.html',
      link: link
    };
  }]);


  //IONIC PURCHASE FOOTER DIRECTIVE
  app.directive('ionCheckoutFooter',['$compile', 'Products', 'stripeCheckout', 'CheckoutValidation','$templateCache', function($compile, Products, stripeCheckout, CheckoutValidation, $templateCache){
    var link = function(scope, element, attr) {
      scope.checkout = Products.checkout;
      scope.processCheckout = stripeCheckout.processCheckout;
      scope.stripeCallback = stripeCheckout.stripeCallback;

      element.addClass('bar bar-footer bar-dark');

      element.on('click', function(){
        if (CheckoutValidation.checkAll(scope.checkout)) {
          scope.processCheckout(scope.checkout, scope.stripeCallback);
        } else {
          var ionPurchaseSpan = document.getElementsByTagName('ion-checkout')[0].children[0];
          angular.element(ionPurchaseSpan).html('You have invalid fields:').css({color: '#ED303C', opacity: 1});
        }
      });

      element.on('touchstart', function(){
        element.css({opacity: 0.8});
      });

      element.on('touchend', function(){
        element.css({opacity: 1});
      });
    };

    return {
      restrict: 'AEC',
      templateUrl: 'checkout-footer.html',
      link: link
    };
  }]);


//-------------------------------------
app.directive('addToCartButton', function() {


  function link(scope, element, attributes) {
    element.on('click', function(event){
      var cartElem = angular.element(document.getElementsByClassName("shopping-cart"));

      var offsetTopCart = cartElem.prop('offsetTop');


      var offsetLeftCart = cartElem.prop('offsetLeft');
      var widthCart = cartElem.prop('offsetWidth');
      var heightCart = cartElem.prop('offsetHeight');
      var imgElem = angular.element(event.target.parentNode.parentNode.childNodes[1]);
      var parentElem = angular.element(event.target.parentNode.parentNode);
      var offsetLeft = imgElem.prop("offsetLeft");
      var offsetTop = imgElem.prop("offsetTop");

      var offsetBottom = imgElem.prop("offsetBottom");

      var imgSrc = imgElem.prop("currentSrc");
      console.log(offsetLeft + ' : ' + offsetTop + ' : ' + imgSrc);
      console.log((offsetTopCart+heightCart/2) + ' : ' + (offsetLeftCart+widthCart/2));
      var imgClone = angular.element('<img src="' + imgSrc + '"/>');

      imgClone.css({
        'height': '150px',
        'position': 'absolute',
		'bottom':'0px',
          'right': '0px',
        'top': offsetTop + 'px',
        'left': offsetLeft + 'px',
        'opacity': 0.5
      });
      imgClone.addClass('itemaddedanimate');
      parentElem.append(imgClone);
      setTimeout(function () {
        imgClone.css({
          'height': '75px',
          'bottom':'0px',
          'right': '0px',
          'top': (offsetTopCart+heightCart/2)+'px',
          'left': (offsetLeftCart+widthCart/2)+'px',
          'opacity': 0.5
        });
      }, 500);
      setTimeout(function () {
        imgClone.css({
          'height': 0,
          'opacity': 0.5

        });
        cartElem.addClass('shakeit');
      }, 1000);
      setTimeout(function () {
        cartElem.removeClass('shakeit');
        imgClone.remove();
      }, 1500);
    });
  };


  return {
    restrict: 'E',
    link: link,
		transclude: true,
    replace: true,
    scope: {},
    template: '<button class="add-to-cart" ng-transclude></button>'
  };
});
//-------------------------------------

})(angular);

(function(angular){
angular.module("ionicShop.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("cart-footer.html","<div class=\'title cart-footer\'>Checkout</div>");
$templateCache.put("cart-item.html","<div ng-if=\'!emptyProducts\'>\n  <div class=\'card product-card\' ng-repeat=\'product in products track by $index\'>\n    <div class=\'item item-thumbnail-right product-item\'>\n      <img ng-src=\'{{product.images[0]}}\' class=\'product-image\' ion-product-image=\'product\'>\n      <h3 class=\'product-title\'>{{product.title}}</h3>\n      <p class=\'product-description\'>{{product.description}}</p>\n\n      <i class=\'icon ion-plus-round icon-plus-round\' mouse-down-up ng-click=\'addProduct(product)\'></i>\n         <span class=\'product-quantity\'>{{product.purchaseQuantity}}</span>\n      <i class=\'icon ion-minus-round icon-minus-round\' mouse-down-up ng-click=\'removeProduct(product)\'></i>\n\n      <span class=\'product-price\'>${{product.price}}</span>\n    </div>\n  </div>\n  <div>\n    <br><br><br><br>\n  </div>\n</div>\n\n<div class=\'empty-cart-div\' ng-if=\'emptyProducts\'>\n  <h3 class=\'empty-cart-header\'>Your bag is empty!</h3>\n  <i class=\'icon ion-bag empty-cart-icon\'></i>\n</div>");
$templateCache.put("checkout-footer.html","<div class=\'title purchase-footer\'>Pay</div>");
$templateCache.put("checkout.html","\n<span class=\'checkout-form-description\'>Please enter your credit card details:</span>\n\n<div class=\'list checkout-form\'>\n  <checkout-name ng-if=\'hasNameDir\'></checkout-name>\n  <checkout-card></checkout-card>\n  <checkout-address ng-if=\'hasAddressDir\'></checkout-address>\n  <checkout-email ng-if=\'hasEmailDir\'></checkout-email>\n</div>\n\n<h2 class=\'checkout-total\'>Total: ${{total}}</h2>\n");
$templateCache.put("gallery-item.html","<div class=\'ion-gallery-content\'>\n  <div class=\'card gallery-card\' ng-repeat=\'product in products track by $index\'>\n    <div class=\'item gallery-item\'>\n      <div class=\'gallery-image-div\'>\n        <img ng-src=\'{{product.images[0]}}\' class=\'gallery-product-image\'>\n      </div>\n      <h3 class=\'gallery-product-title\'>{{product.title}}</h3>\n      <h3 class=\'gallery-product-price\'>${{product.price}}</h3>\n      <div class=\'gallery-product-add\' ng-click=\'addToCart(product)\'>\n        <h3 class=\'gallery-product-add-title\' cart-add>{{addText}}</h3>\n      </div>\n    </div>\n  </div>\n</div>");
$templateCache.put("partials/address-line-one.html","<label class=\'item item-input address-line-one\'>\n  <input type=\'text\' ng-model=\'checkout.addressLineOne\' placeholder=\'Address Line 1\'>\n</label>");
$templateCache.put("partials/address-line-two.html","<label class=\'item item-input address-line-two\'>\n  <input type=\'text\' ng-model=\'checkout.addressLineTwo\' placeholder=\'Address Line 2\'>\n</label>");
$templateCache.put("partials/address.html","<div class=\'item item-divider\'>Address: </div>\n<address-one-input></address-one-input>\n<address-two-input></address-two-input>\n<city-input></city-input>\n<state-input></state-input>\n<zip-input></zip-input>\n");
$templateCache.put("partials/card-cvc-input.html","<label class=\'item item-input card-cvc-input\'>\n  <input type=\'tel\' ng-model=\'checkout.cvc\' ng-focus=\'onCvcFocus()\' ng-blur=\'onCvcBlur()\' placeholder=\'CVC\'>\n  <i class=\"icon\" style=\'width: 40px; text-align: center;\'></i>\n</label>");
$templateCache.put("partials/card-exp-input.html","<label class=\'item item-input card-exp-input\'>\n  <input type=\'tel\' ng-model=\'checkout.exp\' ng-focus=\'onExpFocus()\' ng-blur=\'onExpBlur()\' placeholder=\'MM/YYYY\'>\n  <i  class=\"icon\" style=\'width: 40px; text-align: center;\'></i>\n</label>");
$templateCache.put("partials/card-form.html","<div class=\'item item-divider\'>Card Info: </div>\n<card-num-input></card-num-input>\n<card-exp-input></card-exp-input>\n<card-cvc-input></card-cvc-input>");
$templateCache.put("partials/card-num-input.html","<label class=\'item item-input card-num-input\'>\n  <input type=\'tel\' ng-model=\'checkout.cc\' ng-focus=\'onNumFocus()\' ng-blur=\'onNumBlur()\' placeholder=\'Credit Card Number\'>\n  <i  class=\"icon ion-card\" style=\'width: 40px; text-align: center;\'></i>\n</label>");
$templateCache.put("partials/cart-image-modal.html","<div class=\"modal image-slider-modal\">\n\n  <ion-header-bar>\n    <button class=\"button button-light icon ion-ios7-undo-outline\" ng-click=\'closeModal()\'></button>\n    <h1 class=\"title\">More Images</h1>\n    \n  </ion-header-bar>\n\n    <ion-slide-box class=\'image-slider-box\' does-continue=\'true\'>\n      <ion-slide ng-repeat=\'image in product.images\' class=\'image-ion-slide\'>\n        <ion-content>\n          <div class=\'image-slide-div\'>\n            <h3 class=\'image-slide-description\'>{{product.description}}</h3>\n            <img src=\'{{image}}\' class=\'image-slide\'>\n          </div>\n        </ion-content>\n      </ion-slide>\n    </ion-slide-box>\n\n</div>");
$templateCache.put("partials/city-input.html","<label class=\'item item-input city-input\'>\n  <input type=\'text\' ng-model=\'checkout.city\' placeholder=\'City\'>\n</label>");
$templateCache.put("partials/email-input.html","<div class=\"item item-divider\">E-mail: </div>\n<label class=\"item item-input email-input\">\n  <input type=\"text\" ng-model=\"checkout.email\" ng-focus=\'onEmailFocus()\' ng-blur=\'onEmailBlur()\' placeholder=\"E-Mail\">\n  <i class=\"icon\" style=\'width: 40px; text-align: center;\'></i>\n</label>\n\n");
$templateCache.put("partials/first-name-input.html","  <label class=\'item item-input first-name-input\'>\n    <input type=\'text\' ng-model=\'checkout.lastName\' placeholder=\'Last Name\'>\n  </label>");
$templateCache.put("partials/last-name-input.html","  <label class=\'item item-input last-name-input\'>\n    <input type=\'text\' ng-model=\'checkout.firstName\' placeholder=\'First Name\'>\n  </label>");
$templateCache.put("partials/name-input.html","<div class=\'item item-divider\'>Name: </div>\n<first-name-input></first-name-input>\n<last-name-input></last-name-input>");
$templateCache.put("partials/state-input.html","<label class=\'item item-input state-input\'>\n  <input type=\'text\' ng-model=\'checkout.state\' placeholder=\'State\'>\n</label>");
$templateCache.put("partials/zipcode-input.html","<label class=\'item item-input zip-code-input\'>\n  <input type=\'text\' ng-model=\'checkout.zipcode\' ng-focus=\'onZipFocus()\' ng-blur=\'onZipBlur()\' placeholder=\'Zipcode\'>\n  <i class=\"icon zip-code-input-icon\" style=\'width: 40px; text-align: center;\'></i>\n</label>");}]);
})(angular);
(function(angular) {

  var app = angular.module('ionicShop', ['ionic', 'ionicShop.services', 'ionicShop.directives', 'ionicShop.templates']);

})(angular);
