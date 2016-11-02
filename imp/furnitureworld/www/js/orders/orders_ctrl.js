angular.module('starter.controllers')
.controller('OrdersCtrl', function($scope,$ionicModal,orderService,$rootScope) {
	'use strict';
	$ionicModal.fromTemplateUrl('js/orders/orderdetail-modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
   }).then(function(modal) {
      $scope.modal = modal;
   });

   $scope.openModal = function() {
      $scope.modal.show();
   };

   $scope.closeModal = function() {
      $scope.modal.hide();
   };

   //Cleanup the modal when we're done with it!
   $scope.$on('$destroy', function() {
      $scope.modal.remove();
   });

   // Execute action on hide modal
   $scope.$on('modal.hidden', function() {
      // Execute action
   });

   // Execute action on remove modal
   $scope.$on('modal.removed', function() {
      // Execute action
   });

         //genrate order list//
      orderService.getorderlist()
      .then(function(response) {
        // $rootScope.accordionArray = response.data.data;
          $rootScope.myorder = response.data.order;
           $rootScope.myorderDetail = response.data.orderdetail;
         console.log($rootScope.myorderDetail);
      });





});
