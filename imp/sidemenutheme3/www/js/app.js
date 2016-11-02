angular.module("underscore",[]).factory("_",function(){return window._}),angular.module("your_app_name",["ionic","your_app_name.tracking","your_app_name.directives","your_app_name.views","underscore"]).run(["$ionicPlatform",function(n){n.ready(function(){window.cordova&&window.cordova.plugins.Keyboard&&cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),window.StatusBar&&StatusBar.styleDefault()})}]).config(["$stateProvider","$urlRouterProvider",function(n,e){n.state("app",{url:"/app","abstract":!0,templateUrl:"views/side-menu.html"}).state("app.view1",{url:"/view1",views:{menuContent:{templateUrl:"views/view-1.html"}}}).state("app.view2",{url:"/view2",views:{menuContent:{templateUrl:"views/view-2.html"}}}).state("app.view3",{url:"/view3",views:{menuContent:{templateUrl:"views/view-3.html"}}}).state("app.view4",{url:"/view4",views:{menuContent:{templateUrl:"views/view-4.html"}}}).state("app.view5",{url:"/view5",views:{menuContent:{templateUrl:"views/view-5.html"}}}).state("app.view6",{url:"/view6",views:{menuContent:{templateUrl:"views/view-6.html"}}}).state("app.view7",{url:"/view7",views:{menuContent:{templateUrl:"views/view-7.html"}}}).state("app.view8",{url:"/view8",views:{menuContent:{templateUrl:"views/view-8.html"}}}),e.otherwise("/app/view1")}]),angular.module("your_app_name.directives",[]).directive("multiBg",["_",function(n){return{scope:{multiBg:"=",interval:"=",helperClass:"@"},controller:["$scope","$element","$attrs",function(e,i,t){e.loaded=!1;var o=this;this.animateBg=function(){e.$apply(function(){e.loaded=!0,i.css({"background-image":"url("+e.bg_img+")"})})},this.setBackground=function(n){e.bg_img=n},n.isUndefined(e.multiBg)||o.setBackground(n.isArray(e.multiBg)&&e.multiBg.length>1&&!n.isUndefined(e.interval)&&n.isNumber(e.interval)?e.multiBg[0]:e.multiBg[0])}],templateUrl:"views/common/multi-bg.html",restrict:"A",replace:!0,transclude:!0}}]).directive("bg",function(){return{restrict:"A",require:"^multiBg",scope:{ngSrc:"@"},link:function(n,e,i,t){e.on("load",function(){t.animateBg()})}}}).directive("preImg",function(){return{restrict:"E",transclude:!0,scope:{ratio:"@",helperClass:"@"},controller:["$scope",function(n){n.loaded=!1,this.hideSpinner=function(){n.$apply(function(){n.loaded=!0})}}],templateUrl:"views/common/pre-img.html"}}).directive("spinnerOnLoad",function(){return{restrict:"A",require:"^preImg",scope:{ngSrc:"@"},link:function(n,e,i,t){e.on("load",function(){t.hideSpinner()})}}}),angular.module("your_app_name.views",[]).run(["$templateCache",function(n){n.put("views/side-menu.html",'<ion-side-menus enable-menu-with-back-views="false">\n  <ion-side-menu-content>\n    <ion-nav-bar class="bar-stable">\n      <ion-nav-back-button>\n      </ion-nav-back-button>\n      <ion-nav-buttons side="left">\n        <button class="button button-icon button-clear ion-navicon" menu-toggle="left">\n        </button>\n      </ion-nav-buttons>\n    </ion-nav-bar>\n    <ion-nav-view name="menuContent"></ion-nav-view>\n  </ion-side-menu-content>\n\n  <ion-side-menu side="left">\n    <ion-content has-bouncing="false" scroll="false" class="menu-outer left-menu">\n      <!-- <div multi-bg="[\'http://lorempixel.com/640/1136\']"> -->\n      <div multi-bg="[\'img/bg-img.jpeg\']">\n        <div class="row menu-top-options">\n          <div class="col col-top">\n            <ion-list>\n              <ion-item ui-sref-active="active" class="item-icon-left" menu-close ui-sref="app.view1">\n                <i class="menu-icon icon ion-search"></i>\n                <h2 class="menu-text">Search</h2>\n              </ion-item>\n              <ion-item ui-sref-active="active" class="item-icon-left" menu-close ui-sref="app.view2">\n                <i class="menu-icon icon ion-filing"></i>\n                <h2 class="menu-text">Browse</h2>\n              </ion-item>\n              <ion-item ui-sref-active="active" class="item-icon-left" menu-close ui-sref="app.view3">\n                <i class="menu-icon icon ion-person-stalker"></i>\n                <h2 class="menu-text">Activity</h2>\n              </ion-item>\n              <ion-item ui-sref-active="active" class="item-icon-left" menu-close ui-sref="app.view4">\n                <i class="menu-icon icon ion-mic-c"></i>\n                <h2 class="menu-text">Radio</h2>\n              </ion-item>\n              <ion-item ui-sref-active="active" class="item-icon-left" menu-close ui-sref="app.view5">\n                <i class="menu-icon icon ion-music-note"></i>\n                <h2 class="menu-text">Your Music</h2>\n              </ion-item>\n              <ion-item ui-sref-active="active" class="item-icon-left" menu-close ui-sref="app.view6">\n                <i class="menu-icon icon ion-gear-a"></i>\n                <h2 class="menu-text">Settings</h2>\n              </ion-item>\n            </ion-list>\n          </div>\n        </div>\n        <div class="row menu-bottom-options">\n          <div class="col col-bottom">\n            <ion-list>\n              <ion-item class="user-item" menu-close ui-sref="app.view7">\n                <!-- We need a wrapper with width set for the preload image directive -->\n                <div class="user-image-outer">\n                  <pre-img ratio="_1_1" helper-class="rounded-image">\n                    <img class="user-image" ng-src="https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg" spinner-on-load>\n                	</pre-img>\n                </div>\n                <h2 class="menu-text">Brynn</h2>\n                <div class="user-inbox">\n                  <i class="menu-icon icon ion-ios-filing"></i>\n                  <span class="inbox-unread">13</span>\n                </div>\n              </ion-item>\n              <ion-item class="full-width-item" menu-close ui-sref="app.view8">\n                <button class="button button-full button-positive">\n                  Full Width Block Button\n                </button>\n              </ion-item>\n            </ion-list>\n          </div>\n        </div>\n      </div>\n    </ion-content>\n  </ion-side-menu>\n</ion-side-menus>\n'),n.put("views/view-1.html",'<ion-view view-title="View 1">\n  <ion-content>\n    <h1>1</h1>\n  </ion-content>\n</ion-view>\n'),n.put("views/view-2.html",'<ion-view view-title="View 2">\n  <ion-content>\n    <h1>2</h1>\n  </ion-content>\n</ion-view>\n'),n.put("views/view-3.html",'<ion-view view-title="View 3">\n  <ion-content>\n    <h1>3</h1>\n  </ion-content>\n</ion-view>\n'),n.put("views/view-4.html",'<ion-view view-title="View 4">\n  <ion-content>\n    <h1>4</h1>\n  </ion-content>\n</ion-view>\n'),n.put("views/view-5.html",'<ion-view view-title="View 5">\n  <ion-content>\n    <h1>5</h1>\n  </ion-content>\n</ion-view>\n'),n.put("views/view-6.html",'<ion-view view-title="View 6">\n  <ion-content>\n    <h1>6</h1>\n  </ion-content>\n</ion-view>\n'),n.put("views/view-7.html",'<ion-view view-title="View 7">\n  <ion-content>\n    <h1>7</h1>\n  </ion-content>\n</ion-view>\n'),n.put("views/view-8.html",'<ion-view view-title="View 8">\n  <ion-content>\n    <h1>8</h1>\n  </ion-content>\n</ion-view>\n'),n.put("views/common/multi-bg.html",'<div class="multi-bg-outer" ng-class="{ \'finish-loading\': loaded }">\n	<img bg class="multi-bg {{ helperClass }}" ng-src="{{ bg_img }}"/>\n	<span class="bg-overlay"></span>\n	<ion-spinner ng-show="!loaded" class="spinner-on-load"></ion-spinner>\n	<!-- <span ng-show="!loaded" class="spinner-on-load ion-load-c"></span> -->\n	<ng-transclude></ng-transclude>\n</div>\n'),n.put("views/common/pre-img.html",'<div class="pre-img {{ratio}} {{ helperClass }}" ng-class="{ \'finish-loading\': loaded }">\n	<ion-spinner ng-show="!loaded" class="spinner-on-load"></ion-spinner>\n	<!-- <span ng-show="!loaded" class="spinner-on-load ion-load-c"></span> -->\n	<ng-transclude></ng-transclude>\n</div>\n')}]);