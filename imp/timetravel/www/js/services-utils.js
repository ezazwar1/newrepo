angular.module('starter.services-utils', [])

.factory('Utils', function($localstorage) {
    var self = this;

    // -------------------------------------------------------------------------
    //
    // Formatting
    //
    // -------------------------------------------------------------------------
    
    //
    // $scope.timer $scope.timerFuture
    var mms, ms, h, s, m;
    self.normalizeTimeString = function(totalTime) {
        ms = totalTime/1000;
        h =  self.checkTime(Math.floor(ms / 3600), true);
        ms = Math.floor(ms % 3600);
        m = self.checkTime(Math.floor(ms / 60));
        ms = Math.floor(ms % 60);
        s = self.checkTime(Math.floor(ms));
        mms = totalTime - Math.floor(totalTime/1000)*1000;
        mms = self.checkTime(Math.floor(mms));
        return h + ":" + m + ":" + s + ":" + mms;
    };
    
    //
    // $scope.timeTravelled
    // todo: nanoseconds, seconds, etc.
    //
    var nbDigits = 0, nbDecimals = 0, timeTravelledRef = 0, timeTravelledNormalized = 0, timeTravelledMetric = "";
    var metric_large = "";
    self.normalizeTimeTravelled = function(timeTravelledMili, optShortUnit) {
        //
        // timeTravelled in Miliseconds
        // 1ms = Math.pow(10,6) nanoseconds
        // 1s  = Math.pow(10,9) nanoseconds
        
        //console.log(timeTravelledMili)
        
        // convert to seconds
        timeTravelledRef = (timeTravelledMili / Math.pow(10,6));

        nbDigits    = timeTravelledRef.toString().length; 
        nbDecimals  = -Math.floor( Math.log(timeTravelledRef) / Math.log(10) + 1); //timeTravelledNSStr.substr(timeTravelledNSStr.lastIndexOf('.')+1).length;
        
        //console.log(timeTravelledRef, "---", nbDigits, "---", nbDecimals);
        
        // 19       16      12      9       6       3       0    
        // Atto     Femto   Pico    Nano    Micro   Mili    S
        
        var Units = [
            {name:"plank",  short:"PL",     unit: 44},  
            {name:"1/1000 yocto",  short:"YO",     unit: 27}, 
            {name:"yocto",  short:"YO",     unit: 24},  
            {name:"zepto" , short:"ZE",     unit: 21}, 
            {name:"atto" ,  short:"AT",     unit: 18}, 
            {name:"femto" , short:"FE",     unit: 15}, 
            {name:"picto" , short:"PI",     unit: 12}, 
            {name:"nano" ,  short:"NA",     unit: 9}, 
            {name:"micro" , short:"MI",     unit: 6}, 
            {name:"mili" ,  short:"MS",     unit: 3}, 
            {name: "" ,     short:"SE",     unit: 0}]

        var u = 0;
        for (u=0; u<Units.length; u++) {
            if(Units[u].unit <= nbDecimals) {
                timeTravelledNormalized = timeTravelledRef * Math.pow(10, Units[u].unit+3);
                
                if(optShortUnit == true) {
                    timeTravelledMetric = Units[u].short;
                } else {
                    timeTravelledMetric = Units[u].name + "seconds";
                }

                break
            }
        }
        
        //console.log(u, Units[u], timeTravelledMetric)
        if (u >= Units.length) {
            timeTravelledNormalized = self.normalizeTimeString(timeTravelledMili);
            //timeTravelledNormalized = timeTravelledNormalized.substr(0, timeTravelledNormalized.length-3);
            timeTravelledMetric = "h:m:s:ms"
            metric_large = "(h:m:s:ms)";
        } else {
            metric_large = Units[u].name + "seconds";
            timeTravelledNormalized = timeTravelledNormalized.toFixed(2);
        }
        
        
        
        return {
            value: timeTravelledNormalized, 
            metric: timeTravelledMetric,
            metric_large: metric_large
        };
    };
    
    //
    // format 00
    // optThree: defines whether i can have three digits (like hours, but not minutes, seconds, miliseconds)
    var iStr;
    self.checkTime = function(i, optThree) {
        i = (i < 1) ? 0 : i;
        if (i < 10) { i = "0" + i; }  // add zero in front of numbers < 10
        if(optThree != true) {
            iStr = i.toString();
            if (iStr.length > 2) {iStr = iStr.substr(0,2); i=iStr;};
        };
        return i;
    };
    
    //
    //
    self.numDecimals = function(a) {
        return (a.toString().replace("0.", "").split("0").length - 1)
    };
    
    
    
    
    // -------------------------------------------------------------------------
    //
    // SHARE TEXT
    //
    // -------------------------------------------------------------------------
    
    self.translateTotalTime = function(totalTime) {
        
        //totalTime = "00:05:50:25"
        
        var nbHours = Number(totalTime.substr(0,2));
        var nbMinutes = Number(totalTime.substr(3,2));
        var nbSeconds = Number(totalTime.substr(6,2));
        
        var translatedString = nbSeconds;
        if(Math.ceil(nbSeconds) == 1) {
            translatedString = translatedString + " second"
        } else {
            translatedString = translatedString + " seconds"
        }
        
        
        if(nbMinutes > 0 && nbHours > 0) {
            translatedString =  nbHours + " hours, " + nbMinutes + " minutes and " + translatedString
        }
        
        if(nbMinutes <= 0 && nbHours > 0) {
            translatedString =  nbHours + " hours and " + translatedString
        }
        
        if(nbMinutes > 0 && nbHours <= 0) {
            translatedString =  nbMinutes + " minutes and " + translatedString
        }
        
        
        
        return translatedString;
    };
    
    self.generateShareText = function(shareType, movementVerb, totalTimeNormalized, timeTravelledValue, timeTravelledMetric) {
        var shareText = "";
        switch (shareType) {
            case "element":
                //
                //shareText = shareText + "I just " + movementVerb + " for " + self.translateTotalTime(totalTimeNormalized);
                //if (timeTravelledValue != "") {
                //    shareText = shareText + " of which I Time Travelled " + timeTravelledValue + " " + timeTravelledMetric;
                //}
                shareText = shareText + "I just time traveled " + timeTravelledValue + " " + timeTravelledMetric;
                break
            case "total":
                //
                shareText = shareText + "I have time traveled " + timeTravelledValue + " " + timeTravelledMetric;
                break
        };
        
        shareText = shareText + " with TimeTraveler - bit.ly/timetravelerapp"
        shareText = shareText + " #timetravel #app"
        return shareText;
    };
    
    
    
    
 
    return self;

});
