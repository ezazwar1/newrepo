var servicesModule=angular.module("habitsService",[]),MILLISECONDS_IN_HOUR=36e5,MILLISECONDS_IN_DAY=24*MILLISECONDS_IN_HOUR;servicesModule.factory("HabitsService",["$http","$rootScope","$timeout","$translate","authHttp","Environment","GeneralService","AccountService","StorageService",function(t,a,e,i,n,r,o,u,c){function s(){var t={};return t.success=function(a){return t.successCallback=a,t},t.error=function(a){return t.errorCallback=a,t},t}function l(){B.accountHabitValues=[];for(var t=0;t<B.accountHabits.length;++t)for(var a=B.accountHabits[t].habitValues,e=0;e<a.length;++e){var i=a[e];B.accountHabitValues[i.id]=i}}function b(){c.setItem("accountHabits",JSON.stringify(B.accountHabits))}function d(){c.setItem("habitData",JSON.stringify(B.habitData))}function f(){c.setItem("offlineHabitData",JSON.stringify(B.offlineHabitData))}function H(){c.setItem("recentFeelings",JSON.stringify(B.recentFeelings))}function v(){if(B.offlineHabitData.length>0){for(var t=[],a=0;a<B.offlineHabitData.length;++a){var e=B.offlineHabitData[a],i=B.getHabitValueById(e.habitValueId),o=B.getAccountHabitById(i.habitId),u={habitId:o.id,habitValueId:i.id,habitSubValueIds:e.subValueIds,experiencedAt:e.experiencedAt,notes:e.notes};e.update&&(u.habitDataId=e.id,u.update=!0),t.push(u)}n.post(r.serverURL+"/habits/offline",{data:t}).success(function(t){if(t)for(var a=0;a<t.length;++a)S(t[a]);B.offlineHabitData.length=0,c.removeItem("offlineHabitData")})}}function g(){B.accountHabits=[],B.accountHabitValues=[],B.potentialHabits=[],B.habitData={},T=!1,B.recentFeelings=[],c.removeItem("accountHabits"),c.removeItem("habitData"),c.removeItem("offlineHabitData"),O=!1}function h(t){new Date;t.update=!1,B.offlineHabitData.push(t),f()}function I(t,a){for(var e=t.habitValues.length-1;e>=0;--e){var i=t.habitValues[e];if(a>=i.valueInt)return e}}function D(t){for(var a=!1,e=0;e<B.offlineHabitData.length;++e){var i=B.offlineHabitData[e],n=B.getHabitValueById(i.habitValueId),r=B.getAccountHabitById(n.habitId),u=B.getHabitValueById(t.habitValueId),c=B.getAccountHabitById(u.habitId);if(r.id==c.id&&o.getDayString(i.experiencedAt)==o.getDayString(t.experiencedAt)){i.habitValueId=t.habitValueId,i.habitSubValueIds=t.subValueIds,i.notes=t.notes,a=!0;break}}a||(t.update="number"==typeof t.id,B.offlineHabitData.push(t)),f()}function p(t){var a=[];for(var e in B.habitData)a.push(e);a.sort(function(t,a){return new Date(a)-new Date(t)});for(var i=0,n=!1,r=0;r<a.length&&!n;++r){var o=a[r],u=B.habitData[o],c=u[1];if(c)for(var s=0;s<c.length;++s){var l=c[s],b=B.getHabitValueById(l.habitValueId);if(!t(b.valueInt)){n=!0;break}if(++i,i>=5){n=!0;break}}}return i>=5}function y(t){var a=t.experiencedAt;("number"==typeof a||"string"==typeof a)&&(a=new Date(a));var e=B.getHabitValueById(t.habitValueId),i=B.getAccountHabitById(e.habitId),n=B.getHabitDataList(i,a,!0);n.splice(0,0,t),d()}function S(t){var a=t.experiencedAt;("number"==typeof a||"string"==typeof a)&&(a=new Date(a));var e=B.getHabitValueById(t.habitValueId),i=B.getAccountHabitById(e.habitId),n=B.getHabitDataList(i,a,!0),r=n[0];r&&(n[0]=t,d())}function A(t){for(var a=0;a<B.recentFeelings.length;++a)if(B.recentFeelings[a].id==t.id)return;B.recentFeelings.splice(0,0,t)}function C(t,a){var e=new Date,i=new Date(e.getTime()-a*MILLISECONDS_IN_DAY);i.setHours(0,0,0,0);var n=new Date(i.getTime()-6*MILLISECONDS_IN_HOUR),r=new Date(i.getTime()+12*MILLISECONDS_IN_HOUR);window.plugins.healthkit.querySampleType({startDate:n,endDate:r,sampleType:"HKCategoryTypeIdentifierSleepAnalysis",ascending:"YES"},function(a){if(a&&a.length>0){var e=0;for(var i in a){var n=a[i],o=1===n.value?"Sleeping":"In Bed";if("Sleeping"==o){{var u=moment(n.endDate).diff(n.startDate,"minutes");moment(n.endDate).diff(n.startDate,"hours")}e+=u}}var c=Math.floor(e/60),s=I(t,c),l=B.getHabitDataByHabitId(r,B.SLEEP_HABIT_ID);if(l){var b=B.getHabitValueById(l.habitValueId);s>b.ordinate&&B.updateHabitData(t,l,s,r)}else B.recordHabitData(t,s,void 0,r)}})}function V(){var t=B.getAccountHabitById(B.SLEEP_HABIT_ID);if(t)for(var a=0;7>a;++a)C(t,a)}function m(t,a,e){var i=function(i){if(i&&i.length>0){var n,r=0;for(var o in i){var u=i[o];n||(n=moment(u.startDate).toDate()),r+=u.quantity}var c=Math.floor(r/e),s=I(t,c),l=B.getHabitDataByHabitId(n,a);if(l){var r=B.getHabitValueById(l.habitValueId);s>r.ordinate&&B.updateHabitData(t,l,s,n)}else B.recordHabitData(t,s,void 0,n)}};return i}function _(){var t=B.getAccountHabitById(B.CAFFEINE_HABIT_ID);if(t)for(var a=0;7>a;++a){var e=new Date,i=new Date(e.getTime()-a*MILLISECONDS_IN_DAY);i.setHours(0,0,0,0);var n=new Date(i.getTime()+MILLISECONDS_IN_DAY);window.plugins.healthkit.querySampleType({startDate:i,endDate:n,sampleType:"HKQuantityTypeIdentifierDietaryCaffeine",unit:"mg"},m(t,B.CAFFEINE_HABIT_ID,100))}}function k(){var t=B.getAccountHabitById(B.EXERCISE_HABIT_ID);t&&window.plugins.healthkit.findWorkouts({},function(a){var e={};if(a&&a.length>0)for(var i=0;i<a.length;++i){var n=a[i],r=moment(n.endDate).toDate(),u=n.duration/60,c=o.getDayString(r),s=e[c];s?s.value+=u:(s={value:u,date:r},e[c]=s)}for(var l in e){var b=e[l],d=I(t,b.value),f=B.getHabitDataByHabitId(b.date,B.EXERCISE_HABIT_ID);if(f){var H=B.getHabitValueById(f.habitValueId);d>H.ordinate&&B.updateHabitData(t,f,d,b.date)}else B.recordHabitData(t,d,void 0,b.date)}},function(t){})}var T=!1,B={accountHabits:[],accountHabitValues:[],potentialHabits:[],habitData:{},offlineHabitData:[],recentFeelings:[],MOOD_HABIT_ID:1,SLEEP_HABIT_ID:2,EXERCISE_HABIT_ID:3,EATING_HABIT_ID:4,WATER_HABIT_ID:5,CAFFEINE_HABIT_ID:6,ALCOHOL_HABIT_ID:7,OUTDOORS_HABIT_ID:8,STRESS_HABIT_ID:19,MENSTRUATION_HABIT_ID:20,activeDate:void 0},L=!1;B.requiresHabitDataReload=function(){return L},B.clearHabitDataReload=function(){L=!1};var w=u.getUserPreference("viewed_remove_habit_tooltip"),M=!w||"false"==w,O=!1;B.showRemoveHabitTooltip=function(){return M&&O},B.dismissRemoveHabitTooltip=function(){u.setUserPreference("viewed_remove_habit_tooltip","true"),M=!1};var E=!1;B.setIsEditingHabits=function(t){E=t},B.isEditingHabits=function(){return E},B.removeMoodHabit=function(t){t.habits&&(t.habits=t.habits.slice(0));for(var a=t.habits.length-1;a>=0;--a)t.habits[a].id==B.MOOD_HABIT_ID?t.habits.splice(a,1):t.habits[a].id==B.STRESS_HABIT_ID&&t.habits.splice(a,1)},a.$on("event:pacificaReady",function(){c.getItem("accountHabits",function(t){t&&(B.accountHabits=JSON.parse(t),l())}),c.getItem("habitData",function(t){t&&(B.habitData=JSON.parse(t))}),c.getItem("offlineHabitData",function(t){t&&(B.offlineHabitData=JSON.parse(t))}),c.getItem("recentFeelings",function(t){t&&(B.recentFeelings=JSON.parse(t))})}),B.setActiveDate=function(t){B.activeDate=t},B.getActiveDate=function(){return B.activeDate},B.getHabitSubValueName=function(t,a){for(var e=B.accountHabits[t],i=0;i<e.habitSubValues.length;++i){var n=e.habitSubValues[i];if(n.id==a)return n.display.toLowerCase()}},B.getHabitSubValue=function(t,a){var e;if(t)if(Array.isArray(t))for(var n=0;n<t.length;++n){var r=t[n];r.id==a&&(e=r.valueString)}else{var o=t[a];o&&(e=o.valueString)}if(e||(e=B.getHabitSubValueName(0,a)),e){var u=i.instant(e.toUpperCase());return u==e.toUpperCase()?e.toLowerCase():u.toLowerCase()}return i.instant("UNKNOWN").toUpperCase()},B.updateMoodHabitSubValues=function(t){if(t)for(var a=B.accountHabits[0],e=0;e<t.length;++e){for(var i=t[e],n=!1,r=0;r<a.habitSubValues.length;++r){var o=a.habitSubValues[r];if(o.id==i.id){n=!0;break}}n||a.habitSubValues.push(i)}},B.getHabitSubValues=function(t){for(var a=s(),e="",i=0;i<t.length;++i)i>0&&(e+="&"),e+="ids="+t[i];return n.get(r.serverURL+"/habits/habitSubValues?"+e).success(function(t){B.updateMoodHabitSubValues(t),a.successCallback&&a.successCallback()}).error(function(){a.errorCallback&&a.errorCallback()}),a},a.$on("event:online",v),a.$on("event:userContextInitialized",v),B.logout=function(){g()},B.findHabitData=function(t,a){var e=new Date(a.getTime()+MILLISECONDS_IN_DAY);return n.get(r.serverURL+"/habits/habitData?startDate="+o.getDayString(t)+"&endDate="+o.getDayString(e))},B.findPotentialAccountHabits=function(){return n.get(r.serverURL+"/habits/account/potential")},B.setPotentialAccountHabits=function(t){for(var a=0;a<t.length;++a){for(var e=t[a],i=!1,n=0;n<B.potentialHabits.length;++n)if(B.potentialHabits[n].id==e.id){i=!0;break}i||B.potentialHabits.push(e)}},B.getPotentialAccountHabits=function(){return B.potentialHabits},B.setHabitContext=function(t){var a=t.habitValues;B.accountHabits=a,l(),B.accountHabits.sort(function(t,a){return t.ordinate-a.ordinate});for(var e=0;e<B.accountHabits.length;++e)B.ordinate=e;var i=t.habitData;B.habitData={},B.addHabitData(i),T=!0;for(var n=0;n<B.offlineHabitData.length;++n){var r=B.offlineHabitData[n],o=B.getHabitValueById(r.habitValueId),u=B.getAccountHabitById(o.habitId);if(o&&u){var s;s="number"==typeof r.experiencedAt||"string"==typeof r.experiencedAt?new Date(r.experiencedAt):r.experiencedAt,B.setLocalHabitData(u,o.ordinate,r.subValueIds,r.update,s,r.notes,r)}}c.setItem("accountHabits",JSON.stringify(B.accountHabits)),d()},B.getTodaysLastMoodEntryClass=function(){var t=B.getTodaysLastMoodEntry();return t="?"!=t?t.replace(" ",""):""},B.getStressClass=function(t){if(!t)return"";var a=B.getAccountHabitValues("Stress").habitValues,e=a[t.valueInt-1].valueString;return e.replace(/ /g,"")},B.getMoodClass=function(t){if(!t)return"";var a=B.getAccountHabitValues("Mood").habitValues,e=a.length-t.valueInt,i=a[e].valueString;return i.replace(" ","")},B.getTodaysLastMoodEntry=function(){var t=o.getTodayString(),a=B.habitData[t];if(!a)return"?";if(a=a[1],!a||0===a.length)return"?";a.sort(function(t,a){return new Date(a.recordedAt)-new Date(t.recordedAt)});var e=B.getHabitValueById(a[0].habitValueId);return e.valueString},B.addHabitData=function(t){for(var a=0;a<t.length;++a){var e=t[a],i=o.getDayString(new Date(e.experiencedAt)),n=B.getHabitValueById(e.habitValueId);if(n){var r=B.getAccountHabitById(n.habitId),u=B.habitData[i];u||(u=B.habitData[i]={});var c=u[r.id];c||(c=u[r.id]=[]),c.push(e)}}},B.hasHabitContext=function(){return T},B.getAccountHabitValues=function(t){for(var a in B.accountHabits)if(B.accountHabits[a].name==t)return B.accountHabits[a]},B.getAccountHabitValuesById=function(t){for(var a in B.accountHabits)if(B.accountHabits[a].id==t)return B.accountHabits[a]},B.getAccountHabits=function(){return B.accountHabits},B.getAccountHabitById=function(t){for(var a,e=0;e<B.accountHabits.length;++e)if(B.accountHabits[e].id==t){a=B.accountHabits[e];break}return a};var N=[];B.getCreatedHabits=function(){return N},B.clearCreatedHabits=function(){N.length=0};var R=void 0;return B.getHabitsToAdd=function(){return R},B.setHabitsToAdd=function(t){R=t},B.clearHabitsToAdd=function(){R=void 0},B.createHabit=function(t,a){var e=s();return n.post(r.serverURL+"/habits/create",t).success(function(t){a?B.addHabit(t.id).success(function(){B.addLocalHabit(t),e.successCallback&&e.successCallback(t)}).error(function(){e.errorCallback&&e.errorCallback(t)}):(N.push(t),B.potentialHabits.splice(0,0,t),e.successCallback&&e.successCallback(t))}).error(function(){e.errorCallback&&e.errorCallback()}),e},B.editHabit=function(t){var a=s();return n.post(r.serverURL+"/habits/edit",t).success(function(e){var i=0;for(i=0;i<B.accountHabits.length;++i){var n=B.accountHabits[i];if(n.id==t.id)break}B.accountHabits.splice(i,1,e),l(),a.successCallback&&a.successCallback(e)}).error(function(){a.errorCallback&&a.errorCallback()}),a},B.getHabitValueById=function(t,a){var e;return e="object"==typeof t?B.accountHabitValues[a]:B.accountHabitValues[t],e&&e.active?e:void 0},B.getHabitDisplayById=function(t,a){var e=B.getHabitValueById(t,a);return B.getHabitDisplayFromValue(e)},B.getHabitName=function(t){if(1!=t.creatorId)return t.name;var a=i.instant(t.name.toUpperCase());return a==t.name.toUpperCase()?t.name:a},B.getHabitDisplay=function(t,a){var e=t.habitValues[a];return B.getHabitDisplayFromValue(e)},B.getHabitDisplayFromData=function(t){var a=B.getHabitValueById(t.habitValueId);return B.getHabitDisplayFromValue(a)},B.getHabitDisplayFromValue=function(t){if(t){var a=B.getAccountHabitById(t.habitId);if(1!=a.creatorId)return t.valueString;if(a.id==B.MOOD_HABIT_ID){var e="MOOD_"+t.valueString;return e=e.replace(" ","_"),i.instant(e)}if(a.id==B.STRESS_HABIT_ID||t.valueString&&t.valueInt<0){var e="HABITS_VALUES_"+t.valueString;e=e.replace(/ /g,"_").toUpperCase();var n=i.instant(e);return n&&n!=e||(n=t.valueString),n}var r="HABITS_VALUES_"+t.display;r=r.replace(/ /g,"_").toUpperCase();var o=i.instant(r);return o&&o!=r||(o=t.display),(t.valueString?t.valueString:t.valueInt)+" "+(o?o:"")}return i.instant("NO_DATA")},B.hasHabitData=function(t){var a=o.getDayString(t),e=B.habitData[a];return"undefined"!=typeof e},B.getAllMoodHabitData=function(){var t=[];for(var a in B.habitData){var e=B.habitData[a],i=B.accountHabits[0],n=e[i.id];if(n)for(var r=0;r<n.length;++r)t.push(n[r])}return t},B.canSubmitMood=function(){var t=B.getAccountHabitValues("Mood"),a=new Date,e=B.getHabitDataByHabitId(a,t.id);if(e){var i;i="object"==typeof e.experiencedAt?e.experiencedAt.getTime():new Date(e.experiencedAt).getTime();var n=a.getTime();if(i>n-9e5)return!1}return!0},B.metGoalWithHabitData=function(t){var a=B.getHabitValueById(t.habitValueId),e=B.getAccountHabitById(a.habitId);return B.metGoal(e,a.ordinate)},B.metGoal=function(t,a){return t.goalMinimized?a<=t.goalOrdinal:a>=t.goalOrdinal},B.getHabitDataByHabitId=function(t,a){var e=B.getAccountHabitById(a);if(e){var i=o.getDayString(t),n=B.habitData[i];if(n){var r=n[e.id];if(r){var u=r[0];return u}}}},B.reorderHabits=function(t){for(var a=[],e=0;e<t.length;++e){var i=t[e];if(i.id!=B.MOOD_HABIT_ID&&i.id!=B.STRESS_HABIT_ID){i.ordinate=e+1;var o={habitId:i.id,ordinate:e+1};a.push(o);for(var u=0;u<B.accountHabits.length;++u){var c=B.accountHabits[u];if(c.id==i.id){c.ordinate=i.ordinate;break}}}}return B.accountHabits.sort(function(t,a){return t.ordinate-a.ordinate}),b(),n.post(r.serverURL+"/habits/account/reorder",a)},B.addHabit=function(t,a){return a&&(O=!0),L=!0,n.post(r.serverURL+"/habits/account/add",t)},B.addHabits=function(t,a){return a&&(O=!0),L=!0,n.post(r.serverURL+"/habits/account/addHabits",t)},B.addLocalHabitFromId=function(t){for(var a=0;a<B.accountHabits.length;++a)if(B.accountHabits[a].id==t)return;for(var e,i=0;i<B.potentialHabits.length;++i)if(B.potentialHabits[i].id==t){e=B.potentialHabits[i];break}B.addLocalHabit(e)},B.addLocalHabit=function(t){for(var a=0;a<B.accountHabits.length;++a){var e=B.accountHabits[a];if(e.id==t.id)return}B.accountHabits.push(t),l(),t.ordinate=B.accountHabits.length-1;for(var i=0;i<B.potentialHabits.length;++i)if(B.potentialHabits[i].id==t.id){B.potentialHabits.splice(i,1);break}b()},B.removeHabit=function(t){return L=!0,n.post(r.serverURL+"/habits/account/remove",t)},B.deleteCustomHabit=function(t){var a=s();return n.post(r.serverURL+"/habits/account/delete",t).success(function(){for(var e=0;e<B.potentialHabits.length;++e)if(B.potentialHabits[e].id==t){B.potentialHabits.splice(e,1);break}a.successCallback&&a.successCallback()}).error(function(){a.errorCallback&&a.errorCallback()}),a},B.removeLocalHabit=function(t){for(var a,e=0;e<B.accountHabits.length;++e){var i=B.accountHabits[e];if(i.id==t){a=i,B.accountHabits.splice(e,1),B.potentialHabits.push(a);break}}for(var n=0;n<B.accountHabits.length;++n)B.accountHabits[n].ordinate=n;b()},B.deleteHabitData=function(t){var a=s();return n.post(r.serverURL+"/habits/deleteHabitData",{habitDataId:t.id}).success(function(){var e=!1;for(var i in B.habitData){var n=B.habitData[i];for(var r in n){for(var o=n[r],u=0;u<o.length;++u){var c=o[u];if(c.id==t.id){o.splice(u,1),e=!0,0===o.length&&delete n[r];break}}if(e)break}if(e)break}a.successCallback&&a.successCallback()}).error(function(){a.errorCallback&&a.errorCallback()}),a},B.updateHabitDataNotes=function(t,a){return n.post(r.serverURL+"/habits/updateNotes",{habitDataId:t,notes:a})},B.buildMultiHabitDataArray=function(t,a,e,i,n,r,o){var u={habitId:a.id,habitValueId:a.habitValues[e].id,experiencedAt:i,goalMet:a.id>1?!!o:!1};n&&(u.habitSubValueIds=n),r&&(u.notes=r),t.push(u)},B.recordMultiHabitData=function(t){var a=s();if(r.isOnline())n.post(r.serverURL+"/habits/multiRecord",t).success(function(t){if(t)for(var e=0;e<t.length;++e){var i=t[e];y(i)}a.successCallback&&a.successCallback(t)}).error(function(){a.errorCallback&&a.errorCallback()});else{for(var i=0;i<t.length;++i){var o=t[i],u=B.getAccountHabitById(o.habitId),c=B.getHabitValueById(o.habitValueId),l=B.setLocalHabitData(u,c.ordinate,o.habitSubValueIds,!1,o.experiencedAt,o.notes,o);h(l)}a.success=function(t){return e(t),a}}return a},B.recordHabitData=function(t,a,e,i,n,r){var o=[];return B.buildMultiHabitDataArray(o,t,a,i,e,n,r),B.recordMultiHabitData(o)},B.buildMultiHabitDataUpdateArray=function(t,a,e,i,n,r,o,u){var c={habitDataId:e.id,habitId:a.id,habitValueId:a.habitValues[i].id,experiencedAt:n,goalMet:a.id>1?!!u:!1};r&&(c.habitSubValueIds=r),o&&(c.notes=o),t.push(c)},B.updateMultiHabitData=function(t){for(var a=s(),i=[],o=0;o<t.length;++o){var u=t[o],c=B.getAccountHabitById(u.habitId),l=B.getHabitValueById(c,u.habitValueId),b=B.setLocalHabitData(c,l.ordinate,u.habitSubValueIds,!0,u.experiencedAt,u.notes,u);i.push(b)}if(r.isOnline())n.post(r.serverURL+"/habits/multiUpdate",t).success(function(){a.successCallback&&a.successCallback()}).error(function(){a.errorCallback&&a.errorCallback()});else{for(var d=0;d<i.length;++d){var u=i[d];D(u)}a.success=function(t){return e(t),a}}return a},B.updateHabitData=function(t,a,e,i,n,r,o){var u=[];return B.buildMultiHabitDataUpdateArray(u,t,a,e,n,i,r,o),B.updateMultiHabitData(u)},B.has5BadConsecutiveMoodRatings=function(){return p(function(t){return 3>=t})},B.has5GoodConsecutiveMoodRatings=function(){return p(function(t){return t>=5})},B.getLocaHabitById=function(t){for(var a in B.habitData){var e=B.habitData[a],i=e[1];if(i)for(var n=0;n<i.length;++n){var r=i[n];if(r.localId&&r.localId==t)return r}}},B.getHabitDataList=function(t,a,e){var i=o.getDayString(a),n=B.habitData[i];n||(n=[],B.habitData[i]=n);var r=n[t.id];return!r&&e&&(r=[],n[t.id]=r),r},B.setLocalHabitData=function(t,a,e,i,n,r,o){var u,c=t.habitValues[a],s=new Date,l=n?n:s,b=B.getHabitDataList(t,l,!0);if(i&&b[0]){if(o)for(var f=0;f<b.length;++f){var H=b[f];if(H.habitDataId&&H.habitDataId==o.habitDataId||H.id&&H.id==o.id){u=H;break}}u||(u=b[0])}else u={experiencedAt:l},b.splice(0,0,u);return u.localId||u.id||(u.localId=generateGUID()),u.habitValueId=c.id,u.habitSubValueIds=e,u.recordedAt=s.getTime(),r&&(u.habitDataNotes?u.habitDataNotes.notes=r:u.habitDataNotes={notes:r}),"object"==typeof u.experiencedAt&&(u.experiencedAtStr=u.experiencedAt.toString()),d(),u},B.updateGoalOrdinal=function(t){var a=s();return n.post(r.serverURL+"/habits/account/updateGoal",{habitId:t.id,goalOrdinal:t.goalOrdinal}).success(function(){b(),a.successCallback&&a.successCallback()}).error(function(){a.errorCallback&&a.errorCallback()}),a},B.getRecentFeelings=function(){return B.recentFeelings},B.saveCustomFeelings=function(t){for(var a=s(),e=[],i=0;i<t.length;++i)e.push({valueString:t[i]});return n.post(r.serverURL+"/habits/createSubValues",e).success(function(t){for(var e=0;e<t.length;++e){var i=t[e];A(i)}H(),B.updateMoodHabitSubValues(t),a.successCallback&&a.successCallback(t)}).error(function(){a.errorCallback&&a.errorCallback()}),a},B.saveCustomFeeling=function(t){var a=s();return n.post(r.serverURL+"/habits/createSubValue",{valueString:t}).success(function(t){A(t),H(),B.updateMoodHabitSubValues([t]),a.successCallback&&a.successCallback(t)}).error(function(){a.errorCallback&&a.errorCallback()}),a},B.saveMindfulMinutes=function(t,a,e){window.plugins&&window.plugins.healthkit&&window.plugins.healthkit.requestAuthorization({readTypes:["HKCategoryTypeIdentifierSleepAnalysis","HKQuantityTypeIdentifierDietaryCaffeine","workoutType"],writeTypes:["HKCategoryTypeIdentifierMindfulSession"]},function(){window.plugins.healthkit.saveMindfulMinutes({value:t}),a&&a()},function(){e&&e()})},window.readHealthKitData=function(){V(),_(),k()},B.initHealthKit=function(t,a){window.plugins&&window.plugins.healthkit&&window.plugins.healthkit.available(function(){window.plugins.healthkit.requestAuthorization({readTypes:["HKCategoryTypeIdentifierSleepAnalysis","HKQuantityTypeIdentifierDietaryCaffeine","workoutType"],writeTypes:["HKCategoryTypeIdentifierMindfulSession"]},function(){readHealthKitData(),t&&t()},function(){a&&a()})},function(){})},B}]);