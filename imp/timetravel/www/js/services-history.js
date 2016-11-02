angular.module('starter.services-history', [])

.factory('History', function($localstorage, Utils) {
    var self = this;
    
    var HistTimers = $localstorage.getObject('HistTimers', '{}');
    
    
    //
    //
    self.getHistTimers = function() {
        var HistTimersNormalized = [];
        var fday = null;
        angular.forEach(HistTimers, function(value, key) {
            fday = value["datef"].fday; 
            HistTimersNormalized.push({
                TID:                key,
                datef:              fday.substr(11, fday.length-1),
                transModeIndex:     value.transModeIndex,
                notes:              value.notes,
                totalTime:          Utils.normalizeTimeString(value.totalTime),
                totalTimeFuture:    Utils.normalizeTimeString(value.totalTimeFuture),
                totalTimeTravelled: Utils.normalizeTimeTravelled(value.totalTimeTravelled, true),
                totalTimeShare:     Utils.translateTotalTime(Utils.normalizeTimeString(value.totalTime))
            })
        });
        return HistTimersNormalized;
    };
    
    //
    //
    self.newHistTimer = function(totalTime, totalTimeFuture, totalTimeTravelled, optNotes, transModeIndex) {
        console.log(totalTime, totalTimeFuture, totalTimeTravelled, optNotes)
        if(totalTimeFuture != undefined && totalTimeFuture != "" && totalTimeTravelled != undefined && totalTimeTravelled != "") {
            var d = new Date();
            var TID = d.getTime(); // id of timer
            
            // include date***
            HistTimers[TID] = {
                notes:              optNotes,
                datef:              self.getDateObj(new Date()),
                transModeIndex:   transModeIndex,
                totalTime:          totalTime,
                totalTimeFuture:    totalTimeFuture,
                totalTimeTravelled: totalTimeTravelled
            }
            self.saveHistTimers();
        } else {
            console.log("error newHistTimer")
        }
    };
    
    //
    //
    self.saveHistTimers = function(){
      $localstorage.setObject('HistTimers', HistTimers);  
    };
    
    //
    //
    self.deleteHistTimer = function(TID) {
        delete HistTimers[TID];
        self.saveHistTimers();
    };
    
    self.clearHistTimer = function() {
        HistTimers = {};
        self.saveHistTimers();
    };
    
    //
    //
    self.editNotesTimer = function(TID, notes) {
        HistTimers[TID].notes = notes;
        self.saveHistTimers();
    };
    
    //
    //
    self.getTotalHistTimers = function() {
        //var totalTimeSaved = new BigNumber(0);
        var totalTimeSaved = 0;
        angular.forEach(HistTimers, function(value, key) {
            //var iterTimeSaved   = new BigNumber(value.totalTimeTravelled);
            //totalTimeSaved      = totalTimeSaved.plus(iterTimeSaved);
            var iterTimeSaved   = value.totalTimeTravelled;
            totalTimeSaved      = totalTimeSaved + iterTimeSaved;
        });
        //var prevTotalTimeFuture = new BigNumber(0)
        //xTotalTimeFuture.plus(prevTotalTimeFuture);
        //parseFloat(totalTotalTimeFuture.round(15).toString()
        
        //return parseFloat(totalTimeSaved.round(15).toString());
        return totalTimeSaved;
    };
    
    
    //
    // fn complement
    self.getDateObj = function(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        var year = date.getFullYear();
        var month = date.getMonth()+1; //jan = 0
        var monthStr = getMonthStr(month);
        var day = date.getDate();
        var dayStr = getMonthStr(day);
        
        
        var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
      
        var dateObj = {
            year: year,
            month: month,
            monthStr: monthStr,
            day: day,
            time: strTime,
            fday: year + "-" + monthStr + "-" + dayStr + "-" + monthNames[month-1] + ", " + day + " (" + strTime + ")"
        }
        
        
        function getMonthStr(month) {
            var monthStr = ""; 
            if(month<10){
                monthStr = "0" + month.toString()
            } else{
                monthStr=month.toString()
            } return monthStr
        }

        
        return dateObj;
    };
    

    return self;
});
