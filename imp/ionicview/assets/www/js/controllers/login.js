angular.module('ionic.viewApp.controllers')

.controller('LoginCtrl', function($scope, $rootScope, $http, $state, $ionicModal, HOST_NAME, LoadingService) {
  $scope.formModel = {}
  $scope.login = login

/* -------------------------------------------------------------------------- */

  function login() {
    if (ionic.Platform.isWebView()) cordova.plugins.Keyboard.close()
    LoadingService.show(false).then(function() {
      $http({
        method: 'POST',
        url: HOST_NAME + '/api/v1/login2',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
          var str = []
          for (var p in obj) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
          }
          return str.join('&')
        },
        data: {
          username: $scope.formModel.email,
          password: $scope.formModel.pass
        }
      }).success(function(data, status, headers, config) {
        localStorage.isAuthenticated = true
        localStorage.authToken = data.token
        var defaultHeaders = {
          'Authorization': 'Token ' + data.token
        }
        $http.defaults.headers.delete = defaultHeaders
        $http.defaults.headers.get = defaultHeaders
        if (ionic.Platform.isWebView()) {
          LocalStorageBackup.save('View')
          ionic.Platform.isIOS() && IonicViewNative.clearKeychain()
        }
        $state.go('UserAppsView')
      }).error(function(data, status, headers, config) {
        $scope.formModel.errors = {}
        LoadingService.hide()
        if (status === 401 || status === 400) {
          $scope.formModel.error = 'INVALID CREDENTIALS'
        } else if (status <= 0) {
          $scope.formModel.error = 'NO CONNECTION'
        } else {
          $scope.formModel.error = 'THERE WAS AN ERROR, STATUS CODE: ' + status
        }
      })
    })
  }
})
