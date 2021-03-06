angular.module('app.data-service', ['ionic', 'app.backend-services'])

.service('dataService', function($q, $timeout, usersService, postsService, likesService, commentsService, imagesService) {

	// A timeout applied to all queries to simulate network requets.
	var defaultTimout = 500;

	// Automatically login a user (to be used for development only)
	this.autoLogin = function() {
		usersService.autoLogin();
	}

	// Get the current user
	this.getCurrentUser = function() {
		return usersService.getCurrentUser();
	}	

	this.getUserByUsernameAndPass = function(username, pass) {

		var deferred = $q.defer();
		$timeout(function() {
			var user = usersService.getUserByUsernameAndPass(username, pass);
			if (user != null) {
				deferred.resolve(true);
			} else {
				deferred.resolve(false);
			}
		}, defaultTimout);

		return deferred.promise;
	}	

	// Get a user by id
	// Promise is resolved with a user object on success
	this.getUserById = function(userId) {

		var deferred = $q.defer();

		$timeout(function() {
			var user = usersService.getUserById(userId);
			if (user != null) {
				deferred.resolve(user);
			} else {
				deferred.reject(new Error("An unexpected error occured, please try again later."));
			}
		}, defaultTimout);

		return deferred.promise;
	}	

	// Get all posts
	// Promise is resolved with an array of posts on success
	this.getPosts = function() {

		var deferred = $q.defer();

		$timeout(function() {
			var posts = postsService.getPosts();
			if (posts != null) {
				deferred.resolve(posts);
			} else {
				deferred.reject(new Error("An unexpected error occured, please try again later."));
			}
		}, defaultTimout);

		return deferred.promise;
	}	


	// Get all likes for a given post (by id)
	// Promise is resolved with an array of like objects on success
	this.getLikes = function(postId) {

		var deferred = $q.defer();

		$timeout(function() {
			var likes = likesService.getLikes(postId);
			if (likes != null) {
				deferred.resolve(likes);
			} else {
				deferred.reject(new Error("An unexpected error occured, please try again later."));
			}
		}, defaultTimout);

		return deferred.promise;
	}	


	// Get all comments for a given post (by id)
	// Promise is resolved with an array of comment objects on success
	this.getComments = function(postId) {

		var deferred = $q.defer();

		$timeout(function() {
			var comments = commentsService.getComments(postId);
			if (comments != null) {
				deferred.resolve(comments);
			} else {
				deferred.reject(new Error("An unexpected error occured, please try again later."));
			}
		}, defaultTimout);

		return deferred.promise;
	}


	// Like a post (post will be liked by the current user)
	// Promise is resolved with a like object on success
	this.likePost = function(postId) {

		var deferred = $q.defer();

		$timeout(function() {
			var like = likesService.likePost(postId);
			if (like != null) {
				deferred.resolve(like);
			} else {
				deferred.reject(new Error("An unexpected error occured, please try again later."));
			}
		}, defaultTimout);

		return deferred.promise;
	}


	// Unlike a post (if the post is liked by the current user)
	// Promise is resolved with true on success
	this.unlikePost = function(postId) {

		var deferred = $q.defer();

		$timeout(function() {
			var result = likesService.unlikePost(postId);
			if (result) {
				deferred.resolve(true);
			} else {
				deferred.reject(new Error("An unexpected error occured, please try again later."));
			}
		}, defaultTimout);

		return deferred.promise;
	}


	// Add a comment to a post (author is the urrent user)
	// Promise is resolved with a comment object on success
	this.sendComment = function(message, postId) {

		var deferred = $q.defer();

		$timeout(function() {
			var comment = commentsService.sendComment(message, postId);
			if (comment != null) {
				deferred.resolve(comment);
			} else {
				deferred.reject(new Error("An unexpected error occured, please try again later."));
			}
		}, defaultTimout);

		return deferred.promise;
	}


	// Delete a comment (if the author is the current user)
	// Promise is resolved with true on success
	this.deleteComment = function(comment) {

		var deferred = $q.defer();

		$timeout(function() {
			var result = commentsService.deleteComment(comment);
			if (result) {
				deferred.resolve(true);
			} else {
				deferred.reject(new Error("An unexpected error occured, please try again later."));
			}
		}, defaultTimout);

		return deferred.promise;
	}

	// Creates a new post (author is the urrent user)
	// Promise is resolved with a post object on success
	this.createPost = function(imageURL, message) {

		var deferred = $q.defer();

		$timeout(function() {
			var post = postsService.createPost(imageURL, message);
			if (post != null) {
				deferred.resolve(post);
			} else {
				deferred.reject(new Error("An unexpected error occured, please try again later."));
			}
		}, defaultTimout);

		return deferred.promise;
	}


	// Delete a post (if the author is the current user)
	// Promise is resolved with true on success
	this.deletePost = function(postId) {

		var deferred = $q.defer();

		$timeout(function() {
			var result = postsService.deletePost(postId);
			if (result) {
				deferred.resolve(true);
			} else {
				deferred.reject(new Error("An unexpected error occured, please try again later."));
			}
		}, defaultTimout);

		return deferred.promise;
	}
	
	this.uploadImage = function(localImageURL) {

		var deferred = $q.defer();

		$timeout(function() {
			var remoteImageURL = imagesService.uploadImage(localImageURL);
			if (remoteImageURL) {
				deferred.resolve(remoteImageURL);
			} else {
				deferred.reject(new Error("An unexpected error occured, please try again later."));
			}
		}, defaultTimout);

		return deferred.promise;
	}
})