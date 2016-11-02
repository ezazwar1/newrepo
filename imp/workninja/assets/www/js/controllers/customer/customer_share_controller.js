'use strict';

app.controller('CustomerShareController', [
  '$rootScope',
  '$scope',
  '$state',
function($rootScope, $scope, $state) {

  $scope.goMain = function() {
    $rootScope.clearHistory();
    $state.go('app.customer.main');
  };

}]);
