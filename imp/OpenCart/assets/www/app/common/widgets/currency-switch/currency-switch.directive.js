'use strict';

/**
* @ngdoc directive
* @name starter.directive:currencySwitch
* @description
* Widget to render currency switch. 
* @param {object} item Product object
* @example
<pre>
    <currency-switch></currency-switch>
</pre>
*/
angular.module('starter')
   .directive('currencySwitch', function () {
       return {
           scope: {},
           link: function (scope, element, attrs) {
               
           },
           controller: ['$scope', '$rootScope', 'dataService', '$localStorage', '$ionicHistory', function ($scope, $rootScope, dataService, $localStorage, $ionicHistory) {
				
				$scope.currency = $localStorage.currency ? $localStorage.currency : 'USD'
				
				$scope.$watch('currency', function (currency) {
				    dataService.apiSecuredPost('/currency/currency', { code: currency }).then(function () {
				        $rootScope.$broadcast('i2csmobile.shop.refresh');
				    });
				});

				$scope.loadCurrencies = function(){
					dataService.apiSecuredPost('/currency').then(function (data) {
						$scope.currencies = data.currencies;
						$scope.currency = data.code;
					});
				}
			   
			   $scope.loadCurrencies();
           }],
           templateUrl: 'app/common/widgets/currency-switch/currency-switch-template.html'
       };
   });