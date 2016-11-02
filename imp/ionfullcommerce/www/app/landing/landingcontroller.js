'use strict';
(function(){
	angular.module('eCommerce')
	.controller('landingCtrl', ['$scope','$state','$ionicModal','Auth',
		'$ionicLoading','AuthSession','$ionicPopup',
		function ($scope,$state,$ionicModal,Auth,$ionicLoading,AuthSession,$ionicPopup) {
			$scope.user = {},
			$scope.IsSignIn,
			$scope.formTitle;

			$scope.$on('$ionicView.loaded', function(){

			});

			$scope.$on('$ionicView.afterEnter', function(){


			});

			

			$ionicModal.fromTemplateUrl('app/modals/sign-in-modal.html', {
				scope: $scope
			}).then(function(modal) {
				$scope.loginModal = modal;
			});

			$scope.closeLogin = function() {
				$scope.loginModal.hide();
			};

			$scope.showLogin=function(){
				$scope.IsSignIn = 'signin';
				$scope.formTitle = "Login";			
				$scope.loginModal.show();
			};
			$scope.startShopping=function(){
				$state.go('app.category');
			};

			$scope.showSignUp =function(){
				$scope.IsSignIn = 'register';
				$scope.formTitle = "Sign Up";			
				$scope.loginModal.show();
			};

			$scope.login=function(){
				$ionicLoading.show({
					template:"Please wait.."
				});

				var user = {
					email:$scope.user.email,
					password:$scope.user.password
				};

				Auth.login(user).then(function(res){

					console.log(res);
					if(res.data.error===false){
						AuthSession.setUserId(res.data.user._id);
						$ionicLoading.hide();	
						$scope.closeLogin();
						$state.go('app.home');
					}else{
						$ionicLoading.hide();
						$ionicPopup.alert({
							template:res.data.message,
							title:"Login Error"
						});
					}

				},function(err){
					$ionicLoading.hide();
					console.log(err);
					$ionicLoading.hide();
					$ionicPopup.alert({
						template:err.data.message,
						title:"Login Error"
					});
				})
			};

			$scope.register=function(){
				$ionicLoading.show({
					template:"Please wait.."
				});

				var newUser = {
					name:$scope.user.name,
					email:$scope.user.email,
					password:$scope.user.password
				};

				Auth.add(newUser).then(function(res){

					AuthSession.setUserId(res.data.result._id);					
					$ionicLoading.hide();
					$scope.closeLogin();
					$state.go('app.home');
				},function(err){
					$ionicLoading.hide();
					console.log(err);
				});
			}

		}])
	


})()