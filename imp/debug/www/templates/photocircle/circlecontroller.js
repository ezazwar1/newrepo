angular.module('photoshare')

.controller('circleCtrl', ['$scope','$ionicLoading','$state','postService',
	'$ionicPopup','sessionService','ConnectivityMonitor',
	function ($scope,$ionicLoading,$state,postService,$ionicPopup,sessionService,
		ConnectivityMonitor){

		$scope.cirlces = [];
		var circlePopup={};


		$scope.$on('$ionicView.loaded', function(event, view) {	
			// if(ConnectivityMonitor.isOffline()){
			// 	$ionicPopup.confirm({
			// 		title: "Internet Info",
			// 		content: "No internet connection detected on your device."
			// 	})
			// 	.then(function(result) {
			// 		if(!result) {
			// 			ionic.Platform.exitApp();
			// 		}
			// 	});
			// }else{
				

				$ionicLoading.show({
					template:'<ion-spinner class="light"></ion-spinner><p>Loading..</p>'
				});	
			//}		
			

		});

		$scope.$on('$ionicView.afterEnter', function(event, view){
			if(ConnectivityMonitor.isOffline()){
				$ionicLoading.hide();
				$ionicPopup.confirm({
					title: "Internet Info",
					content: "No internet connection detected on your device."
				})
				.then(function(result) {
					if(!result) {
						ionic.Platform.exitApp();
					}
				});
			}else{
				loadCircles();
			}
			

		});

		function loadCircles(){
			postService.getCircles().then(function(data){
				$scope.cirlces =data.data.results;
				$ionicLoading.hide();
				
			},function(err){
				$ionicLoading.hide();
				$ionicPopup.alert({
					title: "Error",
					template:"There was an error loading photo circle" + err.statusText
				});
			});
		}

		$scope.showNewCircleForm=function(){
			circlePopup=$ionicPopup.show({
				cssClass: 'post-popup',
				templateUrl: 'templates/popups/newcircle.html',
				scope: $scope,
				title: 'Add New Photo Circle',
				buttons: [
				{ text: '', type: 'close-popup ion-ios-close-outline' }
				]
			});
		}

		$scope.saveCircle=function(data){
			$ionicLoading.show({
				template:'<ion-spinner class="light"></ion-spinner>'
			});	
			postService.saveCircle(data).then(function(res){
				if(res.data.error==false){
					
					var currCircle = {
						id:res.data.result._id,
						name:res.data.result.name
					};
					window.localStorage.setItem('currCircle','');
					window.localStorage.setItem('currCircle',JSON.stringify(currCircle))
					circlePopup.close();
					$ionicLoading.hide();
					$state.go('app.feeds');
					
					
				}
			})
		}

		$scope.moveToNext =function(data){
			data = JSON.parse(data);
			var currCircle = {
				id:data._id,
				name:data.name
			};
			window.localStorage.setItem('currCircle','');
			window.localStorage.setItem('currCircle',JSON.stringify(currCircle));
			$state.go('app.feeds');
			
		}


		
	}])