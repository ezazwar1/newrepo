angular.module('fun')
	.factory('sfGrowl', function (LogServ, $rootScope, $timeout) {
		
		var log = LogServ,
			container = $('.sf-growl'),
			growlIcon,
			growlMessage,
			notifIcon,
			notifMessage,
			closeButton
		;

		var sfGrowl = {
			show: function (content, callback) {
				var self = this,
					stateNow = $rootScope.currentState,
					canShowGrowl = true && // you can show growl only if:
						container.not(":visible") && // you are not showing growl already
						stateNow.indexOf('main.moviemaker') === -1 && // you are not in moviemaker
						stateNow != 'main.waiting' && // you are not in waiting step
						stateNow != 'main.publish' // you are not in publish page
				;

				log.info("can grow in this state?", stateNow, canShowGrowl);

				if ( ! canShowGrowl) {
					log.info("GROWL CANNOT SHOW. Refer to canShowGrowl rules.", content);
					return;
				}
				
				container.on("click.sfGrowl", function () {
					self.hide();
					if (callback) callback();
				});

				closeButton = $('<div class="close" />');

				closeButton.on("click", function () {
					self.hide();
					return false;
				});

				container.html(closeButton);

				if (content && content.message) {
					notifIcon = content.icon || "images/LOGO_Stayfilm_redondo.png";
					notifMessage = content.message;

					growlIcon = $('<img src="' + notifIcon + '" class="icon" />').appendTo(container);
					growlMessage = $('<span class="message">' + notifMessage + '</span>').appendTo(container);

					container.css("display", "block");
					$timeout(function () {
						container.addClass('open');
						$timeout(function () {
							self.hide();
						}, 5000);
					}, 500);

				} else {
					log.error("invalid growl: ", content);
				}
			},
			hide: function () {
				container.off("click.sfGrowl").removeClass('open');
				$timeout(function () {
					container.html("").css("display", "none");
				}, 500);
			}
		};

		window.sfGrowl = sfGrowl;

		return sfGrowl;
	})
;
