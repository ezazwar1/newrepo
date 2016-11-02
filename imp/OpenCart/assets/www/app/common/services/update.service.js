'use strict';

/**
* @ngdoc service
* @name starter.updateService
* @requires ng.$rootScope
* @requires $ionicPopup
* @requires locale
* @description
* Initializes the update service. This will check for available app updates on start and once 
* in a 5 minutes. If an update is available, checks for network connection. If the device is 
* connected to a WIFI connection, download the update and install, otherwise popup informing the 
* update will be downloaded when device is connected to a WIFI
*/
angular.module('starter')
    .service('updateService', function ($rootScope, $ionicPopup, locale) {

        var strings = {};

        locale.ready('modals').then(function () {
            strings.update_available_title = locale.getString('modals.update_available_title');
            strings.update_is_ready_title = locale.getString('modals.update_is_ready_title');
            strings.update_downloaded_message = locale.getString('modals.update_downloaded_message');

            strings.button_not_now = locale.getString('modals.button_not_now');
            strings.button_restart = locale.getString('modals.button_restart');
            strings.button_ok = locale.getString('modals.button_ok');
            strings.button_download_now = locale.getString('modals.button_download_now');
        });

        /**
         * @ngdoc function
         * @methodOf starter.updateService
         * @name starter.updateService#init
         * @kind function
         * 
         * @description
         * Initializes the update service. This will check for available app updates on start and once in a 5 minutes. If an update is
         * available, checks for network connection. If the device is connected to a WIFI connection, download the update and install,
         * otherwise popup informing the update will be downloaded when device is connected to a WIFI
         * 
         */
        this.init = function () {
            $rootScope.downloadProgress = 0;
            $rootScope.extractingProgress = 0;
            $rootScope.downloadStarted = false;

            // init ionic deploy
            var deploy = new Ionic.Deploy();
            var forceDownload = false;
            var updateDownloaded = false;
            var updateDownloading = false;
            var updateMessageShown = false;
            var downloadUpdates = function () {
                if (updateDownloading)
                    return;
                $rootScope.noLoginSignupPopup = true;

                if (forceDownload || (window.Connection && navigator.connection.type == Connection.WIFI)) {
                    forceDownload = false;
                    updateDownloading = true;
                    $rootScope.downloadStarted = true;
                    deploy.unwatch();
                    deploy.download().then(function () {
                        updateDownloaded = true;
                        deploy.extract().then(function () {
                            $ionicPopup.show({
                                title: strings.update_is_ready_title,
                                subTitle: strings.update_downloaded_message,
                                buttons: [
                                  { text: strings.button_not_now },
                                  {
                                      text: strings.button_restart,
                                      onTap: function (e) {
                                          deploy.load();
                                      }
                                  }
                                ]
                            });
                        }, null, function (deployExtractingProgress) {
                            $rootScope.extractingProgress = deployExtractingProgress;
                        });
                    }, null, function (deployDownloadProgress) {
                        $rootScope.downloadProgress = deployDownloadProgress;
                    });
                } else {
                    deploy.unwatch();
                    if (updateMessageShown)
                        return;

                    updateMessageShown = true;
                    $ionicPopup.show({
                        title: strings.update_available_title,
                        templateUrl: 'templates/popups/update-available.html',
                        scope: $rootScope,
                        buttons: [
                          {
                              text: strings.button_ok,
                              onTap: function (e) {
                                  deploy.unwatch();
                              }
                          },
                          {
                              text: strings.button_download_now,
                              onTap: function (e) {
                                  e.preventDefault();
                                  forceDownload = true;
                                  downloadUpdates();
                              }
                          }
                        ]
                    });
                }
            }

            deploy.check().then(function (updateAvailable) {
                if (updateAvailable && !updateDownloaded) {
                    downloadUpdates();
                }
            });

            // watch every 5 mins
            deploy.watch({ interval: 600000 }).then(function () { }, function () { }, function (updateAvailable) {
                if (updateAvailable && !updateDownloaded) {
                    downloadUpdates();
                }
            });

            $rootScope.$on("$cordovaNetwork:online", function () {
                deploy.check().then(function (updateAvailable) {
                    if (updateAvailable) {
                        downloadUpdates();
                    }
                });
            });
        }
    });