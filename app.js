(function (){
    var app = angular.module('flapperNews',['ui.router']);

    app.controller('MainCtrl',['$scope','posts',function($scope,posts){
        $scope.test = "Hello world!";
        $scope.title = "";
        $scope.link = "";
        $scope.posts = posts.posts;
        $scope.addPost = function(){
            if(!$scope.title || $scope.title === ''){
                return;
            }
            $scope.posts.push({title: $scope.title, link: $scope.link, upvotes: 0});
            $scope.title = '';
            $scope.link = '';
        };

        $scope.incrementUpVotes = function(post){
            post.upvotes += 1;
        };
    }]);

    app.factory('posts',[function(){
        var  o = {
            posts: [
                {title:'post 1', link:'link1', upvotes: 5},
                {title:'post 2', link:'link2', upvotes: 2},
                {title:'post 3', link:'link3', upvotes: 15},
                {title:'post 4', link:'link4', upvotes: 9},
                {title:'post 5', link:'link5', upvotes: 4}
            ]
        };
        return o;
    }]);

    app.config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider,$urlRouterProvider){
            $stateProvider
                .state('home',{
                    url: '/home',
                    templateUrl: '/home.html',
                    controller: 'MainCtrl'
                });
            $urlRouterProvider.otherwise('home');
        }
    ]);
})();