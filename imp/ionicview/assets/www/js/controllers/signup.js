angular.module('ionic.viewApp.controllers')

.controller('SignupCtrl', function($scope, $http, $state, $ionicScrollDelegate, LoadingService, HOST_NAME) {
  $scope.formModel = {}
  $scope.signup = signup

/* -------------------------------------------------------------------------- */

  function signup() {
    if (ionic.Platform.isWebView()) cordova.plugins.Keyboard.close()
    LoadingService.show(false).then(function() {
      $http({
        method: 'POST',
        url: HOST_NAME + '/api/v1/signup2',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
          var str = []
          for (var p in obj) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
          }
          return str.join('&')
        },
        data: {
          username: $scope.formModel.username,
          name: $scope.formModel.firstName.trim() + ' ' + $scope.formModel.lastName.trim(),
          email: $scope.formModel.email,
          password1: $scope.formModel.password1,
          password2: $scope.formModel.password2
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
        $ionicScrollDelegate.scrollTop()
        LoadingService.hide()
        if (status === 400) {
          var dataJSON
          try {
            dataJSON = JSON.parse(data)
          } catch (error) {
            $scope.formModel.errors['error'] = 'MALFORMED SERVER RESPONSE'
            return
          }
          var errorFields = Object.keys(dataJSON)
          var i = 0
          while (i < errorFields.length) {
            $scope.formModel.errors[errorFields[i]] = dataJSON[errorFields[i++]][0]
          }
        } else if (status <= 0) {
          $scope.formModel.errors['error'] = 'NO CONNECTION'
        } else {
          $scope.formModel.errors['error'] = 'THERE WAS AN ERROR, STATUS CODE: ' + status
        }
      })
    })
  }
})
