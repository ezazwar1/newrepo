angular.module('ionic.viewApp.directives', [])

.directive('loadingBar', function(LoadingService) {
  return {
    restrict: 'E',
    replace: true,
    scope: true,
    template: '<div class="loading-bar"></div>',
    link: function(scope, element) {
      scope.progress = LoadingService.data
      scope.$watch('progress.percentage', function(value) {
        ionic.requestAnimationFrame(function() {
          element.css('width', value + '%')
        })
      })
    }
  }
})

// ngClass breaks $animate, so have separate elements for each class
// looks like the fix isn't in ionic yet
// https://github.com/angular/angular.js/issues/6674
//
// Also ng-show, ng-if, ng-switch are too finicky, so just animate our own directive
//
// Maybe a better way to do ensure that functions are called only after animations
// have run, seems like a weird mixing of view/controller logic
.directive('status', function($animate) {
  return {
    scope: {
      'active': '@'
    },
    link: function(scope, element) {
      var loadingIcon = element[0].querySelector('.loading-icon')

      scope.$watch('active', function(value) {
        if (value === 'true') {
          if (loadingIcon) {
            loadingIcon.style.display = 'block'
          }
          $animate.addClass(element, 'fade-active').then(function() {
            // if we have an intermediate loading state, wait at least until
            // the icon has animated in, even if load time is immediate
            //
            // Better/more proper way to do this than check class?
            if (element.hasClass('sync-loading-icon')) {
              // parent is popup
              scope.$parent.syncApp()
            } else if (element.hasClass('settings-loading-icon')) {
              // parent is settings modal
              scope.$parent.clearData()
            }
          })
        } else {
          $animate.removeClass(element, 'fade-active').then(function() {
            if (loadingIcon) {
              // don't have loading icons animating in background, go back to
              // display: none
              loadingIcon.style.display = ''
            }
          })
        }
      })
    }
  }
})
.directive('itemMdInput', function() {
  return {
    restrict: 'C',
    link: function($scope, $element) {
      var mdInput = $element[0].querySelector('.md-input')

      var dirtyClass = 'used'

      var reg = new RegExp('(\\s|^)' + dirtyClass + '(\\s|$)')

      // Here is our toggle function
      var toggleClass = function() {
        if (this.value === '') {
          this.className = mdInput.className.replace(reg, ' ')
        } else {
          this.classList.toggle(dirtyClass)
        }
      }
      // Here we are saying, on 'blur', call toggleClass, on mdInput
      ionic.on('blur', toggleClass, mdInput)
    }
  }
})

.directive('viewActionSheet', ['$document', function($document) {
  return {
    restrict: 'E',
    scope: true,
    replace: true,
    link: function($scope, $element) {

      var keyUp = function(e) {
        if (e.which == 27) {
          $scope.cancel();
          $scope.$apply();
        }
      };

      var backdropClick = function(e) {
        if (e.target == backdropEl) {
          $scope.cancel();
          $scope.$apply();
        }
      };
      var backdropEl = $element.children()[0]
      $scope.$on('$destroy', function() {
        $element.remove();
        $document.unbind('keyup', keyUp);
      });

      $document.bind('keyup', keyUp);
      //$element.bind('click', backdropClick);
      angular.element(backdropEl).bind('click', backdropClick);

    },
    template: '<div class="action-sheet-container">' +
                '<div class="action-sheet-backdrop">' +
                '</div>' +
                '<div class="action-sheet-wrapper">' +
                  '<div class="action-sheet" ng-class="{\'action-sheet-has-icons\': $actionSheetHasIcon}">' +
                    '<div class="action-sheet-group action-sheet-options">' +
                      '<div class="action-sheet-title" ng-if="titleText" ng-bind-html="titleText"></div>' +
                      '<button class="button action-sheet-option" ng-click="buttonClicked($index)" ng-class="b.className" ng-repeat="b in buttons" ng-bind-html="b.text"></button>' +
                      '<button class="button destructive action-sheet-destructive" ng-if="destructiveText" ng-click="destructiveButtonClicked()" ng-bind-html="destructiveText"></button>' +
                    '</div>' +
                    '<div class="action-sheet-group action-sheet-cancel" ng-if="cancelText">' +
                      '<button class="button" ng-click="cancel()" ng-bind-html="cancelText"></button>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
                '</div>' +
              '</div>'
  };
}])

.controller('$viewRefresher', [
  '$scope',
  '$attrs',
  '$element',
  '$ionicBind',
  '$timeout',
  function($scope, $attrs, $element, $ionicBind, $timeout) {
    var self = this,
        isDragging = false,
        isOverscrolling = false,
        dragOffset = 0,
        lastOverscroll = 0,
        ptrThreshold = 60,
        activated = false,
        scrollTime = 500,
        startY = null,
        deltaY = null,
        canOverscroll = true,
        scrollParent,
        scrollChild;

    if (!angular.isDefined($attrs.pullingIcon)) {
      $attrs.$set('pullingIcon', 'ion-android-arrow-down');
    }

    $scope.showSpinner = !angular.isDefined($attrs.refreshingIcon) && $attrs.spinner != 'none';

    $scope.showIcon = angular.isDefined($attrs.refreshingIcon);

    $ionicBind($scope, $attrs, {
      pullingIcon: '@',
      pullingText: '@',
      refreshingIcon: '@',
      refreshingText: '@',
      spinner: '@',
      disablePullingRotation: '@',
      $onRefresh: '&onRefresh',
      $onPulling: '&onPulling'
    });

    function handleMousedown(e) {
      e.touches = e.touches || [{
        screenX: e.screenX,
        screenY: e.screenY
      }];
      // Mouse needs this
      startY = Math.floor(e.touches[0].screenY);
    }

    function handleTouchstart(e) {
      e.touches = e.touches || [{
        screenX: e.screenX,
        screenY: e.screenY
      }];

      startY = e.touches[0].screenY;
    }

    function handleTouchend() {
      // reset Y
      startY = null;
      // if this wasn't an overscroll, get out immediately
      if (!canOverscroll && !isDragging) {
        return;
      }
      // the user has overscrolled but went back to native scrolling
      if (!isDragging) {
        dragOffset = 0;
        isOverscrolling = false;
        setScrollLock(false);
      } else {
        isDragging = false;
        dragOffset = 0;

        // the user has scroll far enough to trigger a refresh
        if (lastOverscroll > ptrThreshold) {
          start()
          scrollTo(ptrThreshold, scrollTime);

        // the user has overscrolled but not far enough to trigger a refresh
        } else {
          //scrollTo(0, scrollTime, deactivate); deactivate is called by setScrollLock
          scrollTo(0, scrollTime);
          isOverscrolling = false;
        }
      }
    }

    function handleTouchmove(e) {
      e.touches = e.touches || [{
        screenX: e.screenX,
        screenY: e.screenY
      }];

      // Force mouse events to have had a down event first
      if (!startY && e.type == 'mousemove') {
        return;
      }

      // if multitouch or regular scroll event, get out immediately
      if (!canOverscroll || e.touches.length > 1) {
        return;
      }
      //if this is a new drag, keep track of where we start
      if (startY === null) {
        startY = e.touches[0].screenY;
      }

      deltaY = e.touches[0].screenY - startY;

      // xwalk4lyfe
      // how far have we dragged so far?
      // kitkat fix for touchcancel events http://updates.html5rocks.com/2014/05/A-More-Compatible-Smoother-Touch
      // Only do this if we're not on crosswalk
      // if (ionic.Platform.isAndroid() && ionic.Platform.version() === 4.4 && !ionic.Platform.isCrosswalk() && scrollParent.scrollTop === 0 && deltaY > 0) {
      //   isDragging = true;
      //   e.preventDefault();
      // }

      // if we've dragged up and back down in to native scroll territory
      if (deltaY - dragOffset <= 0 || scrollParent.scrollTop !== 0) {

        if (isOverscrolling) {
          isOverscrolling = false;
          setScrollLock(false);
        }

        if (isDragging) {
          nativescroll(scrollParent, deltaY - dragOffset * -1);
        }

        // if we're not at overscroll 0 yet, 0 out
        if (lastOverscroll !== 0) {
          overscroll(0);
        }
        return;

      } else if (deltaY > 0 && scrollParent.scrollTop === 0 && !isOverscrolling) {
        // starting overscroll, but drag started below scrollTop 0, so we need to offset the position
        dragOffset = deltaY;
      }

      // prevent native scroll events while overscrolling
      // can't preventDefault because we're passive
      //e.preventDefault();

      // if not overscrolling yet, initiate overscrolling
      if (!isOverscrolling) {
        isOverscrolling = true;
        setScrollLock(true);
      }

      isDragging = true;
      // overscroll according to the user's drag so far
      overscroll((deltaY - dragOffset) / 3);

      // update the icon accordingly
      if (!activated && lastOverscroll > ptrThreshold) {
        activated = true;
        ionic.requestAnimationFrame(activate);

      } else if (activated && lastOverscroll < ptrThreshold) {
        activated = false;
        ionic.requestAnimationFrame(deactivate);
      }
    }

    function handleScroll(e) {
      // canOverscrol is used to greatly simplify the drag handler during normal scrolling
      canOverscroll = (e.target.scrollTop === 0) || isDragging;
    }

    function overscroll(val) {
      scrollChild.style[ionic.CSS.TRANSFORM] = 'translate3d(0px, ' + val + 'px, 0px)';
      lastOverscroll = val;
    }

    function nativescroll(target, newScrollTop) {
      // creates a scroll event that bubbles, can be cancelled, and with its view
      // and detail property initialized to window and 1, respectively
      target.scrollTop = newScrollTop;
      var e = document.createEvent("UIEvents");
      e.initUIEvent("scroll", true, true, window, 1);
      target.dispatchEvent(e);
    }

    function setScrollLock(enabled) {
      // set the scrollbar to be position:fixed in preparation to overscroll
      // or remove it so the app can be natively scrolled
      if (enabled) {
          scrollChild.classList.add('overscroll');
          show();
      } else {
          scrollChild.classList.remove('overscroll');
          hide();
          //deactivate();
      }
    }

    $scope.$on('scroll.refreshComplete', function() {
      // prevent the complete from firing before the scroll has started
      setTimeout(function() {
        // remove tail since we're hidden by navbar anyways
        //ionic.requestAnimationFrame(tail);

        // scroll back to home during tail animation
        //scrollTo(0, scrollTime, deactivate); scrollTo calls deactivate from setScrollLock
        scrollTo(0, scrollTime);

        // return to native scrolling after tail animation has time to finish
        //$timeout(function() {

          if (isOverscrolling) {
            isOverscrolling = false;
            //setScrollLock(false);
          }

        //}, scrollTime);

      }, scrollTime);
    });

    function scrollTo(Y, duration, callback) {
      // scroll animation loop w/ easing
      // credit https://gist.github.com/dezinezync/5487119
      var start = Date.now(),
          from = lastOverscroll;

      if (from === Y) {
        callback && callback();
        return; /* Prevent scrolling to the Y point if already there */
      }

      // decelerating to zero velocity
      function easeOutCubic(t) {
        return (--t) * t * t + 1;
      }

      // scroll loop
      function scroll() {
        //console.log("scroll")
        var currentTime = Date.now(),
          time = Math.min(1, ((currentTime - start) / duration)),
          // where .5 would be 50% of time on a linear scale easedT gives a
          // fraction based on the easing method
          easedT = easeOutCubic(time);

        overscroll(Math.floor((easedT * (Y - from)) + from));

        if (time < 1) {
          ionic.requestAnimationFrame(scroll);

        } else {

          if (Y < 5 && Y > -5) {
            isOverscrolling = false;
            setScrollLock(false);
          }

          callback && callback();
        }
      }

      // start scroll loop
      ionic.requestAnimationFrame(scroll);
    }


    var touchStartEvent, touchMoveEvent, touchEndEvent;
    if (window.navigator.pointerEnabled) {
      touchStartEvent = 'pointerdown';
      touchMoveEvent = 'pointermove';
      touchEndEvent = 'pointerup';
    } else if (window.navigator.msPointerEnabled) {
      touchStartEvent = 'MSPointerDown';
      touchMoveEvent = 'MSPointerMove';
      touchEndEvent = 'MSPointerUp';
    } else {
      touchStartEvent = 'touchstart';
      touchMoveEvent = 'touchmove';
      touchEndEvent = 'touchend';
    }

    self.init = function() {
      scrollParent = $element.parent().parent()[0];
      scrollChild = $element.parent()[0];

      if (!scrollParent || !scrollParent.classList.contains('ionic-scroll') ||
        !scrollChild || !scrollChild.classList.contains('scroll')) {
        throw new Error('Refresher must be immediate child of ion-content or ion-scroll');
      }

      // passive since we don't ever *need* to preventDefault in View
      scrollChild.addEventListener(touchStartEvent, handleTouchstart, { passive: true })
      scrollChild.addEventListener(touchMoveEvent, handleTouchmove, { passive: true })
      scrollChild.addEventListener(touchEndEvent, handleTouchend , { passive: true })
      scrollParent.addEventListener('scroll', handleScroll, { passive: true })
      ionic.on('mousedown', handleMousedown, scrollChild);
      ionic.on('mousemove', handleTouchmove, scrollChild);
      ionic.on('mouseup', handleTouchend, scrollChild);

      // cleanup when done
      $scope.$on('$destroy', destroy);
    };

    function destroy() {
      console.log("destroy")
      if ( scrollChild ) {
        ionic.off(touchStartEvent, handleTouchstart, scrollChild);
        ionic.off(touchMoveEvent, handleTouchmove, scrollChild);
        ionic.off(touchEndEvent, handleTouchend, scrollChild);
        ionic.off('mousedown', handleMousedown, scrollChild);
        ionic.off('mousemove', handleTouchmove, scrollChild);
        ionic.off('mouseup', handleTouchend, scrollChild);
      }
      if ( scrollParent ) {
        ionic.off('scroll', handleScroll, scrollParent);
      }
      scrollParent = null;
      scrollChild = null;
    }

    // DOM manipulation and broadcast methods shared by JS and Native Scrolling
    // getter used by JS Scrolling
    self.getRefresherDomMethods = function() {
      return {
        activate: activate,
        deactivate: deactivate,
        start: start,
        show: show,
        hide: hide,
        tail: tail
      };
    };

    function activate() {
      $element[0].classList.add('active');
      $scope.$onPulling();
    }

    function deactivate() {
      $element.removeClass('active refreshing')
      if (activated) activated = false;
    }

    function start() {
      $element[0].classList.add('refreshing');
      var q = $scope.$onRefresh();

      if (q && q.then) {
        q['finally'](function() {
          $scope.$broadcast('scroll.refreshComplete');
        });
      }
    }

    function show() {
      // showCallback
      $element[0].classList.remove('invisible');
    }

    function hide() {
      if (activated) activated = false;
      $element.removeClass('active refreshing')
        .addClass('invisible')
    }

    function tail() {
//      console.log("tail")
//      // tailCallback
//      $element[0].classList.add('refreshing-tail');
    }

    // for testing
    self.__handleTouchmove = handleTouchmove;
    self.__getScrollChild = function() { return scrollChild; };
    self.__getScrollParent = function() { return scrollParent; };
  }
])

.directive('viewRefresher', [function() {
  return {
    restrict: 'E',
    replace: true,
    require: ['?^$ionicScroll', 'viewRefresher'],
    controller: '$viewRefresher',
    template:
    '<div class="scroll-refresher invisible" collection-repeat-ignore>' +
      '<div class="ionic-refresher-content">' +
        '<div class="icon-pulling">' +
          '<i class="icon {{pullingIcon}}"></i>' +
        '</div>' +
        '<div class="icon-refreshing">' +
          '<view-spinner class="preloader"></view-spinner>' +
          '<i class="icon {{refreshingIcon}}"></i>' +
        '</div>' +
      '</div>' +
    '</div>',
    link: function($scope, $element, $attrs, ctrls) {

      // JS Scrolling uses the scroll controller
      var scrollCtrl = ctrls[0],
          refresherCtrl = ctrls[1];
      if (!scrollCtrl || scrollCtrl.isNative()) {
        // Kick off native scrolling
        refresherCtrl.init();
      } else {
        $element[0].classList.add('js-scrolling');
        scrollCtrl._setRefresher(
          $scope,
          $element[0],
          refresherCtrl.getRefresherDomMethods()
        );

        $scope.$on('scroll.refreshComplete', function() {
          $scope.$evalAsync(function() {
            scrollCtrl.scrollView.finishPullToRefresh();
          });
        });
      }
    }
  };
}])

.directive('viewSpinner', function() {
  return {
    restrict: 'E',
    template: '<span class="preloader-inner">' +
                 '<span class="preloader-inner-gap"></span>' +
                 '<span class="preloader-inner-left">' +
                   '<span class="preloader-inner-half-circle"></span>' +
                 '</span>' +
                 '<span class="preloader-inner-right">' +
                   '<span class="preloader-inner-half-circle"></span>' +
                 '</span>' +
               '</span>'
  };
})
