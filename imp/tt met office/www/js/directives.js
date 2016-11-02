angular.module('ionic.metApp.directives', ['ngAnimate'])



// .constant('WEATHER_ICONS', {
//     'partlycloudy': 'ion-ios-partlysunny-outline',
//     'mostlycloudy': 'ion-ios-partlysunny-outline',
//     'cloudy': 'ion-ios-cloudy-outline',
//     'rain': 'ion-ios-rainy-outline',
//     'tstorms': 'ion-ios-thunderstorm-outline',
//     'sunny': 'ion-ios-sunny-outline',
//     'clear-day': 'ion-ios-sunny-outline',
//     'nt_clear': 'ion-ios-moon-outline',
//     'clear-night': 'ion-ios-moon-outline'
// })

// .directive('weatherIcon', function(WEATHER_ICONS) {
//     return {
//         restrict: 'E',
//         replace: true,
//         scope: {
//             icon: '='
//         },
//         template: '<i class="icon" ng-class="weatherIcon"></i>',
//         link: function($scope) {
//             // console.log($scope)
//             $scope.$watch('icon', function(v) {
//                 if (!v) {
//                     return;
//                 }

//                 var icon = v;

//                 if (icon in WEATHER_ICONS) {
//                     $scope.weatherIcon = WEATHER_ICONS[icon];
//                 } else {
//                     $scope.weatherIcon = WEATHER_ICONS['cloudy'];
//                 }
//                 // console.log(icon)
//             });
//         }
//     }
// })

// .directive('currentIcon', function(WEATHER_ICONS) {

//     return {
//         restrict: 'E',
//         replace: true,
//         scope: {
//             icon: '='
//         },
//         template: '<i class="icon" ng-class="currentIcon"></i>',
//         link: function($scope) {
//             $scope.$watch('icon', function(v) {
//                 if (!v) {
//                     return;
//                 }
//                 var icon = v;
//                 if (icon in WEATHER_ICONS) {
//                     $scope.currentIcon = WEATHER_ICONS[icon];
//                 } else {
//                     $scope.currentIcon = WEATHER_ICONS['cloudy'];
//                 }
//             });
//         }
//     }
// })

.directive('currentTime', ['$timeout', '$filter',
	function($timeout, $filter) {
		return {
			restrict: 'E',
			replace: true,
			template: '<span class="current-time">{{currentTime}}</span>',
			scope: {
				localtz: '=',
			},
			link: function($scope, $element, $attr) {
				$timeout(function checkTime() {
					if ($scope.localtz) {
						$scope.currentTime = $filter('date')(+(new Date), 'h:mm') + $scope.localtz;
						// console.log($scope.currentTime);
					}
					$timeout(checkTime, 500);
				});
			}
		}
	}
])

// need two of this
.directive('currentWeatherTrin', ['$timeout', '$rootScope',
	function($timeout, $rootScope) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/home/current-weather-trin.html',
			// controller: 'HomeCtrl',
			scope: true,
			compile: function(element, attr) {
				return function($scope, $element, $attr) {
					// Delay so we are in the DOM and can calculate sizes
					$timeout(function() {
						var windowHeight = window.innerHeight;
						var thisHeight = $element[0].offsetHeight;
						var headerHeight = document.querySelector('.header.trin').offsetHeight;
						// $element[0].style.paddingTop = (windowHeight - (thisHeight) + 10) + 'px';
						$element[0].style.paddingTop = (windowHeight - thisHeight) / 5 + 'px';

						if (((windowHeight - thisHeight) / 5) < 0) {
							$element[0].style.paddingTop = '80px';
						}

					// console.log((windowHeight - thisHeight) / 2)
						angular.element(document.querySelector('.content')).css('-webkit-overflow-scrolling', 'auto');
						$timeout(function() {
							angular.element(document.querySelector('.content')).css('-webkit-overflow-scrolling', 'touch');
						}, 50);
					});
				}
			}
		}
	}
])
	.directive('currentWeatherBago', ['$timeout', '$rootScope',
		function($timeout, $rootScope) {
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'app/home/current-weather-bago.html',
				// controller: 'HomeCtrl',
				scope: true,
				compile: function(element, attr) {
					return function($scope, $element, $attr) {
						// Delay so we are in the DOM and can calculate sizes
						$timeout(function() {
							var windowHeight = window.innerHeight;
							var thisHeight = $element[0].offsetHeight;
							var headerHeight = document.querySelector('.header.bago').offsetHeight;
							$element[0].style.paddingTop = (windowHeight - thisHeight) / 5 + 'px';
							angular.element(document.querySelector('.content')).css('-webkit-overflow-scrolling', 'auto');
							$timeout(function() {
								angular.element(document.querySelector('.content')).css('-webkit-overflow-scrolling', 'touch');
							}, 50);
						});
					}
				}
			}
		}
	])

.directive('forecast', ['$timeout',
	function($timeout) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/home/forecast.html',
			link: function($scope, $element, $attr) {}
		}
	}
])

.directive('fiveThirty', ['$timeout',
	function($timeout) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/forecast/five-thirty.html',
			link: function($scope, $element, $attr) {}
		}
	}
])

.directive('tenThree', ['$timeout',
	function($timeout) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/forecast/ten-three.html',
			link: function($scope, $element, $attr) {}
		}
	}
])

.directive('fiveThirtyp', ['$timeout',
	function($timeout) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/forecast/five-thirtyp.html',
			link: function($scope, $element, $attr) {}
		}
	}
])

.directive('weatherBox', ['$timeout',
	function($timeout) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			scope: {
				title: '@'
			},
			template: '<div class="weather-box"><h4 class="title">{{title}}</h4><div ng-transclude></div></div>',
			link: function($scope, $element, $attr) {}
		}
	}
])

.directive('scrollEffects', function() {
	return {
		restrict: 'A',
		link: function($scope, $element, $attr) {
			var amt, st, header;
			var bg = document.querySelector('.bg-image');
			var ff = document.getElementById('trin-img');
			$element.bind('scroll', function(e) {
				if (!header) {
					header = document.querySelector('.header');
				}
				st = e.detail.scrollTop;
				if (st >= 0) {
					// header.style.webkitTransform = 'translate3d(0, 0, 0)';
				} else if (st < 0) {
					// header.style.webkitTransform = 'translate3d(0, ' + -st + 'px, 0)';
				}
				amt = Math.min(0.6, st / 1000);
				var b_amount = 5;
				var blur = "-webkit-filter: blur(" + Math.abs(amt * b_amount) + "px);" +
					"-moz-filter: blur(" + amt * b_amount + "px);" +
					"-o-filter: blur(" + amt * b_amount + "px);" +
					"-ms-filter: blur(" + amt * b_amount + "px);" +
					"filter: url('data:image/svg+xml;utf9,<svg%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'><filter%20id='blur'><feGaussianBlur%20stdDeviation='60'%20/></filter></svg>#blur');" +
					"filter:progid:DXImageTransform.Microsoft.Blur(PixelRadius='" + amt * b_amount + "');" +
					"clip: rect(520px 573px 516px 351px);" // /*transition: all 0.1s ease-in-out;*/';
					// ff.setAttribute("style", blur);
					// header.setAttribute("style", "-webkit-filter: blur("+amt*10+"px); -moz-filter: blur("+amt*10+"px); -o-filter: blur("+amt*10+"px); -ms-filter: blur("+amt*10+"px); filter: url('data:image/svg+xml;utf9,<svg%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'><filter%20id='blur'><feGaussianBlur%20stdDeviation='60'%20/></filter></svg>#blur'); filter:progid:DXImageTransform.Microsoft.Blur(PixelRadius='"+amt*10+"'); clip: rect(520px 573px 516px 351px); /*transition: all 0.1s ease-in-out;*/");
					// console.log(ff)
					// ff.style.WebkitFilter = "blur(" + Math.abs(amt * b_amount) + "px)";
					// $element.style = blur;
					// ff.style = 'translate3d(' + amt * b_amount + 'px,' + st + 'px, 0)';
					// console.log($element[0])
					// console.log(ff)
				ionic.requestAnimationFrame(function() {
					// console.log(amt)
					header.style.opacty = 1 - amt;
					if (bg) {
						bg.style.opacity = 1 - amt;
						// bg.setAttribute("style", "-webkit-filter: blur("+amt*2+"px)")
					}
				});
			});
		}
	}
})

.directive('backgroundCyclerTrin', ['$compile', '$animate',
	function($compile, $animate) {
		// alert();
		var animate = function($scope, $element, newImageUrl) {
			var child = $element.children()[0];
			var scope = $scope.$new();
			scope.url = newImageUrl;
			// var url = "img/home-images/" + $scope.default_trin + ".jpg";
			//         var item = v;
			//         url = "http://farm" + item.farm + ".static.flickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_z.jpg";
			var img = $compile('<background-image></background-image>')(scope);

			$animate.enter(img, $element, null, function() {

			});

			if (child) {
				$animate.leave(angular.element(child), function() {

				});
			}
		};

		return {
			restrict: 'E',
			link: function($scope, $element, $attr) {
				$scope.$watch('activeBgImage', function(v) {
					if (!v) {
						return;
					}
					// console.log('Active bg image changed', v);
					// we need a default background untill the one from flickr is loaded
					var url = "img/home-images/" + $scope.default_trin + ".jpg";
					var item = v;
					url = "http://farm" + item.farm + ".static.flickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_z.jpg";
					// console.log(url);
					// place scope fcast here to get image for the current weather contition
					// var url = "app/home/IMG_3133.jpg"
					// console.warn($scope)
					// var url = '';
					$el2 = document.getElementById('menu-bg');
					$el2.style.background = 'url(' + url + ')'
					// $el2.setAttribute("cache-src", url);
					// $el2.setAttribute("src-is", "background");

					// used for dynamic header background
					$el3 = document.getElementById('i-trin');
					$el3.src = url;
					// $el3.setAttribute("cache-src", url);
					// $el3.setAttribute("src-id", "background");
					// console.log($element);
					// alert("1");
					animate($scope, $element, url);
				});
			}
		}
	}
])
	.directive('backgroundCyclerBago', ['$compile', '$animate',
		function($compile, $animate) {
			var animate = function($scope, $element, newImageUrl) {
				var child = $element.children()[0];
				var scope = $scope.$new();
				scope.url = newImageUrl;
				var img = $compile('<background-image></background-image>')(scope);

				$animate.enter(img, $element, null, function() {

				});

				if (child) {
					$animate.leave(angular.element(child), function() {

					});
				}
			};

			return {
				restrict: 'E',
				link: function($scope, $element, $attr) {
					$scope.$watch('activeBgImage', function(v) {
						if (!v) {
							return;
						}
						// console.log('Active bg image changed', v);
						var item = v;
						var url = "http://farm" + item.farm + ".static.flickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_z.jpg";
						$el2 = document.getElementById('menu-bg');
						$el2.style.background = 'url(' + url + ')'

						$el3 = document.getElementById('i-bago');
						$el3.src = url;
						// console.log($element);
						// alert("1");
						animate($scope, $element, url);
					});
				}
			}
		}
	])


.directive('backgroundImage', ['$compile', '$animate', '$timeout',
	function($compile, $animate, $timeout) {
		return {
			restrict: 'E',
			template: '<div class="bg-image"><div class="background-vignette"></div></div>',
			replace: true,
			scope: true,
			link: function($scope, $element, $attr) {
				if ($scope.url) {
					// $element[0].setAttribute("cache-src", $scope.url);
					// $element[0].setAttribute("src-is", "background");
					$element[0].style.background = 'url(' + $scope.url + ') no-repeat center center fixed';
					$timeout(function() {
						$('.bg-image').css({
							// 'background': 'url(' + $scope.url + ') no-repeat center center fixed',
							'-webkit-background-size': 'cover',
							'-moz-background-size': 'cover',
							'-o-background-size': 'cover',
							'background-size': 'cover'
						});
					}, 1000)
				}
			}
		}
	}
])

// sun up and down icons for trin and bago
.directive('trinSunUp', ['$timeout',
	function($timeout) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/home/svg/sun-rise.html',
			link: function($scope, $element, $attr) {}
		}
	}
])

.directive('trinSunDown', ['$timeout',
	function($timeout) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/home/svg/sun-set.html',
			link: function($scope, $element, $attr) {}
		}
	}
])

.directive('bagoSunUp', ['$timeout',
	function($timeout) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/forecast/five-thirtyp.html',
			link: function($scope, $element, $attr) {}
		}
	}
])

.directive('bagoSunDown', ['$timeout',
	function($timeout) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/forecast/five-thirtyp.html',
			link: function($scope, $element, $attr) {}
		}
	}
])

// icons on home page that show forecast and current for trin and bago
.directive('weatherIconTrin', ['$rootScope', '$timeout',
	function($rootScope, $timeout) {
		return {
			restrict: 'E',
			replace: true,
			link: function(scope, element, attrs) {
				scope.$watch('fcasttrin', function() {
					$timeout(function() {
						var j = scope.fcasttrin.replace(/\s/g, "-").toLowerCase();
						// var j = 'clear-mid-day';
						// console.debug('fcast trin', j)
						scope.getContentUrl = function() {
							$rootScope.trin_w_icon_ready = true;
							return 'app/home/svg/' + j + '.html';
						}
					}, 1000)
				})

			},
			template: '<div ng-include="getContentUrl()" style="padding-top: 13px; margin-right: -7px;"></div>'
		};
	}
])
	.directive('weatherIconBago', ['$timeout', '$rootScope',
		function($timeout, $rootScope) {
			return {
				restrict: 'E',
				link: function(scope, element, attrs) {
					scope.$watch('fcastbago', function() {
						$timeout(function() {
							var j = scope.fcastbago.replace(/\s/g, "-").toLowerCase();
							// console.debug('fcast bago', scope.fcastbago)
							scope.getContentUrl = function() {
								$rootScope.bago_w_icon_ready = true;
								return 'app/home/svg/' + j + '.html';
							}
						}, 2000)
					})
				},
				template: '<div ng-include="getContentUrl()" style="padding-top: 13px; margin-right: -7px;"></div>'
			}
		}
	])

// icons for the 3-day forecast
.directive('trinTodayIcon', ['$rootScope', '$timeout',
	function($rootScope, $timeout) {
		return {
			restrict: 'E',
			link: function(scope, element, attrs) {
				scope.$watch('trin_icon_today', function() {
					$timeout(function() {
						var j = (scope.trin_icon_today ? scope.trin_icon_today : 'sunny').replace(/\s/g, "-").toLowerCase();
						// console.debug('icon for today', scope.trin_icon_today);
						scope.ti1 = function() {
							// console.log('app/home/forecast_icons/' + j + '.html', 'today')
							$rootScope.trin_today_icon_ready = true;
							return 'app/home/forecast_icons/' + j + '.html';
						}

					}, 1000)
				})
			},
			template: '<div ng-include="ti1()" class="tti"></div>'
		}
	}
])
	.directive('trinTomIcon', ['$rootScope', '$timeout',
		function($rootScope, $timeout) {
			return {
				restrict: 'E',
				link: function(scope, element, attrs) {
					scope.$watch('trin_tm_icon', function() {
						$timeout(function() {
							// var jj = scope.trin_tm_icon.replace(/\s/g, "-").toLowerCase();
							var jj = (scope.trin_tm_icon ? scope.trin_tm_icon : 'sunny').replace(/\s/g, "-").toLowerCase();
							// console.debug('icon for 24', jj);
							scope.ti2 = function() {
								// console.log('app/home/forecast_icons/' + jj + '.html', '24')
								$rootScope.trin_tm_icon_ready = true;
								return 'app/home/forecast_icons/' + jj + '.html';
							}

						}, 1000)
					})
				},
				template: '<div ng-include="ti2()"></div>'
			}
		}
	])
	.directive('trinNdiIcon', ['$rootScope', '$timeout',
		function($rootScope, $timeout) {
			return {
				restrict: 'E',
				link: function(scope, element, attrs) {
					scope.$watch('trin_24_icon', function() {
						$timeout(function() {
							// var jj = scope.trin_24_icon.replace(/\s/g, "-").toLowerCase();
							var jj = (scope.trin_24_icon ? scope.trin_24_icon : 'sunny').replace(/\s/g, "-").toLowerCase();
							// console.debug('icon for 24', jj);
							scope.ti3 = function() {
								// console.log('app/home/forecast_icons/' + jj + '.html', '24')
								$rootScope.trin_nd_icon_ready = true;
								return 'app/home/forecast_icons/' + jj + '.html';
							}
						}, 1000)
					})
				},
				template: '<div ng-include="ti3()"></div>'
			}
		}
	])
	.directive('bagoTodayIcon', ['$rootScope', '$timeout',
		function($rootScope, $timeout) {
			return {
				restrict: 'E',
				link: function(scope, element, attrs) {
					scope.$watch('bago_icon_today', function() {
						$timeout(function() {
							// var j = scope.bago_icon_today.replace(/\s/g, "-").toLowerCase();
							var j = (scope.bago_icon_today ? scope.bago_icon_today : 'sunny').replace(/\s/g, "-").toLowerCase();
							// console.debug('icon for today', j);
							scope.bi1 = function() {
								// console.log('app/home/forecast_icons/' + j + '.html', 'today')
								$rootScope.bago_today_icon_ready = true;
								return 'app/home/forecast_icons/' + j + '.html';
							}
						}, 1000)
					})
				},
				template: '<div ng-include="bi1()"></div>'
			}
		}
	])
	.directive('bagoTomIcon', ['$rootScope', '$timeout',
		function($rootScope, $timeout) {
			return {
				restrict: 'E',
				link: function(scope, element, attrs) {
					scope.$watch('bago_tm_icon', function() {
						$timeout(function() {
							// var jj = scope.bago_tm_icon.replace(/\s/g, "-").toLowerCase();
							var jj = (scope.bago_tm_icon ? scope.bago_tm_icon : 'sunny').replace(/\s/g, "-").toLowerCase();
							// console.debug('icon for 24', jj);
							scope.bi2 = function() {
								// console.log('app/home/forecast_icons/' + jj + '.html', '24')
								$rootScope.bago_tm_icon_ready = true;
								return 'app/home/forecast_icons/' + jj + '.html';
							}
						}, 1000)
					})
				},
				template: '<div ng-include="bi2()"></div>'
			}
		}
	])
	.directive('bagoNdiIcon', ['$rootScope', '$timeout',
		function($rootScope, $timeout) {
			return {
				restrict: 'E',
				link: function(scope, element, attrs) {
					scope.$watch('bago_24_icon', function() {
						$timeout(function() {
							// var jj = scope.bago_24_icon.replace(/\s/g, "-").toLowerCase();
							var jj = (scope.bago_24_icon ? scope.bago_24_icon : 'sunny').replace(/\s/g, "-").toLowerCase();
							// console.debug('icon for 24', jj);
							scope.bi3 = function() {
								// console.log('app/home/forecast_icons/' + jj + '.html', '24')
								$rootScope.bago_nd_icon_ready = true;
								return 'app/home/forecast_icons/' + jj + '.html';
							}
							// })
						}, 1000)
					})
				},
				template: '<div ng-include="bi3()"></div>'
			}
		}
	]);
