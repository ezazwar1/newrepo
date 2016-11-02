'use strict';

angular.module('HitchedApp')
    .controller('GamesCtrl', function($scope, $location, $modal, $log, Auth, GameInfo) {

        $scope.currGame = '';
        $scope.currGameSrc = '';
        $scope.currGameEditId = '';

        $scope.userGames = [];

        // Games offered 
        var gameHash = {
            'scavengerhunt': 0,
            'crosswordpuzzle': 1,
            'anagram': 2
        };
        $scope.gameTypes = [{
            'type': 'scavengerhunt',
            'title': 'Scavenger Hunt',
            'template': 'scavenger',
            'info': 'Find all the items!',
            'class': 'box-info',
            'octicon': 'octicon-search'
        }, {
            'type': 'crosswordpuzzle',
            'title': 'Crossword Puzzle',
            'template': 'crossword',
            'info': 'Who can complete it first?',
            'class': 'box-success',
            'octicon': 'octicon-puzzle'
        }, {
            'type': 'anagram',
            'title': 'Wedding Anagram',
            'template': 'anagram',
            'info': 'Can you unscramble the words?',
            'class': 'box-warning',
            'octicon': 'octicon-puzzle'
        }];

        $scope.findGameById = function(gameId){
            for(var i = 0; i < $scope.userGames.length; i++){
                if($scope.userGames[i]._id === gameId){
                    return $scope.userGames[i];
                }
            }
            return null;
        }

        function pullUserGames() {
            var self = $scope;
            Auth.getCurrentUser().$promise.then(function(user) {
                self.user = user;
                GameInfo.userGames(user.games).then(function(data) {
                    self.userGames = data;
                });
            });
        }

        // Get the wedding information
        // Get the user's existing games
        // Add the existing games to the scope 
        pullUserGames();

        // Add the default game setup
        $scope.addGame = function(template){

        };

        // Fetch the template for the specific game selected
        $scope.selectGame = function(template) {
            $scope.currGame = template;
            $scope.currGameSrc = 'app/member/features/games/' + template;
        };

        $scope.editGame = function(gameId) {
            var tempGame = $scope.findGameById(gameId);
            var gameType = $scope.gameTypes[gameHash[tempGame.type]];

            $scope.currGame = gameType.template;
            $scope.currGameSrc = 'app/member/features/games/' + gameType.template;
            $scope.currGameEditId = gameId;
        };

        $scope.deleteGame = function(gameId) {

            var tempGame = $scope.findGameById(gameId);
            GameInfo.remove(tempGame, pullUserGames).then(function() {
                var modalInstance = $modal.open({
                    templateUrl: 'components/alert/alert.html',
                    controller: 'AlertCtrl',
                    windowClass: 'hitched-modal',
                        resolve: {
                            alertTitle: function() {
                                return 'Game Removed.';
                            },
                            alertBody: function() {
                                return 'The game has been deleted.';
                            },
                        alertClass: function() {
                            return 'alert-danger';
                        }
                        }

                });

                modalInstance.result.then(function(result) {

                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });

            }).catch(function(err) {
                err = err.message;
            });
        };

        $scope.cancelGame = function() {
            $scope.currGame = '';
            $scope.currGameSrc = '';
            pullUserGames();
        };

        $scope.closeGame = function() {
            $scope.currGame = '';
            $scope.currGameSrc = '';
            pullUserGames();
        };

    });