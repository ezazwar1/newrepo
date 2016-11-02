'use strict';

app.controller('JobOpenedModalController', [
  '$scope',
  '$timeout',
  'Job',
  'Staff',
function($scope, $timeout, Job, Staff) {

  $scope.showEta = function() {
    $scope.updateEta();
  };

  $scope.updateEta = function() {
    try {
      var ninjaLatlng = new google.maps.LatLng($scope.staff.latitude, $scope.staff.longitude);
      var workplaceLatlng = new google.maps.LatLng($scope.job.workplace.latitude, $scope.job.workplace.longitude);
      var dms = new google.maps.DistanceMatrixService();
  
      dms.getDistanceMatrix({
        origins: [ninjaLatlng],
        destinations: [workplaceLatlng],
        travelMode: new Staff($scope.job.hired_staff).modeOfTransportGmaps()
      }, function(response, status) {
        if (status == 'OK') {
          var row = response.rows[0];
          if (row) {
            var element = row.elements[0];
            if (element && element.status == 'OK') {
              console.log('[JobOpenedModalController] got eta: ' + element.duration.value + 's');
              if (element.duration.value < 60) {
                $scope.eta = 1;  // 1 min
              }
              else {
                $scope.eta = Math.round(element.duration.value / 60);
              }
              $timeout(function() {
                $scope.etaVisible = true;
              });
            }
          }
        }
        else {
          console.log('[JobOpenedModalController] error getting eta: ' + status + ', response: ' + JSON.stringify(response));
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  $scope.acceptJob = function() {
    $scope.job.$accept(function() {
      $scope.showToast('You confirmed you are ready for ' + $scope.job.workplace.name);
      delete $scope.job;
      $scope.jobOpenedModal.hide();
    }, function(error) {
      console.log('[JobOpenedModalController] accept error: ' + JSON.stringify(error));
      delete $scope.job;
      $scope.jobOpenedModal.hide().then(function() {
        if (error.status == 406) {
          $scope.showAlert('Sorry', error.data.info);
        }
      });
    });
  };

  $scope.rejectJob = function() {
    $scope.job.$reject(function() {
      delete $scope.job;
      $scope.jobOpenedModal.hide();
    }, function(error) {
      console.log('[JobOpenedModalController] reject error: ' + JSON.stringify(error));
      delete $scope.job;
      $scope.jobOpenedModal.hide().then(function() {
        if (error.status == 406) {
          $scope.showAlert('Sorry', error.data.info);
        }
      });
    });
  };

}]);
