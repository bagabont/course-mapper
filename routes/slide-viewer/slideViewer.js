var express = require('express');
var config = require('config');
var appRoot = require('app-root-path');
var SlideViewer = require(appRoot + '/modules/slide-viewer');


var router = express.Router();


router.get('/', function(req, res, next) {
  var comment = new Comment();
  comment.getAllComments(function(err, data) {

    //res.json(data);
      res.render('slide-viewer/slideViewer', {
        numComments: data.length,
        comments: data
      }

    );

  });
});

router.post('/slide-viewer', function(req, res, next){
    var comment = new Comment();
    comment.handleSubmitPost(req, res, next);
});

router.get('/slide-viewer/disComm', function(req, res, next){
  var comment = new Comment();
  comment.getAllComments(function(err, data) {

    //res.json(data);
      res.render('slide-viewer/displayComments', {
        numComments: data.length,
        comments: data
      }

    );

  });
});

router.get('/slide-viewer/disComm/:order/:filters', function(req, res, next){
  var comment = new Comment();

  var order = JSON.parse(req.params.order);
  var filter = JSON.parse(req.params.filter);


  comment.getAllComments(function(err, data) {

    //res.json(data);
      res.render('slide-viewer/displayComments', {
        numComments: data.length,
        comments: data
      }

    );

  });
});


/*router.get('/slide-viewer/displayComments', function(req, res, next) {
    res.render('index', {
      title: 'Test',
      pagetitle: 'Hello',
      comments: comment

    });
});*/


module.exports = router;
