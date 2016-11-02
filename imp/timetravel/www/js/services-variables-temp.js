angular.module('starter.services-variables', [])

.factory('Variables', function($localstorage) {
    
    
    // -------------------------------------------------------------------------
    //
    // CUSTOMSPEEDS
    //
    // -------------------------------------------------------------------------
    
    var cityLimit = Math.ceil(30/MPH_IN_KMH);
    var CustomSpeeds = [
        {   text: "Walking",        icon: "ion-android-walk",        
            speed: 5,           
            buttonCSS: "customspeed", 
            description: "",
            movementVerb: "walked"
        },
        {   text: "Running",        icon: "ion-android-walk",         
            speed: 10,          
            buttonCSS: "customspeed",
            description: "",
            movementVerb: "ran"
        },
        {   text: "Biking",         icon: "ion-android-bicycle",     
            speed: Math.ceil(15/MPH_IN_KMH),          
            buttonCSS: "customspeed",
            description: "",
            movementVerb: "biked"
        },
        {   text: "Car city",       icon: "ion-android-car",         
            speed: Math.ceil(30/MPH_IN_KMH),          
            buttonCSS: "customspeed",
            description: "",
            movementVerb: "drove a car"
        },
        {   text: "Subway",        icon: "ion-android-subway",         
            speed: Math.ceil(35/MPH_IN_KMH),            // http://www.metropolitanwalks.com/blog/train-speeds-do-path-and-ny-subway-measure-up/ 
            buttonCSS: "customspeed",
            description: "",
            movementVerb: "took the subway"
        },
        {   text: "Car highway",    icon: "ion-android-car",      
            speed: Math.ceil(60/MPH_IN_KMH),         
            buttonCSS: "customspeed",
            description: "",
            movementVerb: "drove a car"
        }, 
        {   text: "Train",          icon: "ion-android-train",      
            speed: Math.ceil(151/MPH_IN_KMH),       // http://www.cbsnews.com/news/high-speed-rail-could-get-new-train-routes-california-texas/    
            buttonCSS: "customspeed",
            description: "",
            movementVerb: "took the train"
        },    
        {   text: "Plane",          icon: "ion-plane",              
            speed: Math.ceil(550/MPH_IN_KMH),       // https://en.wikipedia.org/?title=Boeing_747 
            buttonCSS: "customspeed",
            description: "",
            movementVerb: "took the plane"
        },    
        {   text: "Felix Baumgartner",    icon: "ion-arrow-down-c",             
            speed: Math.ceil(844/MPH_IN_KMH),      //  http://www.redbullstratos.com/the-mission/world-record-jump/
            buttonCSS: "customspeed",
            description: "Felix Baumgartner broke the speed of sound jumping from the stratosphere, which makes him the first to break this metric in freefall",
            link: "http://www.redbullstratos.com/the-mission/world-record-jump/",
            movementVerb: "jumped from the stratosphere"
        },
        {   text: "Bloodhound SSC",    icon: "ion-edit",             
            speed: Math.ceil(1000/MPH_IN_KMH),      //  http://www.wired.com/2014/12/bloodhound-ssc-1000-mph/
            buttonCSS: "customspeed",
            description: "Bloodhound SSC is a supersonic land vehicle in development with as goal to match or exceed 1,000 miles per hour (1,609 km/h)",
            link: "http://www.wired.com/2014/12/bloodhound-ssc-1000-mph/",
            movementVerb: "drove the Bloodhound SSC"
        },  
        {   text: "F-22 Raptor",    icon: "ion-jet",             
            speed: Math.ceil(1500/MPH_IN_KMH),      //  http://www.redbullstratos.com/the-mission/world-record-jump/
            buttonCSS: "customspeed",
            description: "The Lockheed Martin F-22 Raptor is a twin-engine all stealth tactical fighter aircraft, developed for the United States Air Force (USAF), with a top speed of mach 2.25.",
            link: "http://jets.wikia.com/wiki/F-22_Raptor",
            movementVerb: "drove the Bloodhound SSC"
        },  
        {   text: "Virgin Galactic",    icon: "ion-paper-airplane",             
            speed: Math.ceil(2485/MPH_IN_KMH),      // https://en.wikipedia.org/wiki/Virgin_Galactic 
            buttonCSS: "customspeed",
            description: "Virgin Galactic is developing commercial spacecrafts, of which one will provide suborbital spaceflights to space tourist.",
            link: "http://www.virgingalactic.com/",
            movementVerb: "flew on the Virgin Galactic"
        },  
        {   text: "GPS Satellite",      icon: "ion-planet",             
            speed: Math.ceil(14000),     // http://science.nationalgeographic.com/science/space/solar-system/orbital/
            buttonCSS: "customspeed",
            description: "GPS satellites move at 0.001 percent the speed of light, which results that they experience a slight time dilation, making their clocks run slower relative to one at rest on the ground.",
            link: "http://www.wired.com/2014/02/happy-anniversary-gps/",
            movementVerb: "orbited on a GPS satellite"
        },    
        {   text: "Orbit",          icon: "ion-earth",              
            speed: Math.ceil(67000/MPH_IN_KMH),                          // https://en.wikipedia.org/wiki/Earth's_orbit
            buttonCSS: "customspeed",
            description: "Earth's orbit is the path in which the Earth travels around the Sun. What would happen to us if a giant space finger were to gently stop the Earth in its orbit?",
            link: "http://www.wired.com/2014/12/empzeal-earthfall/",
            movementVerb: "simulated the Earth's orbit"
        },    
        {   text: "Santa Claus",          icon: "ion-cube",          
            speed: 10703437,                      //99% lightspeed
            buttonCSS: "customspeed",
            description: "Santa Claus delivers presents to all the good children in the world at a speed of 1,800 miles per second, all night. He also uses a present-launcher to shoot gifts down chimneys",
            link: "http://www.telegraph.co.uk/topics/christmas/8188997/The-science-of-Christmas-Santa-Claus-his-sleigh-and-presents.html",
            movementVerb: "delivered presents to all good children in the world as a Santa Claus"
        }, 
        {   text: "Light",                icon: "ion-lightbulb",          
            speed: 1079250000,                      //99% lightspeed
            buttonCSS: "customspeed",
            description: "Light travels at a constant, finite speed. A traveler, moving at the speed of light, would circum-navigate the equator 7.5 times in one second.",
            link: "https://www.youtube.com/watch?v=au5i1Bw725o",
            movementVerb: "travelled at the speed of light"
        }, 
        {   text: "Custom",                icon: "ion-person",          
            speed: 0,                      //99% lightspeed
            buttonCSS: "customspeed",
            description: "",
            movementVerb: "moved"
        }, 
    ];
    
    self.getCustomSpeeds = function() {
        return CustomSpeeds;
    }
    
    // -------------------------------------------------------------------------
    //
    // METRICS
    // $scope.metricObj = Variables.changeMetric();
    // -------------------------------------------------------------------------
    
    
    
    //
    self.getMetric = function() {
        return Metric;
    };
    
    //
    self.changeMetric = function() {
        if(Metric.choice == Metric["options"].us) {
            Metric.choice = Metric["options"].eu
        } else {
            Metric.choice = Metric["options"].us
        }
        $localstorage.setObject("Metric", Metric);
    };
    
    
    // -------------------------------------------------------------------------
    //
    // SPEED
    //
    // -------------------------------------------------------------------------

    
    var Speed = $localstorage.getObject("Speed", '{}');
    if(!Speed.hasOwnProperty("ms")) {
        Speed = {
            customSpeedIndex:   2,
            kmh:                self.getCustomSpeedValue(Speed.customSpeedIndex),
            ms:                 Speed.kmh/3.6,
            mph:                Speed.kmh*MPH_IN_KMH,
        }
    }
    
    //
    // @param: customSpeedIndex
    self.updateSpeed = function(customSpeedIndex) {
        Speed = {
            customSpeedIndex:   customSpeedIndex,
            kmh:                self.getCustomSpeedValue(Speed.customSpeedIndex),
            ms:                 Speed.kmh/3.6,
            mph:                Speed.kmh*MPH_IN_KMH,
        }
        return Speed;
    };
    
    
    
    
    // -------------------------------------------------------------------------
    //
    // Time
    //
    // -------------------------------------------------------------------------
    
    
    
    // -------------------------------------------------------------------------
    //
    // TIMEOUT
    //
    // -------------------------------------------------------------------------
    
    // ** temp refresh
    //$localstorage.setObject("timeOutObj", '{}');
    
    //
    // init
    //
    var timeOutObjINIT = {
        "timerState": "stop",
        "timeOutMode":  false,
        "timeOutStartDate": null,
        "totalTimeObj": {totalTime: 0, totalTimeFuture: 0, timeTravelled: 0},
    }
    var timeOutObjSTORAGE = $localstorage.getObject("timeOutObj", "{}");
    
    if(timeOutObjSTORAGE.hasOwnProperty("timeOutMode")) {
        var timeOutObj = timeOutObjSTORAGE;     console.log("storage")
    } else {
        var timeOutObj = timeOutObjINIT;        console.log("init")
    }
  
  
    //
    // part 0
    //
    self.getTimeOutObj = function() {
        return timeOutObj;
    };

    //
    // part 1
    //
    self.startTimeOut = function() {
        
        var timeOutStartDate = new Date(); timeOutStartDate = timeOutStartDate.getTime();
        
        timeOutObj["timeOutMode"]       = true;
        
        if(timeOutObj["timerState"] == "run") {
            timeOutObj["timeOutStartDate"]  = timeOutStartDate;
        }
        
        // will save also totalTimeObj (which is temporarily rendered only)
        $localstorage.setObject("timeOutObj", timeOutObj);
        
        return timeOutObj;
    };
    
    self.endTimeOut = function() {
        
        timeOutObj["timeOutMode"] = false;
        timeOutObj["timeOutStartDate"] = null;
 
        $localstorage.setObject("timeOutObj", timeOutObj);
        
        return timeOutObj;
    };
    
    //
    // part 2 (data storage)
    //
    
    //
    //
    self.setTimeOutField = function(fieldName, fieldValue) {
        timeOutObj[fieldName] = fieldValue;
        $localstorage.setObject("timeOutObj", timeOutObj);
        return timeOutObj;
    };
    
    self.setTempTimeOutField = function(fieldName, fieldValue) {
        timeOutObj[fieldName] = fieldValue;
    };
    
    
    
    
    
    
 
    return self;

});
