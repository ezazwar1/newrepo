angular.module('photoshare')

.service('postService', ['$http','$q','API_URL',function ($http,$q,API_URL) {

	var postAPI = {

		savePost:function(post){
			return $http.post(API_URL + 'post',post);
		},
		getPostByCircleId:function(id){
			return $http.get(API_URL + 'posts/' + id);
		},
		getCircles:function(){
			return $http.get(API_URL + 'cirlces');
		},
		saveCircle:function(circle){
			return $http.post(API_URL + 'cirlce',circle);
		},
		postComment:function(comment){
			return $http.post(API_URL + 'comment',comment);
		},
		getCommentByPostId:function(id){
			return $http.get(API_URL + 'comment/post/' + id);
		},
		getAllPosts:function(){
			return $http.get(API_URL + 'posts');
		},
		likePost:function(id){
			return $http.put(API_URL + 'post/like/' + id);
		}
	}

	return postAPI;
	
}])