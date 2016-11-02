angular.module('databases', [])
.factory('LokiDB', function($q, Loki) {
  var _db;
  var _setting;
  var _articles;
  var _items;
  var _itemGroups;
  var _itemSaved;
  var _itemStream;
  var init = {
  	initDB: function() {            
        var fsAdapter = new LokiCordovaFSAdapter({"prefix": "loki"});  
        _db = new Loki('GetfashDB_prod_2',
                {
                    autosave: true,
                    autosaveInterval: 60 * 1000,// 60 second
                    adapter: fsAdapter
                });
    },
    getArticle: function() {        
        return $q(function (resolve, reject) {

            var options = {};

            _db.loadDatabase(options, function () {

                _articles = _db.getCollection('articles');

                if (!_articles) {
                    _articles = _db.addCollection('articles');
                }

                resolve(_articles.data);
            });
        });
    },
    getItem: function() {        
        return $q(function (resolve, reject) {

            var options = {};

            _db.loadDatabase(options, function () {

                _items = _db.getCollection('items');

                if (!_items) {
                    _items = _db.addCollection('items');
                }

                resolve(_items.data);
            });
        });
    },
    getItemStream: function() {        
        return $q(function (resolve, reject) {

            var options = {};

            _db.loadDatabase(options, function () {

                _itemStream = _db.getCollection('itemstreams');

                if (!_itemStream) {
                    _itemStream = _db.addCollection('itemstreams');
                }

                resolve(_itemStream.data);
            });
        });
    },
    getItemGroup: function() {        
        return $q(function (resolve, reject) {

            var options = {};

            _db.loadDatabase(options, function () {

                _itemGroups = _db.getCollection('itemgroups');

                if (!_itemGroups) {
                    _itemGroups = _db.addCollection('itemgroups');
                }

                resolve(_itemGroups.data);
            });
        });
    },
    getItemSaved: function() {        
        return $q(function (resolve, reject) {

            var options = {};

            _db.loadDatabase(options, function () {
                _itemSaved = _db.getCollection('itemsaved');

                if (!_itemSaved) {
                    _itemSaved = _db.addCollection('itemsaved');
                }

                resolve(_itemSaved.data);
            });
        });
    },
    getSetting: function() {        
        return $q(function (resolve, reject) {

            var options = {};

            _db.loadDatabase(options, function () {
                _setting = _db.getCollection('settings');

                if (!_setting) {
                    _setting = _db.addCollection('settings');
                }

                resolve(_setting.data);
            });
        });
    },

    findArticle: function(articleid) {
        return _articles.findOne({"articleId":articleid});
    },
    addArticle: function(article) {
        _articles.insert(article);
    },
    removeAllArticle: function() {
        _articles.removeWhere({});
    },
    removeArticleById: function(articleid) {
        _articles.removeWhere({"articleid":articleid});
    },
    findAllArticleItem: function(articleId) {
        return _items.find({"itemArticleId":articleId});
    },
    findItem: function(itemid) {
        return _items.findOne({"itemId":itemid});
    },
    addItem: function(item) {
        _items.insert(item);
    },
    removeAllArticleItem: function(articleid) {
        _items.removeWhere({"itemArticleId":articleid});
    },
    removeItemById: function(itemid) {
        _items.removeWhere({"itemId":itemid});
    },
    addItemGroup: function(itemgroup) {
        _itemGroups.insert(itemgroup);
    },
    findItemGroupByUser: function(userid) {
        var data =  _itemGroups.find({"userId":userid});
        if(data != undefined){
            return data.sort(function(left, right){
                if (left.createdDate < right.createdDate) {
                    return 1;
                }
                if (left.createdDate > right.createdDate) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
        }else{
            data;
        }
    },
    findItemGroupById: function(groupid) {
        return _itemGroups.findOne({"groupId":groupid});
    },
    removeAllItemGroup: function() {
        _itemGroups.removeWhere({});
    },
    removeAllItemGroupByUser: function(userid) {
        _itemGroups.removeWhere({"userId":userid});
    },
    removeAllItemGroupById: function(groupid) {
        _itemGroups.removeWhere({"groupId":groupid});
    },
    updateItemGroup: function(itemgroup) {
        _itemGroups.update(itemgroup);
    },

    addItemSaved: function(itemsaved) {
        _itemSaved.insert(itemsaved);
    },
    findItemSavedById: function(groupid) {
        var data = _itemSaved.find({"itemGroupId":groupid});
        if(data != undefined){
            return data.sort(function(left, right){
                if (left.item.itemCreatedDate < right.item.itemCreatedDate) {
                    return 1;
                }
                if (left.item.itemCreatedDate > right.item.itemCreatedDate) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
        }else{
            data;
        }
    },
    findItemSavedByGroupIdAndItemId: function(groupid, itemid) {
        return _itemSaved.findOne({"$and":[{"itemGroupId":groupid}, {"item.itemId":itemid}]});
    },
    removeAllItemSavedById: function(groupid) {
        _itemSaved.removeWhere({"itemGroupId":groupid});
    },
    removeItemSavedById: function(groupid, itemid) {
        _itemSaved.removeWhere({"$and":[{"itemGroupId":groupid}, {"item.itemId":itemid}]});
    },
    removeAllItemSaved: function() {
        _itemSaved.removeWhere({});
    },
    removeAllItemSavedByObj: function(obj) {
        _itemSaved.remove(obj);
    },
    findSetting: function(notif, userid) {
        return _setting.findOne({"notif":notif});
    },
    updateSetting: function(setting) {
        _setting.update(setting);
    },
    addSetting: function(setting) {
        _setting.insert(setting);
    },
    removeAllSetting: function() {
        _setting.removeWhere({});
    },
    findItemStream: function(itemid) {
        return _itemStream.findOne({"itemId":itemid});
    },
    addItemStream: function(item) {
        _itemStream.insert(item);
    },
    removeAllItemStream: function(articleid) {
        _itemStream.removeWhere({"itemArticleId":articleid});
    },
    removeItemStreamById: function(itemid) {
        _itemStream.removeWhere({"itemId":itemid});
    },
  };

  return init;
});