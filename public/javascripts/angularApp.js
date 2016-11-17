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

    app.controller('PostsCtrl',['$scope','posts','allComment',function($scope,posts,allComment){
        $scope.post = allComment;
        $scope.incrementUpVotes = function(comment){
            posts.incrementByOne(comment);
        };

        $scope.addComment = function(){
            if($scope.body === ""){return;}
            posts.addComment($scope.post._id,{
                body: $scope.body,
                author: 'user',
                upvotes: 0
            }).success(function(comment){
                 console.log(comment);
                 $scope.post.comments.push(comment);
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

        service.getAllPost = function(){
            return $http.get('/posts').success(function(data){
                angular.copy(data, service.posts);
            });
        }
        service.getAllComment = function(id){
            return $http.get('/posts/' +id).then(function(response){
                return response.data;
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
        service.addComment = function(id,comment){
           return $http.post('/posts/' + id + '/comments', comment);
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
                            return posts.getAllPost();
                        }
                    }
                })
                .state('posts',{
                    url: '/posts/{id}',
                    templateUrl:'/posts.html',
                    controller: 'PostsCtrl',
                    resolve: {
                        allComment: ['$stateParams', 'posts', function($stateParams, posts) {
                            return posts.getAllComment($stateParams.id);
                        }]
                    }
                });
            $urlRouterProvider.otherwise('home');
        }
    ]);
})();