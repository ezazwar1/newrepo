// Customer routing

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app.customer', {
      url: '/customer',
      abstract: true,
      resolve: {
        customer: ['Session', 'Customer', function(Session, Customer) {
          return Customer.get({customerId: Session.currentUser.company_id}).$promise;
        }],
        settings: ['Settings', function(Settings) {
          return Settings.get().$promise;
        }]
      }

    })

    // Main
    .state('app.customer.main', {
      url: '/main',
      views: {
        'content@app': {
          templateUrl: 'templates/customer/main.html',
          controller: 'CustomerController'
        }
      },
      resolve: {
        jobs: ['Job', function(Job) {
          //return Job.queryIfNeeded().$promise;
          return Job.query().$promise;
        }]
      }
    })

    //Onboard
    .state('app.customer.onboard1', {
      url: '/onboard1',
      views: {
        'content@app': {
          templateUrl: 'templates/customer/onboard1.html',
          controller: 'CustomerOnboardController'
        }
      }
    })
    .state('app.customer.onboard2', {
      url: '/onboard2',
      views: {
        'content@app': {
          templateUrl: 'templates/customer/onboard2.html',
          controller: 'CustomerOnboardController'
        }
      }
    })
    .state('app.customer.onboard3', {
      url: '/onboard3',
      views: {
        'content@app': {
          templateUrl: 'templates/customer/onboard3.html',
          controller: 'CustomerOnboardController'
        }
      }
    })
    .state('app.customer.onboard4', {
      url: '/onboard4',
      views: {
        'content@app': {
          templateUrl: 'templates/customer/onboard4.html',
          controller: 'CustomerOnboardController'
        }
      }
    })
    .state('app.customer.onboard5', {
      url: '/onboard5',
      views: {
        'content@app': {
          templateUrl: 'templates/customer/onboard5.html',
          controller: 'CustomerOnboardController'
        }
      }
    })
    .state('app.customer.onboard6', {
      url: '/onboard6',
      views: {
        'content@app': {
          templateUrl: 'templates/customer/onboard6.html',
          controller: 'CustomerOnboardController'
        }
      }
    })
    

    // Workplace
    .state('app.customer.workplace', {
      url: '/workplace',
      views: {
        'content@app': {
          templateUrl: 'templates/customer/workplace.html',
          controller: 'CustomerWorkplaceController'
        }
      }
    })

    // Payment
    .state('app.customer.payment', {
      url: '/payment',
      views: {
        'content@app': {
          templateUrl: 'templates/customer/payment.html',
          controller: 'CustomerPaymentController'
        }
      }
    })

    // Organisation
    .state('app.customer.organisation', {
      url: '/organisation',
      views: {
        'content@app': {
          templateUrl: 'templates/customer/organisation.html',
          controller: 'CustomerOrganisationController'
        }
      }
    })

    // Add Staff
    .state('app.customer.addstaff', {
      url: '/addstaff',
      views: {
        'content@app': {
          templateUrl: 'templates/customer/add_staff.html',
          controller: 'CustomerAddStaffController'
        }
      }
    })

    // Add Manager
    .state('app.customer.addmanager', {
      url: '/addmanager',
      views: {
        'content@app': {
          templateUrl: 'templates/customer/add_manager.html',
          controller: 'CustomerAddManagerController'
        }
      }
    })

    // Add Workspace
    .state('app.customer.addworkplace', {
      url: '/addworkplace',
      views: {
        'content@app': {
          templateUrl: 'templates/customer/add_workplace.html',
          controller: 'CustomerAddWorkplaceController'
        }
      }
    })

});
