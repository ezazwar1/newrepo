angular.module('fun.services')
	.factory('ProgressBarServ', function (LogServ, $timeout) {
		var log = LogServ;

		log.info("ProgressBarServ()");

		var bufferTimeRange     = 45;
		var bufferTimeDuration  = 30000;
		var bufferTimeCurve     = 'easeOutQuad';
		var jobTimeLimit        = 75;
		var jobTimeInterval     = 5000;
		var jobTimeCurve        = 'easeOutQuad';
		var closingTimeDuration = 3000;
		var closingTimeCurve    = 'easeInQuad';


		if (sfLocal.appContext !== 'fbmessenger') {
			bufferTimeDuration  = 90000;
		}

		var visualProgress = { count: 0 };
		var jobTimeLast = 0;

		var setProgress;

		$.easing.easeInCubic = function (x, t, b, c, d) {
			return c*(t/=d)*t*t + b;
		};

		$.easing.easeOutCubic = function (x, t, b, c, d) {
			return c*((t=t/d-1)*t*t + 1) + b;
		};

		$.easing.easeOutQuad = function (x, t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		};

		$.easing.easeInQuad = function (x, t, b, c, d) {
			return c*(t/=d)*t + b;
		};

		$.easing.easeInOutCubic = function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t + b;
			return c/2*((t-=2)*t*t + 2) + b;
		};

		return {
			init: function (fnProgress) {
				setProgress = fnProgress;
			},

			animateNumber: function (from, to, duration, easing, done) {
				visualProgress.count = from;

				$(visualProgress).stop().animate({ count: to }, {
					done: done,
					duration: duration,
					easing: easing || 'easeInCubic',
					step: function () {
						var progressNow = Math.ceil(this.count);
						
						if (progressNow != jobTimeLast) {
							jobTimeLast = progressNow;
							setProgress(progressNow);
						}
					}
				});
			},

			bufferTime: function () {
				this.animateNumber(0, bufferTimeRange, bufferTimeDuration, bufferTimeCurve);
			},

			jobTime: function (percent) {
				var projectedProgress = this.projectNumber(bufferTimeRange, jobTimeLimit, percent);

				this.animateNumber(jobTimeLast, projectedProgress, jobTimeInterval, jobTimeCurve);
			},

			closingTime: function (done) {
				this.animateNumber(jobTimeLast, 100, closingTimeDuration, closingTimeCurve, function () {
					$timeout(function () {
						done();
					}, 1000);
				});
			},

			projectNumber: function (from, to, percent){
				return from + ((to - from) * (percent / 100));
			},

			stopAll: function () {
				$(visualProgress).stop();
			}
		};
	});
	
