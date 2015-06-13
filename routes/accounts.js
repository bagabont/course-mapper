var express = require('express');
var passport = require('passport');
var config = require('config');

var appRoot = require('app-root-path');
var Account = require(appRoot + '/modules/accounts');
var router = express.Router();

router.get('/accounts/createAdmin/:username', function(req, res, next) {
    var account = new Account();
    account.createAdmin(req.params.username);
    res.status(200).json({status:true});
});

router.get('/accounts', function(req, res, next) {
    if(req.user)
        res.redirect('/accounts/' + req.user.username);
    else
        res.redirect('/accounts/login');
});

router.get('/accounts/login', function(req, res, next) {
    res.render(config.get('theme') + '/login', { title: 'Log In Page' });
});

router.post('/accounts/login', function(req, res, next){
    var account = new Account();
    account.handleLoginPost(req, res, next);
});

router.get('/accounts/signUp', function(req, res, next){
    res.render(config.get('theme') + '/signUp', { title: 'Sign Up Page' });
});

router.post('/accounts/signUp', function(req, res, next){
    var account = new Account();
    account.handleRegisterPost(req, res, next);
});

router.get('/accounts/logout', function(req, res, next) {
    req.logout();
    req.flash('info', 'Logged Out');
    res.redirect('/');
});

router.get('/accounts/:username', function(req, res, next) {
    if(req.session.passport.user){
        res.render(config.get('theme') + '/profile', { title: 'My Profile', user: req.session.passport.user });
    }
    else
        res.redirect('/accounts/login');
});

module.exports = router;