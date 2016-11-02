'use strict';

app.directive('wnPulse', function() {
  return {
    resrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('webkitAnimationIteration', function(e) {
        if (e.animationName == 'ring-animation') {
          element.css({
            top: Math.round(Math.random() * 80) + '%',
            left: Math.round(Math.random() * 80) + '%'
          });
          // var els = element.find('div');
          // for (var i = 0; i < els.length; i++ ) {
          //   var el = angular.element(els[i]);
          //   var a = el.attr('class') + '-animation 3s 1';
          //   el.css({
          //     '-webkit-animation': el.attr('class') + '-animation 3s 1'
          //   });
          // }
        }
      });
    }
  };
});
