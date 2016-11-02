

(function () {
    'use strict';

    angular.module('shiptApp').controller('ContactUsController', [
        '$scope',
        '$rootScope',
        '$state',
        'UIUtil',
        '$log',
        'LogService',
        '$cordovaEmailComposer',
        ContactUsController]);

    function ContactUsController($scope,
                                 $rootScope,
                                 $state,
                                 UIUtil,
                                 $log,
                                 LogService,
                                 $cordovaEmailComposer) {

        var viewModel = this;

        viewModel.emailClick = function(){
            try {
                if('cordova' in window){
                    $cordovaEmailComposer.isAvailable().then(function() {
                        var email = {
                            to: 'support@shipt.com',
                            subject: 'In-App Support',
                            body: '',
                            isHtml: true
                        };
                        $cordovaEmailComposer.open(email).then(null, function () {
                            // user cancelled email
                        });
                    }, function () {
                        window.open('mailto:support@shipt.com', '_system', 'location=yes'); return false;
                    });
                } else {
                    window.open('mailto:support@shipt.com', '_system', 'location=yes'); return false;
                }
            } catch (exception) {
                LogService.error(['viewModel.emailClick',exception])
            }
        };

        viewModel.callClick = function(){
            window.open('tel:205-502-2500', '_system', 'location=yes'); return false;
        };

    }
})();
