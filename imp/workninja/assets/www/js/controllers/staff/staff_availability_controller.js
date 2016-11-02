'use strict';

app.controller('StaffAvailabilityController', [
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  'HOURS_OF_DAY',
  'DAYS_OF_WEEK',
  'staff',
function($scope, $rootScope, $state, $stateParams, HOURS_OF_DAY, DAYS_OF_WEEK, staff) {

  $scope.HOURS_OF_DAY = HOURS_OF_DAY;
  $scope.FROM_HOURS_OF_DAY = _.reject(HOURS_OF_DAY, function(h) {
    return h.id == 24;
  });
  $scope.TO_HOURS_OF_DAY = _.reject(HOURS_OF_DAY, function(h) {
    return h.id == 0;
  });

  $scope.DAYS_OF_WEEK = _.reject(DAYS_OF_WEEK, function(d) {
    return d.id == 100;
  });

  $scope.staff = staff;
  if ($scope.staff._original === undefined) {
    $scope.staff._original = angular.copy($scope.staff);
  }
  $scope.inSetup = $stateParams.inSetup === 'true';
  // $scope.inSetup = true;

  $scope.isAnytime = function(wday) {
    var availability = $scope.staff.availability[wday];
    return availability && availability.available && availability.from == 0 && availability.to == 24;
  };

  $scope.toggleAnytime = function(wday) {
    var availability = $scope.staff.availability[wday];
    if ($scope.isAnytime(wday)) {
      availability.from = 9;
      availability.to = 17;
    }
    else {
      availability.from = 0;
      availability.to = 24;
    }
  };

  $scope.editAvailability = function(wday) {
    var availability = $scope.staff.availability[wday];
    if (availability && availability.available) {
      $state.go('.wday', {wdayId: wday});
    }
  };

  $scope.availabilityChanged = function(wday) {
    var availability = $scope.staff.availability[wday];
    if (availability && availability.available) {
      if (availability.from === null) {
        availability.from = 0;
      }
      if (availability.to === null) {
        availability.to = 24;
      }
    }
  };

  $scope.canUpdate = function() {
    return $scope.staff.hasAvailability() && $scope.staff.isAvailabilityValid();
  };

  $scope.goMain = function() {
    if ($scope.staff._original !== undefined) {
      angular.copy($scope.staff._original, $scope.staff);
      delete $scope.staff._original;
    }
    $rootScope.clearHistory();
    $state.go('app.staff.main');
  };

  $scope.update = function() {
    $scope.staff.use_availability_zones = true;
    $scope.staff.$update().then(function() {
      delete $scope.staff._original;
      $rootScope.clearHistory();
      $state.go('app.staff.main');
    });
  };

    $scope.updateOnboard = function() {
        $scope.staff.use_availability_zones = true;
        $scope.staff.$update().then(function() {
            delete $scope.staff._original;
            $rootScope.clearHistory();
            $state.go('app.staff.onboard6');
        });
    };

    $scope.toggleAvailability = function (a, b) {

        $scope.staff.availability[a.id][b] = !$scope.staff.availability[a.id][b];
    };
}]);
