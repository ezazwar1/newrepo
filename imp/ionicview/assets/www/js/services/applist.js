angular.module('ionic.viewApp.services')

/*
 * Service that provides access to a cached list of objects representing the
 * user's Ionic apps that have been uploaded to the dashboard.  Backed up by
 * localStorage so the list will persist across app sessions, but is cleared
 * on logout.
 */
.factory('AppListService', function($rootScope, $q, $timeout, $http, $httpBackend, HOST_NAME) {
  var appList = localStorage['appList']
  var appListOrdered = {}
  if (appList) {
    try {
      appList = JSON.parse(appList, reviveDate)
    } catch (e) {
      // console.error('JSON parse error:', e)
      appList = {}
    }
  } else {
    appList = {}
  }
  saveAppList()

  return {

    /*
     * Dictionary of App objects, stored by appId.
     */
    get appList() { return appList },

    /*
     * Array of App objects, ordered by last_modified.
     */
    get appListOrdered() { return appListOrdered },

    /*
     * @name setLoaded
     * @description
     * Set the 'loaded' of one (if appId is provided) or all Apps to true.
     * Also updates 'last_modified' to 'server_last_modified' and saves
     * the updated app list to localStorage.
     *
     * @param {string=} appId - id of the App whose loaded property should be
     * set to true.
     */
    setLoaded: setLoaded,

    /*
     * @name clearLoaded
     * @description
     * Set the 'loaded' of one (if appId is provided) or all Apps to false.
     *
     * @param {string=} appId - id of the App whose loaded property should be
     * set to false.
     */
    clearLoaded: clearLoaded,

    /*
     * @name updateAppFromServer
     * @description
     * Update an App from the server
     *
     * @param {string=} appId - id of the App to update.
     */
    updateAppFromServer: updateAppFromServer,

    /*
     * @name updateAppListFromServer
     * @description
     * Update all apps from the server
     */
    updateAppListFromServer: updateAppListFromServer,

    /*
     * @name saveAppList
     * @description
     * Saves the list of apps to localStorage.
     */
    saveAppList: saveAppList,

    /*
     *
     */
    deleteApp: deleteApp
  }

  function setLoaded(appId) {
    var app = appList[appId]
    if (app) {
      app.loaded = true
      app.last_modified = app.server_last_modified

      appList[appId] = app

      saveAppList()
    }
  }

  function clearLoaded(appId) {
    var app
    if (appId) {
      app = appList[appId]
      if (app) {
        app.loaded = false
        appList[appId] = app
      }
    } else {
      var keys = Object.keys(appList)

      for (var i = 0; i < keys.length; i++) {
        appId = keys[i]
        app = appList[appId]
        app.loaded = false

        appList[appId] = app
      }
    }

    saveAppList()
  }

  function saveAppList() {
    sortByServerLastModified(appList)
    localStorage['appList'] = JSON.stringify(appList)
    ionic.Platform.ready(function() {
      if (ionic.Platform.isWebView()) LocalStorageBackup.save('View')
    })
  }

  function sortByServerLastModified(appList) {
    var tempArray = []
    for (var key in appList) {
      tempArray[tempArray.length] = appList[key]
    }
    tempArray.sort(function(a, b) {
      var dateA = a.server_last_modified
      var dateB = b.server_last_modified
      if (dateA < dateB) return 1
      if (dateA > dateB) return -1
      return 0
    })
    appListOrdered = tempArray
  }

  function deleteApp(appId) {
    var d = $q.defer()

    $httpBackend(
      'DELETE',
      HOST_NAME + '/api/v1/apps/' + appId,
      undefined,
      responseHandler,
      {
        Accept: 'application/json, text/plain, */*',
        Authorization: 'Token ' + localStorage.authToken
      }
    )

    function responseHandler(status, data) {
      if (status >= 400 || status <= 0) {
        return d.reject({
          status: status
        })
      }

      delete appList[appId]
      saveAppList()
      return d.resolve()
    }

    return d.promise
  }

/* -------------------------------------------------------------------------- */

  function updateAppFromServer(appId) {
    var d = $q.defer()

    $httpBackend(
      'GET',
      HOST_NAME + '/api/v1/apps/' + appId,
      undefined,
      responseHandler,
      {
        Accept: 'application/json, text/plain, */*',
        Authorization: 'Token ' + localStorage.authToken
      }
    )

    function responseHandler(status, data) {
      if (status >= 400 || status <= 0) {
        return d.reject({
          status: status
        })
      }
      try {
        var appData = JSON.parse(data)
      } catch (e) {
        return d.reject({
          msg: "Malformed server response."
        })
      }
      var app = new App(appData)
      appList[app.appId] = app
      saveAppList()
      return d.resolve(app)
    }

    return d.promise
  }

  function updateAppListFromServer(deferSave) {
    var d = $q.defer()
    $httpBackend(
      'GET',
      HOST_NAME + '/api/v1/apps',
      undefined,
      responseHandler,
      {
        Accept: 'application/json, text/plain, */*',
        Authorization: 'Token ' + localStorage.authToken
      }
    )
    function responseHandler(status, data) {
      if (status >= 400 || status <= 0) {
        return d.reject({
          status: status
        })
      }
      try {
        var appData = JSON.parse(data)
      } catch (e) {
        return d.reject({
          msg: "Malformed server response."
        })
      }
      var newAppList = {}
      var app

      for (var i = 0; i < appData.length; i++) {
        app = appData[i]
        // ignore apps with no project associated with them
        if (app.size === 0 || app.url === '') continue
        app = new App(app)
        if (!app.deleted) newAppList[app.appId] = app
      }
      appList = newAppList
      if (deferSave) {
        $timeout(function() {
          saveAppList()
        }, 1000)
      } else {
        saveAppList()
      }
      return d.resolve(appList)
    }

    return d.promise
  }

  function reviveDate(key, value) {
    if (key === 'last_modified' ||
          key === 'server_last_modified') {
      return new Date(value)
    } else {
      return value
    }
  }

/* -------------------------------------------------------------------------- */

  /*
   * Creates a new App.
   *
   * @param {Object} appResponse - JSON response from the server.
   * @class
   */
  function App(appResponse) {
    this.name = appResponse.name
    this.appId = appResponse.app_id
    this.server_last_modified = new Date(appResponse.last_modified)
    this.url = appResponse.url
    this.size = appResponse.size

    var previousApp = appList[this.appId]
    if (previousApp) {
      this.loaded = previousApp.loaded
      this.last_modified = previousApp.last_modified
    } else {
      this.loaded = false
      this.last_modified = this.server_last_modified
    }
  }
})
