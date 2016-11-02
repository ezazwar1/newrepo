angular.module('ionic.viewApp.controllers')
.controller('SettingsCtrl', function(
  $scope, $state, $timeout,
  $ionicHistory, $ionicViewSwitcher,
  FileService
) {
  $scope.data = {
    showSwipeInfo: localStorage.showSwipeInfo === "true"
  }
  $scope.clearDefault = true

  $scope.toggleShowSwipeInfo = toggleShowSwipeInfo

  // Trigger clear status change from default to loading in status directive.
  $scope.clear = clear

  // Called from status directive when clear status is 'loading' (after
  // loading has animated in).
  $scope.clearData = clearData

  $scope.goToInstructions = goToInstructions
  $scope.goToTOS = goToTOS
  $scope.goToPrivacy = goToPrivacy

  $scope.logout = logout
  $scope.close = close

/* -------------------------------------------------------------------------- */

  $scope.$on('$ionicView.leave', setClearStatus)

/* -------------------------------------------------------------------------- */

  function goToInstructions() {
    $state.go('InstructionsView')
  }

  function goToTOS() {
    $state.go('TOSView')
  }

  function goToPrivacy() {
    $state.go('PrivacyView')
  }

  function toggleShowSwipeInfo() {
    localStorage.showSwipeInfo = localStorage.showSwipeInfo === 'true' ? 'false' : 'true'
    if (ionic.Platform.isWebView()) LocalStorageBackup.save('View')
  }

  function clear() {
    if ($scope.clearDefault) {
      setClearStatus('loading')
    }
  }

  function clearData() {
    FileService.removeAllAppFiles().then(
      function() {
        setClearStatus('success')
      },
      function(error) {
        // one or more files don't exist, just tell them it was cleared
        if (error.code && error.code === 1) {
          setClearStatus('success')
          $timeout(setClearStatus, 3000)
        } else {
          if (error.code === undefined) error.code = 0
          $scope.clearErrorText = 'THERE WAS AN ERROR. CODE: ' + error.code + '.'
          setClearStatus('error')
        }
      }
    )
  }

  function logout() {
    localStorage.clear()
    localStorage.isAuthenticated = false
    if (ionic.Platform.isWebView()) LocalStorageBackup.clear('View')
    $ionicHistory.clearHistory()
    $ionicViewSwitcher.nextDirection('back')
    $ionicHistory.nextViewOptions({
      historyRoot: true
    })
    $state.go('AccountView')
  }

/* -------------------------------------------------------------------------- */

  function setClearStatus(status) {
    $scope.clearDefault = $scope.clearLoading = $scope.clearSuccess = $scope.clearError = false
    if (status === 'success') {
      $scope.clearSuccess = true
    } else if (status === 'error') {
      $scope.clearError = 'true'
    } else if (status === 'loading') {
      $scope.clearLoading = 'true'
    } else {
      $scope.clearDefault = 'true'
    }
  }
})
