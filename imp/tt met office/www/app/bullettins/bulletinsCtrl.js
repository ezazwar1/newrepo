angular.module('ionic.metApp')
    .controller('BulletinsCtrl', ['metApi', '$scope', '$ionicLoading', '$timeout', '$ionicModal', '$cordovaDevice', '$ionicPlatform', '$cordovaPush', '$ionicSlideBoxDelegate', '$state', '$stateParams', '$route', '$ionicScrollDelegate', '$interval', '$ionicHistory',
        function(metApi, $scope, $ionicLoading, $timeout, $ionicModal, $cordovaDevice, $ionicPlatform, $cordovaPush, $ionicSlideBoxDelegate, $state, $stateParams, $route, $ionicScrollDelegate, $interval, $ionicHistory) {
            var vm = this;
            var interval = 10 * 60000;
            // $cordovaBadge.hasPermission().then(function(yes) {
            //              $cordovaBadge.clear();
            //          }, function(no) {
            //          });
            $interval(function time() {
                $ionicHistory.clearCache().then(function() {
                    // alert('cache cleared')
                    // console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
                    // console.log('cache cleared');
                    $route.reload();
                    vm.refresh_all_b();
                    $route.reload();
                    // $state.go ('app.home' , {}, {cache: false});
                    // $state.go ('app.home' , {}, {cache: true});
                });
                $ionicHistory.clearHistory();
            }, interval);

            $scope.$on('$ionicView.enter', function() {
                // vm.refresh_all_b();
            });

            $scope.disableSwipe = function() {
                $ionicSlideBoxDelegate.enableSlide(false);
                // vm.igo = 2;//$stateParams.id;
            };

            $ionicPlatform.ready(function() {
                if (window.cordova) {
                    var device = $cordovaDevice.getDevice();
                }

            })

            $scope.get_initial = function() {
                // $scope.igo = 2;
                $timeout(function() {
                    $scope.slide($stateParams.id);
                }, 1000)
                // console.log('get initial slide', $stateParams.id)
            }


            $scope.slideHasChanged = function(index) {

            }

            vm.refresh_all_b = function() {
                vm.getGIBulletins();
                vm.get_serv_b();
                vm.get_flood_b();
                vm.get_sea_b();
            }

            // get general info bulletins
            vm.getGIBulletins = function() {
                metApi.get_b_info().then(function(data) {
                    vm.b_info = data.items[0];
                    vm.b_info.insertionDateFormatted = timePeriod(data.items[0].insertionDate);
                    if (vm.b_info.flag == '0') {
                        vm.b_info = null;
                    }
                }, function(error) {});
            }



            // get severe weather bulletins
            vm.get_serv_b = function() {
                metApi.get_b_serv().then(function(data) {
                    vm.s_items = data.items[0];
                    vm.s_items.insertionDateFormatted = timePeriod(data.items[0].insertionDate);
                    if (vm.s_items.flag == '0') {
                        vm.s_items = null;
                    }
                }, function(error) {});
            }
            // get blood bulletins
            vm.get_flood_b = function() {
                metApi.get_b_flood().then(function(data) {
                    vm.f_items = data.items[0];
                    vm.f_items.insertionDateFormatted = timePeriod(data.items[0].insertionDate);
                    if (vm.f_items.flag == '0') {
                        vm.f_items = null;
                    }
                }, function(error) {})
            }

            // get rouch seas
            vm.get_sea_b = function() {
                metApi.get_b_sea().then(function(data) {
                    vm.r_items = data.items[0];
                    vm.r_items.insertionDateFormatted = timePeriod(data.items[0].insertionDate);
                    if (vm.r_items.flag == '0') {
                        vm.r_items = null;
                    }
                }, function(error) {});
            }


            // Create modals
            $ionicModal.fromTemplateUrl('app/bullettins/info_item.html', {
                scope: $scope,
                animation: 'scale-in' //modal animation
            }).then(function(b_details_modal) {
                $scope.b_details_modal = b_details_modal;
            });
            // close modal
            $scope.b_info_close = function() {
                $scope.b_details_modal.hide();
            };

            // Open the modal
            $scope.b_info_open = function(id, type) {
                $scope.b_details_modal.show();
                // switch function that gets called based on what key is submitted from clicked item
                switch (type) {
                    case 'b': // bulletin
                        metApi.get_b_info(function(data) {
                            vm.bulletin = data.items[0];
                            // console.log(vm.bulletin)
                        }, id);
                        break;
                    case 's':
                        metApi.get_b_serv(function(data) {
                            vm.bulletin = data.items[0];
                            // console.log(vm.bulletin)
                        }, id);
                        break;
                    case 'f':
                        metApi.get_b_flood(function(data) {
                            vm.bulletin = data.items[0];
                            // console.log(vm.bulletin)
                        }, id)
                        break;
                    case 'r':
                        metApi.get_b_sea(function(data) {
                            vm.bulletin = data.items[0];
                            // console.log(vm.bulletin)
                        }, id)
                        break;
                }
            };

            $scope.slide = function(to) {
                // $route.reload();
                $ionicScrollDelegate.scrollTop();
                $ionicSlideBoxDelegate.slide(to);
                // console.debug('slide to', to)
            }
            // if(1) {
            // 	$route.reload();
            // 	$scope.igo = 2;//$stateParams.id;
            // 	// if($stateParams != undefined) {
            // 		// $scope.slide($stateParams.id)
            // 	// }
            // 	console.debug('here', $stateParams.id)
            // }

            function timePeriod(d) {
                var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', 'September', 'October', 'November', 'December'];
                var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                var today = new Date(d);
                return days[today.getDay() + 1] + ' ' + (today.getDate() + 1) + 'th of ' + months[today.getMonth()] + ' ' + today.getFullYear()
            }

        }
    ])
