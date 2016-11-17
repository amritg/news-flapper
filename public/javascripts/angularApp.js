(function (){
    var app = angular.module('flapperNews',['ui.router']);

    app.controller('MainCtrl',['$scope','posts','allPost',function($scope,posts,allPost){
         $scope.posts = posts.posts;
         
        $scope.addPost = function(){
            if(!$scope.title || $scope.title === ''){
                return;
            }
            posts.create({
                title: $scope.title,
                link: $scope.link
            });
            $scope.title = '';
            $scope.link = '';
        };

        $scope.incrementUpVotes = function(post){
            posts.upvote(post);
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

    app.factory('posts',['$http',function($http){
        var service = this;
        service.posts = [];

        service.incrementByOne = function(value){
             value.upvotes += 1;
        }

        service.getAll = function(){
            return $http.get('/posts').success(function(data){
                angular.copy(data, service.posts);
            });
        }

        service.create = function(post){
            $http.post('/posts', post).then(function(response){
                console.log(response);
                service.posts.push(response.data);
            });
        }

        service.upvote = function(post){
            $http.put('/posts/' + post._id + '/upvote').then(function(response){
                console.log(response);
                post.upvotes += 1;
                console.log(response.data.upvotes);
                console.log(post.upvotes);
            });
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
                    controller: 'MainCtrl',
                    resolve: {
                        allPost: function(posts){
                            return posts.getAll();
                        }
                    }
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