angular.module('starter', ['ionic', 'app.data-service'])
.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})
.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
    .state('root',{
        url: '/root',
        abstract: true,
        templateUrl: 'root.html',
        controller: 'IndexCtrl'
    })
    .state('root.home',{
        url: '/home',
        views: {
            pageHome: {
                templateUrl: 'home.html',
                controller: 'HomeCtrl'
            }
        }
    })
    .state('root.likes',{
        url: '/likes/:post_id',
        views: {
            pageHome: {
                templateUrl: 'likes.html',
                controller: 'LikesCtrl'
            }
        }
    })
    .state('root.comments',{
        url: '/comments/:post_id',
        views: {
            pageHome: {
                templateUrl: 'comments.html',
                controller: 'CommentsCtrl'
            }
        }
    })
    .state('root.add',{
        url: '/add',
        views: {
            pageAdd: {
                templateUrl: 'add.html',
                controller: 'AddCtrl'
            }
        }
    })
    .state('root.profile',{
        url: '/profile',
        views: {
            pageProfile: {
                templateUrl: 'profile.html',
                controller: 'ProfileCtrl'
            }
        }
    })
    $urlRouterProvider.otherwise('/root/home');
})
.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})
.controller('IndexCtrl', ['$scope', 'dataService', function ($scope, dataService) {
    dataService.autoLogin();
}])
.controller('HomeCtrl', ['$scope', 'dataService', function ($scope, dataService) {
    $scope.likeDisabled = false;
    // Récupération des posts avant d'afficher la vue
    $scope.$on('$ionicView.beforeEnter', function(){
        dataService.getPosts().then(function(posts){
            $scope.posts = posts;
        }, function(err){
            console.log('Erreur : ' + err);
        });
    });
    // Raffraichissement de la page en rechargeant les posts
    $scope.doRefresh = function() {
        dataService.getPosts().then(function(posts){
            $scope.posts = posts;
            $scope.$broadcast('scroll.refreshComplete');
        }, function(err){
            console.log('Erreur : ' + err);
        });
    };
    // Fonction de like ou d'unlike d'un post
    $scope.unlikeOrLikePost = function(item){
        $scope.likeDisabled = true;
        // Si le post est liked, on le dislike
        if(item.likedByCurrentUser){
            item.likedByCurrentUser = false;
            item.likesCount--;
            dataService.unlikePost(item.id).then(function(res){
                $scope.likeDisabled = true;
                console.log("unliked");
            }, function(err){
                item.likesCount++;
                $scope.likeDisabled = true;
                item.likedByCurrentUser = true;
                console.log('Erreur : ' + err);
            });
        }
        else{
            item.likedByCurrentUser = true;
            item.likesCount++;
            dataService.likePost(item.id).then(function(res){
                $scope.likeDisabled = true;
                console.log("liked");
            }, function(err){
                item.likesCount--;
                $scope.likeDisabled = true;
                item.likedByCurrentUser = false;
                console.log('Erreur : ' + err);
            });
        }
    }
}])
.controller('LikesCtrl', ['$scope', 'dataService', '$stateParams', function ($scope, dataService, $stateParams) {
    dataService.getLikes($stateParams.post_id).then(function(likes){
        $scope.likes = likes;
    }, function(err){
        console.log('Erreur : ' + err);
    });
    $scope.doRefresh = function() {
        dataService.getLikes($stateParams.post_id).then(function(likes){
            $scope.likes = likes;
            $scope.$broadcast('scroll.refreshComplete');
        }, function(err){
            console.log('Erreur : ' + err);
        });
    };
}])
.controller('CommentsCtrl', ['$scope', 'dataService', '$stateParams', '$ionicPopup', function ($scope, dataService, $stateParams, $ionicPopup) {
    $scope.currentUser = dataService.getCurrentUser();
    dataService.getComments($stateParams.post_id).then(function(comments){
        $scope.comments = comments;
    }, function(err){
        console.log('Erreur : ' + err);
    });
    $scope.doRefresh = function() {
        dataService.getComments($stateParams.post_id).then(function(comments){
            $scope.comments = comments;
            $scope.$broadcast('scroll.refreshComplete');
        }, function(err){
            console.log('Erreur : ' + err);
        });
    };
    $scope.sendComment = function(message){
        dataService.sendComment(message, $stateParams.post_id).then(function(res){
            dataService.getComments($stateParams.post_id).then(function(comments){
                $scope.comments = comments;
            }, function(err){
                console.log('Erreur : ' + err);
            });
        }, function(err){

        });
        $scope.comment = '';
    }
    $scope.deleteComment = function(comment){
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete a comment',
            template: 'Are you sure you want to delete this comment?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                dataService.deleteComment(comment).then(function(res){
                    dataService.getComments($stateParams.post_id).then(function(comments){
                        $scope.comments = comments;
                    }, function(err){
                        console.log('Erreur : ' + err);
                    });
                }, function(err){
                    console.log('Erreur : ' + err);
                });
            } 
            else {
                console.log('You are not sure');
            }
        });
    };
}])
.controller('AddCtrl', ['$scope',  'dataService', function ($scope, dataService) {
    console.log(dataService.getCurrentUser());
}])
.controller('ProfileCtrl', ['$scope', 'dataService', function ($scope, dataService) {
    $scope.currentUser = dataService.getCurrentUser();
    console.log($scope.currentUser);
}])