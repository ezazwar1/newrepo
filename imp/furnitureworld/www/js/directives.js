angular.module('starter.directives', [])


/*=============Master===============================*/
.directive('masterBox',function(){
	return {
		scope: {
		  pholder:'@',
		  searchfun:'&',
		  resetfun:'&',
		  query:'='
		},
		restrict: 'E',
		controller:function($scope,$rootScope,$timeout) {
			var utils = this;
			$scope.btnMasterClose = false;
			utils.masterClose = function(status){
				$scope.$apply(function () { $scope.btnMasterClose = status; });
			};
			utils.searchResult = function(result){ $scope.searchfun({data:result});	};

			$scope.resetMaster = function(){
				$scope.btnMasterClose = false;
				$scope.$broadcast("clear-input");
				$scope.resetfun({data:''});
			};

		},
		template:'<div  class="item-input-wrapper searchWrapper">'
			+'<i class="icon ion-search placeholder-icon"></i>'
			+'<input type="search" placeholder="{{pholder}}" ng-model="query" master-input>'
			+'<i ng-if="btnMasterClose" ng-click="resetMaster();" class="icon ion-ios-close placeholder-icon"></i> '
			+'</div>',
		replace: true
	};
})

.directive('masterInput',function($timeout){
	return {
		scope: {},
		require:'^masterBox',
		restrict: 'A',
		link:function(scope, elem, attr,masterCtrl){
			var timeout='';

			elem.on('focus', function(event) {
				if(this.value.trim().length>0){	masterCtrl.masterClose(true); }else{	masterCtrl.masterClose(false);	}
			});

			elem.on('blur', function(event) {
				$timeout(function(){ masterCtrl.masterClose(false);  }, 200);
			});

			elem.on('keyup', function(event) {
				if(this.value.trim().length>0)  masterCtrl.masterClose(true); else{
					masterCtrl.masterClose(false);

				}
				//---------------------------------
				var target = this;
				if(timeout !== null){	$timeout.cancel(timeout);	}
				var query = target.value;

				timeout = $timeout(function(){
					if(query.trim().length>0){
						masterCtrl.searchResult(query);
					}
				}, 10);
				//---------------------------------
			});

			scope.$on("clear-input", function(){
				elem[0].value='';
				$timeout(function(){ elem[0].focus(); }, 200);
			});
		}
	};
})
/*=============Master Radio===============================*/
.directive('masterRadio',function(){
	return {
		scope: {
		  datlist:'=',
		  classname:'@',
		  fieldName:'@',
		  valuefun:'&'
		},
		restrict: 'E',
		controller:function($scope) {
			var utils = this;


			$scope.radioModel = {name:null};
			$scope.$watch('radioModel.name', function() {
				 $scope.valuefun({data:$scope.radioModel.name});
			 });

			$scope.radioModel.name = getDefaultValue($scope.datlist);


			//if($scope.datlist[0].default) $scope.radioModel.name = $scope.datlist[0].value;

		},
		template:'<ion-list class="{{classname}}">'
			+'<ion-radio ng-model="radioModel.name" name="{{fieldName}}" ng-value="\'{{Obj.label}}\'"  ng-repeat="Obj in datlist"><img ng-src="{{Obj.img}}">{{Obj.label}}</ion-radio>'
			+'</ion-list>',
		replace: true
	};
});

/*===============Functions=========================================*/
function getDefaultValue(datlist){
	for(var i = 0; i < datlist.length; i++)
	{
	  if(datlist[i].default){ return datlist[i].value;  }
	}
	return '';
}
/*========================================================*/
