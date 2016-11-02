
(function () {
    'use strict';

    angular.module('shiptApp').controller('TippingModalController', [
        '$scope',
        'UserOrderService',
        'LogService',
        TippingModalController]);

    function TippingModalController($scope,
                                    UserOrderService,
                                    LogService) {
        var viewModel = this;

        viewModel.tipOptions = [
            {amount:0, text: 'No Tip'},
            {amount:5, text: '$5'},
            {amount:10, text: '$10'},
            {amount:15, text: '$15'}
        ];
        viewModel.otherTipAmount = null;

        viewModel.closeModal = function(){
            $scope.closeModal(viewModel.order);
        };

        viewModel.saveOtherAmount = function(){
            viewModel.order.tip = viewModel.otherTipAmount;
            viewModel.closeModal();
            UserOrderService.tipOrder(viewModel.order);
        };

        viewModel.selectTipOption = function(tipOption){
            viewModel.otherTipAmount = null;
            viewModel.otherAmount = false;
            viewModel.tipOption = tipOption;
            viewModel.order.tip = tipOption.amount;
            viewModel.closeModal();
            UserOrderService.tipOrder(viewModel.order);
        };

        $scope.$watch('viewModel.otherTipAmount', function(){
            if(viewModel.otherTipAmount != null && viewModel.otherTipAmount != ""){
                viewModel.tipOption = null;
                viewModel.otherAmount = true;
            } else {
                viewModel.otherAmount = false;
            }
        });

        viewModel.tipUntilTimeString = function(){
            if(viewModel.order.tippable){
                var formatString = moment(viewModel.order.tippable_until)
                                        .format('MMMM Do YYYY, h:mm:ss a');
                return formatString;
            } else {
                return 'n/a';
            }
        };

        function init() {
            try {
                viewModel.order = $scope.order;
                viewModel.tipOption = null;
                if(!viewModel.order.tip || viewModel.order.tip == 0){
                    viewModel.tipOption = viewModel.tipOptions[0];
                } else {
                    for(var i = 0; i <  viewModel.tipOptions.length; i++){
                        var to = viewModel.tipOptions[i];
                        if(viewModel.order.tip == to.amount){
                            viewModel.tipOption = to;
                            break;
                        }
                    }
                    if(viewModel.tipOption == null){
                        viewModel.otherAmount = true;
                        viewModel.otherTipAmount = viewModel.order.tip;
                    }
                }
            } catch(exception){
                LogService.error(['error in TippingModalController.init', exception]);
            }
        }

        init();
    }
})();
