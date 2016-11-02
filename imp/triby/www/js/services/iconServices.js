'use strict';

MyApp.factory('IconService', function(FeedService, $q) {

    return {
    /////////////////// icon Filter /////////////////////////
    iconFilter: function(user, array){
        if(user && array){
            for(var i = 0; i < array.length; i++)
            {
                if(array[i] == user._id){
                    return true;
                }
            }
            return false;
        }
    },
    /////////////////// icon Filter /////////////////////////

    ///////////////////  set Like /////////////////////////
    setLike: function(like, user, post, cb){
        if(this.iconFilter(user, post.likes)){
            FeedService.removeLike(like).then(function(response){
                cb(null, response)
            }, function(err){
                cb(err)
            });
        }
        else{
            FeedService.addLike(like).then(function(response){
                cb(null, response)
            }, function(err){
                cb(err)
            });
        }
    },
    ///////////////////  set Like /////////////////////////

    ///////////////////  set Heart /////////////////////////
    setHeart: function(heart, user, post, cb){
        if(this.iconFilter(user, post.hearts)){
            FeedService.removeHeart(heart).then(function(response){
                cb(null, response)
            }, function(err){
                cb(err)
            });
        }
        else{
            FeedService.addHeart(heart).then(function(response){
                cb(null, response)
            }, function(err){
                cb(err)
            });
        }
    },
    ///////////////////  set Heart /////////////////////////

    ///////////////////  set DisLike /////////////////////////
    setDislike: function(dislike, user, post, cb){
        if(this.iconFilter(user, post.dislikes)){
            FeedService.removeDislike(dislike).then(function(response){
                cb(null, response)
            }, function(err){
                cb(err)
            });
        }
        else{
            FeedService.addDislike(dislike).then(function(response){
                cb(null, response)
            }, function(err){
                cb(err)
            });
        }

    }
    ///////////////////  set DisLike /////////////////////////
    }
});
