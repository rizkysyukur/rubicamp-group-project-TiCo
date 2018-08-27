// config/passport.js

// load all the things we need
const LocalStrategy   = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

// load up the user model
const User = require('../models/index').User;
const configAuth = require('../config/auth');

// expose this function to our app using module.exports
module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id).then(user => {
      // project will be an instance of Project and stores the content of the table entry
      // with id 123. if such an entry is not defined you will get null
      if(user){
        done(null, user)
      }else{
        done(true, user)
      }
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({
      where: {
        email: email
      }
    }).then(user => {
      // check to see if theres already a user with that email
      if (user) {
        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
      } else {
        // if there is no user with that email
        // create the user
        User.create({
          email: email,
          pass: password
        }).then(newUser => {
          return done(null, newUser);
        }).catch(err => {
          return done(err);
        });
      }
    });
  }));

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) { // callback with email and password from our form

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({
      where: {
        email: email
      }
    }).then(user => {
      // if no user is found, return the message
      if (!user)
      return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

      // if the user is found but the password is wrong
      if (!user.validPassword(password))
      return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

      // all is well, return successful user
      return done(null, user);
    });
  }));

  // facebook
  const fbStrategy = configAuth.facebookAuth;
  fbStrategy.passReqToCallback = true;
  passport.use(new FacebookStrategy(fbStrategy, function(req, token, refreshToken, profile, done){
    // apakah ada session user yang aktif
    if(!req.user){
      User.findOne({
        where: {
          fbid: profile.id
        }
      }).then(user => {
        if(user){ // kalau profile facebook ID ada
          if(!user.fbtoken){ // kalau token ngga ada
            user.fbtoken = token;
            user.fbname = profile.name.givenName + ' ' + profile.name.familyName;
            user.fbemail = (profile.emails[0].value || '').toLowerCase();
            user.save().then(function(){
              return done(null, user);
            })
          }
          return done(null, user);
        }else{
          User.create({
            fbid: profile.id,
            fbtoken: token,
            fbname: profile.name.givenName + ' ' + profile.name.familyName,
            fbemail: (profile.emails[0].value || '').toLowerCase()
          }).then(function(newUser){
            return done(null, newUser);
          })
        }
      });
    }else{ // kalau ada session
      var user = req.user;
      user.fbid = profile.id;
      user.fbtoken = token;
      user.fbname = profile.name.givenName + ' ' + profile.name.familyName;
      user.fbemail = (profile.emails[0].value || '').toLowerCase();
      user.save().then(function(){
        return done(null, user);
      });
    }
  }));

  //twitter
  passport.use(new TwitterStrategy({
    consumerKey: configAuth.twitterAuth.consumerKey,
    consumerSecret: configAuth.twitterAuth.consumerSecret,
    callbackURL: configAuth.twitterAuth.callbackURL,
    passReqToCallback: true
  },
  function(req, token, tokenSecret, profile, done){
    if(!req.user){
      User.findOne({
        where: {
          twid: profile.id
        }
      }).then(user => {
        if(user){ // kalau profile facebook ID ada
          if(!user.twtoken){ // kalau token ngga ada
            user.twtoken = token;
            user.twusername = profile.username;
            user.twdisplayName = profile.displayName;
            user.save().then(function(){
              return done(null, user);
            })
          }
          return done(null, user);
        }else{
          User.create({
            twid: profile.id,
            twtoken: token,
            twusername: profile.username,
            twdisplayName: profile.displayName
          }).then(function(newUser){
            return done(null, newUser);
          })
        }
      });
    }else{ // kalau ada session
      var user = req.user;
      user.twid = profile.id;
      user.twtoken = token;
      user.twusername = profile.username;
      user.twdisplayName = profile.displayName;
      user.save().then(function(){
        return done(null, user);
      });
    }
  }));
};
