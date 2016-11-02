
(function () {
    'use strict';

    angular.module('shiptApp').controller('choosePlanController', [
        '$scope',
        '$timeout',
        'UIUtil',
        'Subscription',
        'createPaymentMethodModal',
        'AccountService',
        'AppAnalytics',
        choosePlanController]);

    function choosePlanController($scope,
                                  $timeout,
                                  UIUtil,
                                  Subscription,
                                  createPaymentMethodModal,
                                  AccountService,
                                  AppAnalytics) {
        var vm = this;

        vm.cancel = function(){
            $scope.closeModal();
        };

        vm.selectedPlanInPlans = true;

        vm.saveSelection = function() {
            $scope.closeModal(vm.selectedPlan);
        };

        vm.clickSource = function(window){
            $timeout(function(){
                if(vm.cards.length == 0) {
                    //needs to add a card first
                    AppAnalytics.track('choosePlanClickPlan',{customerHasCardAlready:false,selectedPlan: vm.selectedPlan})
                    createPaymentMethodModal.showModal($scope)
                        .then(function(newCard){
                            vm.saveSelection();
                        },function(error){
                            AppAnalytics.track('canceledPaymentModalAfterChoosePlanClick')
                            //canceled the payment modal
                        })
                } else {
                    AppAnalytics.track('choosePlanClickPlan',{customerHasCardAlready:true,selectedPlan: vm.selectedPlan})
                    vm.saveSelection();
                }
            },200);
        };

        vm.planPrice = function(plan){
            var amount =  plan.amount / 100;
            return amount;
        }

        vm.addPayment = function() {
            createPaymentMethodModal.showModal($scope)
        }

        function loadData(){
            loadPaymentMethods();
            vm.plans = $scope.plans;
            vm.selectedPlan = $scope.selectedPlan;
            selectPlan ();
            if(!vm.plans){
                Subscription.list()
                    .then(function(data){
                        vm.plans = data;
                        selectPlan ();
                    })
            }
        }

        function loadPaymentMethods() {
            AccountService.getCardsFromServer()
                .then(function(data){
                    var customerInfo = data;
                    vm.cards = customerInfo.credit_cards;
                },function(error){
                    $log.info('load cards error', error);
                });
        }

        function selectPlan () {
            if(vm.selectedPlan && vm.plans){
                var planMatch = vm.plans.find(x => x.id == vm.selectedPlan.id);
                if (planMatch) {
                    vm.selectedPlanInPlans = true;
                    vm.selectedPlan = planMatch;
                } else {
                    vm.selectedPlanInPlans = false;
                }
            }
        }

        loadData();
    }
})();
