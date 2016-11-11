(function (){
    var app = angular.module('flapperNews',[]);
    app.controller('MainCtrl',['$scope',function($scope){
        $scope.test = "Hello world!";
        $scope.title = "";
        $scope.link = "";
        $scope.posts = [
            {title:'post 1', link:'link1', upvotes: 5},
            {title:'post 2', link:'link2', upvotes: 2},
            {title:'post 3', link:'link3', upvotes: 15},
            {title:'post 4', link:'link4', upvotes: 9},
            {title:'post 5', link:'link5', upvotes: 4}
        ];
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
})();