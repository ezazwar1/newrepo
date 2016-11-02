// weather app based on driftyco ionic-weather
// https://github.com/driftyco/ionic-weather
angular.module('ionic.metApp')
	.controller('HomeCtrl', ['$cordovaSplashscreen', 'IonicClosePopupService', 'weatherHelperService', 'metApi', '$scope', '$timeout', '$rootScope', 'Weather', 'Geo', 'Flickr', '$ionicModal', '$ionicPlatform', '$ionicPopup', '$interval', '$ionicBackdrop', '$state', '$ionicHistory', '$route', 'metCodes', '$localstorage',
		function($cordovaSplashscreen, IonicClosePopupService, weatherHelperService, metApi, $scope, $timeout, $rootScope, Weather, Geo, Flickr, $ionicModal, $ionicPlatform, $ionicPopup, $interval, $ionicBackdrop, $state, $ionicHistory, $route, metCodes, $localstorage) {
			/** @type {[object]} [HomeCtrl object instance] */
			var _this = this;
			$scope.activeBgImageIndex = 0;
			$scope.isFlipped = false;
			$rootScope.t = 'Today';
			$interval(function() {
				$rootScope.cdate = new Date();
			});

			ionic.Platform.ready(function() {
				$timeout(function() {
					$cordovaSplashscreen.hide();
					// navigator.splashscreen.hide();
				}, 300);
			})


			//  - - - - - - - - - - - - - - - - - - -
			// MET API functions: all functions look to met factory for consuming data
			// $scope.set_ddue_point(idx, arr) = weatherHelperService.set_dew_point(idx, arr);


			// show alert: can show any type of alert, its a very generic function
			$scope.showAlert = function(title, message) {
				var alertPopup = $ionicPopup.alert({
					title: title,
					template: message
				});
			}

			// close any modal found in the scope
			$scope.closeModal = function(a) {
				$scope[a].hide();
			}

			$scope.myGoBack = function() {
				$ionicHistory.goBack();
			};

			// when any modal is closed, hide the back drop
			$scope.$on('modal.hidden', function() {
				$ionicBackdrop.release();
			})


			// helper functins - - - - - - - - - - - - - - - - - - - - - - - - - \\
			// they help format dates and stuff - - - - - - - - - - - - - - - - - \\

			$scope.format_updated_at = function(time) {
				var mtime = [];
				mtime[0] = time.split(" ")[1]; // the entire time string
				mtime[1] = Number(mtime[0].substring(0, 2)); // the metars day
				mtime[2] = Number(mtime[0].substring(2, 4)) - 4; // the hour
				mtime[3] = Number(mtime[0].substring(4, 6)); // the minute
				var a = new Date();
				return new Date(Number(a.getFullYear()), Number(a.getMonth()), mtime[1], mtime[2], mtime[3]);
			}

			// get us the hour of day=> primarily for displaying the uv index hour: eg 11am
			// $scope.hourOfDay = function() {
			// 	var d = new Date();
			// 	var t = d.getHours();
			// 	if (t >= 0 && t <= 12) {
			// 		t = (t == 0 ? '12' : t) + ':' + ($scope.minuteOfDay()) + ' am';
			// 		if (d.getHours() == 12 && $scope.minuteOfDay() > '01') {
			// 			t = d.getHours() + ':' + $scope.minuteOfDay() + ' pm';
			// 		}
			// 	}
			// 	if (t > 12) {
			// 		t = (t - 12) + ':' + ($scope.minuteOfDay()) + ' pm';
			// 	}

			// 	return t;
			// }

			// $scope.minuteOfDay = function() {
			// 	var d = new Date();
			// 	return d.getMinutes() < 10 ? ('0' + d.getMinutes()) : d.getMinutes();
			// }

			$scope.searchTag = function() {
				var f = $localstorage.getObject('fcast');
				var tag = weatherHelperService.timeOfDaySimple();
				// console.log('tag before', tag);
				// f = {};
				if (f.forecastid) {
					// console.debug('f', f);
					var sunup_hour = weatherHelperService.am_pm_to_hours(f.sunrise, 'hour');
					var sunup_minute = weatherHelperService.am_pm_to_hours(f.sunrise, 'minute');
					tag = weatherHelperService.timeOfDay() ? weatherHelperService.timeOfDay() : tag;
					var d = new Date();
					var t = d.getHours();
					// (d.getHours() >= 0 && d.getHours() <= sunup_hour && d.getMinutes() <= sunup_minute)
					if (tag == 'morning' && t > sunup_hour && t < 7 && d.getMinutes() <= sunup_minute) {
						tag = 'sunrise';
						// console.debug('--------1------')
					}
					if (t >= 0 && t <= sunup_hour /*&& d.getMinutes() <= sunup_minute*/ ) { // between midnight and before sunup
						tag = 'night';
						// console.debug('--------2------')
					}
					if (tag == 'morning') {
						tag = 'mid day';
				// console.debug('--------3------')
					}

					// console.log('tag after', tag);
					// console.debug('its ' + tag, t, sunup_hour);
				}

				return tag;
			}

			// return a string of any day from the current day
			// @ add_days will be the number of days to add to today
			$scope.day_string = function(add_days, f) {
				// console.log('calling day_string function, passing in', add_days);
				var today = new Date();
				var hour = today.getHours();
				var minute = today.getMinutes();
				var td = today.getDay()
				var calc = td + add_days;

				if ((hour >= 0 || hour <= 7)) {
					if ( /*(hour == 5 && minute >= 30) &&*/ f.forecastTime == "05:30PM") {
						td--; // make today the day before
						calc = td + add_days;
						// console.debug('[HERE]', td, add_days, calc);
					}
				}
				// console.log('[debug] - current hour ' + hour, f);
				var days = [ /*'Fri', 'Sat', */ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'];
				return days[calc];
			}



			// checks if a specific word is in a string
			$scope.is_word_in_string = function(string, word) {
				return new RegExp('\\b' + word + '\\b', 'i').test(string);
			}

			// checks if a value is in an array
			// @ returns the position index if it was found
			$scope.inArray = function(needle, haystack) {
				for (i = 0; i < haystack.length; i++) {
					if (haystack[i] == needle) {
						return haystack[i];
					}
				}

				return false;
			}

			// metars fcast array
			$scope.metars_cloud = metCodes.all();

			$rootScope.go_toForecastHome = function() {
				$state.go('app.forecast_home', {});
			}

			$rootScope.get_fcast = function() {
				metApi.get_forecast().then(function(data) {
					// console.log('[fcast]', data.data.items[0]);
					$rootScope.fcast_result = data.data.items[0];
					// $rootScope.fcast_result.forecastTime = '05:30PM';
					$localstorage.setObject('fcast', $rootScope.fcast_result);
					$rootScope.$broadcast('f_cast_ready', $rootScope.fcast_result);
				}, function() {
					// error getting forecast
					$rootScope.doAlert('Error loading latest forecast');
					$rootScope.fcast_result = $localstorage.getObject('fcast');
					// $rootScope.fcast_result.forecastTime = '05:30PM';
					$rootScope.$broadcast('f_cast_ready', $rootScope.fcast_result);
					// var alertPopup = $ionicPopup.alert({
					// 	// title: $scope.title,
					// 	template: 'Error loading forecast',
					// 	cssClass: 'aws_popup',
					// 	okText: 'Close'
					// });
					// IonicClosePopupService.register(alertPopup);
					// $timeout(function() {
					// 	alertPopup.close();
					// }, 3000);
				})
			}

			$rootScope.get_metars = function() {
				metApi.get_metar().then(function(data) {
					$rootScope.metars_result = data.data.items;
					$localstorage.setObject('metars', $rootScope.metars_result);
					$rootScope.$broadcast('metars_loaded', $rootScope.metars_result);
				}, function() {
					// error getting metars
					$rootScope.doAlert('Error loading latest metars');
					$rootScope.metars_result = $localstorage.getObject('metars');
					$rootScope.$broadcast('metars_loaded', $rootScope.metars_result);
					// var alertPopup1 = $ionicPopup.alert({
					// 	// title: $scope.title,
					// 	template: 'Error loading metars',
					// 	cssClass: 'aws_popup',
					// 	okText: 'Close'
					// });
					// IonicClosePopupService.register(alertPopup1);
					// $timeout(function() {
					// 	alertPopup1.close();
					// }, 3000);
				})
			}

			$rootScope.globalRefresh = function() {
				$rootScope.get_fcast();
				$rootScope.get_metars();

				// $timeout(function() {
				// $rootScope.doToast('Weather Info. updated');
				// }, 2000)
			}

			// call forecast one as Trinidad and Tobago both use the same result
			// $rootScope.get_fcast();
			// $rootScope.get_metars();
		}

	])
	.controller('TrinCtrl', ['$filter', 'weatherHelperService', '$cordovaSocialSharing', 'metApi', '$scope', '$timeout', '$rootScope', 'Weather', 'Geo', 'Flickr', '$ionicModal', '$ionicPlatform',
		'$ionicPopup', '$interval', '$ionicBackdrop', '$state', '$ionicHistory', '$route', '$window', '$ionicLoading', '$localstorage', '$cordovaDialogs', 'metTT', '$ionicPopover',
		function($filter, weatherHelperService, $cordovaSocialSharing, metApi, $scope, $timeout, $rootScope, Weather, Geo, Flickr, $ionicModal, $ionicPlatform,
			$ionicPopup, $interval, $ionicBackdrop, $state, $ionicHistory, $route, $window, $ionicLoading, $localstorage, $cordovaDialogs, metTT, $ionicPopover) {
			var _this = this;
			var tc = _this;
			tc.show = true;


			$scope.fcastbago = "sunny"; // default bago fcast

			var interval = 10 * 60000;
			$interval(function time() {
				$ionicHistory.clearCache().then(function() {
					// alert('cache cleared')
					// console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
					// console.log('cache cleared')
					// $window.location.reload(true);
					$route.reload();
					// $state.reload();
					_this.refreshData();
					$rootScope.get_fcast();
					$rootScope.get_metars();
					_this.getBackgroundImage("Trinidad, " + $scope.searchTag());
					$route.reload();
				});
				$ionicHistory.clearHistory();
			}, interval);

			$rootScope.ref_trin = function() {
				_this.refreshData();
			}
			$scope.refreshImgTrin = function() {
				_this.getBackgroundImage("Trinidad, " + $scope.searchTag());
				$scope.popover.hide();
			}

			$scope.closePopover = function() {
				$scope.popover.hide();
			}

			$scope.share = function() {
				$cordovaSocialSharing.share('message', 'subject', 'file', 'link') // Share via native share sheet
				.then(function(result) {
					// Success!
				}, function(err) {
					// An error occured. Show a message to the user
				});
			}


			$rootScope.$on('metars_loaded', function(event, data) {
				// alert()
				_this.metars_trin();
			});

			$rootScope.$on('f_cast_ready', function(event, data) {
				_this.trin_3day();
				// alert();
				$scope.fcasttrin = weatherHelperService.timeOfDay() == 'night' ? 'fair-night' : 'fair'; // default trin fcast
				// console.debug('fcast trin loaded - fcast trin', $scope.fcasttrin);
			});
			_this.refreshData = function() {
				// $timeout(function() {
				// document.addEventListener('deviceready', function() {

				// Geo.getLocation().then(function(position) {
				// var lc = "";
				// var lat = position.coords.latitude;
				// var lng = position.coords.longitude;
				// google map service will give us a location string based on our current location (or nearest detected location)
				// Geo.reverseGeocode(lat, lng).then(function(locString) {
				// $scope.currentLocationString = locString;
				// $scope.trin_error = $scope.currentLocationString;
				// $scope.country = $scope.currentLocationString.indexOf('Tobago') > -1 ? 'Tobago' : 'Trinidad';
				// $scope.$watch('country', function() {
				// 	$rootScope.c = $scope.country;
				// })
				$timeout(function() {
					_this.get_uv_index();
				}, 1000)
				_this.getCurrent(null, null);
				// $rootScope.get_metars();
				$rootScope.get_fcast();
				$rootScope.get_metars();
				// _this.metars_trin();
				// _this.trin_3day();


				// });
				// }, function(error) {
				// in some cases something may go wrong
				// most times location service for android may be turned off
				// if (error.message == 'The last location provider was disabled') {
				// 	error.message = error.message + "<br> Try enabling Location services in Settings";
				// }
				// $scope.showAlert('Unable to get current location', 'Try enabling Location services in Settings');
				// $scope.currentLocationString = "Unable to get current location:" + error;
				// $rootScope.$broadcast('scroll.refreshComplete');

				// $scope.trin_error = $scope.currentLocationString;
				// });

				$ionicHistory.clearCache().then(function() {
					// console.log('cache cleared')
					$route.reload();
				});

			};

			_this.getCurrent = function(lat, lng) {
				// Weather.getAtLocation(lat, lng).then(function(resp) {
				// $scope.current = resp.data;
				$rootScope.$broadcast('scroll.refreshComplete');
				// $scope.today = $scope.my_date(); // today is
				// fetch a background image from flickr based on out location, time and current weather conditinos

				// }, function(error) {
				// var errorTxt = "";
				// switch (error.status) {
				// 	case 404:
				// 		errorTxt = "No network connection";
				// 		break;
				// 	case 'The last location provider was disabled': // attempt to catch error of location services being disabled
				// 		errorTxt = error.status + "<br> Try enabling Location services in Settings";
				// 		break;
				// }
				// $scope.showAlert('Unable to get current conditions', errorTxt);
				// $rootScope.$broadcast('scroll.refreshComplete');
				// });
			};

			// gives us a random background after a refresh

			/**
			 * @return {[type]}
			 */
			_this.cycleBgImages = function() {
				$timeout(function cycle() {
					if ($scope.bgImages) {
						var image_index = Math.floor(Math.random() * $scope.bgImages.length) + 0;
						// console.warn('IMAGE INDEX', image_index);
						$scope.activeBgImage = $scope.bgImages[image_index];
						// $scope.activeBgImage = $scope.bgImages[$scope.activeBgImageIndex++ % $scope.bgImages.length];
						$timeout(function() {
							// weatherHelperService.getAverageRGB(document.querySelector('#i-trin'), '.trin')
						}, 2000)
					}
				})
			}

			/**
			 * @param  {[string]} - locString: search string text that goes to Flickr photo search API
			 */
			this.getBackgroundImage = function(locString) {
				Flickr.search(locString).then(function(resp) {
					var photos = resp.photos;
					$scope.bgImages = photos.photo;
					// console.debug('from flickr', $scope.bgImages, locString);
					_this.cycleBgImages();
				}, function(error) {
					// console.log('Unable to get Flickr images', error);
				})
			}

			_this.get_uv_index = function() {
				var today_index = [];
				var today = new Date();
				$scope.has_index = true;
				var el = document.getElementById('uv-index');
				// var el = document.getElementsByClassName('trinuv');
				var d = today.getDate() + '.' + ((today.getMonth() + 1) < 9 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '.' + today.getFullYear();
				// $interval(function() {
				//     $scope.hour_of_day = $scope.hourOfDay();
				// }, 300)
				// these indexes represent uv values. but instead of using the value directly we use a color in place of the index to represent the value
				// the index will match to a color class to represent the uv_index value on the summary page
				var uv_c = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11'];
				metApi.get_uv_index(function(data) {
					// drop all uv_info not for today
					for (var i = 0; i < data.items.length; i++) {
						var uv_date_clean = data.items[i].uv_date.trim();
						// uv_date_clean = uv_date_clean.replace(/\s+/, "")
						// console.log(d, uv_date_clean)
						if (d == uv_date_clean) {
							today_index.push(data.items[i]);
						}
					}
					// console.log('today index', today_index);
					if (today_index.length) {
						$scope.uv_index = today_index[today_index.length - 1];
						var ii = Number($scope.uv_index.uv_value);
						var i = ii.toFixed(0);
						$scope.uv_index.uv_value = i; // our scope uv variable

						// console.log('scope uv', $scope.uv_index);

						// ensure the uv value matches the correct color class
						var ci = i == 0 || i == 1 ? 0 : i == 11 || i > 11 ? (11 - 1) : i - 1;
						$scope.uv_color = uv_c[ci];

						// remove any stray uv classes from the uv display
						for (x = 0; x < uv_c.length; x++) {
							if (hasClass(el, uv_c[x])) {
								el.classList.remove(uv_c[x])
							}
						}
						$scope.$watch('uv_color', function() {
							el.className = el.className + "  " + $scope.uv_color;
						})
					}
				})

				// console.log('today index', today_index);

				if (!today_index.length) {
					// console.log('has no index');
					$scope.has_index = false;
					var ti = [{
						'uv_value': 0
					}]
					$scope.uv_index = ti[0];

					// console.debug('element in angular', el);
					el.className = el.className + " c1";
				}
			}

			// test if a gived element has a given class
			function hasClass(el, cls) {
				return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
			}

			$scope.current_temp_trin = "Loading..";
			// $rootScope.$on('forecast_loaded', function(event, data) {
			//metars keys for trinidad
			_this.metars_trin = function() {
				// metApi.get_metar(function(data) {
				var m = $localstorage.getObject('metars'); //data;
				// console.log('metars trin', m)
				var ids = metTT.all();

				_this.mdata = [];
				// push any items with station of TTPP to the mdata array
				var count_ttpp = 0;
				for (i = 0; i < m.length; i++) {
					if (m[i].station == "TTPP" /* && ids[count_ttpp]*/ ) {
						// console.log('last before error', m[i]);
						if (m[count_ttpp].label.replace(':', '') == 'Clouds') {
							var temp = m[count_ttpp].value.toLowerCase();
							m[count_ttpp].value = temp.replace('agl', 'above ground level');
						}
						_this.mdata.push({
							'id': m[count_ttpp].id,
							'label': m[count_ttpp].label.replace(':', '') == 'Dewpoint' ? 'Relative Humidity' : m[count_ttpp].label.replace(':', ''),
							'station': m[count_ttpp].station,
							'value': m[count_ttpp].value,
							// 'value': m[count_ttpp].label.replace(':', '') == 'Clouds' ? m[count_ttpp].value.replace('AGL', 'above ground level') : m[count_ttpp].value,
							'icon': ids[count_ttpp].icon,
							'el': ids[count_ttpp].el,
							'show': ids[count_ttpp].show
						});
						count_ttpp++;
					}
				}

				// when was the metars updated
				$scope.updated_at = $scope.format_updated_at(_this.mdata[1].value);

				$scope.current_temp_trin = _this.mdata[2].value.substring(0, 3);
				_this.mdata[2].txt = 'Feels like a ' + weatherHelperService.cTemp(Number($scope.current_temp_trin));
				_this.mdata[5].value = weatherHelperService.cWind(_this.mdata[5].value);
				_this.mdata[8].value = weatherHelperService.capFLetter(_this.mdata[8].value);
				$scope.dew_point_trin = weatherHelperService.set_dew_point(3, _this.mdata);
				// alert($scope.dew_point_trin);
				_this.mdata[3].value = $scope.dew_point_trin

				// metars we compare against for building home screen up-to-date summary
				var mets = [];
				// use the parent scope metars_cloud array and compayr trinidad metars to it to buuld conditions
				for (i = 0; i < $scope.metars_cloud.length; i++) {
					if (_this.mdata[1].value.indexOf($scope.metars_cloud[i].code) > -1) {
						// console.log($scope.metars_cloud[i].code);
						mets.push($scope.metars_cloud[i].code);
					}
				}

				$scope.cc;
				// mets = ['-SHRA', 'FEW', 'SCT', 'SHRA']; // testing other conditions
				for (i = 0; i < mets.length; i++) {
					// start of cloud conditions
					if (mets[i] == "FEW") {
						if (!$scope.inArray('SCT', mets) && !$scope.inArray('BKN', mets) && !$scope.inArray('OVC', mets)) {
							$scope.cc = 'FEW';
						}
					}

					if (mets[i] == "SCT") {
						if (!$scope.inArray('BKN', mets) && !$scope.inArray('OVC', mets)) {
							$scope.cc = 'SCT';
						}
					}

					if ($scope.inArray('BKN', mets)) {
						$scope.cc = 'BKN';
					}

					if ($scope.inArray('OVC', mets)) {
						$scope.cc = 'OVC';
					}
					// end of cloud conditions

					// start of precipitation / weather conditions
					for (x = 0; x < $scope.metars_cloud.length; x++) {
						if (mets[mets.length - 1] == $scope.metars_cloud[x].code) {
							$scope.cc = $scope.metars_cloud[x].code;
						}
					}
					// end of weather conditions
				}


				var ci = "";
				for (x = 0; x < $scope.metars_cloud.length; x++) {
					if ($scope.cc == $scope.metars_cloud[x].code) {
						ci = $scope.metars_cloud[x].desc;
						$scope.summary_text_trin = ci;
					}
				}

				if (!ci) {
					ci = 'Clear';
					$scope.summary_text_trin = ci;
				}

				// ci = 'Clear';
				var d = new Date();
				$scope.fcasttrin = (ci == 'Clear' || ci == "Fair" ? ci + '-' + weatherHelperService.timeOfDay() : ci);
				// if we are between midnight and general sunrise time with clear conditions show us a moon
				// console.warn('the ci', ci)

				/* 0 here means midnight and 5 acts as the sun up time
				 * so, once we are between 0 and the sun up time then its still night time
				 * we will use compare the sun up hour and sun up minute to current time to know if its still night time
				 */
				var f = $localstorage.getObject('fcast');
				var sunup_hour = weatherHelperService.am_pm_to_hours(f.sunrise, 'hour');
				var sunup_minute = weatherHelperService.am_pm_to_hours(f.sunrise, 'minute');
				// console.debug('[debug] - sunup hour', sunup_hour, ' sunup minute', sunup_minute
				// console.debug('[debug] - this hour', d.getHours(), ' this minute', d.getMinutes());

				if ((ci == 'Clear' || ci == "Fair") && (d.getHours() >= 0 && d.getHours() <= sunup_hour && d.getMinutes() <= sunup_minute)) {
					// if(ci=='Clear' && parseInt($scope.hourOfDay()) >= 0 && parseInt($scope.hourOfDay()) <= 5) {
					$scope.fcasttrin = ci + '-night';
					// console.log('current hour', d.getHours());
				}
				// alert($scope.summary_text_trin);
				// console.debug('metars trin', mets, $scope.cc, ci, $scope.fcasttrin);
				// deal with summary text based on metars
				if (_this.mdata[1].value.indexOf('NOSIG') > -1) {
					// metars says no sig
					// when metars says no sig then we need an icon to say clear conditions for the current time of day
					var v = $scope.summary_text_trin; //!= undefined ? $scope.summary_text_trin : $scope.fcasttrin.replace('-', ' '); // + " " + weatherHelperService.timeOfDay();
					$scope.summary_text_trin = weatherHelperService.capFLetter(v);
				} else {
					// "value": "TTPP 181400Z 11007KT 3000 -SHRA VCSH FEW010CB SCT012 24/23 Q1015 TEMPO SHRA RMK CB-E/S SHWRS-ALL QUADS",
					// metars has a weather condition
					// we pull the weather condition string from the weather index of the data set
					// weather index only exists when NOSIG is not present
					$scope.summary_text_trin = weatherHelperService.capFLetter(_this.mdata[9] ? _this.mdata[9].value.match(/\(([^)]+)\)/)[1] : $scope.summary_text_trin).replace('(', ''); // this is the weather index
					// when metars tells us that we have a weather condition then we need to match that current condition to our array of conditions
					// and select the appropriate icon
				}

				if ($scope.summary_text_trin.indexOf('Haze') > -1) {
					$scope.summary_text_trin = "Dust, smoke and other dry particles may be in the air"
				}

				// correct cloudy icon for day or night
				if ($scope.fcasttrin.indexOf('Cloudy') > -1 || $scope.fcasttrin.indexOf('cloudy') > -1) {
					var tod = weatherHelperService.timeOfDay() == 'night' ? '-night' : '';
					$scope.fcasttrin = $scope.fcasttrin + tod;
					if (d.getHours() >= 0 && d.getHours() <= sunup_hour && d.getMinutes() <= sunup_minute) {
						// if (parseInt(d.getHours()) >= 0 && parseInt(d.getHours()) <= 5) {
						$scope.fcasttrin = $scope.fcasttrin + '-night';
					}
				}

				// })
			} // end of get metars trin

			// console.debug('trin summary', $scope.summary_text_trin);
			// })


			// shows the modal for trin metars: slide up from bottom
			$scope.showMetarsTrin = function() {
				$ionicBackdrop.retain();
				if (!$scope.mettrin_modal) {
					// load modal from given template URL
					$ionicModal.fromTemplateUrl('app/home/metars-trin.html', function(mt_modal) {
						$scope.mettrin_modal = mt_modal;
						$scope.mettrin_modal.show();

					}, {
						// animation we want for modal entrance
						// animation: 'scale-in'
						animation: 'slide-in-up',
						scope: $scope
					})
				} else {
					$scope.mettrin_modal.show();
				}
			}

			$scope.open_trin_popover = function($event) {
				// console.debug(e);
				$ionicPopover.fromTemplateUrl('app/home/trin_popover.html', {
					scope: $scope
				}).then(function(popover) {
					$scope.popover = popover;
					$scope.popover.show($event);
					// console.debug('popover', $scope.popover)
				})
			}
			// outlook tv for the 3-day forecast
			_this.trin_3day = function(t) { // can be input of the country we load data for
				// _this.wicons = [];
				var f = $localstorage.getObject('fcast'); //$rootScope.fcast_result;

				$scope.tm = $scope.day_string(1, f);
				$scope.nd = $scope.day_string(2, f);
				// $rootScope.get_forecast

				// get forecast for first day of 3-day forecast
				// metApi.get_forecast(function(data) {
				// console.debug('trin fcast', $rootScope.fcast_result);
				// $rootScope.$on('f_cast_ready', function(event, data) {

				// alert('fcast ready');


				// console.debug('f', f)


				_this.ftime_trin = f.forecastTime;
				// alert(_this.ftime_trin);

				if (_this.ftime_trin == "05:30PM") {
					// $localstorage.setObject('530pm_fcast', f);
					// console.debug('530pm forecast from local storage', $localstorage.getObject('530pm_fcast'));
					$rootScope.t = 'Tonight';
					// today
					_this.th = f.PiarcoFcstMxTemp;
					_this.tl = f.PiarcoFcstMnTemp;
					// tomorrow
					_this.maxtm = f.TmPiarcoMxTemp;
					_this.mintm = f.TmPiarcoMnTemp;
					$scope.trin_tm_icon = f.TmWeatherPiarcoMx ? f.TmWeatherPiarcoMx : 'sunny';
					// 24
					_this.max24 = f.maxTrin24look;
					_this.min24 = f.minTrin24look;
					$scope.trin_24_icon = f.wx24 ? f.wx24 : 'sunny';
					// 48
					// 48 is on standby, it will be used as the last day in the 530am forecast

				}
				// 530 am
				if (_this.ftime_trin != '05:30PM') {
					// today
					$rootScope.t = 'Today';
					_this.th = f.PiarcoFcstMxTemp;
					// ff = $localstorage.getObject('530pm_fcast');
					// console.log('530pm stored data', ff);
					_this.tl = f.TmPiarcoMnTemp;
					//tomorrow
					_this.maxtm = f.maxTrin24look;
					_this.mintm = f.minTrin24look;
					$scope.trin_tm_icon = f.wx24 ? f.wx24 : 'sunny';
					// 24
					_this.max24 = f.maxTrin48look;
					_this.min24 = f.minTrin48look;
					$scope.trin_24_icon = f.wx48 ? f.wx48 : 'sunny';
				}

				$scope.trin_icon_today = f.imageTrin ? f.imageTrin : 'sunny'; // this will always be the latest from the api
				// alert($scope.trin_icon_today)
				// _this.sunup = f.sunrise;
				// _this.sundown = f.sunset;
				// })
			}

			// do initial load
			_this.refreshData();
			// _this.getBackgroundImage("Trinidad, " + $scope.searchTag());
			$timeout(function() {
				_this.getBackgroundImage("Trinidad, " + $scope.searchTag());
			}, 300);

			$ionicPlatform.on("resume", function() {
				// alert('platform resume');
				_this.refreshData();
				// _this.getBackgroundImage("Trinidad, " + $scope.searchTag());
				$timeout(function() {
					_this.getBackgroundImage("Trinidad, " + $scope.searchTag());
				}, 300);
				// PushNotificationsService.register();
			});
			// $scope.$on('$ionicView.enter', function() {
			//     $rootScope.globalRefresh();
			// });
		}
	])
	.controller('BagoCtrl', ['weatherHelperService', 'metApi', '$scope', '$timeout', '$rootScope', 'Weather', 'Geo', 'Flickr', '$ionicModal',
		'$ionicPlatform', '$ionicPopup', '$interval', '$ionicBackdrop', '$state', '$ionicHistory', '$route', '$ionicLoading', '$localstorage', 'metTB', '$ionicPopover',
		function(weatherHelperService, metApi, $scope, $timeout, $rootScope, Weather, Geo, Flickr, $ionicModal,
			$ionicPlatform, $ionicPopup, $interval, $ionicBackdrop, $state, $ionicHistory, $route, $ionicLoading, $localstorage, metTB, $ionicPopover) {
			var _this = this;
			var bc = _this;
			bc.show = true;
			// $scope.$ionicSideMenuDelegate = $ionicSideMenuDelegate;

			$scope.fcastbago = "sunny"; // default bago fcast
			var interval = 10 * 60000;
			$interval(function time() {
				$ionicHistory.clearCache().then(function() {
					$rootScope.get_fcast();
					$rootScope.get_metars();
					// _this.refreshData();
					$route.reload();
					_this.getBackgroundImage("Tobago, " + $scope.searchTag());
				});
				$ionicHistory.clearHistory();
			}, interval);
			// refresh when we flip screen
			$rootScope.ref_bago = function() {
				_this.refreshData();
			}

			$scope.open_bago_popover = function($event) {
				// console.debug(e);
				$ionicPopover.fromTemplateUrl('app/home/bago_popover.html', {
					scope: $scope
				}).then(function(popover) {
					$scope.popover = popover;
					$scope.popover.show($event);
					// console.debug('popover', $scope.popover)
				})
			}

			$scope.refreshImgBago = function() {
				_this.getBackgroundImage("Tobago, " + $scope.searchTag());
				$scope.popover.hide();
			}

			$scope.closePopover = function() {
				$scope.popover.hide();
			}

			$rootScope.$on('metars_loaded', function(event, data) {
				_this.metars_bago();
			});

			$rootScope.$on('f_cast_ready', function(event, data) {
				_this.bago_3day();
				$scope.fcastbago = weatherHelperService.timeOfDay() == 'night' ? 'fair-night' : 'fair'; // default trin fcast
			});

			_this.refreshData = function() {
				// Geo.getLocation().then(function(position) {
				// 	var lc = "";
				// 	var lat = position.coords.latitude;
				// 	var lng = position.coords.longitude;
				// 	// google map service will give us a location string based on our current location (or nearest detected location)
				// 	Geo.reverseGeocode(lat, lng).then(function(locString) {
				// 		$scope.currentLocationString = locString;
				_this.getCurrent(null, null);
				$rootScope.get_fcast();
				$rootScope.get_metars();
				// $rootScope.get_metars();
				// _this.bago_3day();
				// _this.set_time_bubble();
				// _this.metars_bago();
				// 	});
				// }, function(error) {
				// 	// in some cases something may go wrong
				// 	// most times locatio service for android may be turned off
				// 	if (error.message == 'The last location provider was disabled') {
				// 		error.message = error.message + "<br> Try enabling Location services in Settings";
				// 	}
				// 	$scope.showAlert('Unable to get current location', 'Try enabling Location services in Settings');
				// 	$scope.currentLocationString = "Unable to get current location:" + error;
				// 	$rootScope.$broadcast('scroll.refreshComplete');
				// });

			};

			_this.getCurrent = function(lat, lng) {
				// Weather.getAtLocation(lat, lng).then(function(resp) {
				// $scope.current = resp.data;
				// $rootScope.$broadcast('scroll.refreshComplete');
				// $scope.today = $scope.my_date();

				// }, function(error) {
				// 	var errorTxt = "";
				// 	switch (error.status) {
				// 		case 404:
				// 			errorTxt = "No network connection";
				// 			break;
				// 		case 'The last location provider was disabled': // attempt to catch error of location services being disabled
				// 			errorTxt = error.status + "<br> Try enabling Location services in Settings";
				// 			break;
				// 	}
				// $scope.showAlert('Unable to get current conditions', errorTxt);
				$rootScope.$broadcast('scroll.refreshComplete');
				// });
			};

			// gives us a random background after a refresh
			_this.cycleBgImages = function() {
				$timeout(function cycle() {
					if ($scope.bgImages) {
						var image_index = Math.floor(Math.random() * $scope.bgImages.length) + 0;
						// console.debug('image index', image_index);
						$scope.activeBgImage = $scope.bgImages[image_index];
						// $scope.activeBgImage = $scope.bgImages[$scope.activeBgImageIndex++ % $scope.bgImages.length];
						setTimeout(function() {
							// weatherHelperService.getAverageRGB(document.querySelector('#i-bago'), '.bago')
						}, 2000)
					}
				})
			}

			// gets images from flickr, consimes flicker api, with s failed attempt to cache images in local storage
			this.getBackgroundImage = function(locString) {
				Flickr.search(locString).then(function(resp) {
					var photos = resp.photos;
					$scope.bgImages = photos.photo;
					_this.cycleBgImages();
				}, function(error) {
					// console.log('Unable to get Flickr images', error);
				})
			}

			$scope.current_temp = "Loading..";
			// $rootScope.$on('forecast_loaded', function(event, data) {
			_this.metars_bago = function() {
				// metApi.get_metar(function(data) {
				// var m = data;
				var m = $localstorage.getObject('metars');
				// ids of metars for tobago
				var ids = metTB.all();

				_this.mdatab = null;
				_this.mdatab = [];
				var c = 0;
				for (i = 0; i < m.length; i++) { // metars
					if (m[i].station == 'TTCP') {
						if (m[i].label.replace(':', '') == 'Clouds') {
							var temp = m[i].value.toLowerCase();
							m[i].value = temp.replace('agl', 'above ground level');
						}
						_this.mdatab.push({
							'id': m[i].id,
							'label': m[i].label.replace(':', '') == 'Dewpoint' ? 'Relative Humidity' : m[i].label.replace(':', ''),
							'station': m[i].station,
							'value': m[i].value,
							'icon': ids[c] != undefined ? ids[c].icon : '',
							'el': ids[c] != undefined ? ids[c].el : '',
							'show': ids[c] != undefined ? ids[c].show : ''
						});
						c++;
					}
				}

				$scope.updated_at = $scope.format_updated_at(_this.mdatab[1].value);

				$scope.current_temp = _this.mdatab[2].value.substring(0, 3);
				_this.mdatab[2].txt = 'Looks like a ' + weatherHelperService.cTemp(Number($scope.current_temp));
				_this.mdatab[5].value = weatherHelperService.cWind(_this.mdatab[5].value);
				_this.mdatab[8].value = weatherHelperService.capFLetter(_this.mdatab[8].value);
				$scope.dew_point = weatherHelperService.set_dew_point(3, _this.mdatab);
				_this.mdatab[3].value = $scope.dew_point;

				var mets = [];
				for (i = 0; i < $scope.metars_cloud.length; i++) {
					if (_this.mdatab[1].value.indexOf($scope.metars_cloud[i].code) > -1) {
						// console.log($scope.metars_cloud[i].code);
						mets.push($scope.metars_cloud[i].code);
					}
				}

				$scope.cd;
				for (i = 0; i < mets.length; i++) {
					// start of clouf conditions
					if (mets[i] == "FEW") {
						// cannot have SCT, BKN or OVC
						if (!$scope.inArray('SCT', mets) && !$scope.inArray('BKN', mets) && !$scope.inArray('OVC', mets)) {
							$scope.cc = 'FEW';
						}
					}
					if (mets[i] == "SCT") {
						if (!$scope.inArray('BKN', mets) && !$scope.inArray('OVC', mets)) {
							$scope.cc = 'SCT';
						}
					}
					if ($scope.inArray('BKN', mets)) {
						$scope.cc = 'BKN';
					}
					if ($scope.inArray('OVC', mets)) {
						$scope.cc = 'OVC';
					}
					// end of cloud conditions
					// start of precipitation / weather conditions
					for (x = 0; x < $scope.metars_cloud.length; x++) {
						if (mets[mets.length - 1] == $scope.metars_cloud[x].code) {
							$scope.cd = $scope.metars_cloud[x].code;
						}
					}
				}

				var ci = "";
				for (x = 0; x < $scope.metars_cloud.length; x++) {
					if ($scope.cd == $scope.metars_cloud[x].code) {
						ci = $scope.metars_cloud[x].desc;
						$scope.summary_text = ci;
					}
				}

				if (!ci) {
					ci = 'Clear';
					$scope.summary_text = ci;
				}
				// temp variable
				var d = new Date();
				$scope.fcastbago = ci == 'Clear' || ci == 'Fair' ? ci + '-' + weatherHelperService.timeOfDay() : ci;

				var f = $localstorage.getObject('fcast');
				var sunup_hour = weatherHelperService.am_pm_to_hours(f.sunrise, 'hour');
				var sunup_minute = weatherHelperService.am_pm_to_hours(f.sunrise, 'minute');
				// console.debug('[debug] - sunup hour', sunup_hour, ' sunup minute', sunup_minute);
				// console.debug('[debug] - this hour', d.getHours(), ' this minute', d.getMinutes());

				if ((ci == 'Clear' || ci == "Fair") && (d.getHours() >= 0 && d.getHours() <= sunup_hour && d.getMinutes() <= sunup_minute)) {
					// console.log(d.getHours())
					// if ((ci == 'Clear' || ci == 'Fair') && parseInt(d.getHours()) >= 0 && parseInt(d.getHours()) <= 5) {
					$scope.fcastbago = ci + '-night';
				}
				// console.debug('metars bago', mets, $scope.cd, ci, $scope.fcastbago);
				// deal with summary text based on metars
				if (_this.mdatab[1].value.indexOf('NOSIG') > -1) {
					var v = $scope.summary_text; // + " " + weatherHelperService.timeOfDay();;
					$scope.summary_text = weatherHelperService.capFLetter(v);
				} else {
					// console.debug('[tobago metars]', _this.mdatab);
					$scope.summary_text = weatherHelperService.capFLetter(_this.mdatab[9] ? _this.mdatab[9].value.match(/\(([^)]+)\)/)[1] : $scope.summary_text).replace('(', ''); // this is the weather index
				}

				if ($scope.summary_text.indexOf('Haze') > -1) {
					$scope.summary_text = "Dust, smoke and other dry particles may be in the air"
				}
				// correct cloudy icon for day or night
				if ($scope.fcastbago.indexOf('Cloudy') > -1 || $scope.fcastbago.indexOf('cloudy') > -1) {
					var tod = weatherHelperService.timeOfDay() == 'night' ? '-night' : '';
					$scope.fcastbago = $scope.fcastbago + tod;
					if (d.getHours() >= 0 && d.getHours() <= sunup_hour && d.getMinutes() <= sunup_minute) {
						$scope.fcastbago = $scope.fcastbago + '-night';
					}
				}
				// })
				// })
			}

			// _this.set_time_bubble = function() {
			//     // these indexes represent uv values. but instead of using the value directly we use a color in place of the index to represent the value
			//     // the index will match to a color class to represent the uv_index value on the summary page
			//     var today = new Date();
			//     var d = today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear();
			//     $scope.hour_of_day = $scope.hourOfDay();
			// }

			$scope.showMetarsBago = function() {
				$ionicBackdrop.retain();
				if (!$scope.metbago_modal) {
					// load modal from given template URL
					$ionicModal.fromTemplateUrl('app/home/metars-bago.html', function(mb_modal) {
						$scope.metbago_modal = mb_modal;
						$scope.metbago_modal.show();
					}, {
						animation: 'slide-in-up'
					})
				} else {
					$scope.metbago_modal.show();
				}
			}

			_this.bago_3day = function(t) { // can be input of the country we load data for
				// $scope.t = 'Today';


				// metApi.get_forecast(function(data) {
				var f = [];
				// wait for update
				// $rootScope.$on('f_cast_ready', function(event, data) {
				// $timeout(function() {
				// console.debug('bago fcast', $rootScope.fcast_result);
				// f = $rootScope.fcast_result; //data.items[0];
				var f = $localstorage.getObject('fcast'); //$rootScope.fcast_result;
				$scope.tm = $scope.day_string(1, f);
				$scope.nd = $scope.day_string(2, f);
				// $rootScope.$apply();
				_this.ftime_bago = f.forecastTime;

				if (_this.ftime_bago == "05:30PM") {
					// $localstorage.setObject('530pm_fcast', f);
					// console.debug('530pm forecast from local storage', $localstorage.getObject('530pm_fcast'));
					// $scope.t = 'Tonight';
					$rootScope.t = 'Tonight';
					// alert($scope.t)
					// today
					_this.th = f.CrownFcstMxTemp ? f.CrownFcstMxTemp : ' - ';
					_this.tl = f.CrownFcstMnTemp ? f.CrownFcstMnTemp : ' - ';
					// tomorrow
					_this.maxtm = f.TmCrownMxTemp;
					_this.mintm = f.TmCrownMnTemp;
					$scope.bago_tm_icon = f.TmWeatherCpMx ? f.TmWeatherCpMx : 'sunny';
					// 24
					_this.max24 = f.maxTob24look;
					_this.min24 = f.minTob24look;
					$scope.bago_24_icon = f.wx24cp ? f.wx48cp : 'sunny';
					// 48
					// 48 is on standby, it will be used as the last day in the 530am forecast

				}
				// 530 am
				if (_this.ftime_bago != '05:30PM') {
					$rootScope.t = 'Today';
					// today
					_this.th = f.CrownFcstMxTemp ? f.CrownFcstMxTemp : ' - ';
					ff = $localstorage.getObject('530pm_fcast');
					_this.tl = f.TmCrownMnTemp ? f.TmCrownMnTemp : ' - ';
					//tomorrow
					_this.maxtm = f.maxTob24look;
					// alert(f.maxTob24look);
					_this.mintm = f.minTob24look;
					$scope.bago_tm_icon = f.wx24cp ? f.wx24cp : 'sunny';
					// 24
					_this.max24 = f.maxTob48look;
					_this.min24 = f.minTob48look;
					$scope.bago_24_icon = f.wx48cp ? f.wx48cp : 'sunny';
				}
				$scope.bago_icon_today = f.imagebago; // this will always be the latest from the api

			}

			// _this.refreshData();
			_this.metars_bago();
			_this.bago_3day();
			_this.getBackgroundImage("Tobago, " + $scope.searchTag());
			// _this.set_time_bubble();


			// $scope.$on('$ionicView.enter', function() {
			//     $rootScope.globalRefresh();
			// });

		}
	])
