'use strict';

app.service('timeService', function() {
  var timeYear = 31556926;
  var timeDay = 86400;

  this.getSinceDateForYearsAgo = function(yearsAgo) {
    var sinceDate = new Date();
    var currentYear = sinceDate.getFullYear();
    var sinceYearsAgo = currentYear - yearsAgo;

    sinceDate.setFullYear(sinceYearsAgo);
    sinceDate.setHours(0, 0, 0, 0);

    return sinceDate;
  }

  this.getSinceEpochTimeForYearsAgo = function(yearsAgo) {
    var timeCurrent = new Date().setHours(0, 0, 0, 0) / 1000 - timeDay * 2;
    var dateLastYear = new Date((timeCurrent - timeYear * yearsAgo) * 1000);

    var since = Math.floor(dateLastYear.setHours(0, 0, 0, 0) / 1000);

    return since;
  }

  this.getUntilDateForYearsAgo = function(yearsAgo) {
    var untilDate = new Date();
    var currentYear = untilDate.getFullYear();
    var untilYearsAgo = currentYear - yearsAgo;
    
    untilDate.setFullYear(untilYearsAgo);
    untilDate.setHours(23, 59, 59, 59);

    return untilDate;
  }

  this.getUntilEpochTimeForYearsAgo = function(yearsAgo) {
    var timeCurrent = new Date().setHours(0, 0, 0, 0) / 1000;
    var dateLastYear = new Date((timeCurrent - timeYear * yearsAgo) * 1000);

    var since = Math.floor(dateLastYear.setHours(23, 59, 59, 59) / 1000);

    return since;
  }

  this.getUntilEpochTimeForYearsAgoWithRange = function(yearsAgo, range) {
    var timeCurrent = new Date().setHours(0, 0, 0, 0) / 1000;
    var dateLastYearWithRange = new Date( (timeCurrent - (timeYear * yearsAgo) + (range * timeDay) ) * 1000);

    var since = Math.floor(dateLastYearWithRange.setHours(23, 59, 59, 59) / 1000);

    return since;
  }

  this.isEligibleToThrowbackToday = function(date) {
    for (var year = 1; year < 6; year++) {
      var sinceDate = this.getSinceDateForYearsAgo(year);
      var untilDate = this.getUntilDateForYearsAgo(year);

      if (date >= sinceDate && date <= untilDate) {
        return true;
      }
    }
    return false;
  }
});
