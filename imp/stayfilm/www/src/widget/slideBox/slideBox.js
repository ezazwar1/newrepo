angular.module('fun')
	.service('sfSlideBoxDelegate', function () {
		this.addInstance = function (instance) {
			this.instance = instance;
		};
	})
	.directive('sfSlideBox', function (sfSlideBoxDelegate) {
		return {
			restrict: 'E',
			template: '<div class="sf-slide-box"><div class="slide-container" ng-transclude></div></div>',
			transclude: true,
			scope: true,
			controller: function ($scope) {

				var slides = [];
				this.curSlideName = null;

				$scope.curSlideName = this.curSlideName;

				this.slides = slides;

				this.next = function () {
					var nextName = getNextSlideName(this.curSlideName);
					this.slide(nextName);
				};

				this.prev = function () {
					var prevName = getPrevSlideName(this.curSlideName);
					this.slide(prevName);
				};

				this.slide = function (name) {

					angular.forEach(slides, function (o) {

						if (o.scope.selected && o.scope.hide) {
							o.scope.hide();
						}

						o.scope.selected = false;
					});

					var slide = getSlideByName(name);

					slide.scope.selected = true;
					$scope.curSlideName = this.curSlideName = name;
				};

				this.addSlide = function (key, scope) {

					if ( ! key) {
						throw 'key is missing';
					}

					if ( ! scope) {
						throw 'scope missing';
					}

					slides.push({name: key, scope: scope});
				};

				this.render = function () {
					this.slide(this.curSlideName);
				};

				function getNextSlideName(name) {

					for (var i = 0; i < slides.length; i++) {
						if (slides[i].name === name) {
							if (slides.length - 1 > i) {
								return slides[i + 1].name;
							} else {
								return slides[0].name;
							}
						}
					}

					throw 'next slide name not found';
				}

				function getSlideByName(name) {
					for (var i = 0; i < slides.length; i++) {

						if (slides[i].name === name) {
							return slides[i];
						}
					}

					throw 'Slide #' + name + ' not found';
				}

				function getPrevSlideName(curName) {

					for (var i = 0; i < slides.length; i++) {
						if (slides[i].name === curName) {
							if (i === 0) {
								return slides[slides.length].name;
							} else {
								return slides[i - 1].name;
							}
						}
					}

					throw 'prev slide name not found';
				}

				sfSlideBoxDelegate.addInstance(this);
			}
		};
	})
;

angular.module('fun')
	.directive('sfSlide', function () {
		return {
			restrict: 'E',
			template: '<div class="sf-slide" ng-show="selected" ng-transclude></div>',
			transclude: true,
			require: '^sfSlideBox',
			scope: true,
			link: function ($scope, element, attrs, controller) {

				controller.addSlide(attrs.name, $scope);

				if (attrs.$attr.selected) {
					controller.curSlideName = attrs.name;
					controller.render();
				}
			}
		};
	})
;
