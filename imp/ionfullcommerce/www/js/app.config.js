'use strict';
(function(){
	angular.module('eCommerce')
	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider

		.state('app', {
			url: '/app',
			abstract: true,
			templateUrl: 'app/shared/sidemenu.tmpl.html'
		})		
		.state('landing', {
			url: '/landing',			
			templateUrl: 'app/landing/landing.tmpl.html',
			controller:'landingCtrl'
		})
		.state('app.category', {
			url: '/category',
			views: {
				'menuContent': {
					templateUrl: 'app/categories/categories.tmpl.html',
					controller:'categoriesCtrl'
				}
			}
		})
		.state('app.store', {
			url: '/store',
			views: {
				'menuContent': {
					templateUrl: 'app/store/store.tmpl.html',
					controller:'storeCtrl'
				}
			}
		})
		.state('app.single', {
			url: '/single/:id',
			views: {
				'menuContent': {
					templateUrl: 'app/shop/single.tmpl.html',
					controller:'singleCtrl'
				}
			}
		})
		.state('app.cart', {
			url: '/cart',
			views: {
				'menuContent': {
					templateUrl: 'app/cart/cart.tmpl.html',
					controller:'cartCtrl'
				}
			}
		})

		.state('app.delivery', {
			url: '/delivery',
			views: {
				'menuContent': {
					templateUrl: 'app/checkout/delivery.tmpl.html',
					controller:'checkoutCtrl'
				}
			}
		})
		.state('app.checkout', {
			url: '/checkout',
			views: {
				'menuContent': {
					templateUrl: 'app/checkout/checkout.tmpl.html',
					controller:'checkoutCtrl'
				}
			}
		})
		.state('app.orders', {
			url: '/orders',
			views: {
				'menuContent': {
					templateUrl: 'app/shop/orders.tmpl.html',
					controller:'checkoutCtrl'
				}
			}
		})

		.state('app.home', {
			url: '/home',
			views: {
				'menuContent': {
					templateUrl: 'app/home/homepage.tmpl.html',
					controller:'homeCtrl'
				}
			},
			onEnter:function(AuthSession,$state){

				if(!AuthSession.isLoggedIn()){

				}				
			}
		});

		$urlRouterProvider.otherwise('/landing');
	});


})()