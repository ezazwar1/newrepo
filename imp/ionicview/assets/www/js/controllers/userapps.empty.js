angular.module('ionic.viewApp.controllers')

.controller('UserAppsEmptyCtrl', function(
  $scope, $state, $timeout,
  $ionicModal, $ionicPlatform, $ionicLoading, $ionicHistory, $ionicViewSwitcher,
  AppListService, LoadingService
) {
  var pollPromise
  var dontPoll
  var numBacks = 0
  var backButtonTimer = null
  var deregisterBackButton = null

  $scope.reloadAppList = reloadAppList
  $scope.goToInstructions = goToInstructions
  $scope.goToLoadAppPage = goToLoadAppPage
  $scope.goToSettings = goToSettings

/* -------------------------------------------------------------------------- */

  $scope.$on('$ionicView.enter', function() {
    registerBackButton()

    ionic.Platform.ready(function() {
      setTimeout(function() {
        LoadingService.hide()
        if (ionic.Platform.isWebView()) navigator.splashscreen.hide()
      }, 16)
    })

    dontPoll = false
    pollForUpdates()
  })

  $scope.$on('$ionicView.leave', function() {
    deregisterBackButton && deregisterBackButton()
    stopPolling(pollPromise)
  })

/* -------------------------------------------------------------------------- */

  function goToInstructions() {
    $state.go('InstructionsView')
  }

  function goToLoadAppPage() {
    $state.go('LoadAppView')
  }

  function goToSettings() {
    $state.go('SettingsView')
  }

  function pollForUpdates() {
    if (localStorage.isAuthenticated === 'false') {
      return logout();
    }

    if (dontPoll) return
    AppListService.updateAppListFromServer()
      .then(function() {
        if (AppListService.appListOrdered.length > 0) {
          stopPolling(pollPromise)
          return $state.go('UserAppsView')
        }
        pollPromise = $timeout(pollForUpdates, 30000)
      })
      .catch(function(error) {
        if (error.status === 401 || error.status === 403) {
          $ionicLoading.show({
            template: 'Not authorized. Please re-login.<br>Status code: ' + error.status
          })
          setTimeout(function() {
            $ionicLoading.hide()
              .then(logout)
          }, 2000)
        }
      })
  }

  function stopPolling(pollPromise) {
    dontPoll = true
    $timeout.cancel(pollPromise)
  }

  function reloadAppList() {
    setTimeout(function() {
      AppListService.updateAppListFromServer(true)
        .finally(function() {
          $scope.$broadcast('scroll.refreshComplete')
          // technically all apps could be deleted, but app list doesn't save
          // for one second to reduce the pressure on the PTR animation
          setTimeout(function() {
            if (AppListService.appListOrdered.length > 0) {
              stopPolling(pollPromise)
              $state.go('UserAppsView')
            }
          }, 1100)
        })
        .catch(loadAppErrorHandler)
    })
  }

  function registerBackButton() {
    deregisterBackButton = $ionicPlatform.registerBackButtonAction(function(e) {
      numBacks++
      if (numBacks === 2) {
        numBacks = 0
        clearTimeout(backButtonTimer)
        navigator.app.exitApp()
      } else {
        plugins.toast.showShortBottom('Press back button again to exit the app')
        backButtonTimer = setTimeout(function() {
          numBacks = 0
        }, 2000)
      }
    }, 101)
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

  function loadAppErrorHandler(error) {
    var msg = error.msg
    var status = error.status
    if (msg) {
      $ionicLoading.show({
        template: msg,
        duration: 2000
      })
    } else if (status === 403 || status === 401) {
      $ionicLoading.show({
        template: 'Not authorized. Please re-login.<br>Status code: ' + status
      })
      setTimeout(function() {
        $ionicLoading.hide().then(function() {
          localStorage.clear()
          localStorage.isAuthenticated = false
          if (ionic.Platform.isWebView()) LocalStorageBackup.clear('View')
          $ionicHistory.clearHistory()
          $ionicViewSwitcher.nextDirection('back')
          $ionicHistory.nextViewOptions({
            historyRoot: true
          })
          $state.go('AccountView')
        })
      }, 2000)
    } else if (status === 404) {
      $ionicLoading.show({
        template: 'Unable to connect to server.<br>Status code: ' + status,
        duration: 2000
      })
    } else if (status <= 0) {
      $ionicLoading.show({
        template: 'No connection.',
        duration: 2000
      })
    } else {
      $ionicLoading.show({
        template: 'There was an error.<br>Status code: ' + status,
        duration: 2000
      })
    }
  }
})
