angular.module('controller.users', [])
.controller('UserCtrl', function($scope, ModalLoginSignupService) {

    $scope.openModal = function() {
      ModalLoginSignupService
        .init($scope)
        .then(function(modal) {
          modal.show();
        });
    };
});