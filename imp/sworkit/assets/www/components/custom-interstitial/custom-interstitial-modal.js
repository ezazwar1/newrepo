angular.module('swMobileApp').factory('CustomInterstitialModal', function ($rootScope, $ionicModal, SyncService, $sce, $window) {

    var CustomInterstitialModal = {};
    CustomInterstitialModal.hideModal = function () {
    };

    var $scope = $rootScope.$new();

    $scope.customInterstitialData = {
        header: $sce.trustAsHtml(globalSworkitAds.customInterstitial.header),
        body: $sce.trustAsHtml(globalSworkitAds.customInterstitial.body),
        ctaButtonText: $sce.trustAsHtml(globalSworkitAds.customInterstitial.ctaButtonText),
        action: globalSworkitAds.customInterstitial.action,
        navigateUrl: globalSworkitAds.customInterstitial.navigateUrl,
        buttonStyle: globalSworkitAds.customInterstitial.buttonStyle,
        backgroundColor: globalSworkitAds.customInterstitial.backgroundColor,
        customAdID: globalSworkitAds.customInterstitial.customAdID,
        showCountDownTimer: globalSworkitAds.customInterstitial.showCountDownTimer
    };

    $scope.liveSubscriptionPurchases = {
        dateUntilChange: globalSworkitAds.liveSubscriptionPurchases.dateUntilChange
    };

    $scope.openInAppBrowser = function () {
        $window.open($scope.customInterstitialData.navigateUrl, 'blank', 'location=no,AllowInlineMediaPlayback=yes');
        CustomInterstitialModal.hideModal();
        trackEvent('Ad Click', globalSworkitAds.customInterstitial.customAdID, 0);
    };

    $scope.showPremiumModal = function () {
        $rootScope.showPremium(globalSworkitAds.customInterstitial.customAdID);
        SyncService.pushArray(globalSworkitAds.customInterstitial.customAdID, 'premiumInterest');
        CustomInterstitialModal.hideModal();
        trackEvent('Ad Click', globalSworkitAds.customInterstitial.customAdID, 0);
    };

    $scope.closeModal = function () {
        CustomInterstitialModal.hideModal();
    };

    var modalOptions = {
        scope: $scope
    };

    CustomInterstitialModal.show = function () {
        $ionicModal.fromTemplateUrl('components/custom-interstitial/custom-interstitial-modal.html', modalOptions)
            .then(function (modal) {
                CustomInterstitialModal.hideModal = function () {
                    return modal.hide()
                        .then(function () {
                            return modal.remove();
                        });
                };

                modal.show();
            });
    };

    return CustomInterstitialModal;

});
