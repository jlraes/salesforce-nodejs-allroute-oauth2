var express = require('express');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var session = require('express-session');
var util = require('util');
var methodOverride = require('method-override');
var passport = require('passport'),
    passportSFAuth = require('passport-salesforce-oauth2').Strategy;
var PORT = process.env.PORT || 3000;

var SF_ORG = '';
var SF_CLIENT_ID = '';
var SF_CLIENT_SECRET = '';
var CALLBACK_URL = '/auth/salesforce/callback';
var SF_AUTHORIZE_URL = 'https://login.salesforce.com/services/oauth2/authorize';
var SF_TOKEN_URL = 'https://login.salesforce.com/services/oauth2/token';

// @@ Passport Specific
passport.serializeUser(function(user, done) {
    done(null,user);
  });

passport.deserializeUser(function(user, done) {
    done(null, obj);
  });

passport.use(new passportSFAuth({
    clientID: SF_CLIENT_ID,
    clientSecret:  SF_CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    authorizationURL: SF_AUTHORIZE_URL,
    tokenURL: SF_TOKEN_URL
  },
  function(accessToken, refreshToken, profile, done) {
    //delete profile._raw;
    done(null, profile);
  }
));

passport.use(passportSFAuth);
// !@

// @@ Fire up middleware needs
var app = express();
app.use(cookieParser());
app.use(methodOverride());
app.use(passport.initialize());
app.use(passport.session());
// !@


// @@ Strategy login needs
app.get('/auth/salesforce',
  passport.authenticate('salesforce'));

app.get('/auth/salesforce/callback', passport.authenticate('salesforce', {
  failureRedirect: '/failure'
}), function(req, res) {
    console.log('Auth Request Success ' + req.user.displayName);
    res.cookie('name', req.user.displayName, { maxAge: 259200 });
    res.cookie('email', req.user.email, { maxAge: 259200 });
    res.cookie('userid', req.user.id, { maxAge: 259200 });
    res.cookie('email', req.user.email, { maxAge: 259200 });
    res.cookie('sfid', req.user.id, { maxAge: 259200 });
    res.cookie('orgid', req.user.organization_id, { maxAge: 259200 });
    res.cookie('thumb', req.user._json.photos.thumbnail, { maxAge: 259200 });
    res.cookie('phone', req.user._json.phone_number, { maxAge: 259200 });
    res.cookie('active', req.user._json.active, { maxAge: 259200 });
    res.redirect('/');
});
// !@


app.use(function(req,res,next) {
  if (req.cookies.orgid == SF_ORG && req.cookies.active == 'true') {
    console.log('Ok to pass ' + req.cookies.name);
    next();
  } else {
    console.log('Not logged in');
    res.redirect('/auth/salesforce/callback');
  }
});


app.get('/', function(req,res) {
    console.log('Displaying page for : ' + req.cookies.name);
    res.send('Hello, ' + req.cookies.name);
});

// START SERVER
app.listen(PORT, function() { console.log("Listening on " + PORT); });
