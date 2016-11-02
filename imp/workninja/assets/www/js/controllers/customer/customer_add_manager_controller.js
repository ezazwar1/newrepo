'use strict';

app.controller('CustomerAddManagerController', [
  '$scope',
  '$rootScope',
  '$state',
  '$window',
  '$ionicPopup',
  '$timeout',
  'Auth',
  'Tracker',
  'customer',
  'Customer',
  'CustomerManager',
  'Workplace',
  'Manager',
  'toaster',
function($scope, $rootScope, $state, $window, $ionicPopup, $timeout, Auth, Tracker, customer, Customer, CustomerManager, Workplace, Manager, toaster) {
  $scope.detailsActive = true;
  $scope.workplacesActive = false;
  $scope.workplaceList = [];

  $scope.newmanager = {id:"new", first_name:"", email:"", mobile:"", workplace_ids:[], timezone: "Australia/Sydney", customer_admin:false, approved:false, confirmed:false, country_id:-1};
  
  Customer.getWorkplaces({customerId: customer.id},function(data) {
    $scope.workplaceList = data;
  });

  $scope.selectDetails = function() {
    $scope.detailsActive = true;
    $scope.rolesActive = false;
    $scope.workplacesActive = false;
  };

  $scope.selectWorkplaces = function() {
    $scope.detailsActive = false;
    $scope.rolesActive = false;
    $scope.workplacesActive = true;
  };

  $scope.toggleWorkplace = function(id) {
    var n = _.indexOf($scope.newmanager.workplace_ids, id);
    if(n===-1){
      $scope.newmanager.workplace_ids.push(id);
    } else {
      $scope.newmanager.workplace_ids = _.without($scope.newmanager.workplace_ids, id);
    }
  };

  $scope.goBack = function() {
    $rootScope.clearHistory();
    $state.go('app.customer.organisation');
  };

  $scope.isInWorkplaces = function(id) {
    try {
      return $scope.newmanager.workplace_ids.indexOf(id) > -1;
    } catch (e) {
      return false;
    }
  };

  $scope.inviteManager = function(){
    if($scope.newmanager.workplace_ids.length === 0) {
      $scope.showMessage('Choose Workplace', 'We need to know which Workplaces  ')
    } else {

      if($rootScope.managerEditUpdate) { 
        Manager.update({managerId: $scope.newmanager.id}, $scope.newmanager, function (data) {
              console.log(data);
              $rootScope.managerEditUpdate = false;
              $rootScope.managerEdit = [];
              $scope.newmanager = [];
              $state.go('app.customer.organisation');
        });

       } else {
         Customer.inviteManager({customerId: customer.id}, $scope.newmanager, function(res) {
            if(res.id !== null) {
                  $state.go('app.customer.organisation');
                } else {
                  $scope.showMessage('Crikey', 'Something went wrong');
                }
         });
     };
    }
   
  };

  $scope.showMessage = function(title, message, cb) {
    $scope.popup = $ionicPopup.alert({
        template: message,
        title: title,
        okText: 'OK',
        okType: 'button-assertive'
    });
    $scope.popup.then(function() {
        if (cb) cb();
        delete $scope.popup;
    });
  };


  if($rootScope.managerEditUpdate) {
    $scope.newmanager = $rootScope.managerEdit;
    $scope.update = $rootScope.staffEditUpdate;
    $scope.btnMsg = "UPDATE";
    $scope.managerMsg = "UPDATE MANAGER";
    // $scope.toggleStaffWorkplaces();
    // $scope.toggleStaffRoles();

  } else {
    $scope.newmanager = {id:"new", first_name:"", email:"", mobile:"", workplace_ids:[], timezone: "Australia/Sydney", customer_admin:false, approved:false, confirmed:false, country_id:-1};
     $scope.btnMsg = "SEND INVITE";
     $scope.managerMsg = "ADD NEW MANAGER";
  }
  
}]);
