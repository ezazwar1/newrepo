// customerAddressList
angular
    .module('shiptApp')
    .directive('customerAddressList',
    [
        '$timeout','AccountService','AppAnalytics','$rootScope',customerAddressList
    ]);


    function customerAddressList($timeout,AccountService,AppAnalytics,$rootScope) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
            showEditButtons: '=showEditButtons',
            refreshList: '=refreshList',
            noDefaultAddress: '=noDefaultAddress',
            editAddressFunction: '&',
            chooseAddressFunction: '&',
            addAddressFunction: '&'
        },
        link: function(scope, element, attrs) {

            function loadData() {
                scope.chooseStoreEnabled = AccountService.checkFeature("chooseStoreInApp");
                scope.customer = AccountService.getCustomerInfo(true);
                scope.defaultShoppingAddress = AccountService.getCustomerDefaultShoppingAddress();

                if(scope.refreshList) {
                    showLoading();
                    AccountService.getAddressesFromServer()
                        .then(function(data){
                            scope.customer = data;
                            scope.defaultShoppingAddress = AccountService.getCustomerDefaultShoppingAddress();
                            hideLoading();
                            if(!scope.defaultShoppingAddress && scope.customer && scope.chooseStoreEnabled){
                                scope.noDefaultAddress();
                            }
                        },function(error){
                            hideLoading();
                        });
                }

            }

            $rootScope.$on('refreshCustomerAddressList',function(){
                loadData();
            });

            function showLoading() {
                scope.showLoading = true;
            }

            function hideLoading() {
                scope.showLoading = false;
            }

            scope.clickAddress = function(address){
                var addressClicked = address;
                scope.chooseAddressFunction({ clickedAddress: addressClicked });
            }

            scope.clickEditAddress = function(address){
                var addressClicked = address;
                console.log('editAddressClick',addressClicked);
                scope.editAddressFunction({ clickedAddress: addressClicked });
            }

            scope.addAddressClick = function() {
                console.log('addAddressClick');
                scope.addAddressFunction();
            }

            loadData();
        },
        templateUrl: "app/groceries/account/address/customerAddressList/customerAddressList.html",
      };
    }
