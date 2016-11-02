angular.module('instacafe.directives')
.directive('rateStars', function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<p><span class="rating"><span ng-repeat="rate in rates track by $index"><i class="icon {{ rate }}"></i></span></p>',
        scope: {
            rating: '='
        },
        link: function(scope, element, attrs) {
            scope.rates = _buildRateIcons(scope.rating);
        }
    };

    function _buildRateIcons (rating) {
        var max = 5;
        var rate = _isDecimal(rating) ? rating - 0.5 : rating;
        var hasHalf = _isDecimal(rating) ? true : false;
        var rest = max - rate;
        var rates = [];

        for (i = 0; i < rate; i++) {
            rates[i] = 'ion-ios-star';
        }
        for (i = 0; i < rest; i++) {
            if (hasHalf) {
                rates.push('ion-ios-star-half');
                hasHalf = false;
                i++;
            }
            if (rating < 4.5) {
                rates.push('ion-ios-star-outline');
            }
        }
        return rates;
    }

    function _isDecimal (rating) {
        num = String(rating).split(".")[1];
        if (typeof num === 'undefined') {
            return false;
        } else {
            return true;
        }
    }
});
