angular.module('ionic.viewApp.controllers', [])

.controller('AccountCtrl', function($scope, $document, $state, $ionicPlatform) {
  var numBacks = 0
  var backButtonTimer = null
  var deregisterBackButton = null
  $scope.goToSignup = goToSignup
  $scope.goToLogin = goToLogin

/* -------------------------------------------------------------------------- */

  $scope.$on('$ionicView.enter', onEnter)

  $scope.$on('$ionicView.leave', function() {
    deregisterBackButton && deregisterBackButton()
  })

/* -------------------------------------------------------------------------- */

  function onEnter() {
    registerBackButton()
    ionic.Platform.ready(function() {
      // either exited from app or first run
      if (typeof localStorage.ionicView === 'undefined') {
        if (ionic.Platform.isWebView()) {
          // clear any potentially app defined values
          localStorage.clear()
          LocalStorageBackup.load('View', function() {
            // first run
            if (typeof localStorage.ionicView === 'undefined') {
              localStorage.showSwipeInfo = true
              localStorage.isAuthenticated = false
              localStorage.ionicView = true
            }
            checkAuth()
          })
        } else { // first run
          localStorage.showSwipeInfo = true
          localStorage.isAuthenticated = false
          localStorage.ionicView = true
          checkAuth()
        }
      } else {
        checkAuth()
      }
    })
  }

  function goToSignup() {
    $state.go('SignupView')
  }

  function goToLogin() {
    $state.go('LoginView')
  }

  function checkAuth() {
    if (localStorage.isAuthenticated === 'true') {
      $state.go('UserAppsView')
    } else {
      ionic.Platform.ready(function() {
        if (ionic.Platform.isWebView()) navigator.splashscreen.hide()
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
