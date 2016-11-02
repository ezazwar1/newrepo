'use strict';

// Mix in underscore.string to Underscore namespace
_.mixin(_.str.exports());

function CustomMarker(latlng, map) {
  this.latlng = latlng;
  this.setMap(map);
}

// Custom workplace Google Maps marker

CustomMarker.prototype = new google.maps.OverlayView();

CustomMarker.prototype.setPosition = function(latlong) {
  this.latlng = latlong;
  var that = this;
  //window.setTimeout(function() {
    that.draw();
  //}, 100);
};

CustomMarker.prototype.setEta = function(eta) {
  if (eta < 60) {
    this.eta = 1;  // 1 min
  }
  else {
    this.eta = Math.round(eta / 60);
  }
  var that = this;
  //window.setTimeout(function() {
    that.draw();
  //}, 100);
};

CustomMarker.prototype.draw = function() {
  var that = this;
  var div = this.div;

  if (!div) {
    div = this.div = document.createElement('div');
    var panes = this.getPanes();
    if(panes) panes.overlayImage.appendChild(div);
  }

  var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
  if (point) {
    div.style.left = point.x - 21 + 'px';
    div.style.top = point.y - 52 + 'px';
  }

  if (this.eta !== undefined) {
    div.className = 'workplace-marker';
    div.innerHTML = '<div class="eta-mins">' + this.eta + '<em>min</em></div><div class="eta-footer">away</div>';
  }
  else {
    div.className = 'workplace-marker-na';
    div.innerHTML = '<i class="ion-ios7-clock-outline"></i>';
  }
};

CustomMarker.prototype.remove = function() {
  if (this.div) {
    this.div.parentNode.removeChild(this.div);
    this.div = null;
  }
};

var app = angular.module('WorkNinja', [
  'ionic',
  'ngResource',
  'http-auth-interceptor',
  'pubnub.angular.service',
  'ratings',
  'toaster',
  'ui.utils',
  'ngAnimate',
  'ngTouch',
  'ui.bootstrap.typeahead',
  'ng-mfb'
]);

