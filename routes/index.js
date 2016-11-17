var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = require('../models/Post');
var Comment = require('../models/Comment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/posts', function(req,res,next){
  Post.find({},function(err,posts){
      if(err) {return next(err)};
      res.json(posts);
  });
});

router.post('/posts', function(req,res,next){
   var post = new Post(req.body);

   post.save(function(err,post){
     if(err) {return next(err);}
     res.json(post);
   });
});

router.get('/posts/:post',function(req,res,next){
  Post.findById(req.params.post)
    .populate('comments')
    .exec(function(err, post){
        if(err) throw err;
        res.json(post);
    });
});

router.put('/posts/:post/upvote',function(req, res, next) {
  Post.findById(req.params.post)
    .exec(function(err, post){
      post.upvote(function(err, post){
        if (err) { return next(err); }
        res.json(post);
      });
    });
});

router.post('/posts/:post/comments',function(req, res, next){
    Post.findById(req.params.post)
        .exec(function(err, post){
    
            var comment = new Comment(req.body);
    
            // comment.post = post;
            post.comments.push(comment);

            post.save(function(err,post){
                if(err) {return next(err);}     
            });

            comment.save(function(err, comment){
                console.log(comment);
                if(err){ return next(err);}
                res.json(comment);   
            });
        });
});

router.put('/posts/:post/comments/:comment/upvote',function(req, res, next){
   //fill here
});
module.exports = router;
