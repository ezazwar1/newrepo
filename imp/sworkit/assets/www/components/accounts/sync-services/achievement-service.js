angular.module('swMobileApp')
    .factory('AchievementService', function (moment, $q) {

      function getWorkoutWeekTimeRanges(oldestWorkoutTime, todayDate) {
        var workoutWeekTimeRanges = [];

        var previousWeekTimeRange = getWeekTimeRange(todayDate);
        workoutWeekTimeRanges.push(previousWeekTimeRange);

        while (previousWeekTimeRange.start > oldestWorkoutTime) {
          previousWeekTimeRange = getWeekTimeRange(new Date(previousWeekTimeRange.start));
          workoutWeekTimeRanges.push(previousWeekTimeRange);
        }
        return workoutWeekTimeRanges;
      }

      function getWeekTimeRange(inputSundayMidnightDate) {
        var sunday = getNextSundayDateMidnight(inputSundayMidnightDate);

        var endTime = sunday.getTime();
        endTime = endTime - 1;

        var m = moment(sunday); // the day before DST in the US
        m.subtract(7, 'days');
        var startTime = m.valueOf();

        var weekTimeRange = {
          start: startTime,
          end: endTime,
          startDate: new Date(startTime),
          endDate: new Date(endTime)
        };
        return weekTimeRange;
      }

      function getMostRecentSundayDateMidnight(inputDate) {
        var copiedMoment = moment(inputDate.getTime());
        while (copiedMoment.day() > 0) {
          copiedMoment.subtract(1, 'days');
        }
        return new Date(copiedMoment.valueOf());
      }

      function getNextSundayDateMidnight(inputDate) {
        var copiedMoment = moment(inputDate.getTime());
        while (copiedMoment.day() > 0) {
          copiedMoment.add(1, 'days');
        }
        return new Date(copiedMoment.valueOf());
      }

      function getWorkoutsByDateReverseArray(_workoutsToReverse) {
        var workoutsByDateArray = [];
        _.each(_workoutsToReverse, function (statValues, dateKey) {
          var newValue = angular.copy(statValues);
          newValue.dateKey = dateKey;
          workoutsByDateArray.push(newValue);
        }, function (err) {
        });
        return workoutsByDateArray.reverse();
      }

      return {
        getStreakCount: function (workoutsByDateObject, todayOnly) {
          var streakCount = 0;
          var oldestWorkoutTime = Object.keys(workoutsByDateObject)[0];
          var workoutWeekTimeRanges = getWorkoutWeekTimeRanges(oldestWorkoutTime, todayOnly);
          var workoutsByDateReverseArray = getWorkoutsByDateReverseArray(workoutsByDateObject);
          for (var i = 0; i < workoutWeekTimeRanges.length; i++) {
            var workoutWeekTimeRange = workoutWeekTimeRanges[i];
            var foundWorkout = _.find(workoutsByDateReverseArray, function (workout) {
              var foundWorkout = workout.dateKey >= workoutWeekTimeRange.start && workout.dateKey <= workoutWeekTimeRange.end && workout.minutes > 0;
              return foundWorkout;
            });
            if (foundWorkout) {
              streakCount++;
            } else if (i === 0) {
              // OK to skip current week without workouts
            } else {
              break;
            }
          }
          return streakCount;
        },
        getWeekStart: function(todayDate) {
          return getMostRecentSundayDateMidnight(todayDate)
        }
      }
    }
);
