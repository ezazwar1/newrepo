'use strict';

app.controller('CustomerController', [
  '$scope',
  '$rootScope',
  '$state',
  '$ionicModal',
  '$timeout',
  '$window',
  'GOOGLE_MAP_STYLES',
  'Session',
  'Event',
  'Job',
  'Role',
  'Staff',
  'Customer',
  'Manager',
  'Workplace',
  'Tracker',
  'settings',
  'customer',
  'jobs',
function($scope, $rootScope, $state, $ionicModal, $timeout, $window, GOOGLE_MAP_STYLES, Session, Event, Job, Role, Staff, Customer, Manager, Workplace, Tracker, settings, customer, jobs) {

  $scope.customer = customer;

  $scope.job = jobs[0];
  $scope.staffActive = true;
  $scope.agencyActive = false;

  $scope.isOnStandBy = function() {
    return !$scope.job || ($scope.job && $scope.job.isOnStandBy());
  };

  $scope.isEnRoute = function() {
    return $scope.job && $scope.job.isEnRoute();
  };

  $scope.isOnShift = function() {
    return $scope.job && $scope.job.isOnShift();
  };

  $scope.isFeedbackPending = function() {
    return $scope.job && $scope.job.isFeedbackPending();
  };

  $scope.modePartial = function() {
    if ($scope.job) {

      if ($scope.job.isOnStandBy()) {
        return 'templates/customer/_on_standby.html';
      }
      else if ($scope.job.isEnRoute()) {
        return 'templates/customer/_en_route.html';
      }
      else if ($scope.job.isOnShift()) {
        return 'templates/customer/_on_shift.html';
      }
      else if ($scope.job.isFeedbackPending()) {
        return 'templates/customer/_feedback_pending.html';
      }
    }
    else {
      return 'templates/customer/_on_standby.html';

      //return 'templates/customer/_on_board.html';
    }
  };

  $scope.pageTitle = function() {
    if ($scope.job) {
      if ($scope.job.isOnStandBy())
        return 'Nearby Ninjas';
      else if ($scope.job.isEnRoute())
        return 'Ninja En Route';
      else if ($scope.job.isOnShift())
        return 'Ninja On Shift';
      else if ($scope.job.isFeedbackPending())
        return 'Receipt';
    }
    else {
      return 'Nearby Ninjas';
    }
  };

  $scope.initMode = function() {
    $timeout(function() {
      //need to get workplaces

      Customer.getWorkplaces({customerId: $scope.customer.id},function(data) {
        $scope.workplaces = data;
        if($scope.customer.active_workplace === undefined) {
           $scope.customer.workplace = data[0];
         } else {
           $scope.customer.workplace = $scope.customer.active_workplace;
         }

        //console.log($scope.customer.workplace);
        $rootScope.setCustomer($scope.customer);
          $scope.isJobSheetOpen = false;
          if ($scope.job) {
            if ($scope.job.isOnStandBy()) {
              console.log('[CustomerController] init on standby');
              delete $scope.map;
              initializeMap($scope.customer.workplace.latitude, $scope.customer.workplace.longitude);
            }
            else if ($scope.job.isEnRoute()) {
              console.log('[CustomerController] init en route');
              delete $scope.map;
              initializeMap($scope.customer.workplace.latitude, $scope.customer.workplace.longitude);
              // initializeMap(42.16845214370312, 125.3401412491582);
            }
            else if ($scope.job.isOnShift()) {
              console.log('[CustomerController] init on shift');
            }
            else if ($scope.job.isFeedbackPending()) {
              console.log('[CustomerController] init feedback pending');
            }
          }
          else {
            console.log('[CustomerController] no job, init on standby');
            delete $scope.map;
            initializeMap($scope.customer.workplace.latitude, $scope.customer.workplace.longitude);
          }
      });
     }, 100);


  };

  function initializeMap(latitude, longitude) {
    if ($scope.map === undefined) {
      console.log('[CustomerController] initializeMap ' + latitude + ', ' + longitude);

      var workplaceLatlng = new google.maps.LatLng(latitude, longitude);
      var mapOptions = {
        center: workplaceLatlng,
        minZoom: settings.map_zoom_min,
        maxZoom: settings.map_zoom_max,
        zoom: settings.map_zoom_default,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        draggable: true,
        styles: GOOGLE_MAP_STYLES
      };

      delete $scope.map;
      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

      // wait for map to be fully loaded before placing markers
      google.maps.event.addListenerOnce($scope.map, 'idle', function() {
        console.log('[CustomerController] map idle');

        // place workplace marker
        $scope.workplaceMarker = new CustomMarker(workplaceLatlng, $scope.map);

        // handle ninja markers
        if (!$scope.job || $scope.job.isOnStandBy()) {
          // clear hired ninja marker
          //if ($scope.hiredMarker) {
          //  $scope.hiredMarker.setMap(null);
          //  delete $scope.hiredMarker;
          //}
          delete $scope.hiredMarker;

          // reload nearby ninjas
          $timeout(function() {
            $scope.updateNearbyNinjas();
          }, 300);
        }
        else if ($scope.job && $scope.job.isEnRoute()) {
          // clear nearby ninja markers
          //if ($scope.nearbyMarkers) {
          //  _.each($scope.nearbyMarkers, function(marker) {
          //    marker.setMap(null);
          //  });
          //  delete $scope.nearbyMarkers;
          //}
          // delete $scope.nearbyMarkers;
          console.log($scope.job);

          // Staff.get({staffId:$scope.job.hired_staff.staff_id}, function (data) {
          //   console.log(data);
          //   $scope.hired_staff = data;
          // });


          var updateNinjaMarker = function(latitude, longitude) {
            var ninjaLatlng = new google.maps.LatLng(latitude, longitude);

            // update hired ninja marker
            if ($scope.hiredMarker) {
              $scope.hiredMarker.setPosition(ninjaLatlng);
            }



            // update workplace eta
            var dms = new google.maps.DistanceMatrixService();
            dms.getDistanceMatrix({
              origins: [ninjaLatlng],
              destinations: [workplaceLatlng],
              travelMode:  $scope.hired_staff.modeOfTransportGmaps()
            }, function(response, status) {
              if (status == 'OK') {
                var row = response.rows[0];
                if (row) {
                  var element = row.elements[0];
                  if (element && element.status == 'OK') {
                    console.log('[CustomerController] got eta: ' + element.duration.value + 's');
                    $scope.workplaceMarker.setEta(element.duration.value);

                  }
                }
              }
              else {
                console.log('[CustomerController] error getting eta: ' + status + ', response: ' + JSON.stringify(response));
              }
            });
          };

          // place hired ninja marker
          var ninjaLatlng = new google.maps.LatLng($scope.job.hired_staff.staff.latitude, $scope.job.hired_staff.staff.longitude);
          $scope.hiredMarker = new google.maps.Marker({
            position: ninjaLatlng,
            map: $scope.map,
            icon: {
              url: 'img/workninja.png',
              size: new google.maps.Size(25, 32),
              scaledSize: new google.maps.Size(25, 32),
              anchor: new google.maps.Point(12.5, 32)
            }
          });

          $timeout(function() {
            updateNinjaMarker($scope.job.hired_staff.staff.latitude, $scope.job.hired_staff.staff.longitude);
          }, 100);

          // track hired ninja location
          $scope.$on('event:ninja_location', function(event, data) {
            console.log('[CustomerController] ' + event.name);
            if ($scope.hiredMarker) {
              var ninjaLatlng = new google.maps.LatLng(data.location.latitude, data.location.longitude);
              $scope.hiredMarker.setPosition(ninjaLatlng);
              $scope.workplaceMarker.setEta(data.location.eta);

              // if eta is less than 2 minutes, display a toast
              if (data.location.eta < 2 * 60 && !$scope.ninjaApproachingWasShown) {
                $scope.ninjaApproachingWasShown = true;
                $timeout(function() {
                  $scope.showToast('Your Work Ninja is approaching');
                }, 3000);
              }
            }
          });
        }
      });

      google.maps.event.addListenerOnce($scope.map, 'projection_changed', function() {
        console.log('[CustomerController] map projection_changed');
      });

      $timeout(function() {
        google.maps.event.trigger($scope.map, 'resize');
      }, 500);
    }
    else {
      console.log('[CustomerController] map resize ');
      google.maps.event.trigger($scope.map, 'resize');
    }
  }

  $scope.updateNearbyNinjas = function() {
    console.log('[CustomerController] updateNearbyNinjas');

    //Staff or Agency

    if ($scope.staffActive) {
      Workplace.nearbyCustomerStaff({workplaceId: $scope.customer.workplace.id},function(nearbyStaff) {
        console.log('[CustomerController] nearby staff: ' + nearbyStaff.length);
        var minEta = null;

        // add ninja markers
        for (var i = 0; i < nearbyStaff.length; i++) {
          console.log(nearbyStaff[i]);
          var staff = nearbyStaff[i];
          var staff_id = staff.id;
          var location = new google.maps.LatLng(staff.latitude, staff.longitude);
          minEta = Math.min((minEta || Number.MAX_VALUE), staff.eta);

          // $scope.nearbyMarkers[staff_id] = new google.maps.Marker({
          new google.maps.Marker({
            position: location,
            map: $scope.map,
            icon: {
              url: 'img/workninja.png',
              size: new google.maps.Size(25, 32),
              scaledSize: new google.maps.Size(25, 32),
              anchor: new google.maps.Point(12.5, 32)
            }
          });
        }

        // update min eta
        console.log('[CustomerController] min eta: ' + minEta + 's');
        if ($scope.workplaceMarker && minEta !== null) {
          $scope.workplaceMarker.setEta(minEta);
        }

        // center on workplace marker
        var workplaceLatlng = new google.maps.LatLng($scope.customer.workplace.latitude, $scope.customer.workplace.longitude);
        $scope.map.panTo(workplaceLatlng);




      }, function(error) {
        console.log('[CustomerController] updateNearbyNinjas error: ' + JSON.stringify(error));
      });
    } else {
      console.log('[CustomerController] Agency ');
     Workplace.nearbyAgencyStaff({workplaceId: $scope.customer.workplace.id},function(agencyStaff) {
        console.log('[CustomerController] nearby staff: ' + agencyStaff.length);
        var minEta = null;

        // add ninja markers
        for (var i = 0; i < agencyStaff.length; i++) {
          var staff = agencyStaff[i];
          var staff_id = staff.id;
          var location = new google.maps.LatLng(staff.latitude, staff.longitude);
          minEta = Math.min((minEta || Number.MAX_VALUE), staff.eta);

          // $scope.nearbyMarkers[staff_id] = new google.maps.Marker({
          new google.maps.Marker({
            position: location,
            map: $scope.map,
            icon: {
              url: 'img/workninja.png',
              size: new google.maps.Size(25, 32),
              scaledSize: new google.maps.Size(25, 32),
              anchor: new google.maps.Point(12.5, 32)
            }
          });
        }

        // update min eta
        console.log('[CustomerController] min eta: ' + minEta + 's');
        if ($scope.workplaceMarker && minEta !== null) {
          $scope.workplaceMarker.setEta(minEta);
        }

        // center on workplace marker
        var workplaceLatlng = new google.maps.LatLng($scope.customer.workplace.latitude, $scope.customer.workplace.longitude);
        $scope.map.panTo(workplaceLatlng);


      });
    }
  };

  // --------------------------------------------------------
  // Events
  // --------------------------------------------------------


  $scope.$on('event:app-resume', function(event) {
    console.log('[CustomerController] ' + event.name);
    // reload job
    //if ($scope.job && !$scope.job.isOnStandBy()) {
    //  Job.getAndCache({jobId: $scope.job.id}, function(job) {
    //    $scope.job = job;
    //  });
    //}
    Job.query({}, function(jobs) {
      $scope.job = jobs[0];
    });
  });

  $scope.$on('event:job_posted', function(event, job) {
    if ($scope.isOnStandBy()) {
      console.log('[CustomerController] ' + event.name);

      $scope.searchingForNinjasModal.scope.job = job;
      $scope.searchingForNinjasModal.scope.pulseTop = Math.round(Math.random() * 80);
      $scope.searchingForNinjasModal.scope.pulseLeft = Math.round(Math.random() * 80);
      $scope.searchingForNinjasModal.scope.lineDuration = job.timeout + 5;  // +5 seconds
      $scope.searchingForNinjasModal.show();

      // in case pubnub msg was missed, schedule job_expired event
      $timeout(function() {
       $scope.$broadcast('event:job_expired', {job_id: job.id});
      }, (job.timeout + 45) * 1000);
    }
  });

  $scope.$on('event:job_expired', function(event, data) {
    console.log('[CustomerController] ' + event.name);
    if ($scope.searchingForNinjasModal.isShown() && $scope.searchingForNinjasModal.scope.job.id == data.job_id) {
      $scope.searchingForNinjasModal.hide().then(function() {
        // event might come late, after ninja already hired
        if ($scope.isOnStandBy()) {
          $scope.showAlert('Sorry', 'All nearby Work Ninjas were not available, please try again shortly');
        }
      });
    }
  });

  $scope.$on('event:job_cancelled', function(event, data) {
    console.log('[CustomerController] ' + event.name);
    if ($scope.isOnStandBy()) {
      $scope.showAlert('Job cancelled', 'Sorry but this job was cancelled, please request another WorkNinja');
    }
    else {
      $scope.showAlert('Shift cancelled', 'Sorry but this shift was cancelled, please request another Work Ninja');
    }
    //Job.removeFromCache(data.job_id);
    delete $scope.job;
  });

  $scope.$on('event:ninja_hired', function(event, data) {
    console.log('[CustomerController] ' + event.name);
    $scope.requestNinjaModal.hide();
    $scope.searchingForNinjasModal.hide().then(function() {
      //Job.getAndCache({jobId: data.job_id}, function(job) {
      //  $scope.job = job;
      //});
      Job.get({jobId: data.job_id}, function(job) {
        $scope.job = job;
      });
      $scope.showToast('You have hired a Work Ninja!');
    });
  });

  $scope.$on('event:job_started', function(event, data) {
    console.log('[CustomerController] ' + event.name);
    $scope.requestNinjaModal.hide();
    Job.get({jobId: data.job_id}, function(job) {
      console.log(job);
      $scope.job = job;
    });
    $scope.showToast('Your Work Ninja has clocked on');
  });

  $scope.$on('event:job_stopped', function(event, data) {
    console.log('[CustomerController] ' + event.name);

    Job.get({jobId: data.job_id}, function(job) {
      console.log(job);
      $scope.job = job;
    });
    $scope.showToast('Your Work Ninja has clocked off');
  });

  $scope.$on('event:job_closed', function(event, data) {
    console.log('[CustomerController] ' + event.name);
    //Job.removeFromCache(data.job_id);
    delete $scope.job;
  });

  // $scope.$on('event:job_charge_failed', function(event, data) {
  //   $scope.showAlert('Charge failed', 'Shift charge failed.');
  // });

  // --------------------------------------------------------
  // Modal popups
  // --------------------------------------------------------

  $ionicModal.fromTemplateUrl('templates/customer/request_ninja_modal.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true,
    backdropClickToClose: false,
    hardwareBackButtonClose: false
  }).then(function(modal) {
    $scope.requestNinjaModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/customer/searching_for_ninjas_modal.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true,
    backdropClickToClose: false,
    hardwareBackButtonClose: false
  }).then(function(modal) {
    $scope.searchingForNinjasModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/feedback_modal.html', {
    scope: $scope,
    animation: 'slide-in-up',
    backdropClickToClose: false,
    hardwareBackButtonClose: false
  }).then(function(modal) {
    $scope.feedbackModal = modal;
  });

  // --------------------------------------------------------
  // Operations
  // --------------------------------------------------------

  $scope.refresh = function() {
    console.log('[CustomerController] refresh');

    // reload job/jobs
    if ($scope.job) {
      Job.get({jobId: $scope.job.id}, function(job) {
        $scope.job = job;
      });
    }
    else {
      Job.query({}, function(jobs) {
        $scope.job = jobs[0];
      });
    }

    // reload map
    if ($scope.isOnStandBy() || $scope.isEnRoute()) {
      delete $scope.map;
      initializeMap($scope.customer.workplace.latitude, $scope.customer.workplace.longitude);
    }
  };

  $scope.requestNinja = function() {
    if($scope.staffActive) {
      //get staff roles nearby
      Workplace.nearbyCustomerRoles({workplaceId: $scope.customer.workplace.id},function(roles) {
            if (_.all(roles, function(role) { return role.eta === null})) {
              $scope.showAlert('Sorry', 'All nearby WorkNinjas were not available for this shift, please try again shortly');
            }
            else {
              $scope.roles = _.select(roles, function(role) {return role.eta !== null});
              $rootScope.customer = $scope.customer;
              $scope.requestNinjaModal.show();
            }
      });
    } else {
      //get agency roles nearby
      Workplace.nearbyAgencyRoles({workplaceId: $scope.customer.workplace.id},function(roles) {
            if (_.all(roles, function(role) { return role.eta === null})) {
              $scope.showAlert('Sorry', 'All nearby WorkNinjas were not available for this shift, please try again shortly');
            }
            else {
              $scope.roles = _.select(roles, function(role) {return role.eta !== null});
              $rootScope.customer = $scope.customer;
              $scope.requestNinjaModal.show();
            }
      });
    };
  };

  $scope.jobDetail = function() {
    if($scope.staffActive) {
      return $scope.job.receipt_duration.toString();
    } else {
      return '$' + $scope.job.receipt_amount.toString();
    }
  };

  $scope.cancelJob = function() {
    $scope.showConfirmation('Cancel Shift', 'Are you sure you want to cancel this shift?',
      function() {
        $scope.job.$cancel().then(function(job) {
          console.log('[CustomerController] cancelJob done');
          // TODO: update only when needed
          $scope.job = job;
          $scope.showToast('Shift was cancelled');
        });
      },
      function() {
        $scope.closeJobSheet();
      });
  };

  $scope.provideFeedback = function() {
    $scope.feedbackModal.show();
  };

  $scope.toggleJobSheet = function() {
    if ($scope.isJobSheetOpen) {
      $scope.closeJobSheet();
    }
    else {
      $scope.openJobSheet();
    }
  };

  $scope.openJobSheet = function() {
    if ($scope.map) {
      $scope.map.setOptions({
        draggable: false,
        zoomControl: false
      });
    }
    $scope.isJobSheetOpen = true;
  };

  $scope.closeJobSheet = function() {
    if ($scope.map) {
      $scope.map.setOptions({
        draggable: true,
        zoomControl: true
      });
    }
    $scope.isJobSheetOpen = false;
  };

  $scope.messageNinja = function() {
    console.log('shareViaSms');
    if ($window.plugins && $window.plugins.socialsharing) {
      $window.plugins.socialsharing.shareViaSMS(
        ' ',  // message, buggy: null or empty string here puts 'null' in sms text field
        $scope.job.hired_staff.staff.mobile,  // phone
        function() {
        },  // success cb
        function() {
        }   // error cb
      )
    }
  };

  $scope.trackCalledNinja = function() {
    Tracker.trackCalledNinja($scope.job.id);
    window.open('tel:' + $scope.job.hired_staff.mobile, '_system');
  };

  $scope.selectStaff = function() {
    console.log('staff');
    $scope.staffActive = true;
    $scope.agencyActive = false;
    $scope.updateNearbyNinjas();
    $scope.refresh();

  };

  $scope.selectAgency = function() {
    console.log('agency');
    $scope.staffActive = false;
    $scope.agencyActive = true;
    $scope.updateNearbyNinjas();
    $scope.refresh();
  };

  // cleanup

  $scope.$on('$destroy', function() {
    console.log('[CustomerController] destroy');
    if ($scope.requestNinjaModal) {
      $scope.requestNinjaModal.remove();
    }
    if ($scope.searchingForNinjasModal) {
      $scope.searchingForNinjasModal.remove();
    }
    if ($scope.feedbackModal) {
      $scope.feedbackModal.remove();
  }
  });

    //get Direction- Map show

    $scope.getDirection = function() {
        /*var ninjaLatlng = new google.maps.LatLng($scope.job.hired_staff.staff.latitude, $scope.job.hired_staff.staff.longitude);
        //var workplaceLatlng = new google.maps.LatLng(43.16845214370312, 125.3401412491582);
        var workplaceLatlng = new google.maps.LatLng($scope.customer.workplace.latitude, $scope.customer.workplace.longitude);

        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();

        directionsDisplay.setMap($scope.map);
        directionsDisplay.setOptions({suppressMarkers:true});

        var request = {
            origin:ninjaLatlng,
            destination:workplaceLatlng,
            travelMode: google.maps.TravelMode.WALKING
        };
        directionsService.route(request, function(response, status) {

            if (status == google.maps.DirectionsStatus.OK) {

                $scope.closeJobSheet();

                directionsDisplay.setDirections(response);
            }
        });*/

          launchnavigator.navigate(
                [$scope.job.hired_staff.staff.latitude, $scope.job.hired_staff.staff.longitude],
                [$scope.customer.workplace.latitude, $scope.customer.workplace.longitude],
                function(){

                },
                function(error){
                   alert("plugin error" + error);
                }

          );


    };

}]);
