'use strict';

app.controller('RequestNinjaModalController', [
  '$rootScope',
  '$scope',
  '$state',
  'Role',
  'Job',
  'Workplace',
function($rootScope, $scope, $state, Role, Job, Workplace) {

  $scope.createRequest = function(role, staffActive) {
      var workplaceid = $rootScope.customer.workplace.id
      var data = {role_id : role.id, agency_staff: !staffActive, client_id: workplaceid, staff_id: ""}

      Workplace.createJobOffer({ workplaceId: workplaceid }, data, function(res) {
          console.log(res);
      });
      $scope.searchingForNinjasModal.show();
  };

  $scope.cancelRequest = function() {
    $scope.requestNinjaModal.hide();
  };

    $scope.goPayment = function() {
        $rootScope.clearHistory();
        $state.go('app.customer.payment');
    };
}]);
