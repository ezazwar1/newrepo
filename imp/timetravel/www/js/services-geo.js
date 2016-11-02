angular.module('starter.services-geo', [])

.factory('Geo', function($cordovaGeolocation, $q) {
    var self = this;
    
    self.getCurrentPosition = function() {
        var posOptions = {timeout: 10000, enableHighAccuracy: true};
        return $cordovaGeolocation.getCurrentPosition(posOptions);
    };
    
    
    var geoLatest = {};
    var geoLatestArray = [];
    var dGeoLatestSpeed = [];

    var iIter = 0, dIter = 0, xSpeed = -2;
    var INTERVAL_GPS_DELAY = 5;
    
    self.resetSpeed = function() {
        geoLatestArray = [];
        dGeoLatestSpeed = [];
        iIter = 0, dIter = 0, xSpeed = -2;
    };
    
    self.getSpeed = function() {
        
        
        //
        // get a new coordinate
        self.getCurrentPosition().then(
            function(position){
                
                // fill iIter
                geoLatest = {
                    lat: position.coords.latitude,
                    long: position.coords.longitude,
                    speed: position.coords.speed,
                    time: position.timestamp
                };
                
                geoLatestArray[iIter] = geoLatest;
                
                // fill dIter
                if(iIter > 0) {
                    dGeoLatestSpeed[dIter] = calculateSpeed(
                        geoLatestArray[iIter-1].lat,
                        geoLatestArray[iIter-1].long,
                        geoLatestArray[iIter].lat,
                        geoLatestArray[iIter].long,
                        geoLatestArray[iIter-1].time,
                        geoLatestArray[iIter].time);
                        
                        dIter = dIter+1;
                };
                
                // calculate speed
                if(iIter > INTERVAL_GPS_DELAY) {
                    xSpeed = self.calculateAverage(dGeoLatestSpeed, INTERVAL_GPS_DELAY)//avg
                    
                    // splice arrays
                    //geoLatestArray.splice(0,1);
                    //iIter = iIter - 1;
                } else {
                    xSpeed = -1; // initializingl
                };
                
                
                
                // splice dIter
                if(dIter > INTERVAL_GPS_DELAY) {
                   dGeoLatestSpeed.splice(0, 1);
                   geoLatestArray.splice(0,1);
                   dIter = dIter -1;
                   iIter = iIter - 1;
                }
                
                
                iIter = iIter + 1;
                
                //console.log(geoLatestArray);
                //console.log(dGeoLatestSpeed);
                
            }, function(error){
                // todo
                xSpeed = -1;
                console.log(error);
            }
        )
        
        //
        // fn proceed
        // if at least 5 data samples, calculate average speed (rolling window)
        
        
        
        
        return xSpeed.toPrecision(4);
    };
    
    
    //
    // avg from array
    var xaSum = 0, xaAvg = 0, xaN = 0, xaT = 0;
    self.calculateAverage = function(a, k) {
        //console.log("calculating average", a, k)
        xaN = a.length;
        xaT = 0;
        xaSum = 0;
        for(var i = 0; i <= k; i++ ){
            if(isNaN(parseFloat(a[xaN-i-1])) == false) {
                xaSum = xaSum + parseFloat(a[xaN-i-1]); //don't forget to add the base
                xaT = xaT + 1;
            }
        };
        if(xaT >= 1) {
            xaAvg = xaSum/xaT;
        } else {
            xaAvg = -1
        }
        //console.log(xaSum, xaT, xaAvg);
        return xaAvg;
    };

    
    //
    // 
    var xDist = 0, dTime = 0;
    function calculateSpeed(lat1, lon1, lat2, lon2, t1, t2) {
        
        dTime = (t2-t1)/1000;      // miliseconds > second
        xDist = calculateDistance(lat1, lon1, lat2, lon2)*1000;  // km > m
        
        return xDist/dTime; // m/s
    };
    
    //
    // http://www.html5rocks.com/en/tutorials/geolocation/trip_meter/
    function calculateDistance(lat1, lon1, lat2, lon2) {
        var R = 6371; // km
        var dLat = (lat2 - lat1).toRad();
        var dLon = (lon2 - lon1).toRad(); 
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
        var d = R * c; // distance in km http://stackoverflow.com/a/27943/4262057
        return d;
    };
    
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }

    return self;
});
