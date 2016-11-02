"use strict";

 angular.module("config", [])

.constant("ENV", {
  "clientId": "zinkSatIpad",
  "firebaseAppScopeName": "sat_app",
  "name": "production",
  "apiEndpoint": "https://api.zinkerz.com/",
  "fbEndpoint": "https://znk-prod.firebaseio.com/",
  "videosEndpoint": "http://d1qqqwawt7o27r.cloudfront.net/",
  "gaTrackingId": "UA-58469239-5",
  "atatusApiKey": "c2a8fe8e7019478badb6db414cb23a04",
  "debug": false,
  "enableAnalytics": true
})

;