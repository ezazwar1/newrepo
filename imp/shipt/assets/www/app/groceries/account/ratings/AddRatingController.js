/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('shiptApp').controller('AddRatingController', [
        '$scope',
        '$log',
        '$rootScope',
        'UIUtil',
        'OrderRating',
        'LogService',
        'ShareModalProvider',
        AddRatingController]);

    function AddRatingController($scope,
                                 $log,
                                 $rootScope,
                                 UIUtil,
                                 OrderRating,
                                 LogService,
                                 ShareModalProvider) {

        $log.info('LoginController loaded');

        var viewModel = this;
        viewModel.rating = null;
        viewModel.ratingSaved = false;
        viewModel.savingRatingInProgress = false;

        viewModel.init = function(rateOrder) {
            if(rateOrder.rating) {
                viewModel.rating = new OrderRating(rateOrder.rating);
            } else {
                viewModel.rating = new OrderRating();
            }
            viewModel.rating.order_id = rateOrder.id;
            viewModel.rating.driver_id = rateOrder.driver_id;

            loadViewData();
        };

        $scope.$watch('viewModel.rating.rating', function(){
            if(viewModel.rating && viewModel.rating.isValid()) {
                viewModel.saveRating();
            }
        });

        viewModel.shareOrder = function() {
            ShareModalProvider.showModal($scope, 'rating_edit_add_modal_from_order_detail');
        };

        viewModel.showShareButton = function() {
            if(webVersion) {
                return false;
            } else {
                return true;
            }
        };

        viewModel.saveRating = function() {
            if(viewModel.rating.isValid){
                viewModel.savingRatingInProgress = true;
                viewModel.ratingSaved = false;
                viewModel.rating.save()
                    .success(function(data){
                        viewModel.rating.id = data.id;
                        viewModel.ratingSaved = true;
                        viewModel.savingRatingInProgress = false;
                        loadViewData();
                        $rootScope.$broadcast('rating.saved.refresh', viewModel.rating);
                    })
                    .error(function(error){
                        viewModel.savingRatingInProgress = false;
                        viewModel.ratingSaved = false;
                        $log.error('error', error);
                        LogService.error(error);
                        UIUtil.showErrorAlert(JSON.stringify(error));
                    });
            }
        };

        viewModel.cancelRating = function(){
            viewModel.rating.save();
            $rootScope.$broadcast('hide.add.rating');
        };

        viewModel.clickReason = function (reason) {
            reason.value = !reason.value;
            viewModel.rating[reason.property] = reason.value;
        };

        function loadViewData() {
            viewModel.badRatingReasons = [
                {
                    name: "Wrong Items",
                    names: ["Wrong", "Items"],
                    property: "wrong_items",
                    value: viewModel.rating.wrong_items
                },
                {
                    name: "Missing Items",
                    names: ["Missing", "Items"],
                    property: "missing_items",
                    value: viewModel.rating.missing_items
                },
                {
                    name: "Damaged Items",
                    names: ["Damaged", "Items"],
                    property: "damaged_items",
                    value: viewModel.rating.damaged_items
                },
                {
                    name: "Late Delivery",
                    names: ["Late", "Delivery"],
                    property: "late_delivery",
                    value: viewModel.rating.late_delivery
                },
                {
                    name: "Poor Substitutions",
                    names: ["Poor", "Substitutions"],
                    property: "poor_replacements",
                    value: viewModel.rating.poor_replacements
                },
                {
                    name: "Unfriendly Shopper",
                    names: ["Unfriendly", "Shopper"],
                    property: "unfriendly_driver",
                    value: viewModel.rating.unfriendly_driver
                }
            ]
        }
    }
})();
