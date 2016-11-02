angular.module('instacafe.api', ['restangular'])
.factory('CafeApi', function (Restangular) {
    return {
        getNear: function (point, offset) {
            return Restangular.one('cafes').get({
                point: [point.latitude, point.longitude].join(','),
                offset: offset
            });
        },
        getDetail: function (cafeId) {
            return Restangular.one('cafes', cafeId).get();
        },
        getPhotos: function (cafeId, offset) {
            return Restangular.one('cafes', cafeId).one('photos').get({
                offset: offset
            });
        },
        search: function (countryId, cityId, offset) {
            return Restangular.one('cafes').one('search').get({
                country: countryId,
                city: cityId,
                offset: offset
            });
        },
        discover: function (offset) {
            return Restangular.one('cafes').one('discover').get({
                offset: offset
            });
        },
        favorite: function (cafeIds, offset) {
            var ids = cafeIds.join(',');
            return Restangular.one('cafes').one('search').get({
                ids: ids,
                offset: offset
            });
        }
    };
})

.factory('LocationApi', function (Restangular) {
    return {
        getCountries: function () {
            return Restangular.one('countries').get();
        },
        getCities: function (countryId) {
            return Restangular.one('cities').get({ country: countryId });
        }
    };
})

.factory('ReportApi', function (Restangular) {
    return {
        send: function (category, photoId) {
            return Restangular.one('report').customPOST({
                category: category,
                photo: photoId
            });
        },
        update: function (user_id, updated) {
            return Restangular.one('account-image', user_id).customPUT({
                user_id: user_id,
                image_updated: updated
            });
        }
    };
})

.factory('FeedbackApi', function (Restangular) {
    return {
        send: function (formData) {
            return Restangular.one('feedback').customPOST(formData);
        }
    };
});
