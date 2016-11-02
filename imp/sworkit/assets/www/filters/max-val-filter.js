angular.module('swMobileApp').filter('maxVal', function () {
    return function (input, max) {
        input = parseInt(input);
        console.log('input', input);
        console.log('max', max);
        if (input > max) {
            return max
        } else {
            return input;
        }
    };
});