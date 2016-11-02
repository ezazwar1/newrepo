'use strict';

angular.module('HitchedApp')
    .controller('CrosswordCtrl', function($scope, $location, $modal, $log, Auth, GameInfo) {
        /******************************************************
         * Crossword
         ******************************************************/

        $scope.crossword = {};
        $scope.submitted = false;

        // TODO: Encode the information before passing it across
        $scope.saveAnagram = function() {
            $log.info('Saving Crossword');
            $scope.submitted = true;

            var updateGame = {
                type: 'Crossword',
                gameInfo: $scope.crossword
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
                            return 'Your crossword puzzle has been saved!';
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