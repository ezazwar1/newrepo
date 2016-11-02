angular.module('ionic.metApp')
	.controller('ServicesCtrl', ['Radars', 'metApi', '$scope', '$ionicLoading', '$timeout', '$ionicModal', '$cordovaDevice', '$ionicPlatform', '$cordovaPush', '$ionicSlideBoxDelegate', '$ionicScrollDelegate',
		function(Radars, metApi, $scope, $ionicLoading, $timeout, $ionicModal, $cordovaDevice, $ionicPlatform, $cordovaPush, $ionicSlideBoxDelegate, $ionicScrollDelegate) {

			var sc = this;

			$scope.disableSwipe = function() {
				$ionicSlideBoxDelegate.enableSlide(false);
			};


			sc.refresh_all_a = function() {

			}
			// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			// calls aviation data
			// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			sc.get_o_aviation = function() {
				metApi.get_o_aviation().then(function(data) {
					sc.aviation_items = data.items;
					// console.log(sc.aviation_items);
				}, function(error) {});
			}

			sc.get_aviation_radar = function() {

			}
			// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			// calls for climate data
			// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

			sc.get_elninos = function() {
				metApi.get_elninos().then(function(data) {
					sc.el_infos = data[0];
					// console.log(data);
					// console.log("el nino");
					// console.log(data);
				}, function(error) {});
				// get option files
				metApi.get_option_files('/file/search?category=elnino').then(function(data) {
					sc.ii = [$scope.image1 = 'data: ;base64,' + data['elnino0'].data, $scope.image2 = 'data: ;base64,' + data['elnino1'].data, $scope.image3 = 'data: ;base64,' + data['elnino2'].data];
					img_builder(sc.ii, '.nino_i', 'El Nino');
				}, function(error) {})
			}

			$('body').on('click', '.swipebox', function(e) {
				e.preventDefault();
				var img = $(this).attr('href')
				$scope.showImages(img);
			})

			$scope.showImages = function(index) {
				$scope.showModal('app/services/radar/radar_image_modal.html');
				$timeout(function() {
					var image = new Image();
					image.src = index;
					var img_div = $('.modal_img');
					img_div.html(image);
				}, 300)
			}

			$scope.showModal = function(templateUrl) {
				$ionicModal.fromTemplateUrl(templateUrl, {
					scope: $scope,
					animation: 'slide-in-up'
				}).then(function(modal) {
					$scope.modal = modal;
					$scope.modal.show();
				})
			}

			$scope.closeModal = function() {
				// console.debug('modal', $scope.modal)
				$scope.modal.hide();
				// $scope.modal.remove();
			}

			$scope.updateSlideStatus = function(slide) {
				var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition.zoom;
				if (zoomFactor == $scope.zoomMin) {
					$ionicSlideBoxDelegate.enableSlide(true);
				} else {
					$ionicSlideBoxDelegate.enableSlide(false);
				}
			}

			sc.get_rainandtemp = function() {
				// alert()
				metApi.get_rainandtemp().then(function(data) {
					sc.rt = data.items[0];
					// console.log(sc.rt.month);
					sc.key_list = data.items[0].para1 ? data.items[0].para1.split('\r\n') : null;
					sc.ir_list = data.items[0].para12 ? data.items[0].para12.split('\r\n') : null;
					if (sc.key_list) {
						for (x = 0; x < sc.key_list.length; x++) {
							sc.key_list[x].trim();
						}
					}
					if (sc.ir_list) {
						for (x = 0; x < sc.ir_list.length; x++) {
							sc.ir_list[x].trim();
						}
					}
				}, function(error) {});
				// get option files
				metApi.get_option_files('/file/search?category=rainandtemp').then(function(data) {
					sc.rti = [$scope.image4 = 'data: ;base64,' + data['rainandtemp0'].data, $scope.image5 = 'data: ;base64,' + data['rainandtemp1'].data];
					img_builder(sc.rti, '.rt_i', 'Rainfall - Temp');
				}, function(error) {});
			}
			sc.get_drywet = function() {
				metApi.get_drywet().then(function(data) {
					sc.dw = data.items[0];
				}, function(error) {});
				// get option files
				metApi.get_option_files('/file/search?category=dryandwetspell').then(function(data) {
					sc.dwi = [$scope.image6 = 'data: ;base64,' + data['dryandwetspell0'].data];
					img_builder(sc.dwi, '.dw_i', 'Dry/Wet Outlook');
				}, function(error) {});
			}

			// build image elements for climate page
			function img_builder(img_arr, elem, title) {
				for (x = 0; x < img_arr.length; x++) {
					var image = new Image();
					image.src = img_arr[x];
					image.style.maxWidth = "100%";
					var img_div = $(elem + (x + 1));
					img_div.html(image);
					img_div.find('img').wrap('<a href="' + img_arr[x] + '" class="swipebox" title="' + title + '"></a>')

				}
			}

			sc.agrotrini = function() {
				metApi.get_agrotrini().then(function(data) {
					sc.atrin = data.items[0];
				}, function(error) {});

				// get option files
				metApi.get_option_files('/file/search?category=agrotrini').then(function(data) {
					$scope.image_agro_trin = ['data: ;base64,' + data['agrotrini0'].data];
					img_builder($scope.image_agro_trin, '.trin_i', 'Trinidad Agromet');
				}, function(error) {});

				metApi.get_agroData('summary').then(function(area) {
					sc.sum = area;
				}, function(error) {});
			}

			sc.agrotbg = function() {
				metApi.get_agrotbg().then(function(data) {
					sc.atbg = data.items[0];
				}, function(error) {});

				metApi.get_option_files('/file/search?category=agrotobago').then(function(data) {
					$scope.image_agro_bago = ['data: ;base64,' + data['agrotobago0'].data];
					img_builder($scope.image_agro_bago, '.bago_i', 'Tobago Agromet');

				}, function(error) {});

				metApi.get_agroDataTbg('summary').then(function(area) {
					sc.sumtbg = area;
				}, function(error) {});
			}


			// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			// calls for marine climate data
			// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			// calls for tourism data
			// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			// calls agriculture climate data
			// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

			// will find a bettwe way to do this later but for now .... this
			$scope.slideHasChanged_a = function(index) {
				sc.update_slide_a(index);
			}
			sc.update_slide_a = function(index) {
				titles = ['Satellite', 'Radar', 'Weather Report', 'Forecast'];
				$scope.sub_title = titles[index];
			}

			$scope.slideHasChanged_c = function(index) {
				sc.update_slide_c(index);
			}
			sc.update_slide_c = function(index) {
				titles = ['El Nino Update', 'Rainfall & Temp', 'Dry/Wet Outlook'];
				$scope.sub_title = titles[index];
			}

			$scope.slideHasChanged_m = function(index) {
				sc.update_slide_m(index);
			}
			sc.update_slide_m = function(index) {
				titles = [''];
				$scope.sub_title = titles[index];
			}

			$scope.slideHasChanged_t = function(index) {
				sc.update_slide_t(index);
			}
			sc.update_slide_t = function(index) {
				titles = ['3-day Natinwide', '3-day Tobago'];
				$scope.sub_title = titles[index];
			}

			$scope.slideHasChanged_ag = function(index) {
				sc.update_slide_ag(index);
			}
			sc.update_slide_ag = function(index) {
				titles = ['Trinidad', 'Tobago'];
				$scope.sub_title = titles[index];
			}

			$scope.slide = function(to) {
				$ionicScrollDelegate.scrollTop();
				$ionicSlideBoxDelegate.slide(to);
			}

			sc.radars_150 = function() {
				sc.radars_150_list = Radars.all_of_cat(150);
			}
			sc.radars_250 = function() {
				sc.radars_250_list = Radars.all_of_cat(250);
			}

			sc.get_radar_400 = function() {
				sc.radars_400_list = Radars.all_of_cat(400);
				// alert();
			}

			sc.sigmet = function() {
				metApi.get_sigmet().then(function(data) {
					sc.sig = data.items;
				}, function(error) {});
			}

		}
	])
	.controller('RadarDetailCtrl', ['$scope', '$stateParams', 'metApi', 'Radars', '$http', '$cordovaPush', '$ionicPlatform', '$rootScope', '$ionicLoading', '$state', '$ionicBackdrop', '$ionicModal', '$ionicScrollDelegate', '$ionicSlideBoxDelegate', '$timeout',
		function($scope, $stateParams, metApi, Radars, $http, $cordovaPush, $ionicPlatform, $rootScope, $ionicLoading, $state, $ionicBackdrop, $ionicModal, $ionicScrollDelegate, $ionicSlideBoxDelegate, $timeout) {
			var rdc = this;
			$scope.close_loading = function() {
				$ionicLoading.hide();
			}
			$scope.get_radar_detail = function() {
				$scope.zoomMin = 1;
				rdc.radar = Radars.get($stateParams.id);
				metApi.get_radar(rdc.radar.code).then(function(data) {
					var image = new Image();
					image.src = data.data;
					$scope.image = data.data;
					image.style.maxWidth = "100%";
					var img_div = $('.img_holder');
					img_div.html(image);
					img_div.find('img').wrap('<a href="' + $scope.image + '" class="swipebox2" title="' + rdc.radar.title + '"></a>')
				}, function(error) {});

				rdc.radar = Radars.get($stateParams.id);

				rdc.radar.title = (rdc.radar.title != 'Satellite' ? rdc.radar.title : 'Infared Satellite');

				$('body').on('click', '.swipebox2', function(e) {
					e.preventDefault();
					$scope.showImages();
				})
			}

			$scope.reload_page = function() {
				$scope.get_radar_detail($stateParams.id);
			}

			$scope.$on('loading:show', function() {
				$ionicLoading.show({
					template: ' <ion-spinner class="light"></ion-spinner><br><button class="button button-light button-block" ng-click="close_loading()">Cancel</button>',
					scope: $scope
				});
			})

			// handle image scrolling and zooming of radar
			$scope.showImages = function(index) {
				$scope.showModal('app/services/radar/radar_image_modal.html');
				$timeout(function() {
					var image = new Image();
					image.src = $scope.image;
					var img_div = $('.modal_img');
					img_div.html(image);
				}, 300)
			}

			$scope.showModal = function(templateUrl) {
				// $ionicBackdrop.retain();
				// console.debug('modals on page', $('.modal-backdrop').length);
				if ($('.modal-backdrop').length > 0) {
					$('.modal-backdrop:not(:last)').remove();
				}

				if (!$scope.modal) {
					$ionicModal.fromTemplateUrl(templateUrl, function(modal) {
						$scope.modal = modal;
						$scope.modal.show();
					}, {
						scope: $scope,
						animation: 'slide-in-up'
					})
				} else {
					$scope.modal.show();
				}
				// console.debug('scope modal in show functino', $scope.modal);
				// $ionicModal.fromTemplateUrl(templateUrl, {
				// 	scope: $scope,
				// 	animation: 'slide-in-up'
				// }).then(function(modal) {
				// 	$scope.modal = modal;
				// 	$scope.modal.show();
				// })
			}

			$scope.closeModal = function() {
				$scope.modal.hide().then(function() {
					$('.modal-backdrop').remove();
					$scope.modal = null;
				})
				// $scope.modal.remove()
				// 	.then(function() {
				// 		$scope.modal = null;
				// 	});
				// $scope.modal.remove();
			}
			$scope.$on('$stateChangeStart', function() {
				// if ($scope.modal) {
				// console.debug('state change start');
				$scope.modal.remove();
				// }
			});

			$scope.updateSlideStatus = function(slide) {
				var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition.zoom;
				if (zoomFactor == $scope.zoomMin) {
					$ionicSlideBoxDelegate.enableSlide(true);
				} else {
					$ionicSlideBoxDelegate.enableSlide(false);
				}
			}
		}
	])

.controller('AWSCtrl', ['weatherHelperService', '$filter', 'metApi', '$scope', '$timeout', '$ionicModal', '$ionicPlatform', '$ionicPopup', '$interval', '$ionicBackdrop', '$state', '$route', '$rootScope', '$ionicLoading', 'NgMap',
	function(weatherHelperService, $filter, metApi, $scope, $timeout, $ionicModal, $ionicPlatform, $ionicPopup, $interval, $ionicBackdrop, $state, $route, $rootScope, $ionicLoading, NgMap) {
		var _this = this;
		$scope.ai = [];
		$scope.lat = 10.611439;
		$scope.lng = -61.167560;

		// $scope.lat = 10.474225;
		// $scope.lng = -61.339991

		$scope.cities = [{
				city: 'Piarco',
				desc: 'Piarco (BASE) AWS',
				pos: [10.602912, -61.335640]
			}, {
				city: 'Brasso',
				desc: 'Brasso Venado AWS',
				pos: [10.399413, -61.317268]
			}, {
				city: 'Caroni',
				desc: 'Caroni AWS',
				pos: [10.606881, -61.383883]
			}, {
				city: 'Chatham',
				desc: 'Chatham  AWS',
				pos: [10.115793, -61.741620]
			}, {
				city: 'El Reposo',
				desc: 'El Reposo AWS',
				pos: [10.589908, -61.114339]
			}, {
				city: 'Penal',
				desc: 'Penal AWS',
				pos: [10.168662, -61.437830]
			}, {
				city: 'Guayaguayare',
				desc: 'Guayaguayare AWS',
				pos: [10.215853, -61.071504]
			}
			/*,{
                                city: 'Centeno',
                                desc: 'Centeno AWS',
                                lat: 10.352226,
                                long: -61.192286
                            }*/
			, {
				city: 'Crown Point',
				desc: 'Crown Point AWS',
				// pos: [11.248446, -60.669835]
				pos: [11.152917, -60.835251]
			}
		];

		$scope.mapCreated = function(map) {
			$scope.map = map;
		};

		$scope.centerOnMe = function() {
			$ionicLoading.show({
				template: 'Centering map...',
			});
			$timeout(function() {
				NgMap.getMap().then(function(map) {
					map.setCenter(new google.maps.LatLng($scope.lat, $scope.lng))
				})
				$ionicLoading.hide();
			}, 1000);
		};

		$scope.closeModal = function(a) {
			$ionicPlatform.ready(function() {
				if (window.StatusBar) {
					StatusBar.styleLightContent();
				}
			})
			$scope[a].hide();
		}
		// when any modal is closed, hide the back drop
		$scope.$on('modal.hidden', function() {
			$ionicBackdrop.release();
		})

		$rootScope.ace = function(event, city) {
			$scope.do_split = false;
			$scope.ai = [];
			$ionicPlatform.ready(function() {
				if (window.StatusBar) {
					StatusBar.styleBlackTranslucent();
				}
			})

			$scope.title = city;
			// get aws data
			metApi.get_aws(city).then(function(data) {
				$scope.has_aws = false;
				if (data.items != undefined) {
					var length = data.items.length;
					$scope.has_aws = true;
					$scope.do_split = true;
					var d = data.items;
					for (z = 0; z < length; z++) {
						if (d[z].item == 'Temperature') {
							$scope.ai[0] = d[z];
						}
						if (d[z].item == 'Pressure') {
							$scope.ai[1] = d[z];
						}
						if (d[z].item == 'Gust') {
							$scope.ai[2] = d[z];
						}
						if (d[z].item == 'Precipitation') {
							$scope.ai[3] = d[z];
						}
						if (d[z].item == 'Humidity') {
							$scope.ai[4] = d[z];
						}
						if (d[z].item == 'Wind Direction') {
							$scope.ai[5] = d[z];
						}
						if (d[z].item == 'Wind Speed') {
							$scope.ai[6] = d[z];
						}
					}
					// console.log('[debug] - trinidad', $scope.ai);
				} else if (data.location == 'Crown Point') {
					var i = ['humidity', 'precipitation', 'pressure', 'temperature', 'wd', 'ws'];
					$scope.has_aws = true;
					$scope.do_split = false;
					$scope.ai = [];
					for (x = 0; x < i.length; x++) {
						$scope.ai[x] = {};
						$scope.ai[x]['value'] = data[i[x]];
						$scope.ai[x]['item'] = (i[x] == 'wd' ? ' Wind Direction' : i[x] == 'ws' ? 'Wind Speed' : weatherHelperService.capFLetter(i[x]));
					}
				}

				// $scope.ai = null;

				if ($scope.ai && $scope.has_aws) {
					if ($scope.do_split) {
						var aws_date = $scope.ai[0].aws_date.split('/');
						var aws_time = $scope.ai[0].aws_time.split(':'); //.replace(/:/g, ', ');
						$scope.updated_at = new Date(aws_date[2], (aws_date[0] > 0 ? aws_date[0] - 1 : aws_date[0]), aws_date[1], aws_time[0], aws_time[1], aws_time[2]);
					}

					if (!$scope.aws_modal) {
						$ionicModal.fromTemplateUrl('app/services/aws_details.html', function(mt_modal) {
							$scope.aws_modal = mt_modal;
							$scope.aws_modal.show();

						}, {
							animation: 'scale-in',
							scope: $scope
						})
					} else {
						$scope.aws_modal.show();
					}
				} else {
					$rootScope.doAlert($scope.title, ': No data');
					// var alertPopup = $ionicPopup.alert({
					// 	// title: $scope.title,
					// 	template: $scope.title + ': No data',
					// 	cssClass: 'aws_popup',
					// 	// okText: 'Close'
					// });

					// $timeout(function() {
					// 	alertPopup.close();
					// }, 3000);
				}

			}, function(error) {});

		}
	}
]);
