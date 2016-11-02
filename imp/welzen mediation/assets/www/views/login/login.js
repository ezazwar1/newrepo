(function() {
	'use strict';

	angular.module('welzen')

	.controller('LoginController', function($scope, $state, $ionicHistory, userService, $ionicLoading, $ionicPopup,$stateParams,InAppPurchaseService) {

		var isBuying = $stateParams.buying;
		var productToBuy = $stateParams.product;

		$scope.popUpActive = isBuying;
		$scope.togglePopUpActive = function() {
			$scope.popUpActive = !$scope.popUpActive;
		};


		$scope.user = {};

		$scope.isBuying = function(){
			return isBuying;
		};

		$scope.productToBuy = function(){
			return productToBuy;
		};
		
		$scope.goBack = function(count) {
			$ionicHistory.goBack(count);
		};

		function validateEmail(email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		}

		$scope.analyzeEnterLogin = function(event){
			if(event.which === 13){
				$scope.login($scope.user);
			}
		};

		$scope.analyzeEnterForgot = function(event){
			if(event.which === 13){
				$scope.sendForgotMail($scope.user);
			}
		};

		$scope.analyzeEnterCreate = function(event){
			if(event.which === 13){
				$scope.create($scope.user);
			}
		};

		$scope.login = function() {

			if($scope.user.email.length === 0 || $scope.user.password.length === 0){
				return;
			}

			if(!validateEmail($scope.user.email)){
				return;
			}

			$ionicLoading.show();
			userService.login($scope.user).then(function(user){
				$ionicLoading.hide();
				if (isBuying){
		    		InAppPurchaseService.buyProduct(productToBuy);	
				}else{
					$state.go('main');
				}
			}, function(error){
				if(error.data===null){
					$ionicPopup.alert({
						title: 'Error',
						content: 'Network problems, check your connection'
					});
				}else{
					$ionicLoading.hide();
					$ionicPopup.alert({
						title: 'Error',
						content: error.data.message
					});
				}
			});
		};

		$scope.sendForgotMail = function(){
			if($scope.user.email.length === 0){
				return;
			}

			if(!validateEmail($scope.user.email)){
				return;
			}

			$ionicLoading.show();
			userService.sendForgotMail($scope.user).then(function(user){
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					title: 'Success',
					content: 'Check your email!'
				});
				alertPopup.then(function(res) {
					$state.go('main');
				});
			}, function(error){
				var errorMessage;
				$ionicLoading.hide();
				if(error.data===null){
					errorMessage = 'Network problems, check your connection';
				}else if(error.status === 404){
					errorMessage = 'Oops - An user with this email does not exists!';
				}else{
					errorMessage = error.data.message;
				}
				$ionicPopup.alert({
					title: 'Error',
					content: errorMessage
				});
			});	

		};

		$scope.create = function(){

			if($scope.user.fullname.length === 0 || $scope.user.password.length === 0 || $scope.user.email.length === 0){
				return;
			}

			if(!validateEmail($scope.user.email)){
				return;
			}

			$ionicLoading.show();
			userService.create($scope.user).then(function(user){
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					title: 'Success',
					content: 'Welcome to the family!'
				});
				alertPopup.then(function(res) {
					if (isBuying){
		    			InAppPurchaseService.buyProduct(productToBuy);	
					}else{
						$state.go('main');
					}
				});
			}, function(error){
				var errorMessage;
				$ionicLoading.hide();
				if(error.data===null){
					errorMessage = 'Network problems, check your connection';
				}else if(error.status === 409){
					errorMessage = 'Oops - An user with this email already exists!';
				}else{
					errorMessage = error.data.message;
				}
				$ionicPopup.alert({
					title: 'Error',
					content: errorMessage
				});
			});			
		};
	})

	.directive('welzenInput', function() {
		return {
			restrict: 'E',
			replace: true,
			require: '?ngModel',
			template: '<label class="welzenInput">' +
				'<input type="text" class="md-input">' +
				'<span class="input-label"></span>' +
				'</label>',
			compile: function(element, attr) {

				var label = element[0].querySelector('.input-label');
				label.innerHTML = attr.placeholder;

				/*Start From here*/
				var input = element.find('input');
				angular.forEach({
					'name': attr.name,
					'type': attr.type,
					'ng-value': attr.ngValue,
					'ng-model': attr.ngModel,
					'required': attr.required,
					'ng-required': attr.ngRequired,
					'ng-minlength': attr.ngMinlength,
					'ng-maxlength': attr.ngMaxlength,
					'ng-pattern': attr.ngPattern,
					'ng-change': attr.ngChange,
					'ng-trim': attr.trim,
					'ng-blur': attr.ngBlur,
					'ng-focus': attr.ngFocus,
				}, function(value, name) {
					if (angular.isDefined(value)) {
						input.attr(name, value);
					}
				});

				var cleanUp = function() {
					ionic.off('$destroy', cleanUp, element[0]);
				};
				// add listener
				ionic.on('$destroy', cleanUp, element[0]);

				return function LinkingFunction($scope, $element) {

					var mdInput = $element[0].querySelector('.md-input');

					var dirtyClass = 'used';

					var reg = new RegExp('(\\s|^)' + dirtyClass + '(\\s|$)');

					//Here is our toggle function
					var toggleClass = function() {
						if (this.value === '') {
							this.className = mdInput.className.replace(reg, ' ');
						} else {
							this.classList.add(dirtyClass);
						}
					};

					//Lets check if there is a value on load
					ionic.DomUtil.ready(function() {
						if (mdInput.value === '') {
							mdInput.className = mdInput.className.replace(reg, ' ');
						} else {
							mdInput.classList.add(dirtyClass);
						}
					});
					// Here we are saying, on 'blur', call toggleClass, on mdInput
					ionic.on('blur', toggleClass, mdInput);

				};

			}
		};
	});
}());