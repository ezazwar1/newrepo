'use strict';

app.controller('StaffController', [
  '$scope',
  '$rootScope',
  '$state',
  '$window',
  '$ionicModal',
  '$timeout',
  '$http',
  'CONFIG',
  'GOOGLE_MAP_STYLES',
  'Location',
  'Session',
  'Event',
  'Job',
  'Tracker',
  'settings',
  'staff',
  'jobs',
  'Workplace',
function($scope, $rootScope, $state, $window, $ionicModal, $timeout, $http, CONFIG, GOOGLE_MAP_STYLES, Location, Session, Event, Job, Tracker, settings, staff, jobs, Workplace) {

  $scope.staff = staff;
  $scope.standBy = true;
  $scope.isMapBlurred = true; 
  $scope.standByMessages = [{ 'id': 0, 'message':"END STANDBY"}, { 'id': 1, 'message':"START STANDBY"}];
  
  // if incomplete setup, go to profile page
  if (!$scope.staff.isSetupComplete()) {
    $rootScope.clearHistory();
    $state.go('app.staff.profile');
    return;
  }

  // if empty availability, go to availability page --Disable for now
  // if (!$scope.staff.hasAvailability()) {
  //   $rootScope.clearHistory();
  //   $state.go('app.staff.availability');
  //   return;
  // }

  

  //fetch job details
  // Job.get({jobId: jobs[0].id}, function (data) {
  //   console.log(data);
  //   $scope.job = data;
  //   $scope.getWorkplaceDetails($scope.job.workplace_id);
  // });


  $scope.getWorkplaceDetails = function(id) {
    Workplace.get({workplaceId:id}, function (wp) {
      console.log(wp);
    });
  };

  $scope.locationOptions = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 15000
  };


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
        return 'templates/staff/_on_standby.html';
      }
      else if ($scope.job.isEnRoute()) {
        return 'templates/staff/_en_route.html';
      }
      else if ($scope.job.isOnShift()) {
        return 'templates/staff/_on_shift.html';
      }
      else if ($scope.job.isFeedbackPending()) {
        return 'templates/staff/_feedback_pending.html';
      }
    }
    else {
      return 'templates/staff/_on_standby.html';
    }
  };

  $scope.pageTitle = function() {
    if ($scope.job) {
      if ($scope.job.isOnStandBy()) {
        return "On Standby";
      }
      else if ($scope.job.isEnRoute()) {
        return 'Make Your Way In';
      }
      else if ($scope.job.isOnShift()) {
        return 'Ninja On Shift';
      }
      else if ($scope.job.isFeedbackPending()) {
        return 'Receipt';
      }
    }
    else {
      if($scope.available) {
        return 'On Standby';
      } else {
        return 'Not Available';
      }
      
    }
  };

  $scope.initMode = function() {
    $timeout(function() {
      $scope.isJobSheetOpen = false;
      if ($scope.job) {
        if ($scope.job.isOnStandBy()) {

          console.log('[StaffController] init on standby');
          $scope.initializeLocation();
          $scope.notifyPendingJobOffer();
        }
        else if ($scope.job.isEnRoute()) {
          console.log('[StaffController] init en route');
          $scope.initializeLocation();
        }
        else if ($scope.job.isOnShift()) {
          console.log('[StaffController] init on shift');
        }
        else if ($scope.job.isFeedbackPending()) {
          console.log('[StaffController] init feedback pending');
        }
      }
      else {
        console.log('[StaffController] no job, init on standby');
        $scope.initializeLocation();
        $scope.notifyPendingJobOffer();
      }
    }, 100);

  };



  $scope.ninjaAvailable = function() {
      if($scope.available){
        //need to put confirmation here
        $scope.showConfirmation('Are you sure?', 'Are you sure you wish to stand down? You won\'t receive any shift offers', function() {
          $scope.standbyMessage = $scope.standByMessages[1].message;
          $scope.stopLocation();
          $scope.available = !$scope.available;
          $scope.getNinjaAvailability('finish');
        }, function () {});      
      } else {
        $scope.standbyMessage = $scope.standByMessages[0].message;
        $scope.startLocation();
        $scope.getNinjaAvailability('start');
        $scope.available = !$scope.available;
        //need to find out ninja transport
        $scope.showTransportMode($scope.staff);
      }  
  };

  $scope.getNinjaAvailability = function(call) {
      var url = CONFIG.url + '/shifts/' + call;
      console.log(url);
      $http.post(url).
      success(function(data, status, headers, config) {
        console.log(data);
      }).
      error(function(data, status, headers, config) {
        console.log(data);
      });
  };

  $scope.getNinjaCurrentShift = function() {
      var url = CONFIG.url + '/shifts/current';
      console.log(url);
      $http.get(url).
      success(function(data, status, headers, config) {
        
        if(data.started_at !== undefined){
          if(data.finished_at === null) {
            //its open but not finished
            $scope.available  = true;
            $scope.standbyMessage = $scope.standByMessages[0].message;  
            $scope.isMapBlurred = false;     
          } else {
            $scope.available = false;
            $scope.standbyMessage = $scope.standByMessages[1].message;
            $scope.isMapBlurred = true; 
            $scope.stopLocation();
          }
        } else {
          $scope.available = false;
          $scope.standbyMessage = $scope.standByMessages[1].message;
          $scope.isMapBlurred = true; 
          $scope.stopLocation();
        }
        $scope.pageTitle();
        
      }).
      error(function(data, status, headers, config) {
        $scope.available = false;
        $scope.stopLocation();
      });   
  };

  $scope.getNinjaCurrentShift();
  


  function initializeMap(latitude, longitude) {
    if ($scope.map === undefined) {
      //console.log('[StaffController] initializeMap: ' + latitude + ', ' + longitude + ' ' + new Date().getMilliseconds());

      var ninjaLatlng = new google.maps.LatLng(latitude, longitude);
      var mapOptions = {
        center: ninjaLatlng,
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
         console.log('[StaffController] map idle');

        // place ninja marker
        $scope.ninjaMarker = new google.maps.Marker({
          position: ninjaLatlng,
          map: $scope.map,
          icon: {
            url: 'img/workninja.png',
            size: new google.maps.Size(25, 32),
            scaledSize: new google.maps.Size(25, 32),
            anchor: new google.maps.Point(12.5, 32)
          }
        });

        // handle workplace marker
        if ($scope.job) {
          if ($scope.job.isOnStandBy()) {
            // clear workplace marker
            if ($scope.workplaceMarker) {
              $scope.workplaceMarker.remove();
              delete $scope.workplaceMarker;
            }
          }
          else if ($scope.job.isEnRoute()) {
            // place workplace marker


            console.log($scope.job);
            var worplaceLatlng = new google.maps.LatLng($scope.job.workplace.latitude, $scope.job.workplace.longitude);
            $scope.workplaceMarker = new CustomMarker(worplaceLatlng, $scope.map);
            // update workplace eta
            $scope.updateNinjaMarker($scope.staff.latitude, $scope.staff.longitude);
          }
        }
      });

      $timeout(function() {
        google.maps.event.trigger($scope.map, 'resize');
      }, 500);
    }
    else {
      //console.log('[StaffController] map resize ');
      google.maps.event.trigger($scope.map, 'resize');
    }
  }
  
  $scope.stopLocation = function () {
    Location.stopReporting();
    try {
      Location.finish();
    } catch (e) {
      // pass
    }
    
    $scope.isMapBlurred = true;
  };
  
  $scope.startLocation = function () {
    Location.startReporting();
    $scope.isMapBlurred = false;
  };
  
  $scope.initializeLocation = function() {
    Location.startReporting();

    $scope.showProgressIndicator();

    Location.getLastLocation(function(location) {
        console.log('[StaffController] getLastLocation: ' + JSON.stringify(location));
        delete $scope.map;
        $timeout(function() {
            initializeMap(location.latitude, location.longitude);

            $scope.hideProgressIndicator();
        });
    }, function(error) {
        console.log('[StaffController] getLastLocation error: ' + error);
        //set map to default location or it shows up blank
        delete $scope.map;
        $timeout(function() {
            initializeMap(-33.867, 151.207);

            $scope.hideProgressIndicator();
        });
    });

    if($scope.standBy){
      $scope.startLocation();
    } else {
      $scope.stopLocation();
    }
};


  $scope.updateNinjaMarker = function(latitude, longitude) {
    if ($scope.map === undefined) {
      return;
    }

    $scope.staff.latitude = latitude;
    $scope.staff.longitude = longitude;
    var ninjaLatlng = new google.maps.LatLng(latitude, longitude);

    // update ninja marker
    if ($scope.ninjaMarker) {
      $scope.ninjaMarker.setPosition(ninjaLatlng);
      $scope.map.panTo(ninjaLatlng);
    }

    // update workplace eta
    if ($scope.workplaceMarker && $scope.job) {
      var dms = new google.maps.DistanceMatrixService();
      var workplaceLatlng = new google.maps.LatLng($scope.job.workplace.latitude, $scope.job.workplace.longitude);
      dms.getDistanceMatrix({
        origins: [ninjaLatlng],
        destinations: [workplaceLatlng],
        travelMode: $scope.staff.modeOfTransportGmaps()
      }, function(response, status) {
        if (status == 'OK') {
          var row = response.rows[0];
          if (row) {
            var element = row.elements[0];
            if (element && element.status == 'OK') {
              console.log('[StaffController] got eta: ' + element.duration.value + 's');
              if ($scope.workplaceMarker) {
                $scope.workplaceMarker.setEta(element.duration.value);
              }
            }
          }
        }
        else {
          console.log('[StaffController] error getting eta: ' + status + ', response: ' + JSON.stringify(response));
        }
      });
    }
  };

  $scope.notifyPendingJobOffer = function() {
    Job.offered(function(job) {
      $scope.notifyJobOffer(job);
    });
  };

  $scope.notifyJobOffer = function(job) {
    var job_timeout_ms = job.timeout * 1000;
    var job_age_ms = new Date() - new Date(job.created_at);

    if (job_age_ms < job_timeout_ms) {
      $scope.jobOpenedModal.scope.job = job;
      $scope.hidePopup();   // hide any alerts
      $scope.jobOpenedModal.show();

      // in case pubnub msg was missed, schedule job_expired event
      $timeout(function() {
        $scope.$broadcast('event:job_expired', {job_id: job.id});
      }, (job.timeout + 45) * 1000);
    }
    else {
      // ignore stale offers
      console.log('[StaffController] ignoring stale job offer, age=' + job_age_ms + 'ms, timeout=' + job_timeout_ms + 'ms');
    }
  };

  // --------------------------------------------------------
  // Events
  // --------------------------------------------------------

  $scope.$on('event:location-changed', function(event, location) {
    //console.log('[StaffController] ' + event.name + ': ' + JSON.stringify(location));
    $timeout(function() {
          initializeMap(location.latitude, location.longitude);
      });
      $scope.updateNinjaMarker(location.latitude, location.longitude);
  });

  $scope.$on('event:location-error', function(event, error) {
    //console.log('[StaffController] ' + event.name + ': ' + JSON.stringify(error));
    $scope.showAlert('Warning', error.message, function() {
      if (error.error == 'errLocationDisabled') {
        if ($window.cordova) {
          $window.cordova.plugins.WorkNinjaExt.openSettings();
        }
      }
    });
  });

  $scope.$on('event:app-resume', function(event) {
    
    if($scope.available){
      Location.startReporting();
    }

    

    Job.query({}, function(jobs) {
      $scope.job = jobs[0];
    });

    // check availability and turn off reporting location after 30s if NA
    $timeout(function() {
      if (!$scope.staff.isAvailableNow()) {
        Location.stopReporting();
      }
    }, 30000);
  });

  $scope.$on('event:job_opened', function(event, data) {
    if ($scope.isOnStandBy() && !$scope.jobOpenedModal.isShown()) {
      //console.log('[StaffController] ' + event.name);
      $scope.notifyPendingJobOffer();
    }
  });

  $scope.$on('event:job_expired', function(event, data) {
    //console.log('[StaffController] ' + event.name);
    if ($scope.jobOpenedModal.isShown() && $scope.jobOpenedModal.scope.job.id == data.job_id) {
      $scope.jobOpenedModal.hide();
    }
  });

  $scope.$on('event:job_cancelled', function(event, data) {
    //console.log('[StaffController] ' + event.name);
    if ($scope.isOnStandBy()) {
      $scope.showAlert('Job cancelled', 'Sorry but this job was cancelled');
    }
    else {
      $scope.showAlert('Shift cancelled', 'Sorry but this shift was cancelled');
    }
    //Job.removeFromCache(data.job_id);
    delete $scope.job;
  });

  $scope.$on('event:ninja_missed_job', function(event, data) {
    //console.log('[StaffController] ' + event.name);
    if ($scope.jobOpenedModal.isShown() && $scope.jobOpenedModal.scope.job.id == data.job_id) {
      $scope.jobOpenedModal.hide();
    }
    var shifts;
    if (data.missed > 1) {
      shifts = data.missed.toString() + ' shifts';
    }
    else {
      shifts = data.missed.toString() + ' shift';
    }
    $scope.showAlert('Whilst you were gone', 'You missed out on ' + shifts + ', remember keep your phone handy and tap \'I\'m Ready\'');
  });

  $scope.$on('event:ninja_not_hired', function(event, data) {
    //console.log('[StaffController] ' + event.name);
    if ($scope.jobOpenedModal.isShown() && $scope.jobOpenedModal.scope.job.id == data.job_id) {
      $scope.jobOpenedModal.hide();
    }
    $scope.showToast('Sorry you were not the closest the ninja this time, better luck next time!');
  });

  $scope.$on('event:ninja_hired', function(event, data) {
    //console.log('[StaffController] ' + event.name);
    //Job.getAndCache({jobId: data.job_id}, function(job) {
    //  $scope.job = job;
    //});
    Job.get({jobId: data.job_id}, function(job) {
      $scope.job = job;
      console.log(job);
    });
    $scope.showToast('Congratulations you have been hired!');
  });

  $scope.$on('event:job_started', function(event, data) {
    console.log('[StaffController] ' + event.name);
    //Job.getAndCache({jobId: data.job_id}, function(job) {
    //  $scope.job = job;
    //});
    Job.get({jobId: data.job_id}, function(job) {
      $scope.job = job;
    });
    $scope.showToast('You are now clocked on');
  });

  $scope.$on('event:job_stopped', function(event, data) {
    console.log('[StaffController] ' + event.name);
    //Job.getAndCache({jobId: data.job_id}, function(job) {
    //  $scope.job = job;
    //});
    Job.get({jobId: data.job_id}, function(job) {
      $scope.job = job;
    });
    $scope.showToast('You are now clocked off');
  });

  $scope.$on('event:job_closed', function(event, data) {
    console.log('[StaffController] ' + event.name);
    //Job.removeFromCache(data.job_id);
    delete $scope.job;
  });

  // --------------------------------------------------------
  // Modal popups
  // --------------------------------------------------------

  $ionicModal.fromTemplateUrl('templates/staff/job_opened_modal.html', {
    scope: $scope,
    animation: 'slide-in-up',
    backdropClickToClose: false,
    hardwareBackButtonClose: false
  }).then(function(modal) {
    $scope.jobOpenedModal = modal;
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
    console.log('[StaffController] refresh');
    $scope.showProgressIndicator();

    // reload job/jobs
    if ($scope.job) {
      console.log('Querying job.id')
      Job.get({jobId: $scope.job.id}, function(job) {
        $scope.job = job;
      });
    }
    else {
      console.log('Querying job[0]')

      Job.query({}, function(jobs) {
        $scope.job = jobs[0];
      });
    }

    // reload map
    if ($scope.isOnStandBy() || $scope.isEnRoute()) {
      $timeout(function() {
            Location.getLastLocation(function(location) {
                console.log('[StaffController] refresh location: ' + location.latitude + ', ' + location.longitude);
                delete $scope.map;
                initializeMap(location.latitude, location.longitude);
                Location.post(location);
                $scope.updateNinjaMarker(location.latitude, location.longitude);
                //$scope.hideProgressIndicator();
            }, function(error) {
                console.log('[StaffController] refresh location error: ' + JSON.stringify(error));
                //$scope.hideProgressIndicator();
                $scope.showAlert('Warning', error.message, function() {
                    if (error.error == 'errLocationDisabled') {
                        if ($window.cordova) {
                            $window.cordova.plugins.WorkNinjaExt.openSettings();
                        }
                    }
                });
            });
        }, 150);
    }
  };

  $scope.startJob = function() {
    $scope.job.$start().then(function(job) {
      console.log('[StaffController] startJob done');
      $scope.job = job;
    });
  };

  $scope.stopJob = function() {
    var now = new Date();
    var startedAt = new Date($scope.job.started_at);
    var shiftMs = now - startedAt;
    var minShiftMs = settings.hiring_min_hours * 60*60*1000;

    var stopFn = function() {
      $scope.job.$stop().then(function(job) {
        console.log('[StaffController] stopJob done');
        $scope.job = job;
      });
    };

    if (shiftMs < minShiftMs) {
      $scope.showConfirmation(
        'Warning',
        //'You are trying to clock off too early. Minimum shifts are ' + settings.hiring_min_hours + ' hours, please confirm with customer first',
        'You are below the minimum shift time of ' + settings.hiring_min_hours + ' hours. Have you confirmed this with the customer?',
        stopFn,
        function() {
        }
      )
    } else {
      stopFn();
    }
  };

  $scope.cancelJob = function() {
    $scope.showConfirmation('Cancel Shift', 'Are you sure you want to cancel this shift?',
      function() {
        $scope.job.$cancel().then(function(job) {
          console.log('[StaffController] cancelJob done');
          $scope.job = job;
          $scope.showToast('Sorry this shift was cancelled');
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

  $scope.trackCalledCustomer = function() {
    Tracker.trackCalledCustomer($scope.job.id);
    window.open('tel:' + $scope.job.workplace.mobile, '_system');
  };

  // cleanup

  $scope.$on('$destroy', function() {
    console.log('[StaffController] destroy');
    if ($scope.jobOpenedModal) {
      $scope.jobOpenedModal.remove();
    }
    if ($scope.feedbackModal) {
      $scope.feedbackModal.remove();
    }
  });

  //get Direction- Map show

  $scope.getDirection = function() {

      /*var directionsService = new google.maps.DirectionsService();
      var ninjaLatlng = new google.maps.LatLng($scope.staff.latitude, $scope.staff.longitude);
      //var workplaceLatlng = new google.maps.LatLng(43.16845214370312, 125.3401412491582);
      var workplaceLatlng = new google.maps.LatLng($scope.job.workplace.latitude, $scope.job.workplace.longitude);

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
            [$scope.staff.latitude, $scope.staff.longitude],
            [$scope.job.workplace.latitude, $scope.job.workplace.longitude],
            function(){
            
            },
            function(error){
                alert("plugin error" + error);
            }
        
        );
                             

  };

}]);
