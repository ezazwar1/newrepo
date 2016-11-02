'use strict';

app.controller('SearchingForNinjasModalController', [
  '$rootScope',
  '$scope',
function($rootScope, $scope) {

  $scope.rejectJob = function() {
    delete $scope.job;
    $scope.searchingForNinjasModal.hide();
    $scope.job.$cancel(function() {
    }, function(error) {
      console.log('[SearchingForNinjasModalController] cancel error: ' + JSON.stringify(error));
    });
  };

}]);
