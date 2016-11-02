// orderItemsList
angular
    .module('shiptApp')
    .directive('orderItemsList',
    [
        '$timeout','AccountService','AppAnalytics','$rootScope',orderItemsList
    ]);


    function orderItemsList($timeout,AccountService,AppAnalytics,$rootScope) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
            order: '=order',
            hasChanges: '=hasChanges',
            editAddressFunction: '&',
            chooseAddressFunction: '&',
            addAddressFunction: '&'
        },
        link: function(scope, element, attrs) {

            function loadData() {
                try {
                    if(!scope.order.order_lines) {
                        AccountService.getOrder(scope.order.id)
                            .success(function(order){
                                scope.order = order;
                            })
                    }
                } catch (e) {

                }
            }

            scope.addOneToOrderLine = function(order_line) {
                if (orderLine.requested_product.product_type == 'by weight'){
                    orderLine.requested_qty = (parseFloat(orderLine.requested_qty) + .5 );
                } else {
                    orderLine.requested_qty ++ ;
                }
                updateCurrentOrder();
            };

            scope.removeOneFromOrderLine = function(order_line) {
                if (orderLine.requested_product.product_type == 'by weight'){
                    orderLine.requested_qty = (parseFloat(orderLine.requested_qty) - .5 );
                } else {
                    orderLine.requested_qty -- ;
                }
                if(orderLine.requested_qty == 0) {
                    viewModel.removeOrderLineCompletely (orderLine);
                }
                updateCurrentOrder();
            };

            scope.removeOrderLineCompletely = function(order_line) {
                var index;
                index = viewModel.order.order_lines.indexOf(orderLine);
                if (index > -1) {
                    viewModel.order.order_lines.splice(index,1);
                }
                updateCurrentOrder();
            };

            scope.getDisplayProductForOrderLine = function(order_line) {
                order_line.current_product = order_line.actual_product ? order_line.actual_product : order_line.requested_product;
                return order_line.current_product;
            };
            
            scope.getDisplayNameForProduct = function(product) {
                if(!product) return;
                if(product.isCustom) {
                    return product.description;
                } else {
                    if(product.brand_name) {
                        return product.brand_name + " " + product.name;
                    } else {
                        return product.name;
                    }
                }
            };

            function updateCurrentOrder () {
                scope.hasChanges = true;
            }

            loadData();
        },
        templateUrl: "app/groceries/account/orders/orderItemsList/orderItemsList.html",
      };
    }
