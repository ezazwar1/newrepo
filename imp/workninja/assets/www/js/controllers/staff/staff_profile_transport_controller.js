'use strict';

app.controller('StaffProfileTransportController', [
  '$scope',
  'Staff',
  'staff',
function($scope, Staff, staff) {

  $scope.Staff = Staff;
  $scope.staff = staff;

  $scope.setModeOfTransport = function(mode) {
    $scope.staff.profile.mode_of_transport = mode;
  }

}]);
