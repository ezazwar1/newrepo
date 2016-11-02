angular.module('starter.controllers', []);

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $modal, $log, Auth) {
        $scope.isLoggedIn = Auth.isLoggedIn;

        // Add action for the 'scrollTop' element 
        $scope.scrollTop = function() {
            $('body').animate({
                scrollTop: 0
            }, 'slow');
        };

        $scope.scrollToAbout = function() {
            $('body').animate({
                scrollTop: $("#about").position().top
            }, 'slow');
        };

        // Open a modal template
        $scope.open = function(template, ctrl) {

            // Create the login modal that we will use later
            $ionicModal.fromTemplateUrl('templates/account/' + template + '/' + template + '.html', {
                scope: $scope,
                controller: ctrl
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.open(modal.template, modal.ctrl);
            });

            var modalInstance = $modal.open({
                templateUrl: 'app/account/' + template + '/' + template + '.html',
                controller: ctrl
            });

        };
    })
    .controller('ContactCtrl', function($scope, $location, ContactUs) {
        $scope.errors = {};
        $scope.emailSent = false;

        $scope.contact = function(form) {
            $scope.submitted = true;

            if (form.$valid) {
                ContactUs.sendEmail(form)
                    .then(function() {
                        // Email Sent
                        $scope.emailSent = true;
                        $scope.errors.result = 'Thanks for contacting us!';
                    })
                    .catch(function(err) {
                        err = err.data;
                        $scope.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function(error, field) {
                            form[field].$setValidity('mongoose', false);
                            $scope.errors[field] = error.message;
                        });
                    });
            }
        };
    });



// .controller('AppCtrl', function($scope, $ionicModal, $timeout) {
//   // Form data for the login modal
//   $scope.loginData = {};

//   // Create the login modal that we will use later
//   $ionicModal.fromTemplateUrl('templates/account/login/login.html', {
//     scope: $scope
//   }).then(function(modal) {
//     $scope.modal = modal;
//   });

//   // Triggered in the login modal to close it
//   $scope.closeLogin = function() {
//     $scope.modal.hide();
//   };

//   // Open the login modal
//   $scope.login = function() {
//     $scope.modal.show();
//   };

//   // Perform the login action when the user submits the login form
//   $scope.doLogin = function() {
//     console.log('Doing login', $scope.loginData);

//     // Simulate a login delay. Remove this and replace with your login
//     // code if using a login system
//     $timeout(function() {
//       $scope.closeLogin();
//     }, 1000);
//   };
// });