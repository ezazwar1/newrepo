angular.module('starter.services-variables', [])

.factory('Variables', function($localstorage, Utils) {
    
    
    // big reset
    //$localstorage.setObject("TransModes", '{}');
    //$localstorage.setObject("Metric", '{}');
    //$localstorage.setObject("Speed", '{}');
    //
    
    
    var Speed = {}; 
    var SpeedLS = $localstorage.getObject("Speed", "{}");
    var Metric = {}; 
    var MetricLS = $localstorage.getObject("Metric", "{}");
    var TimerData = {}; 
    var TimerDataLS = $localstorage.getObject("TimerData", "{}");
    
    // -------------------------------------------------------------------------
    //
    // CUSTOMSPEEDS
    //
    // -------------------------------------------------------------------------
    
    var cityLimit = Math.ceil(30/MPH_IN_KMH);
    var TransModes = [
        {   text: "Walking",        icon: "ion-android-walk",        
            speed: 5,           
            description: "",
            movementVerb: "walked"
        },
        {   text: "Running",        icon: "ion-android-walk",         
            speed: 10,          
            description: "",
            movementVerb: "ran"
        },
        {   text: "Biking",         icon: "ion-android-bicycle",     
            speed: Math.ceil(15/MPH_IN_KMH),          
            description: "",
            movementVerb: "biked"
        },
        {   text: "Car city",       icon: "ion-android-car",         
            speed: Math.ceil(30/MPH_IN_KMH),          
            description: "",
            movementVerb: "drove a car"
        },
        {   text: "Subway",        icon: "ion-android-subway",         
            speed: Math.ceil(35/MPH_IN_KMH),            // http://www.metropolitanwalks.com/blog/train-speeds-do-path-and-ny-subway-measure-up/ 
            description: "",
            movementVerb: "took the subway"
        },
        {   text: "Car highway",    icon: "ion-android-car",      
            speed: Math.ceil(60/MPH_IN_KMH),         
            description: "",
            movementVerb: "drove a car"
        }, 
        {   text: "Train",          icon: "ion-android-train",      
            speed: Math.ceil(151/MPH_IN_KMH),       // http://www.cbsnews.com/news/high-speed-rail-could-get-new-train-routes-california-texas/    
            description: "",
            movementVerb: "took the train"
        },    
        {   text: "Plane",          icon: "ion-plane",              
            speed: Math.ceil(550/MPH_IN_KMH),       // https://en.wikipedia.org/?title=Boeing_747 
            description: "",
            movementVerb: "took the plane"
        },    
        {   text: "Felix Baumgartner",    icon: "ion-arrow-down-c",             
            speed: Math.ceil(844/MPH_IN_KMH),      //  http://www.redbullstratos.com/the-mission/world-record-jump/
            description: "Felix Baumgartner broke the speed of sound jumping from the stratosphere, which makes him the first to break this metric in freefall",
            link: "http://www.redbullstratos.com/the-mission/world-record-jump/",
            movementVerb: "jumped from the stratosphere"
        },
        {   text: "Bloodhound SSC",    icon: "ion-edit",             
            speed: Math.ceil(1000/MPH_IN_KMH),      //  http://www.wired.com/2014/12/bloodhound-ssc-1000-mph/
            description: "Bloodhound SSC is a supersonic land vehicle in development with as goal to match or exceed 1,000 miles per hour (1,609 km/h)",
            link: "http://www.wired.com/2014/12/bloodhound-ssc-1000-mph/",
            movementVerb: "drove the Bloodhound SSC"
        },  
        {   text: "F-22 Raptor",    icon: "ion-jet",             
            speed: Math.ceil(1500/MPH_IN_KMH),      //  http://www.redbullstratos.com/the-mission/world-record-jump/
            description: "The Lockheed Martin F-22 Raptor is a twin-engine all stealth tactical fighter aircraft, developed for the United States Air Force (USAF), with a top speed of mach 2.25.",
            link: "http://jets.wikia.com/wiki/F-22_Raptor",
            movementVerb: "drove the Bloodhound SSC"
        },  
        {   text: "Virgin Galactic",    icon: "ion-paper-airplane",             
            speed: Math.ceil(2485/MPH_IN_KMH),      // https://en.wikipedia.org/wiki/Virgin_Galactic 
            description: "Virgin Galactic is developing commercial spacecrafts, of which one will provide suborbital spaceflights to space tourist.",
            link: "http://www.virgingalactic.com/",
            movementVerb: "flew on the Virgin Galactic"
        },  
        {   text: "GPS Satellite",      icon: "ion-planet",             
            speed: Math.ceil(14000),     // http://science.nationalgeographic.com/science/space/solar-system/orbital/
            description: "GPS satellites move at 0.001 percent the speed of light, which results that they experience a slight time dilation, making their clocks run slower relative to one at rest on the ground.",
            link: "http://www.wired.com/2014/02/happy-anniversary-gps/",
            movementVerb: "orbited on a GPS satellite"
        },    
        {   text: "Orbit",          icon: "ion-earth",              
            speed: Math.ceil(67000/MPH_IN_KMH),                          // https://en.wikipedia.org/wiki/Earth's_orbit
            description: "Earth's orbit is the path in which the Earth travels around the Sun. What would happen to us if a giant space finger were to gently stop the Earth in its orbit?",
            link: "http://www.wired.com/2014/12/empzeal-earthfall/",
            movementVerb: "simulated the Earth's orbit"
        },    
        {   text: "Santa Claus",          icon: "ion-cube",          
            speed: 10703437,                      //99% lightspeed
            description: "Santa Claus delivers presents to all the good children in the world at a speed of 1,800 miles per second, all night. He also uses a present-launcher to shoot gifts down chimneys",
            link: "http://www.telegraph.co.uk/topics/christmas/8188997/The-science-of-Christmas-Santa-Claus-his-sleigh-and-presents.html",
            movementVerb: "delivered presents to all good children in the world as a Santa Claus"
        }, 
        {   text: "Light",                icon: "ion-lightbulb",          
            speed: 1079250000,                      //99% lightspeed
            description: "Light travels at a constant, finite speed. A traveler, moving at the speed of light, would circum-navigate the equator 7.5 times in one second.",
            link: "https://www.youtube.com/watch?v=au5i1Bw725o",
            movementVerb: "traveled at the speed of light"
        }, 
        {   text: "Custom",                icon: "ion-person",          
            speed: 0,                      //99% lightspeed
            description: "",
            movementVerb: "moved"
        }, 
    ];

     
    
    
   
    
    
    // -------------------------------------------------------------------------
    //
    // METRICS
    //
    // -------------------------------------------------------------------------
    
    
    
    if (MetricLS.hasOwnProperty("choice")) {        console.log("Metric: storage")
        Metric = MetricLS;
    } else {                                        console.log("Metric: new")
        Metric = {
            options: {us: "MPH", eu: "KMH"},
            choice: "MPH"
        }
        updateDisplaySpeed();
        $localstorage.setObject("Metric", Metric);
    };
    
    function changeMetric() {
        if(Metric.choice == Metric["options"].us) {
            Metric.choice = Metric["options"].eu
        } else {
            Metric.choice = Metric["options"].us
        }
        updateDisplaySpeed();
        $localstorage.setObject("Metric", Metric);
    };
    
    
    
    // -------------------------------------------------------------------------
    //
    // SPEED
    // sets also 'default' transModeIndex
    //
    // -------------------------------------------------------------------------
    
    
    
    
    if (SpeedLS.hasOwnProperty("transModeIndex")) { console.log("Speed: storage")
        Speed = SpeedLS;
    } else {                                        console.log("Speed: new")
        updateSpeed(5);
    }
    
    function updateSpeed(newTransModeIndex, customSpeedValue) {
        
        if(customSpeedValue != undefined && newTransModeIndex == TransModes.length-1) {
            if(Metric.choice == Metric["options"].eu) {
                var kmh = customSpeedValue;
            } else {
                var kmh = customSpeedValue/MPH_IN_KMH;
            }
            Speed["customSpeedMode"] = true;
        } else {
            Speed["customSpeedMode"] = false;
            var kmh = getTransModeSpeed(newTransModeIndex);
        }
        
        if(Speed["customSpeedMode"] == true) {
            if(kmh >= SPEED_OF_LIGHT_MS*3.6) {
                kmh = (SPEED_OF_LIGHT_MS*3.6)-1000;
            }
        }
        
        console.log("kmh", kmh)
        var ms = kmh/3.6;
        var mph = kmh*MPH_IN_KMH;
        
        Speed["transModeIndex"] = newTransModeIndex;
        Speed["kmh"]            = kmh;
        Speed["ms"]             = ms;
        Speed["mph"]            = mph;
        
        updateDisplaySpeed();
        updateTransModeCSS(newTransModeIndex);
        
        $localstorage.setObject("Speed", Speed);
    };
    
    function updateTransModeCSS(newTransModeIndex) {
        var tempButtonCSS = [];
        for (var i=0; i<TransModes.length; i++) {
            if(i == newTransModeIndex) {
                tempButtonCSS[i] = "customspeed-active";
            } else {
                tempButtonCSS[i] = "customspeed";
            }
        }
        Speed["buttonCSS"] = tempButtonCSS;
    };
    
    
    
    function updateDisplaySpeed() { console.log(Metric.choice)
        if(Metric.choice != undefined) {
            if (Metric.choice == Metric["options"].eu) {    
                Speed["display"]            = Math.ceil(Speed.kmh);
            } else if (Metric.choice == Metric["options"].us) {
                Speed["display"]            = Math.floor(Speed.mph);
            }
        } else {
            // first init
            Speed["display"]            = Math.floor(Speed.mph);
        }
        
    };
    
    function checkInputSpeed(speedInput) {
        var speedMS = null;
        if (Metric.choice == Metric["options"].eu) {    
            speedMS = speedInput / 3.6;
        } else if (Metric.choice == Metric["options"].us) {
            speedMS = (speedInput*MPH_IN_KMH) / 3.6;
        }
        
        console.log(speedMS, SPEED_OF_LIGHT_MS,speedMS >= SPEED_OF_LIGHT_MS)
        return (speedMS >= SPEED_OF_LIGHT_MS)
    }
    
    function getTransModeSpeed(transModeIndex) {
        console.log(Speed, transModeIndex)
        return TransModes[transModeIndex].speed;
    };
    
    
    
    
    
    // -------------------------------------------------------------------------
    //
    // TIMER
    //
    // -------------------------------------------------------------------------
    
   
    if (TimerDataLS.hasOwnProperty("timerState")) { console.log("TimerData: storage")
        TimerData = TimerDataLS;
    } else {                                        console.log("TimerData: new")
        resetTimer();
    }
    
    function resetTimer() {
        TimerData["timerState"]             = "stop";
        TimerData["timerNextAction"]        = "Start";
        TimerData["timeOutMode"]            = false;
        TimerData["timeOutStartDate"]       = null;
        TimerData["timer"]                  = {totalTime: 0, totalTimeFuture: 0, timeTravelled: 0};
        normalizeTimeString(0,0,0);
        saveTimerData();
    };
    
    function saveTimerData() {
        $localstorage.setObject("TimerData", TimerData);
    };
    
    function updateTimerData(field, value) {
        if(TimerData.hasOwnProperty(field)){
            TimerData[field] = value;
        }
        // do not save to localstorage (consistency)
    };
    
    function updateTimer(totalTime, totalTimeFuture, timeTravelled) {
        TimerData["timer"]  = {totalTime: totalTime, totalTimeFuture: totalTimeFuture, timeTravelled: timeTravelled};
        normalizeTimeString();
        // do not save to localstorage (memory)
    };
    
    function updateTimerField(field, value) {
        TimerData["timer"][field] = value;
        normalizeTimeString();
        // do not save to localstorage (memory)
    };
    
    function normalizeTimeString() {
        TimerData["timerStr"]        = {
            totalTime:          Utils.normalizeTimeString(TimerData.timer.totalTime),
            totalTimeFuture:    Utils.normalizeTimeString(TimerData.timer.totalTimeFuture),
            timeTravelled:      Utils.normalizeTimeTravelled(TimerData.timer.timeTravelled),
        }
    };
    
    function startpauseTimer() {
        switch (TimerData.timerState) {
            case "stop":
                //
                updateTimerData("timerState", "run");
                break
            case "run":
                //
                updateTimerData("timerState", "pause");
                break
            case "pause":
                //
                updateTimerData("timerState", "run");
                break
        }
        checkNextAction();
    };
    
    function checkNextAction() {
        switch (TimerData.timerState) {
            case "stop":
                //
                updateTimerData("timerNextAction", "Start");
                break
            case "run":
                //
                updateTimerData("timerNextAction", "Pause");
                break
            case "pause":
                //
                updateTimerData("timerNextAction", "Resume");
                break
        }
    }
    
    
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    return {
        
        // TransModes
        TransModes: TransModes,
        
        // Metric
        Metric: Metric,
        changeMetric: function() {
            changeMetric();
        },
        
        // Speed
        Speed: Speed,
        updateSpeed: function(newTransModeIndex, customSpeedValue) {
            updateSpeed(newTransModeIndex, customSpeedValue);
        },
        updateDisplaySpeed: function() {
            updateDisplaySpeed();
        },
        checkInputSpeed: function(speedInput){
            checkInputSpeed(speedInput);
        },
        
        // TimerData
        TimerData: TimerData,
        updateTimerData: function (field, value) {
            updateTimerData(field, value)
        },
        updateTimer: function (totalTime, totalTimeFuture, timeTravelled) {
            updateTimer(totalTime, totalTimeFuture, timeTravelled)
        },
        updateTimerField: function(field, value) {
            updateTimerField(field, value);
        },
        resetTimer: function() {
            resetTimer();
        },
        startpauseTimer: function() {
            startpauseTimer();
        },
        saveTimerData: function() {
            saveTimerData();
        }
        
        

        
    }
});
