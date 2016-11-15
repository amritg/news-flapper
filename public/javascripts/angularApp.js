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
            $scope.posts.push({
                title: $scope.title,
                link: $scope.link,
                upvotes: 0,
                comments: [
                    {author: 'Joe', body: 'Cool post!', upvotes: 0},
                    {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0},
                ]
            });
            $scope.title = '';
            $scope.link = '';
        };

        $scope.incrementUpVotes = function(post){
            posts.incrementByOne(post);
        };
    }]);

    app.controller('PostsCtrl',['$scope','$stateParams','posts',function($scope,$stateParams,posts){
        $scope.post = posts.posts[$stateParams.id];
        
        $scope.incrementUpVotes = function(comment){
            posts.incrementByOne(comment);
        };

        $scope.addComment = function(){
            console.log($scope);
            if($scope.body === ""){return;}
            $scope.post.comments.push({
                body: $scope.body,
                author: 'user',
                upvotes: 0
            });
            $scope.body = '';
        }
    }]);

    app.factory('posts',[function(){
        var service = this;
        service = {
            posts: [
                {title:'post 1', link:'link1', upvotes: 5},
                {title:'post 2', link:'link2', upvotes: 2},
                {title:'post 3', link:'link3', upvotes: 15},
                {title:'post 4', link:'link4', upvotes: 9},
                {title:'post 5', link:'link5', upvotes: 4}
            ]
        };
         service.incrementByOne = function(value){
             value.upvotes += 1;
         }
        return service;
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
                })
                .state('posts',{
                    url: '/posts/{id}',
                    templateUrl:'/posts.html',
                    controller: 'PostsCtrl'
                });
            $urlRouterProvider.otherwise('home');
        }
    ]);
})();