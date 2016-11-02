// Staff routing

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app.staff', {
      url: '/staff',
      abstract: true,
      resolve: {
        staff: ['Session', 'Staff', function(Session, Staff) {
          return Staff.get({staffId: Session.currentUser.id}).$promise;
        }],
        settings: ['Settings', function(Settings) {
          return Settings.get().$promise;
        }]
      }
    })

    // Main
    .state('app.staff.main', {
      url: '/main',
      views: {
        'content@app': {
          templateUrl: 'templates/staff/main.html',
          controller: 'StaffController'
        }
      },
      resolve: {
        jobs: ['Job', function(Job) {
          //return Job.queryIfNeeded().$promise;
          return Job.query().$promise;
        }]
      }
    })

    // Profile
    .state('app.staff.profile', {
      url: '/profile',
      views: {
        'content@app': {
          templateUrl: 'templates/staff/profile.html',
          controller: 'StaffProfileController'
        }
      }
    })
    .state('app.staff.profile.transport', {
      url: '/transport',
      views: {
        'content@app': {
          templateUrl: 'templates/staff/transport.html',
          controller: 'StaffProfileTransportController'
        }
      }
    })

    // Availability
    .state('app.staff.availability', {
      url: '/availability/:inSetup',
      views: {
        'content@app': {
          templateUrl: 'templates/staff/availability.html',
          controller: 'StaffAvailabilityController'
        }
      }
    })
    .state('app.staff.availability.wday', {
      url: '/:wdayId',
      views: {
        'content@app': {
          templateUrl: 'templates/staff/availability_wday.html',
          controller: 'StaffAvailabilityWdayController'
        }
      }
    })


    //Onboard
    .state('app.staff.onboard1', {
      url: '/onboard1',
      views: {
        'content@app': {
          templateUrl: 'templates/staff/onboard1.html',
          controller: 'StaffOnboardController'
        }
      }
    })
    .state('app.staff.onboard2', {
      url: '/onboard2',
      views: {
        'content@app': {
          templateUrl: 'templates/staff/onboard2.html',
          controller: 'StaffOnboardController'
        }
      }
    })
    .state('app.staff.onboard3', {
      url: '/onboard3',
      views: {
        'content@app': {
          templateUrl: 'templates/staff/onboard3.html',
          controller: 'StaffOnboardController'
        }
      }
    })
    .state('app.staff.onboard4', {
      url: '/onboard4',
      views: {
        'content@app': {
          templateUrl: 'templates/staff/onboard4.html',
          controller: 'StaffOnboardController'
        }
      }
    })
    .state('app.staff.onboard5', {
      url: '/onboard5',
      views: {
        'content@app': {
          templateUrl: 'templates/staff/onboard5.html',
          controller: 'StaffOnboardController'
        }
      }
    })

    .state('app.staff.onboard5.wday', {
      url: '/:wdayId',
      views: {
        'content@app': {
          templateUrl: 'templates/staff/onboard5_wday.html',
          controller: 'StaffAvailabilityWdayController'
        }
      }
    })
    .state('app.staff.onboard6', {
      url: '/onboard6',
      views: {
        'content@app': {
          templateUrl: 'templates/staff/onboard6.html',
          controller: 'StaffOnboardController'
        }
      }
    })
    .state('app.staff.onboard7', {
      url: '/onboard7',
      views: {
        'content@app': {
          templateUrl: 'templates/staff/onboard7.html',
          controller: 'StaffOnboardController'
        }
      }
    })
//    .state('app.staff.onboard8', {
//      url: '/onboard8',
//      views: {
//        'content@app': {
//          templateUrl: 'templates/staff/onboard8.html',
//          controller: 'StaffOnboardController'
//        }
//      }
//    })

    // map
    .state('app.staff.standby', {
      url: '/main',
      views: {
        'content@app': {
          templateUrl: 'templates/staff/_on_standby.html',
          controller: 'StaffController'
        }
      },
      resolve: {
        jobs: ['Job', function(Job) {
          //return Job.queryIfNeeded().$promise;
          return Job.query().$promise;
        }]
      }
    })
});
