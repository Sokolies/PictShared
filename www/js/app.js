angular.module('starter', ['ionic'])
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
                controller: 'IndexCtrl'
            }
        }
    })
    .state('root.add',{
        url: '/add',
        views: {
            pageAdd: {
                templateUrl: 'add.html',
                controller: 'IndexCtrl'
            }
        }
    })
    .state('root.profile',{
        url: '/profile',
        views: {
            pageProfile: {
                templateUrl: 'profile.html',
                controller: 'IndexCtrl'
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
.controller('SideMenuCtrl', ['$scope', '$ionicModal', function ($scope, $ionicModal) {
}])
.controller('IndexCtrl', ['$scope', '$ionicModal', function ($scope, $ionicModal) {
}])