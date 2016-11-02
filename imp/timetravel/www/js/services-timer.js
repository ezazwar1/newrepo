angular.module('starter.services-timer', [])

.factory('Timer', function() {
    var self = this;
    
    // -------------------------------------------------------------------------
    //
    // Calculations and handling
    //
    // -------------------------------------------------------------------------
    
    //
    // start a new watch
    var timeStart = 0, timeEnd = 0;
    self.initTimeStart =function() {
        var today = new Date();
        timeStart = today.getTime();
    };
    
    //
    // time difference between intervals
    self.calculateTimeDifference = function(optTimeStart) {
        //console.log(optTimeStart, timeStart)
        if(optTimeStart != undefined && optTimeStart != null) {
            timeStart = optTimeStart;
        };
        var today = new Date();
        timeEnd = today.getTime();
        var timeDiff = timeEnd-timeStart;
        timeStart = timeEnd;
        return timeDiff;
    };
    
    //
    // using time dilation, calculate time in future
    self.calculateTimeFuture = function(totalTimeFuture, timeDiff, timeDilation) {
        return totalTimeFuture + (timeDiff * timeDilation);
    };
    
    
    
    
    
    
    //
    // rounding errors persist
    self.calcTimeDilationOld = function(userVelocity, totalTimeFuture, totalTime, timeDiff) {
        var xDiv    = (Math.pow(userVelocity, 2))/(Math.pow(SPEED_OF_LIGHT_MS, 2)); 
        var gamma   = 1/(Math.sqrt(1-xDiv)); 
        
        totalTimeFuture = totalTime * gamma;
        var timeTravelled = totalTimeFuture - totalTime;
     
        return {
            totalTime: totalTime,
            totalTimeFuture: totalTimeFuture,
            timeTravelled: timeTravelled
        };   
    };
    
    
    
    //
    // in m/s
    // http://hyperphysics.phy-astr.gsu.edu/hbase/relativ/tdil.html
    //
    //
    // comparison (not used)
    // var gamma = 1, xDiv = 0;
    // xDiv    = (Math.pow(userVelocity, 2))/(Math.pow(SPEED_OF_LIGHT_MS, 2)); 
    // gamma   = 1/(Math.sqrt(1-xDiv)); 

    var xVel, xSpeed, x1, xBottomPart, xBottomMinus, xGamma;
    var yTotalTime, yTotalTimeFuture, yTimeDiff, dTotalTimeFuture, deltaFuture, deltaTime;
    
    var prevTotalTimeFuture     = new BigNumber(0), prevTotalTime       = new BigNumber(0);
    var totalTotalTimeFuture    = new BigNumber(0), totalTimeTravelled  = new BigNumber(0);
    
    self.calcTimeDilation = function(userVelocity, totalTimeFuture, totalTime, timeDiff) {

        // config mode
        BigNumber.config({ DECIMAL_PLACES: 50, ROUNDING_MODE: 4 })
        
        
        
        // calculate time dilation
        xVel                = new BigNumber(userVelocity.toFixed(14));
        xSpeed              = new BigNumber(SPEED_OF_LIGHT_MS);
        x1                  = new BigNumber(1);
        xBottomPart         = xVel.toPower(2).dividedBy(xSpeed.toPower(2));
        xBottomMinus        = x1.minus(xBottomPart); 
        xGamma              = x1.dividedBy(xBottomMinus.squareRoot());
        
        //console.log(userVelocity)
        
        // init absolute differences 
        yTotalTime          = new BigNumber(totalTime.toFixed(15));
        yTotalTimeFuture    = new BigNumber(totalTimeFuture.toFixed(15));
        yTimeDiff           = new BigNumber(timeDiff);
        
        dTotalTimeFuture    = yTimeDiff.times(xGamma);
        yTotalTimeFuture    = yTotalTime.times(xGamma); 
        
        // calculate delta differences
        deltaFuture = yTotalTimeFuture.minus(prevTotalTimeFuture);
        deltaTime   = yTotalTime.minus(prevTotalTime);
        
        // set output
        totalTotalTimeFuture    = yTotalTimeFuture;//totalTotalTimeFuture.plus(deltaFuture);
        totalTimeTravelled      = yTotalTimeFuture.minus(yTotalTime);//totalTimeTravelled.plus(deltaFuture).minus(deltaTime);
        
        // update
        prevTotalTimeFuture = yTotalTimeFuture; 
        prevTotalTime       = yTotalTime; 

        return {
            totalTime:          totalTime,
            totalTimeFuture:    parseFloat(totalTotalTimeFuture.round(15).toString()),
            timeTravelled:      parseFloat(totalTimeTravelled.round(15).toString())
        };
    };
    
    
    
    
    
    

    return self;
});
