// This function is only used in testing to recreate database data for Firebase testing 
// assuming a user had been using Sworkit before Accounts were created
// First step before this in most cases would be to delete the database in Chrome
// This is done manually from here for localhost: chrome://settings/cookies

var populateDatabase = function(numberOfRows) {
    Number.prototype.padLeft = function(base,chr){
        var  len = (String(base || 10).length - String(this).length)+1;
        return len > 0? new Array(len).join(chr || '0')+this : this;
    }

    window.db=false;
    window.db = openDatabase('SworkitDBFree', '1.0', 'SworkitDBFree',1048576);

    window.db.transaction(function(tx){
                          tx.executeSql( 'CREATE TABLE IF NOT EXISTS SworkitFree(sworkit_id INTEGER NOT NULL PRIMARY KEY, created_on DATE DEFAULT NULL, minutes_completed INTEGER NOT NULL,calories INTEGER NOT NULL, type TEXT NOT NULL, utc_created DATE DEFAULT NULL, exercise_list TEXT NOT NULL DEFAULT "", sync_id TEXT DEFAULT NULL, sync_lastUpdated INTEGER DEFAULT NULL, device_type TEXT NOT NULL DEFAULT "", connected_apps TEXT NOT NULL DEFAULT "", heart_rate TEXT NOT NULL DEFAULT "")', [],window.nullHandler,window.errorHandler);},window.errorHandler,window.successCallBack);

    window.errorHandler = function(transaction, error) {
        console.log('DB Error: ' + error.message + ' code: ' + error.code);
    }
    window.successCallBack = function() {
        //alert("DEBUGGING: success");
        console.log('Data Test - Database success' );
    }
    window.nullHandler = function(){
        //console.log('Data Test - Database null' );
    };

    var originalDate = new Date('January 17, 2014 08:24:00');
    var dateNow = new Date();
    var minutesArray = [5,10,15,20,25,30];
    var caloriesArray = [14,40,88,120,160,200,220];
    var typeIdArray = ['upperBody', 'lowerBody', 'customWorkout', 'coreExercise', 'fullBody', 'cardio', 'cardioLight', 'headToToe', 'stretchExercise'];
    var dateInterval = (dateNow.valueOf() - originalDate.valueOf()) / numberOfRows;
    var increment = 0;

    var createNextRow = function() {
        if (increment !== numberOfRows + 1){
            var timeToAdd = minutesArray[Math.floor(Math.random()*minutesArray.length)];
            var burn = caloriesArray[Math.floor(Math.random()*caloriesArray.length)];
            var typeId = typeIdArray[Math.floor(Math.random()*typeIdArray.length)];
            var d = new Date(originalDate.valueOf() + (dateInterval*increment));
            var useDate = [d.getFullYear().padLeft(),
                   (d.getMonth()+1).padLeft(),
                   d.getDate()].join('-') +' ' +
                  [d.getHours().padLeft(),
                   d.getMinutes().padLeft(),
                   d.getSeconds().padLeft()].join(':');
            increment++;
            window.db.transaction(function(transaction) {
             transaction.executeSql('INSERT INTO SworkitFree(created_on, minutes_completed, calories, type, utc_created) VALUES (?,?,?,?,?)',[useDate, timeToAdd, burn, typeId, useDate], nullHandler,errorHandler, createNextRow());
            });
         }
    }

    createNextRow(numberOfRows);
}
