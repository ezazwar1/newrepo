'use strict';

angular.module('HitchedApp')
    .controller('AnagramCtrl', function($scope, $location, $modal, $log, Auth, GameInfo) {
        /******************************************************
         * Anagram
         ******************************************************/

        $scope.anagram = {};
        $scope.submitted = false;

        // TODO: Encode the information before passing it across
        $scope.saveAnagram = function() {
            $log.info('Saving Anagram');
            $scope.submitted = true;

            var updateGame = {
                type: 'Anagram',
                gameInfo: $scope.anagram
            };

            GameInfo.update(updateGame).then(function() {

                $scope.submitted = false;

                var modalInstance = $modal.open({
                    templateUrl: 'components/alert/alert.html',
                    controller: 'AlertCtrl',
                    windowClass: 'hitched-modal',
                    resolve: {
                        alertTitle: function() {
                            return 'Success!';
                        },
                        alertBody: function() {
                            return 'Your anagram game has been saved!';
                        },
                        alertClass: function() {
                            return 'alert-success';
                        }
                    }
                });

                modalInstance.result.then(function(result) {

                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });

            }).catch(function(err) {
                err = err.message;
                $scope.errors.other = err.message;
            });
        };

    });