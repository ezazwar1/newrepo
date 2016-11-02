'use strict';

angular.module('HitchedApp')
    .controller('ScavengerCtrl', function($scope, $location, $modal, $log, Auth, GameInfo) {
        /******************************************************
         * Scavenger Hunt
         ******************************************************/
        $scope.editing = false;
        $scope.submitted = false;

        $scope.clueIdx = 0;
        $scope.hideAddClue = false;

        $scope.scavenger = {
            items: []
        };

        $scope.updateGame = {
            type: 'scavengerhunt',
            gameInfo: $scope.scavenger
        };

        $scope.newItem = {
            type: '',
            instruction: '',
            answer: '',
            clues: [{
                clue: ''
            }]
        };

        // load the current game index to be edited
        if ($scope.currGameEditId !== '') {
            $scope.updateGame = $scope.findGameById($scope.currGameEditId);
        }

        $scope.addItem = function(form) {
            if (form.$valid) {

                // push the new item and reset our newItem in the scope
                $scope.scavenger.items.push($scope.newItem);

                $scope.clueIdx = 0;
                $scope.editing = false;
                $scope.newItem = {
                    type: '',
                    instruction: '',
                    answer: '',
                    clues: [{
                        clue: ''
                    }]
                };
            }
        };

        $scope.addClue = function() {
            ++$scope.clueIdx;
            $scope.newItem.clues.push({
                clue: ''
            });
        };

        $scope.editItem = function(index) {
            // set item as current 'edit' item and remove from saved array
            $scope.newItem = $scope.scavenger.items[index];
            $scope.clueIdx = $scope.newItem.clues.length;
            $scope.scavenger.items.splice(index, 1);
            $scope.editing = true;
        };

        $scope.deleteItem = function(index) {
            // if (confirm('Are you sure you want to delete this?')) {
            //     $scope.scavenger.items.splice(index, 1);
            // }
        };

        // TODO: Encode the information before passing it across
        $scope.saveScavengerHunt = function() {
            $log.info('Saving Scavenger Hunt');
            $scope.submitted = true;

            $scope.updateGame.gameInfo = $scope.scavenger;
            GameInfo.update($scope.updateGame, $scope.closeGame).then(function() {

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
                            return 'Your scavenger hunt has been saved!';
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