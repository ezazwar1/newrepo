
(function() {
    'use strict';

    angular
        .module('shiptApp')
        .controller('planController', planController);

    planController.$inject = [
        '$scope',
        '$log',
        'Subscription',
        'selectPaymentMethod',
        'UIUtil',
        'choosePlan',
        'ErrorHandler',
        '$rootScope',
        'createPaymentMethodModal',
        'FeatureService'
    ];

    function planController(
        $scope,
        $log,
        Subscription,
        selectPaymentMethod,
        UIUtil,
        choosePlan,
        ErrorHandler,
        $rootScope,
        createPaymentMethodModal,
        FeatureService) {

        var vm = this;
        vm.planLoaded = false;

        activate();

        function activate() {
            vm.plan = $scope.plan;
            loadPlans();
            if(!vm.plan) {
                if($scope.planPromise){
                    $scope.planPromise.then(function(data){
                        vm.plan = data;
                        $log.info("vm.plan",vm.plan);
                        vm.planLoaded = true;
                        $scope.planPromise = null;
                    })
                } else {
                    vm.populatePlan();
                }
            } else {
                vm.planLoaded = true;
            }
        }

        function loadPlans() {
            Subscription.list()
                .then(function(data) {
                    vm.availablePlans = data;
                }, function(error){
                    $log.error(error);
                })
        }

        vm.addPaymentMethod = function() {
            createPaymentMethodModal.showModal($scope)
                .then(function(cardAdded){
                    vm.populatePlan();
                }, function(error){
                    //no card added
                })
        }

        vm.changePlan = function() {
            choosePlan.showModal($scope, vm.availablePlans, vm.plan.plan)
                .then(function(selectedPlan){
                    if(selectedPlan.id != vm.plan.plan.id) {
                        UIUtil.showLoading('Saving Plan...');
                        vm.plan.plan_id = selectedPlan.id;
                        Subscription.update(vm.plan)
                            .then(function(data){
                                UIUtil.hideLoading();
                                UIUtil.showAlert('Plan Updated', 'Your plan has been updated to the ' + data.plan.name + ' plan.');
                                $rootScope.$broadcast('refresh.user-data');
                                vm.plan = data;
                            },function(error){
                                UIUtil.hideLoading();
                            });
                    }
                },function() {
                    //modal was canceled
                })
        }

        vm.choosePlan = function() {
            choosePlan.showModal($scope, vm.availablePlans, null)
                .then(function(selectedPlan){
                    $scope.saveModal();
                    UIUtil.showLoading('Saving Plan...');
                    selectedPlan.plan_id = selectedPlan.id;
                    Subscription.create(selectedPlan)
                        .then(function(data){
                            UIUtil.hideLoading();
                            UIUtil.showAlert('Plan Created', 'You have been subscribed to the ' + data.plan.name + ' plan.');
                            $rootScope.$broadcast('refresh.user-data');
                            vm.plan = data;
                        },function(error){
                            UIUtil.hideLoading();
                        });
                },function() {
                    $scope.cancelModal();
                    //modal was canceled
                })
        }

        vm.planPrice = function(plan){
            var amount =  plan.amount / 100;
            return amount;
        }

        vm.populatePlan = function() {
            Subscription.edit()
                .then(function(data) {
                    vm.plan = data;
                    $log.info("vm.plan",vm.plan);
                    vm.planLoaded = true;
                    $scope.$broadcast('scroll.refreshComplete');
                })
        }

        vm.trialEnding = function() {
            var trialEnding = moment(vm.plan.trial_end, "YYYY-MM-DD HH:mm:SS Z").format("MMMM Do")
            return trialEnding;
        }

        vm.defaultCard = function() {
            var card = vm.plan.sources.find(x => x.default_source)
            return card;
        }

        vm.currentPeriod = function() {
            var start = moment(vm.plan.current_period_start, "YYYY-MM-DD HH:mm:SS Z").format("MMM Do YYYY")
            var end = moment(vm.plan.current_period_end, "YYYY-MM-DD HH:mm:SS Z").format("MMM Do YYYY")
            var formatted = start + ' to ' + end;
            return formatted;
        }

        vm.cancelPlan = function(){
            UIUtil.showYesNoConfirm('Cancel Plan', 'Are you sure you want to cancel your plan?')
                .then(function(confirmed) {
                    if(confirmed) {
                        UIUtil.showLoading('Cancelling...');
                        performCancelSubscription();
                    }
                });
        }

        function performCancelSubscription(){
            Subscription.cancel().then(function(result){
                UIUtil.hideLoading();
                UIUtil.showAlert('Plan Cancelled', '').then(function(){
                    $rootScope.$broadcast('refresh.user-data');
                    vm.cancel();
                });
            }, function(error){
                UIUtil.hideLoading();
                showCancelSubscriptionError(error);
            });
        }

        function showCancelSubscriptionError(error){
            ErrorHandler.displayShiptAPIError(error, 'Error', 'We\'re sorry, there was a problem cancelling your subscription.\n Please contact us for help.');
        }

        vm.cancel = function() {
            $scope.cancelModal();
        }

        vm.showCancelPlan = function() {
            return FeatureService.subscriptionCancellation();
        }

        vm.addEditCardForPlan = function() {
            selectPaymentMethod.showModal($scope,vm.plan.sources, vm.defaultCard())
                .then(function(selectedCard){
                    if(selectedCard && selectedCard.id != vm.defaultCard().id){
                        $log.info('selected new card');
                        vm.plan.default_card = selectedCard.id;
                        vm.plan.default_source = selectedCard.id;
                        UIUtil.showLoading('Updating Payment...');
                        Subscription.update(vm.plan)
                            .then(function(data){
                                UIUtil.hideLoading();
                                $rootScope.$broadcast('refresh.user-data');
                                vm.plan = data;
                            },function(error){
                                UIUtil.hideLoading();
                            });
                    }
                })
        }
    }
})();
