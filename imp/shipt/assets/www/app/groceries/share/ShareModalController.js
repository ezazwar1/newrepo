/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('shiptApp').controller('ShareModalController', [
        '$scope',
        '$log',
        '$rootScope',
        'UIUtil',
        'SharingService',
        'LogService',
        'ShiptLogItemsService',
        'ReferralService',
        'KahunaService',
        '$timeout',
        'AppAnalytics',
        ShareModalController]);

    function ShareModalController($scope,
                                  $log,
                                  $rootScope,
                                  UIUtil,
                                  SharingService,
                                  LogService,
                                  ShiptLogItemsService,
                                  ReferralService,
                                  KahunaService,
                                  $timeout,
                                  AppAnalytics){
        var viewModel = this;

        viewModel.cancelShare = function() {
            $log.info('cancel share');
            $rootScope.$broadcast('hide.share.modal');
        }

        viewModel.shareOrder = function() {
            AppAnalytics.track('clickShareReferralButton',{source: $scope.source});
            ShiptLogItemsService.incrementLogItem('analytics','customer_app_share_referral_link_location',$scope.source);
            SharingService.shareNativeShareSheet(viewModel.code.urls[0].share_message,
                                                    viewModel.code.urls[0].share_subject,
                                                    null,
                                                    viewModel.code.urls[0].url);
            KahunaService.inviteFriend();
        };

        viewModel.loadCode = function() {
            ReferralService.getCustomerCodes()
                .then(function(codes) {
                    viewModel.code = codes[0];
                })
        };

        AppAnalytics.track('viewReferralShareModal',{source: $scope.source});

    };
})();
