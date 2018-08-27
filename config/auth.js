'use strict'

const config = {
  'facebookAuth': {
    'clientID' : '255872088026',
    'clientSecret': 'fc45862856000dd9bc06491a33603016',
    'callbackURL': 'http://localhost:3000/auth/facebook/callback',
    'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'
  },
  'twitterAuth': {
    'consumerKey': 'Sgw4j3iTJRdGZfkpXmYLoSbBX',
    'consumerSecret': '9HzIjZ5dBoaJH57mYfU0rbQHJpLu1WLJqABCJfnIdGIniAls73',
    'callbackURL': 'http://localhost:3000/auth/twitter/callback'
  },
  'googleAuth': {
    'clientID': '933505276345-fvc65cr61du96v8aettrh04s810l0vhh.apps.googleusercontent.com',
    'clientSecret': '-5W6WVgIyUnuzLEGUygpgpwa',
    'callbackURL': 'http://localhost:3000/auth/google/callback'
  }
}

module.exports = config
