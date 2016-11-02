
'use strict';

(function() {
    angular.module('znk.sat').filter('expressionStyle',[ function() {
        return function(input) {
            input = input || '0';
            var commifyNum = function commifyNum(num_str) {
                var decimal_part;
                var integer_part;
                var new_integer_part = '';
                var i;
                var iter_num;

                if (isNaN(parseFloat(num_str))) { return num_str; }

                num_str = num_str.split('.');
                integer_part = num_str[0];
                decimal_part = num_str[1];

                for (i = integer_part.length - 1, iter_num = 0; i >= 0; --i) {
                    iter_num += 1;
                    new_integer_part += integer_part[i];
                    if (iter_num % 3 === 0) {
                        new_integer_part += ',';
                    }
                }
                if (new_integer_part.length > 0 && new_integer_part[new_integer_part.length - 1] === ',') {
                    new_integer_part = new_integer_part.substr(0, new_integer_part.length - 1);
                }
                new_integer_part = new_integer_part.split('').reverse().join('');
                if (decimal_part) {
                    return new_integer_part + '.' + decimal_part;
                }
                return new_integer_part;
            };

            var splitExp = function splitExp(exp) {
                var i = 0;
                var digit_or_dot = /[\d\.]/;
                var result = [];
                var current_elem = '';
                if (exp === '') { return []; }
                var in_number = exp[0].match(digit_or_dot);
                while (i < exp.length) {
                    if (in_number) {
                        if (exp[i].match(digit_or_dot)) {
                            current_elem += exp[i];
                            i = i + 1;
                        } else {
                            in_number = false;
                            result.push(current_elem);
                            current_elem = '';
                        }
                    } else {
                        if (!exp[i].match(digit_or_dot)) {
                            current_elem += exp[i];
                            i = i + 1;
                        } else {
                            in_number = true;
                            result.push(current_elem);
                            current_elem = '';
                        }
                    }
                }
                if (current_elem.length > 0) {
                    result.push(current_elem);
                }
                return result;
            }

            var commify = function commify(exp) {
                exp = exp + '';
                var i;
                var res = '';
                if (exp === '') { return ''; }

                exp = splitExp(exp);
                for (i = 0; i < exp.length; ++i) {
                    res += commifyNum(exp[i]);
                }
                return res;
            }

            return  commify(input) ;
        };
    }]);
})();
