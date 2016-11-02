'use strict';

app.controller('CustomerAddStaffController', [
  '$scope',
  '$rootScope',
  '$state',
  '$window',
  '$ionicPopup',
  'Auth',
  'Tracker',
  'customer',
  'Customer',
  'CustomerStaff',
  'Workplace',
  'Role',
  'Staff',
function($scope, $rootScope, $state, $window, $ionicPopup, Auth, Tracker, customer, Customer, CustomerStaff, Workplace, Role, Staff) {


  $scope.detailsActive = true;
  $scope.rolesActive = false;
  $scope.workplacesActive = false;
  $scope.rolesList = [];
  $scope.workplaceList = [];

  $scope.toggleStaffWorkplaces = function() {
    $scope.newstaff.workplace_ids.forEach(function (n) {
      $scope.toggleWorkplace(n);
    });
  };



  $scope.toggleStaffRoles = function() {
    $scope.newstaff.role_ids.forEach(function (n) {
      $scope.toggleRole(n);
    });
  };

  
  Customer.getWorkplaces({customerId: customer.id},function(data) {
    $scope.workplaceList = data;
    $scope.getWorkplaceRoles(data);
  });


  $scope.getWorkplaceRoles = function(data) {
    //get a unique set of the roleids
    var mg = [];
    data.forEach(function(w) {
      mg = _.union(mg, w.role_ids);
    });
    $scope.loadAllRoles(mg);
  };

  $scope.loadAllRoles = function(roleids) {
      roleids.forEach(function (n) {
          Role.get({roleId: n}, function (r) {
            $scope.rolesList.push(r);
          })
      });
  };

  $scope.toggleRole = function(id) {
    var i = _.indexOf($scope.newstaff.role_ids, id);
    if(i===-1){
      $scope.newstaff.role_ids.push(id);
    } else {
      $scope.newstaff.role_ids = _.without($scope.newstaff.role_ids, id);
    }
  };

  $scope.toggleWorkplace = function(id) {
    var n = _.indexOf($scope.newstaff.workplace_ids, id);
    if(n===-1){
      $scope.newstaff.workplace_ids.push(id);
    } else {
      $scope.newstaff.workplace_ids = _.without($scope.newstaff.workplace_ids, id);
    }
  };

  $scope.isInWorkplaces = function(id) {
      return $scope.newstaff.workplace_ids.indexOf(id) > -1;
  };


  $scope.isInRoles = function(id) {
      return $scope.newstaff.role_ids.indexOf(id) > -1;
  };

  $scope.invite = function() {
    if($scope.newstaff.workplace_ids.length === 0){
      $scope.showMessage('Choose Workplace', 'We need to know which Workplaces ')
    } else {
      if($rootScope.staffEditUpdate) {
          if($scope.newstaff.timezone === undefined) {
            $scope.newstaff.timezone = customer.timezone;
          }

          CustomerStaff.update({customerId:customer.id, staffId:$scope.newstaff.id}, $scope.newstaff, function (data) {
                if(data.id !== null) {
                    $state.go('app.customer.organisation');
                  } else {
                    $scope.showMessage('Crikey', 'Something went wrong');
                  }
          });

      } else {
          Customer.inviteStaff({customerId: customer.id}, $scope.newstaff, function (data) {
              console.log(data);

              if(data.id !== null) {
                $state.go('app.customer.organisation');
              } else {
                $scope.showMessage('Crikey', 'Something went wrong');
              }
              
          });
      };      
    }
    
  };

  $scope.selectDetails = function() {
    $scope.detailsActive = true;
    $scope.rolesActive = false;
    $scope.workplacesActive = false;
  };

  $scope.selectRoles = function() {
    $scope.detailsActive = false;
    $scope.rolesActive = true;
    $scope.workplacesActive = false;
  };

  $scope.selectWorkplaces = function() {
    $scope.detailsActive = false;
    $scope.rolesActive = false;
    $scope.workplacesActive = true;
  };

  $scope.goBack = function() {
    $rootScope.clearHistory();
    $state.go('app.customer.organisation');
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

  if($rootScope.staffEditUpdate) {
    $scope.newstaff = $rootScope.staffEdit;
    $scope.update = $rootScope.staffEditUpdate;
    $scope.btnMsg = "UPDATE";
    $scope.staffMsg = "UPDATE STAFF";
    CustomerStaff.get({customerId:customer.id, staffId:$scope.newstaff.id}, $scope.newstaff, function (data) {
      if(data.id !== null) {
        console.log(data);
        $scope.newstaff = data;
      }
    });
    

  } else {
    $scope.newstaff = {id:"new", first_name:"", email:"", mobile:"", role_ids:[], workplace_ids:[], timezone: "Australia/Sydney", approved:false, confirmed:false, country_id:-1};
     $scope.btnMsg = "SEND INVITE";
     $scope.staffMsg = "ADD NEW STAFF";
  }
  
}]);
