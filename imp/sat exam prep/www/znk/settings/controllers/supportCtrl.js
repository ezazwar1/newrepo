'use strict';

(function(angular) {

    angular.module('znk.sat').controller('SupportCtrl', [
        '$scope','$window', 'ZnkModalSrv', 'PopUpSrv',
        function SupportCtrl($scope, $window, ZnkModalSrv, PopUpSrv) {
            $scope.d = {};

            $scope.openInBrowser = function(){
                $window.open ('http://www.zinkerz.com', '_system');
            };

            $scope.sendEmail = function sendEmail () {
                if ($window.cordova && $window.cordova.plugins && $window.cordova.plugins.email){
                    $window.cordova.plugins.email.isAvailable(
                      function (isAvailable){
                          if(!isAvailable){
                              $scope.$apply(function(){
                                  PopUpSrv.error('Email Client Not Configured','Please configure your email client or contact us through support@zinkerz.com');
                              });
                          }else{
                              $window.cordova.plugins.email.open({
                                  to:      'support@zinkerz.com',
                                  subject: 'Contact Us',
                                  body:    ''
                              });
                          }
                      }
                    )
                }
            };

            function _baseShowTourModal(customOpt){
                var baseTourVideoModalOpt = {
                    templateUrl: 'znk/system/shared/templates/baseVideoTourHintModal.html',
                    wrapperClass: 'base-video-tour-hint-modal',
                    showCloseBtn: true,
                    ctrl: 'BaseVideoTourHintModalCtrl',
                    ctrlAs: 'baseVideoTourCtrl'
                };
                var modalOptions = angular.extend(baseTourVideoModalOpt,customOpt);
                if(!modalOptions.resolve){
                    modalOptions.resolve = {};
                }
                if(!modalOptions.resolve.config){
                    modalOptions.resolve.config = {};
                }
                modalOptions.resolve.config.onVideoEnded = function(){
                    if(createModalFn.modalInstance && !createModalFn.modalInstance.closed){
                        createModalFn.modalInstance.close();
                    }
                };
                var createModalFn = ZnkModalSrv.singletonModalFn(modalOptions);

                return createModalFn;
            }

            var questionTourCustomOpt = {
                resolve:{
                    config:{
                        videoSrc:{
                            mobileUrl: 'assets/videos/question-tour-mobile.mp4',
                            tabletUrl: 'assets/videos/question-tour.mp4'
                        }
                    }
                }
            };
            $scope.d.showQuestionTour = _baseShowTourModal(questionTourCustomOpt);
        }]);
})(angular);
