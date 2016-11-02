(function () {
  'use strict';
  MyApp.directive('ngSlideDown', [
    '$timeout',
    function ($timeout) {
      var getTemplate, link;
      link = function (scope, element, attrs) {
        var closePromise, duration, elementScope, emitOnClose, getHeight, hide, lazyRender, onClose, openPromise, show, timingFunction;
        duration = attrs.duration || 1;
        timingFunction = attrs.timingFunction || 'ease-in-out';
        lazyRender = attrs.lazyRender !== void 0;
        closePromise = null;
        openPromise = null;
        getHeight = function (passedScope) {
          var c, children, height, _i, _len;
          height = 0;
          children = element.children();

          for (_i = 0, _len = children.length; _i < _len; _i++) {
            c = children[_i];

            height += c.clientHeight;
          }
          return '' + height + 'px';
        };
        show = function () {
          if (closePromise) {
            $timeout.cancel(closePromise);
          }
          if (lazyRender) {
            scope.lazyRender = true;
          }
          return $timeout(function () {
            element.css({
              display: 'block'
            })
            $timeout(function() {
              element.css({
                overflow: 'hidden',
                transitionProperty: 'height',
                transitionDuration: '' + duration + 's',
                transitionTimingFunction: timingFunction,
                height: getHeight()
              });
            });
            return openPromise = $timeout(function () {
              element.css({
                overflow: 'visible',
                height: 'auto',
                transition: 'none'
              });
              return scope.$emit('animation:done');
            }, duration * 1000);
          });
        };
        hide = function () {
          if (openPromise) {
            $timeout.cancel(openPromise);
          }
          element.css({
            overflow: 'hidden !important',
            padding: '0',
            transitionProperty: 'height',
            transitionDuration: '' + duration + 's',
            transitionTimingFunction: timingFunction,
            height: '0px'
          });
          return closePromise = $timeout(function () {
            element.css({
              'display': 'none'
            });
          }, duration * 1000);
        };

        scope.$on('slide:show', function(value) {
          $timeout(show);
        });

        scope.$on('slide:hide', function(value) {
          if (value != null) {
            element.css({ height: getHeight() });
            element[0].clientHeight;
          }
          return $timeout(hide);
        });
      };
      return {
        restrict: 'A',
        link: link
      };
    }
  ]);

  MyApp
  .directive('focusMe', function($timeout, $parse) {
    return {
      //scope: true,   // optionally create a child scope
      link: function(scope, element, attrs) {
        var model = $parse(attrs.focusMe);
        scope.$watch(model, function(value) {
          if(value === true) {
            $timeout(function() {
              element[0].focus();
              if(cordova.plugins && cordova.plugins.Keyboard) cordova.plugins.Keyboard.show();
            });
          } else {
            setTimeout(function() {
              if(cordova.plugins && cordova.plugins.Keyboard) cordova.plugins.Keyboard.close();
            }, 10);
          }
        });
        // to address @blesh's comment, set attribute value to 'false'
        // on blur event:
        element.bind('blur', function() {
          console.log('blur');
          //scope.$apply(model.assign(scope, false));
        });
      }
    };
  });

}.call(this));
