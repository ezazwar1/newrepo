angular.module('instacafe.services')

.factory('Favorite', function (LocalStorage) {
    return {
        getAll: function () {
            return LocalStorage.getList('favorite');
        },
        getById: function (id) {
            var cafe_ids = this.getAll();
            return cafe_ids.indexOf(id);
        },
        setById: function (id) {
            var cafe_ids = this.getAll();
            if (!this.exists(id)) {
                cafe_ids.push(id);
            }
            LocalStorage.setObject('favorite', cafe_ids);
        },
        removeById: function (id) {
            var cafe_ids = this.getAll();
            if (this.exists(id)) {
                var cafe_id = this.getById(id);
                cafe_ids.splice(cafe_id, 1);
            }
            LocalStorage.setObject('favorite', cafe_ids);
        },
        exists: function (id) {
            var index = this.getById(id);
            if (index == -1) {
                return false;
            } else {
                return true;
            }
        },
    };
});
