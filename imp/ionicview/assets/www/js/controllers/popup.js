angular.module('ionic.viewApp.controllers')

.controller('PopupCtrl', function(
  $scope, $q, $timeout,
  $ionicPlatform,
  LoadingService, FileService, AppListService, $viewPopup
) {
  var actionInProgress = false

  // For the when the back button has closed the loading screen on Android
  var canceled = false
  var deregisterBackButton = null

  $scope.viewErrorText = $scope.clearErrorText = $scope.syncErrorText = $scope.deleteErrorText = ''
  $scope.viewDefault = $scope.clearDefault = $scope.syncDefault = $scope.deleteDefault = true
  $scope.clearDisabled = !$scope.app.loaded

  $scope.loadApp = loadApp
  $scope.clearAppData = clearAppData
  $scope.confirmDelete = confirmDelete

  // Trigger sync status change from default to loading in status directive.
  $scope.sync = sync

  // Called from status directive when sync status is 'loading' (after
  // loading has animated in).
  //
  // Displays HTTP status code on error if available, otherwise tries to
  // show a reasonably informative but concise error message.
  $scope.syncApp = syncApp

/* -------------------------------------------------------------------------- */

  function loadApp() {
    if (actionInProgress) return
    if (FileService.syncInProgress) {
      $scope.viewErrorText = 'Other sync in progress.'
      setViewStatus('error')
      $timeout(setViewStatus, 2000)
      return
    }

    actionInProgress = true
    var appId = $scope.app.appId.toLowerCase()

    registerBackButton()
    LoadingService.show(true).then(
      function() {
        return FileService.loadApp($scope.app, true)
      }
    )
    .then(
      function(indexPath) {
        if (canceled) {
          return
        }
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
            feedback: 'true'
          })
          ref.addEventListener('loadstop', onLoad)
          ref.addEventListener('exit', onExit)

          $scope.loadAppPopup.close()
        })

        function onLoad() {
          // ref.executeScript({ file: 'cordova.js' })

          // script load order is guaranteed by iAB on Android
          // TODO: investigate on iOS
          ref.executeScript({ file: 'file:///android_asset/www/cordova.js' })
          ref.executeScript({ file: 'file:///android_asset/www/scripts/afterLoad.js' })

          //ref.executeScript({ file: 'file:///android_asset/www/cordova.js' }, function() {
          //  ref.executeScript({ file: 'file:///android_asset/www/scripts/afterLoad.js' })
          //})

          // otherwise header doesn't add 20px statusbar padding on ios
          // ref.executeScript({ code: 'document.body.classList.add('platform-ios', 'platform-cordova')' })

          if (showSwipeInfo === 'true') {
            ref.executeScript({ file: 'file:///android_asset/www/scripts/swipeImg.js' })
          }
          ref.removeEventListener('loadstop', onLoad)
          setTimeout(LoadingService.hide, 2000);
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
      },
      function(error) {
        var msg, status
        LoadingService.hide()

        // status: updateAppFromServer, http_status: fileTransfer
        status = error.status || error.http_status
        if (status <= 0) {
          msg = 'No connection.'
        } else if (error.code) {
          msg = getErrorMessage(error.code)
        } else if (status) {
          msg = 'View error. Status: ' + status + '.'
        } else {
          msg = 'Unknown error.'
        }
        $scope.viewErrorText = msg
        setViewStatus('error')
        $timeout(setViewStatus, 2000)
      }
    )
    .finally(function() {
      deregisterBackButton()
      canceled = false
      actionInProgress = false
    })
  }

  function clearAppData() {
    if (actionInProgress) return
    actionInProgress = true

    var appId = $scope.app.appId

    // remove the files
    FileService.removeAppFiles(appId)
      .then(function() {
        LocalStorageBackup.clear(appId, function() {
          $scope.$evalAsync(function() { setClearStatus('success') })
          $timeout(setClearStatus, 2000)
        })
      })
      .catch(function(error) {
        // one or more files don't exist, just tell them it was cleared
        if (error.code === 1) {
          LocalStorageBackup.clear(appId, function() {
            $scope.$evalAsync(function() { setClearStatus('success') })
            $timeout(setClearStatus, 2000)
          })
        } else {
          $scope.clearErrorText = 'Clear Error. Code: ' + error.code + '.'
          setClearStatus('error')
          $timeout(setClearStatus, 2000)
        }
      })
      .finally(function() {
        actionInProgress = false
      })
  }

  function sync() {
    // only allow syncing if in the default state (SYNC TO LATEST)
    if ($scope.syncDefault && !actionInProgress) {
      if (FileService.syncInProgress) {
        $scope.syncErrorText = 'Other sync in progress.'
        setSyncStatus('error')
        $timeout(setSyncStatus, 2000)
        return
      }

      actionInProgress = true
      setSyncStatus('loading')
    }
  }

  function syncApp() {
    var appId = $scope.app.appId

    var error = {}
    // Load app info and last_modified date from server
    AppListService.updateAppFromServer(appId)
    .then(
      function() {
        var app = $scope.app = AppListService.appList[appId]

        if (!app.loaded) {
          return $q.defer().resolve()
        } else if (new Date(app.last_modified).getTime() !==
                      new Date(app.server_last_modified).getTime()) {
          // remove the old files before downloading new
          return FileService.removeAppFiles(appId)
        } else {
          error.msg = 'upToDate'
          return $q.reject(error)
        }
      } // let the error with error.status pass through
    )
    // download the new one
    .then(
      function() {
        return FileService.syncApp($scope.app)
      },
      function(error) { // FileService.removeAppFiles error
        // pass error on from being up to date or updating from server
        if (error.msg || error.status || error.status === 0) return $q.reject(error)

        // File doesn't exist, possibly due to previous connectivity issues
        if (error.code && error.code === 1) {
          // Doesn't stop us from downloading the latest version
          return FileService.loadApp($scope.app)
        }

        error.msg = 'Error removing the old files.'
        return $q.reject(error)
      }
    )
    .catch(
      function(error) { // FileService.loadApp Error
        // pass error on from up to date, updating from server, or
        // removing old files
        if (error.msg || error.status || error.status === 0) return $q.reject(error)

        // fileTransfer plugin uses http_status property
        if (error.http_status) {
          error.status = error.http_status
        } else {
          // fallback if for whatever reason there is no status code
          error.msg = getErrorMessage(error.code)
        }

        return $q.reject(error)
      }
    )
    .then(
      function() {
        LocalStorageBackup.clear(appId, function() {
          $scope.$evalAsync(function() {
            $scope.syncSuccessText = 'Sync successful.'
            setSyncStatus('success')
            LoadingService.setPercentage(0)
          })
          $timeout(setSyncStatus, 2000)
        })
      },
      function(error) {
        if (!error.msg) {
          if (error.status <= 0) {
            error.msg = 'No connection.'
          } else if (error.status) {
            error.msg = 'Sync Failed. Status: ' + error.status + '.'
          } else {
            error.status = 'Sync Failed. Unknown Error.'
          }
        }

        if (error.msg === 'upToDate') {
          $scope.syncSuccessText = 'Up to date.'
          setSyncStatus('success')
        } else {
          $scope.syncErrorText = error.msg
          setSyncStatus('error')
        }

        // if we removed the files, but the sync failed, disable clear
        $scope.clearDisabled = !$scope.app.loaded

        $timeout(setSyncStatus, 2000)
      }
    )
    .finally(function() {
      actionInProgress = false
    })
  }

/* -------------------------------------------------------------------------- */

  function confirmDelete(appId) {
    var confirmDeletePopup = $viewPopup.show({
      title: 'Delete app',
      template: 'Are you sure you want to permanently delete this app?',
      cssClass: 'delete-popup',
      buttons: [
        {
          text: 'CANCEL',
          type: 'item button-cancel button-clear button-positive',
          onTap: function() { return false }
        },
        {
          text: 'DELETE',
          type: 'item error',
          onTap: function() { return true }
        }
      ]
    })

    confirmDeletePopup.then(function(res) {
      if (res) {
        setDeleteStatus('inprogress')
        AppListService.deleteApp(appId)
          .then(function() {
            $scope.loadAppPopup.close()
            if (ionic.Platform.isWebView()) LocalStorageBackup.clear(appId)
          })
          .catch(function(error) {
            if (error.status && error.status <= 0) {
              $scope.deleteErrorText = 'No Connection'
            } else {
              $scope.deleteErrorText = 'Error. Status code: ' + error.status
            }
            setDeleteStatus('error')
            $timeout(setDeleteStatus, 2000)
          })
      }
    })
  }

  function setSyncStatus(status) {
    $scope.syncDefault = $scope.syncSuccess = $scope.syncError = $scope.syncLoading = false
    if (status === 'success') {
      $scope.syncSuccess = true
    } else if (status === 'error') {
      $scope.syncError = true
    } else if (status === 'loading') {
      $scope.syncLoading = true
    } else {
      $scope.syncDefault = true
    }
  }

  function setClearStatus(status) {
    $scope.clearDefault = $scope.clearSuccess = $scope.clearError = false
    if (status === 'success') {
      $scope.clearSuccess = true
      $scope.clearDisabled = false
    } else if (status === 'error') {
      $scope.clearError = true
    } else {
      $scope.clearDefault = $scope.clearDisabled = true
    }
  }

  function setViewStatus(status) {
    $scope.viewDefault = $scope.viewError = false
    if (status === 'error') {
      $scope.viewError = true
    } else {
      $scope.viewDefault = true
    }
  }

  function setDeleteStatus(status) {
    $scope.deleteDefault = $scope.deleteError = $scope.deleteInProgress = false
    if (status === 'error') {
      $scope.deleteError = true
    } else if (status === 'inprogress') {
      $scope.deleteInProgress = true
    } else {
      $scope.deleteDefault = true
    }
  }

  function getErrorMessage(code) {
    switch (code) {
      case FileService.syncInProgressCode: // 99
        return 'Other sync in progress'

      case FileService.unzipErrorCode: // 98
        return 'ERROR UNZIPPING FILES'

      case FileService.copyErrorCode: // 97
        return 'ERROR COPYING FILES'

      case FileTransferError.FILE_NOT_FOUND_ERR: // 1
        return 'File not found'

      case FileTransferError.INVALID_URL_ERR: // 2
        return 'Invalid URL'

      case FileTransferError.CONNECTION_ERR: // 3
        return 'Connection error'

      case FileTransferError.ABORT_ERR: // 4
        return 'Connection aborted'

      default:
        return 'FileTransfer error'
    }
  }

  function registerBackButton() {
    deregisterBackButton = $ionicPlatform.registerBackButtonAction(function(e) {
      canceled = true
    }, 501)
  }
})

