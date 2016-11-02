/**
 * Created by Shipt.
 */

(function () {
    'use strict';

    angular.module('shiptApp').controller('AccountOrdersController', [
        '$scope',
        '$rootScope',
        'AccountService',
        'UIUtil',
        '$ionicModal',
        '$stateParams',
        '$state',
        'AuthService',
        'ordersModalProvider',
        AccountOrdersController]);

    function AccountOrdersController($scope,
                                     $rootScope,
                                     AccountService,
                                     UIUtil,
                                     $ionicModal,
                                     $stateParams,
                                     $state,
                                     AuthService,
                                     ordersModalProvider) {

        var viewModel = this;
        viewModel.title = "Your Orders";
        var ratingModal = null;
        var orderDetailModal = null;

        var loadOrders = function() {
            return AccountService.getOrdersFromServer()
                .then(function(data){
                    var customerInfo = data;
                    viewModel.orders = customerInfo.orders;
                    hideLoading();
                    $scope.$broadcast('scroll.refreshComplete');
                },function(error){
                    hideLoading();
                    var account  = AuthService.getCustomerInfo();
                    viewModel.orders = account.orders;
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };

        viewModel.getDisplayDate = function(dateString) {
            return moment(dateString).format("MMM Do YYYY, h:mm a");
        };

        viewModel.showRating = function(order){
            return (order.status == "delivered" && order.rating);
        };

        viewModel.doRefresh = function(){
            $rootScope.$broadcast('refresh.user-data');
            loadOrders();
        };

        viewModel.rateOrderClick = function(order) {
            $scope.rateOrder = order;
            $ionicModal.fromTemplateUrl('app/groceries/account/ratings/addRatingModal.html', {scope: $scope})
                .then(function(modal) {
                    ratingModal = modal;
                    ratingModal.show();
                });
        };

        viewModel.clickOrder = function ( order ) {
            if(order.status == 'cancelled') {
                UIUtil.showAlert('Cancelled Order', 'This order has been cancelled.');
                return false;
            }
            $scope.orderDetailOrder = order;
            ordersModalProvider.orderHistoryModal($scope);
        };

        $scope.closeOrderDetailModel = function() {
            orderDetailModal.hide();
            $scope.orderDetailOrder = null;
        };

        $rootScope.$on('hide.add.rating', function(){
            if(ratingModal) ratingModal.hide();
        });

        $rootScope.$on('rating.saved.refresh', function(event, args){
            if($scope.rateOrder) $scope.rateOrder.rating = args;
            if($scope.orderDetailOrder) $scope.orderDetailOrder.rating = args;
        });

        $rootScope.$on('order.saved.refresh', function(event,order){
            $rootScope.$broadcast('refresh.user-data');
            loadOrders();
        });

        function showRateOrderModal() {
            var passedInOrder = $stateParams.order ? angular.fromJson($stateParams.order) : null;
            if(passedInOrder) {
                var order_id = passedInOrder.order_id;
                var driver_id = passedInOrder.driver_id;
                var order = {id: order_id, driver_id: driver_id, status: passedInOrder.status };
                if(passedInOrder.status) {
                    if(order.status != "delivered") {
                        viewModel.clickOrder(order);
                        return;
                    }
                }
                if (order_id && driver_id) {
                    viewModel.clickOrder(order);
                    viewModel.rateOrderClick(order);
                }
            }
        }

        $scope.$on('$ionicView.afterEnter', function() {
            if($state.current.name != 'app.orders') {
                showRateOrderModal();
            }
            $rootScope.$broadcast('refresh.user-data');
            showLoading();
            loadOrders();
        });

        function showLoading() {
            viewModel.loadingSpinner = true;
        }
        function hideLoading() {
            viewModel.loadingSpinner = false;
        }

    }
})();
