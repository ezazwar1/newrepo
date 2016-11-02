/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('shiptApp').factory('OrderRating', [
        '$http',
        'AuthService',
        'ApiEndpoint',
        'DefaultHeaders',
        'AppAnalytics',
        OrderRatingModel]);

    function OrderRatingModel($http,
                              AuthService,
                              ApiEndpoint,
                              DefaultHeaders,
                              AppAnalytics) {

        function addDefaultHeaders(){
            DefaultHeaders.customer();
        }

        var OrderRating = function(rating) {
            this.id = null;
            this.rating = null;
            this.comments = null;
            this.order_id = null;
            this.driver_id = null;
            this.wrong_items = false;
            this.missing_items = false;
            this.damaged_items = false;
            this.late_delivery = false;
            this.poor_replacements = false;
            this.unfriendly_driver = false;

            this.went_above_and_beyond = false;
            this.good_communication = false;
            this.friendly_driver = false;

            if(rating) {
                this.id = rating.id;
                this.rating = rating.rating;
                this.comments = rating.comments;
                this.wrong_items = rating.wrong_items;
                this.missing_items = rating.missing_items;
                this.damaged_items = rating.damaged_items;
                this.late_delivery = rating.late_delivery;
                this.poor_replacements = rating.poor_replacements;
                this.unfriendly_driver = rating.unfriendly_driver;

                this.went_above_and_beyond = rating.went_above_and_beyond;
                this.good_communication = rating.good_communication;
                this.friendly_driver = rating.friendly_driver;
            }
        };

        OrderRating.prototype.hasItemIssues = function() {
            if(this.wrong_items || this.missing_items || this.damaged_items || this.poor_replacements) {
                return true;
            } else {
                return false;
            }
        }

        OrderRating.prototype.save = function() {
            var self = this;
            if(self.isValid()){
                addDefaultHeaders();
                AppAnalytics.rateShopper(self);
                if(!self.id) {
                    return $http({
                        url: ApiEndpoint.apiurl + '/api/v1/ratings.json',
                        method: "POST",
                        data: self
                    });
                } else {
                    return $http({
                        url: ApiEndpoint.apiurl + 'api/v1/ratings/'+self.id+'.json',
                        method: "PATCH",
                        data: self
                    });
                }
            }
        };

        OrderRating.prototype.isValid = function() {
            var self = this;
            console.log('is valid prototype method.')
            if(self.order_id && self.order_id && self.rating) {
                if(self.rating <= 5 && self.rating >= 1) {
                    return true;
                }
            }
            return false;
        };

        return OrderRating;

    }
})();
