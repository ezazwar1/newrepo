angular.module('ionic.viewApp.services', [])

.factory('FileService', function($q, $timeout, LoadingService, AppListService) {
  var _syncInProgress = false
  var _syncInProgressCode = 99
  var _unzipErrorCode = 98
  var _copyErrorCode = 97
  var _noAppFilesCode = 96
  var _filesDir = null

  return {

    /*
     * @name syncInProgressCode
     * @description
     * Error code if there is already a sync in progress. Value is 99,
     * but could be anything that doesn't clash with FileTransferError codes.
     */
    syncInProgressCode: _syncInProgressCode,

    /*
     * @name unzipErrorCode
     * @description
     * Error code if there is a problem unzipping the app files.
     */
    unzipErrorCode: _unzipErrorCode,

    /*
     * @name fileCopyErrorCode
     * @description
     * Error code if there is a problem copying a file.
     */
    copyErrorCode: _copyErrorCode,

    /*
     * @name fileCopyErrorCode
     * @description
     * Error code if there are no files associated with this app (ie the user
     * has not uploaded any from the CLI)
     */
    noAppFilesCode: _noAppFilesCode,

    /*
     * @name syncInProgress
     * @description
     * Returns true if there is a sync in progress, false if otherwise.
     */
    syncInProgress: _syncInProgress,

    /*
     * @name loadApp
     * @description
     * loads the files of the supplied app, downloading them to the device if necessary
     *
     * @param {object} app object whose files you want to load
     *
     * @returns {object} A promise that resolves with the path to the app's
     * index.html file on the device or null if index.html isn't found, and rejects with
     * any errors that may have happened during the process.
     */
    loadApp: loadApp,

    /*
     * @name syncApp
     * @description
     * Downloads the files of the supplied app
     *
     * @param {object} app object whose files you want to download
     *
     * @returns {object} A promise that resolves once the files have been
     * downloaded.
     */
    syncApp: syncApp,

    /*
     * @name removeAllAppFiles
     * @description
     * removes all files for all apps from the device
     *
     * @returns {object} A promise that resolves when all the files are removed,
     * or rejects with the corresponding error if there is a problem
     */
    removeAllAppFiles: removeAllAppFiles,

    /*
     * @name removeAppFiles
     * @description
     * removes all files for the app specified by appId from the device
     *
     * @param {string} `appId` the id of the app whose files should be removed
     *
     * @returns {object} A promise that resolves when all the files are removed,
     * or rejects with the corresponding error if there is a problem
     */
    removeAppFiles: removeAppFiles
  }

/* -------------------------------------------------------------------------- */

  function loadApp(app, updateFirst) {
    var appId = app.appId
    var dataDir = null

    // get the directory where app files are saved
    return getFilesDir()
      .then(function(filesDir) {
        dataDir = filesDir // save it for later

        // get the path of index.html in the app directory
        // if index.html exists then return its path, otherwise download files
        return getIndexPath(appId, dataDir)
          .then(function(indexPath) {
            // update last_modified and loaded properties on app object
            AppListService.setLoaded(appId)
            LoadingService.setPercentage(1)
            // wait for loading bar animation to complete
            return $timeout(function() {
              return indexPath
            }, 600)
          })
          // file doesn't exist, need to download it
          .catch(function() {
            // update to get fresh s3 link, otherwise we might get 403 if
            // it's expired
            if (updateFirst) {
              return AppListService.updateAppFromServer(appId)
                .then(function() {
                  app = AppListService.appList[appId]
                  if (app.size === 0 || app.url === '') {
                    throw {
                      code: _noAppFilesCode
                    }
                  }
                  return downloadUnzipAndCleanup(dataDir, app)
                })
            } else {
              if (app.size === 0 || app.url === '') {
                throw {
                  code: _noAppFilesCode
                }
              }
              return downloadUnzipAndCleanup(dataDir, app)
            }
          })
      })
  }

  function syncApp(app) {
    return getFilesDir()
      .then(function(filesDir) {
        return downloadUnzipAndCleanup(filesDir, app)
      })
  }

  function removeAllAppFiles() {
    var d = $q.defer()
    getFilesDir()
      .then(function(filesDir) {
        filesDir.createReader()
          .readEntries(function(entries) {
            // remove all entries (files, dirs) in the directory
            for (var i = 0, ii = entries.length; i < ii; i++) {
              if (entries[i].isFile) {
                entries[i].remove(null, d.reject)
              } else {
                entries[i].removeRecursively(null, d.reject)
              }
            }
            // set all app objects' loaded property to false
            AppListService.clearLoaded()
            d.resolve()
          }, d.reject)
      }, d.reject)

    return d.promise
  }

  function removeAppFiles(appId) {
    var d = $q.defer()
    getFilesDir()
    .then(function(filesDir) {
      filesDir.getDirectory(appId, null, function(appDir) {
        appDir.removeRecursively(function() {
          // set app object's loaded property to false
          AppListService.clearLoaded(appId)
          d.resolve()
        }, d.reject)
      }, d.reject)
    }, d.reject)

    return d.promise
  }

  function fileApiWrapper(func) {
    return function() {
      if (_syncInProgress) {
        return $q.reject({ 'code': _syncInProgressCode })
      }
      _syncInProgress = true

      return func.apply(this, arguments)
        .finally(function() {
          _syncInProgress = false
        })
    }
  }

/* -------------------------------------------------------------------------- */

  function downloadUnzipAndCleanup(dataDir, app, isSync) {
    var appId = app.appId
    var uri = app.url
    var zipFileFullPath = dataDir.toURL() + appId + '/app.zip'

    // download the zip that has the app files
    return downloadFiles(uri, zipFileFullPath)
      .then(function(file) {
        // sometimes only loads to 98-99 (88-89 of total), give it a nudge
        LoadingService.setPercentage(0.9)
        var dest = dataDir.toURL() + appId

        // unzip the files
        return unzipFiles(file, dest)
      })
      .then(function(result) {
        if (result !== 0) {
          throw { code: _unzipErrorCode }
        }

        // final 10% is unzipping
        LoadingService.setPercentage(1)
        var zipName = appId + '/app.zip'

        // remove the .zip after successful unzip, ignore if it fails
        return removeFile(zipName, dataDir).catch(function() {})
      })
      .then(function() {
        return copyFile(
          cordova.file.applicationDirectory + 'www/scripts/beforeLoad.js',
          dataDir.toURL() + appId,
          'cordova.js'
        )
        .catch(function() {
          throw { code: _copyErrorCode }
        })
      })
      .then(function() {
        // update last_modified and loaded properties on the app object
        AppListService.setLoaded(appId)

        // get path to index.html now that we've downloaded, unzipped and
        // removed the old zip
        return getIndexPath(appId, dataDir)
      })
      .then(function(indexPath) {
        // return path to index.html, but wait for loading bar animation to
        // complete
        return isSync ? indexPath : $timeout(function() { return indexPath }, 600)
      })
      .catch(function(error) {
        if (error !== null) {
          throw error
        }

        // index file not found
        return null
      })
  }

  function onProgress(progress) {
    // even with no connection there is still "work" to be done
    if (!progress.total || progress.total < 200) return

    if (progress.lengthComputable) {
      // Android returns double the correct amount for whatever reason
      var loaded = device.platform === 'Android' ? (progress.loaded / 2) : progress.loaded
      // update loading bar
      var percentage = (loaded / progress.total) * 0.9 // download is 90% unzip is 10%
      LoadingService.setPercentage(percentage)
      // console.log(loaded / progress.total)
    } else {
      LoadingService.fakeIncrement()
    }
  }

  // Promisified wrappers for File and Zip API callbacks --------------------//

  function removeFile(fileName, directory) {
    var d = $q.defer()
    directory.getFile(fileName, null, function(file) {
      file.remove(d.resolve, d.reject)
    }, d.reject)
    return d.promise
  }

  function unzipFiles(zipFile, destDir) {
    var d = $q.defer()
    zip.unzip(zipFile.toURL(), destDir, d.resolve)
    return d.promise
  }

  function downloadFiles(uri, filePath) {
    var d = $q.defer()
    var fileTransfer = new FileTransfer()
    fileTransfer.onprogress = onProgress
    fileTransfer.download(uri, filePath, d.resolve, d.reject, false, {})
    return d.promise
  }

  /*
   * files/files for Android and
   * Library/files for iOS
   */
  function getFilesDir() {
    var d = $q.defer()
    // just resolve it right away if we already know what it is
    if (_filesDir) {
      d.resolve(_filesDir)
    } else {
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dataDir) {
        dataDir.getDirectory('files', { create: true }, function(filesDir) {
          _filesDir = filesDir
          d.resolve(filesDir)
        }, d.reject)
      }, d.reject)
    }

    return d.promise
  }

  /*
   * Check root and www/ for index.html, resolve with path to index.html
   * reject with error.html if not found
   */
  function getIndexPath(appId, dataDir) {
    var d = $q.defer()
    var path1 = appId + '/www/index.html'
    var path2 = appId + '/index.html'
    var error = { path: 'error.html' }

    dataDir.getFile(path1, null, function() {
      d.resolve(dataDir.toURL() + path1)
    }, function() {
      // path1 not found, try path2
      dataDir.getFile(path2, null, function() {
        d.resolve(dataDir.toURL() + '/' + path2)
      }, function() {
        d.reject(error)
      })
    })

    return d.promise
  }

  function copyFile(srcPath, destPath, destName) {
    var d = $q.defer()

    window.resolveLocalFileSystemURL(srcPath, function(fileEntry) {
      window.resolveLocalFileSystemURL(destPath, function(dirEntry) {
        fileEntry.copyTo(dirEntry, destName || fileEntry.name, d.resolve, d.reject)
      }, d.reject)
    }, d.reject)

    return d.promise
  }
})
