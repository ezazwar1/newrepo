angular.module('ionic.viewApp.services')

.factory('LoadingService', function($rootScope, $document, $compile, $animate, $q, $timeout, $ionicTemplateLoader, $ionicPlatform) {
  var animation = 'custom-fade-in'
  var element, scope, pendingAnimation
  var updateInProgress = false
  var isShowing = false
  var data = {
    percentage: 0
  }

  var loadingPromise = $ionicTemplateLoader.load('templates/loadingscreen.html').then(
    function(templateString) {
      scope = $rootScope.$new(true)
      element = $compile(templateString)(scope)
    }
  )

  // $animate uses raf which doesn't fire until the window is visible
  // again, so for the case of hiding after the iab is showing, just
  // remove the class directly, since we can't see the animation anyways
  document.addEventListener('visibilitychange', function(e) {
    if (document.hidden && pendingAnimation) {
      $animate.cancel(pendingAnimation)
      pendingAnimation = null
      data.percentage = 0
      element[0].classList.remove('custom-fade-in')
    }
  })

  return {
    show: show,
    hide: hide,
    toggleLoadingBar: toggleLoadingBar,
    setPercentage: setPercentage,
    fakeIncrement: fakeIncrement,
    data: data
  }

/* -------------------------------------------------------------------------- */

  function show(showLoadingBar) {
    scope.showLoadingBar = showLoadingBar

    registerBackButton()

    isShowing = true

    if (!element.parent().length) {
      $document[0].body.appendChild(element[0])
      // sometimes if you hit View right after opening a popup for the first
      // time the loading screen opens, closes and re-opens. So try and let
      // things settle before resolving the promise.
      return $timeout(function() {
        return $animate.addClass(element, animation)
      }, 200)
    }

    return $animate.addClass(element, animation)
  }

  function hide() {
    if (!isShowing) return
    isShowing = false

    return loadingPromise.then(function() {
      if (ionic.Platform.isWebView()) cordova.plugins.Keyboard.close()

      deregisterBackButton && deregisterBackButton()

      // $animate uses raf which doesn't fire until the window is visible
      // again, so for the case of hiding after the iab is showing, just
      // remove the class directly, since we can't see the animation anyways
      if (document.hidden) {
        element && element[0].classList.remove('custom-fade-in')
        pendingAnimation = null
        $timeout(function() {
          data.percentage = 0
        })
        return
      }

      pendingAnimation = $animate.removeClass(element, animation)
      return pendingAnimation.then(function() {
        pendingAnimation = null
        $timeout(function() {
          data.percentage = '0'
        })
      })
    })
  }

  function toggleLoadingBar(show) {
    scope.showLoadingBar = show
  }

  function setPercentage(value) {
    if (updateInProgress) return

    if (value === 1) {
      data.percentage = '100'
      updateInProgress = false
      return
    }

    updateInProgress = true
    $timeout(function() {
      data.percentage = Math.round(value * 100).toString()
      updateInProgress = false
    }, 100)
  }

  function fakeIncrement() {
    data.percentage = (parseInt(data.percentage) + 1).toString()
    // scope.$digest()
  }

/* -------------------------------------------------------------------------- */

  function registerBackButton() {
    deregisterBackButton = $ionicPlatform.registerBackButtonAction(hide, 501)
  }
})
