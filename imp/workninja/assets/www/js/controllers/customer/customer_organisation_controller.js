'use strict';

app.controller('CustomerOrganisationController', [
  '$scope',
  '$rootScope',
  '$state',
  '$window',
  'Auth',
  'Tracker',
  'customer',
  'Customer',
  'Workplace',
  'Staff',
  'Session',
  'Manager',
function($scope, $rootScope, $state, $window, Auth, Tracker, customer, Customer, Workplace, Staff, Session, Manager) {
  $scope.staff = [];
  $scope.addMessage = "Staff";
  $scope.managersActive = false;
  $scope.staffActive = true;
  $scope.workplacesActive = false;
  $scope.staffList = [];
  $scope.managerList = [];



  Customer.getWorkplaces({
      customerId: customer.id
  }, function(data) {
      $scope.workplaceList = data;
      $scope.getWorkplaceRoles(data);
  });


  $scope.getWorkplaceRoles = function(data) {
    //get a unique set of the roleids
    var mg = [];
    data.forEach(function(w) {
      mg = _.union(mg, w.role_ids);
    });
    $rootScope.allRoles = mg;
  };


  Customer.getStaff({customerId: customer.id},function(data) {
    $scope.staffList = data;
  });

  Customer.getManagers({customerId: customer.id},function(data) {
    $scope.managersList = data;
    var k = [];

    data.forEach(function(j) {
      k.push(j.id);
    });

    $rootScope.allManagers = k;
  });

  $scope.selectStaff = function() {
    $scope.staffActive = true;
    $scope.addMessage = "Staff";
    $scope.staffButtonSelect = true;
    $scope.managerButtonSelect = false;
    $scope.workplaceButtonSelect = false;
    $scope.managersActive = false;
    $scope.workplacesActive = false;
  };

  $scope.selectManagers = function() {
    $scope.staffActive = false;
    $scope.managersActive = true;
    $scope.addMessage = "Manager";
    $scope.staffButtonSelect = true;
    $scope.managerButtonSelect = false;
    $scope.workplaceButtonSelect = false;
    $scope.workplacesActive = false;
  };

  $scope.selectWorkplaces = function() {
    $scope.staffActive = false;
    $scope.managersActive = false;
    $scope.workplacesActive = true;
    $scope.addMessage = "Workspace";
    $scope.staffButtonSelect = true;
    $scope.managerButtonSelect = false;
    $scope.workplaceButtonSelect = false;
  };

  $scope.goMain = function() {
    $rootScope.clearHistory();
    $state.go('app.customer.main');
  };


  $scope.setActiveWorkplace = function(n) {
    customer.active_workplace = n;
    $rootScope.clearHistory();
    $state.go('app.customer.main');
  };

  $scope.goAdd = function(editTrue) {
    if($scope.staffActive) {
      $scope.addStaff = true;
      $scope.staffActive = false;
      $scope.hideFAB = true;
      $rootScope.staffEditUpdate = false;
      $state.go('app.customer.addstaff');
    } else if($scope.workplacesActive) {
      $rootScope.workplaceEdit = [];
      $rootScope.workplaceEditUpdate = false;
      $state.go('app.customer.addworkplace');
    } else {
      $rootScope.managerEdit = [];
      $rootScope.managerEditUpdate = false;
      $state.go('app.customer.addmanager');
    }
  };

  $scope.editStaff = function(s) {
    $scope.addStaff = true;
    $scope.staffActive = false;
    $scope.hideFAB = true;
    $rootScope.staffEdit = s;
    $rootScope.staffEditUpdate = true;
    $state.go('app.customer.addstaff');
  };

  $scope.editManager = function(m) {
    $scope.staffActive = false;
    $scope.managersActive = true;
    $scope.addMessage = "Manager";
    $scope.staffButtonSelect = true;
    $scope.managerButtonSelect = false;
    $scope.workplaceButtonSelect = false;
    $scope.workplacesActive = false;
    $rootScope.managerEdit = m;
    $rootScope.managerEditUpdate = true;
    $state.go('app.customer.addmanager');
  };

  $scope.editWorkplace = function(w) {
    $scope.staffActive = false;
    $scope.managersActive = false;
    $scope.addMessage = "Workplace";
    $scope.staffButtonSelect = true;
    $scope.managerButtonSelect = false;
    $scope.workplaceButtonSelect = false;
    $scope.workplacesActive = true;
    $rootScope.workplaceEdit = w;
    $rootScope.workplaceEditUpdate = true;
    $state.go('app.customer.addworkplace');
  };
  
  $scope.isActive = function(active) {
      if(active){
        return 'Active';
      } else {
        return 'Pending';
      }
  };

}]);
