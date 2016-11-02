angular.module('ionic.viewApp.controllers')

.controller('LoadAppCtrl', function($scope, $state, $q, $timeout, LoadingService, FileService, AppListService) {
  $scope.data = {}
  $scope.data.appId = ''
  $scope.data.error = null

  $scope.modalLoadApp = loadApp
  $scope.back = back
  $scope.close = close

/* -------------------------------------------------------------------------- */
  var inProgress = false
  function loadApp() {
    if (inProgress) return

    if (FileService.syncInProgress) {
      $scope.data.error = 'Another sync is currently in progress'
      return
    }

    inProgress = true
    var appId = $scope.data.appId.toLowerCase()

    if (ionic.Platform.isWebView()) cordova.plugins.Keyboard.close()

    LoadingService.show(true)
      .then(function() {
        return AppListService.updateAppFromServer(appId)
      })
      .then(function(app) {
        var promise = FileService.loadApp(app, false)
        // $timeout is resolved with the return value of its callback
        return $timeout(function() { return promise }, 600)
      })
      .then(function(indexPath) {
        // these should never be needed, but if somehow the plugin fails to
        // backup, use the previous values as a fallback
        var authToken = localStorage.authToken
        var showSwipeInfo = localStorage.showSwipeInfo
        // want each app to have clean localStorage before we load the app
        localStorage.clear()

        var ref
        LocalStorageBackup.load(appId, function() {
          ref = window.open(indexPath, '_blank', 'location=no', {
            appId: appId,
            authToken: authToken,
            feedback: 'false'
          })
          ref.addEventListener('loadstop', onLoad)
          ref.addEventListener('exit', onExit)

          $scope.data.error = null
        })

        function onLoad() {
          // ref.executeScript({ file: 'cordova.js' })
          ref.executeScript({ file: 'file:///android_asset/www/cordova.js' })

          ref.executeScript({ file: 'file:///android_asset/www/scripts/afterLoad.js' })

          // otherwise header doesn't add 20px statusbar padding on ios
          // ref.executeScript({ code: 'document.body.classList.add('platform-ios', 'platform-cordova')' })

          if (showSwipeInfo === 'true') {
            ref.executeScript({ file: 'file:///android_asset/www/scripts/swipeImg.js' })
          }
          ref.removeEventListener('loadstop', onLoad)
          LoadingService.hide()
        }

        function onExit() {
          // save app localStorage for next session
          LocalStorageBackup.save(appId, function() {
            // clear any app specified values
            localStorage.clear()

            // restore View's localStorage
            LocalStorageBackup.load('View', function(err) {
              if (err) {
                // this should never happen, but if it does assume we're
                // still logged in, since you can't view apps without being
                // logged in
                localStorage.isAuthenticated = true
                localStorage.authToken = authToken
                localStorage.showSwipeInfo = showSwipeInfo
              }
              ref.removeEventListener('exit', onExit)
            })
          })
        }
      })
      .catch(function(error) {
        if ((error.code && error.code === 3) ||
             error.status <= 0) {
          $scope.data.error = 'No connection.'
        } else if (error.code === 1 || error.status === 404) {
          $scope.data.error = 'Please enter a valid app ID.'
        } else if (error.code && error.code === FileService.syncInProgressCode) {
          $scope.data.error = 'Another sync is currently in progress'
        } else if (error.code && error.code === FileService.noAppFilesCode) {
          $scope.data.error = 'App has no files (needs upload)'
        } else {
          $scope.data.error = 'There was an error downloading the app.'
        }
        LoadingService.hide()
      })
      .finally(function() {
        inProgress = false
      })
  }

  function back() {
    $state.go('UserAppsViewEmpty')
  }

  function close() {
    $scope.data.error = null
  }
})
