angular.module('starter', ['ionic', 'ionic.native', 'app.data-service'])
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
.run(function($rootScope, $state, dataService){
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        if(dataService.getCurrentUser() == null && toState.name != 'login'){
            $state.go('login');
            event.preventDefault();
        }
    });
})
.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
    .state('login',{
        url: '/login',
        templateUrl: 'login.html',
        controller: 'LoginCtrl'
    })
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
    .state('root.user',{
        url: '/user/:profile_id',
        views: {
            pageHome: {
                templateUrl: 'profile.html',
                controller: 'ProfileCtrl'
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
        url: '/profile/:profile_id',
        views: {
            pageProfile: {
                templateUrl: 'profile.html',
                controller: 'ProfileCtrl'
            }
        }
    })
    $urlRouterProvider.otherwise('/login');
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
.controller('LoginCtrl', ['$scope', 'dataService', '$state', function ($scope, dataService, $state) {
    $scope.login = function(user, mdp){
        dataService.getUserByUsernameAndPass(user,mdp).then(function(res){
            if(res){
                $state.go('root.home');
            }
            else{
                alert('Invalid Credentials');
            }
        });
    }
}])
.controller('IndexCtrl', ['$scope', 'dataService', function ($scope, dataService) {
    dataService.autoLogin();
    $scope.currentUser = dataService.getCurrentUser();
}])
.controller('HomeCtrl', ['$scope', 'dataService', '$state', function ($scope, dataService, $state) {
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
    $scope.goTo = function(user_id){
        $state.go('root.user', {profile_id: user_id});
    }
}])
.controller('LikesCtrl', ['$scope', 'dataService', '$stateParams', '$state', function ($scope, dataService, $stateParams, $state) {
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
    $scope.goTo = function(user_id){
        $state.go('root.user', {profile_id: user_id});
    }
}])
.controller('CommentsCtrl', ['$scope', 'dataService', '$stateParams', '$ionicPopup', '$state', function ($scope, dataService, $stateParams, $ionicPopup, $state) {
    $scope.currentUser = dataService.getCurrentUser();
    dataService.getComments($stateParams.post_id).then(function(comments){
        $scope.comments = comments;
    }, function(err){
        console.log('Erreur : ' + err);
    });
    $scope.goTo = function(user_id){
        $state.go('root.user', {profile_id: user_id});
    }
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
.controller('AddCtrl', ['$scope',  'dataService', '$cordovaCamera', function ($scope, dataService, $cordovaCamera) {
    console.log(dataService.getCurrentUser());

    $scope.takePicture = function(){
        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA
        }
        $cordovaCamera.getPicture(options).then(function(image){
            $scope.imageURI = image;
        }, function(error){
            alert('Failed with error' +  error.code + ' : ' + error.message);
        });
    }
}])
.controller('ProfileCtrl', ['$scope', 'dataService', '$stateParams', function ($scope, dataService, $stateParams) {
    dataService.getUserById($stateParams.profile_id).then(function(user){
        $scope.profileUser = user;
    }, function(err){
        console.log('Erreur ', err);
    });
}])