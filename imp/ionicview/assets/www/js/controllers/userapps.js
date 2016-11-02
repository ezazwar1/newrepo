angular.module('ionic.viewApp.controllers')

.controller('UserAppsCtrl', function(
  $scope, $rootScope, $state, $timeout,
  $ionicPlatform, $ionicScrollDelegate, $ionicLoading, $ionicModal, $ionicHistory, $ionicViewSwitcher,
  LoadingService, AppListService, $viewActionSheet, $viewPopup,
  dateFilter
) {
  var numBacks = 0
  var backButtonTimer = null
  var deregisterBackButton = null
  var offAppListUpdate = null
  var firstRun = true

  $scope.showPopup = showPopup
  $scope.reloadAppList = reloadAppList
  $scope.openActionSheet = openActionSheet

  $scope.appListService = AppListService

/* -------------------------------------------------------------------------- */

  $scope.$on('$ionicView.enter', load)
  $scope.$on('$ionicView.leave', deregisterBackButton)

/* -------------------------------------------------------------------------- */
  function load() {
    registerBackButton()

    AppListService.updateAppListFromServer()
      .finally(function() {
        if (AppListService.appListOrdered.length === 0) {
          $state.go('UserAppsViewEmpty')
        } else {
          LoadingService.hide()
          if (firstRun && ionic.Platform.isWebView()) {
            firstRun = false
            ionic.Platform.ready(navigator.splashscreen.hide)
          }
        }
      })
      .catch(function(error) {
        loadAppErrorHandler(error)
      })
  }

  function showPopup(appId, appName) {
    var popupScope = $scope.$new()
    popupScope.app = AppListService.appList[appId]

    var lastModified = popupScope.app.server_last_modified
    var formattedLastModified = dateFilter(lastModified, 'medium').toUpperCase()

    deregisterBackButton()
    $scope.loadAppPopup = $viewPopup.show({
      templateUrl: 'templates/partials/userapps.popup.html',
      title: appName,
      subTitle: 'ID: ' + appId.toUpperCase() + '<br>' + formattedLastModified,
      scope: popupScope
    })

    popupScope.loadAppPopup
      .then(function() {
        popupScope.$destroy()
        registerBackButton()
        if (AppListService.appListOrdered.length === 0) {
          $state.go('UserAppsViewEmpty')
        }
      })
  }

  function reloadAppList() {
    setTimeout(function() {
      AppListService.updateAppListFromServer(true)
        .finally(function() {
          $scope.$broadcast('scroll.refreshComplete')
          // technically all apps could be deleted, but app list doesn't save
          // for one second to reduce the pressure on the PTR animation
          setTimeout(function() {
            if (AppListService.appListOrdered.length === 0) {
              $state.go('UserAppsViewEmpty')
            }
          }, 1100)
        })
        .catch(loadAppErrorHandler)
    })
  }

  function openActionSheet() {
    $viewActionSheet.show({
      buttons: [
        { text: 'Preview an app' },
        { text: 'Settings' }
      ],
      buttonClicked: function(index) {
        if (index) {
          $state.go('SettingsView')
        } else {
          $state.go('LoadAppView')
        }
      }
    })
  }

/* -------------------------------------------------------------------------- */

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
})
