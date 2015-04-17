var express = require('express');
var config = require('config');
var appRoot = require('app-root-path');
var Catalog = require(appRoot + '/modules/catalogs');
var debug = require('debug')('cm:route');

var router = express.Router();

router.get('/api/catalogs/categories', function(req, res, next) {
    var cat = new Catalog();
    cat.getCategoriesRecursive(
        function(err){
            res.status(500).json({});
        },
        // pass 0 to get root categories(who dont have parents), and all of its subcats
        0
        ,
        function(categories){
            res.status(200).json({categories: categories});
        }
    );
});

router.get('/api/catalogs/category/:category', function(req, res, next) {
    var cat = new Catalog();
    cat.getCategory(
        function(err){
            res.status(500).json({});
        },
        {
            slug: req.params.category
        }
        ,
        function(categories){
            res.status(200).json({category: categories});
        }
    );
});


router.get('/api/catalogs/category/:category/tags', function(req, res, next) {
    var cat = new Catalog();
    cat.getCategoryTags(
        function(err){
            res.status(500).json({});
        },
        {
            slug: req.params.category
        }
        ,
        function(tags){
            res.status(200).json({tags: tags});
        }
    );
});

router.get('/api/catalogs/category/:category/courses', function(req, res, next) {
    var cat = new Catalog();
    cat.getCategoryCourses(
        function(err){
            res.status(500).json({errors:err});
        },
        {
            slug: req.params.category
        }
        ,
        function(courses){
            res.status(200).json({courses: courses});
        }
    );
});

router.post('/api/catalogs/categories', function(req, res, next){
    if (req.user && req.user.roles != 'admin') {
        res.status(401).send('Unauthorized');
    }
    else {
        var cat = new Catalog();
        cat.addCategory(
            function (err) {
                res.status(500).json({result:false, errors: err});
            },

            // parameters
            req.body,

            function (cat) {
                res.status(200).json({result:true, category: cat});
            }
        );
    }
});


module.exports = router;