angular.module('swMobileApp').factory('UserService', function () {
    return {
        getUserSettings: function () {
            return PersonalData.GetUserSettings;
        }, getCustomWorkoutList: function () {
            return PersonalData.GetCustomWorkouts;
        }, getCurrentCustom: function () {
            return PersonalData.GetWorkoutArray.workoutArray;
        }, getGoalSettings: function () {
            return PersonalData.GetUserGoals;
        }, getTimingIntervals: function () {
            return TimingData.GetTimingSettings;
        }, getAudioSettings: function () {
            return PersonalData.GetAudioSettings;
        }, getFitSettings: function () {
            return PersonalData.GetGoogleFit;
        }
    }
});