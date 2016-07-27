
var constants					= require('../scripts/constants');
var logger 						= require(constants.paths.scripts + '/logger');
var util 							= require(constants.paths.scripts + '/util');
var assetBuilder 			= require(constants.paths.scripts + '/assetBuilder');


module.exports = function(app, passport) {

// normal routes ===============================================================


    // show the home page (will also have our login links)
    app.get('/', function(req, res) {

      if (!req.isAuthenticated()){
				res.locals.pageTitle = "Main";
				res.locals.stdAssets = assetBuilder.getAssets("stdAssets", "general,index");
				res.locals.appAssets = assetBuilder.getAssets("appAssets", "general,index");
        res.render('index.ejs',{layout: 'layouts/public'});
			} else {
				renderHome(req, res);
      }
    });

    // Token SECTION =========================
    app.get('/token', isLoggedIn, function(req, res) {
      res.status(200).send(req.user);
    });

    app.get('/home', isLoggedIn, function(req, res) {
        renderHome(req, res);
    });

		function renderHome(req, res){
			res.locals.pageTitle = "Home";
			res.locals.stdAssets = assetBuilder.getAssets("stdAssets", "general,angular");
			res.locals.appAssets = assetBuilder.getAssets("appAssets", "general,home");
			if("desktop".compare(res.locals.device)){
				res.render('home.ejs', {
						user : req.user
				});
			} else {
				res.redirect('/m/main/');
			}
		}

    app.get('/app', isLoggedIn, function(req, res) {
        res.locals.pageTitle = "App Info";
        res.locals.stdAssets = assetBuilder.getAssets("stdAssets", "general");
        res.locals.appAssets = assetBuilder.getAssets("appAssets", "general");
        res.render('app.ejs', {
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
					res.locals.pageTitle = "Login";
					res.locals.stdAssets = assetBuilder.getAssets("stdAssets", "general");
					res.locals.appAssets = assetBuilder.getAssets("appAssets", "general,login");
          res.render('login.ejs', {
						message: req.flash('loginMessage'),
						layout: 'layouts/public'
					});
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/home', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
                    res.locals.pageTitle = "SignUp";
                    res.locals.stdAssets = assetBuilder.getAssets("stdAssets", "general");
                    res.locals.appAssets = assetBuilder.getAssets("appAssets", "general");
            res.render('signup.ejs', {
							layout: 'layouts/public',
							message: req.flash('signupMessage')
						});
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/home', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/home',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

        // handle the callback after twitter has authenticated the user
        app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect : '/home',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/home',
                failureRedirect : '/'
            }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/home', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/home',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the user
        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/home',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['home', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/home',
                failureRedirect : '/'
            }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/home');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/home');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/home');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    // A simple detour for token access
    // Application can access token after login to connect with API
    if(req.url.indexOf('/token') > -1)
        res.status(404).send("Not Found");
    else
        res.redirect('/login?' + req.path);
}
