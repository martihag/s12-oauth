'use strict';

var _ = require('lodash');
var qs = require('querystring');
var jwt = require('jwt-simple');
var request = require('request');
var moment = require('moment');

var config = {
  TWITTER_KEY: 'CBC9bUbbmxsA53LQvwNdD4bd2',
  TWITTER_SECRET: 'AokeB4IUHlIQOqCQ1H2wP615nKdD6VrF3FUfaG2UUmWAUsEGni',
  TWITTER_CALLBACK: 'http://127.0.0.1:9000/',
  TOKEN_SECRET: 's12-oauth'
}

// Get list of auths
/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
function ensureAuthenticated(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }

  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, config.TOKEN_SECRET);

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }

  req.user = payload.sub;
  next();
}

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createToken(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}
/*
 |--------------------------------------------------------------------------
 | Login with Twitter
 |--------------------------------------------------------------------------
 */

exports.twitter = function(req, res) {
  var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  var authenticateUrl = 'https://api.twitter.com/oauth/authenticate';

  if (!req.query.oauth_token || !req.query.oauth_verifier) {
    var requestTokenOauth = {
      consumer_key: config.TWITTER_KEY,
      consumer_secret: config.TWITTER_SECRET,
      callback: config.TWITTER_CALLBACK
    };

    // Step 1. Obtain request token for the authorization popup.
    console.log('step 1');
    request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
      console.log('inside step 1');
      var oauthToken = qs.parse(body);
      var params = qs.stringify({ oauth_token: oauthToken.oauth_token });

      // Step 2. Redirect to the authorization screen.
      console.log('step 2');
      res.redirect(authenticateUrl + '?' + params);
    });
  } else {
    console.log('step 2 else');
    var accessTokenOauth = {
      consumer_key: config.TWITTER_KEY,
      consumer_secret: config.TWITTER_SECRET,
      token: req.query.oauth_token,
      verifier: req.query.oauth_verifier
    };

    // Step 3. Exchange oauth token and oauth verifier for access token
    console.log('before step 3');
    request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, profile) {
      console.log('step 3');
      profile = qs.parse(profile);

      // Step 4a. Link user accounts.
      if (req.headers.authorization) {
          console.log('req.headers.auth');
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);

          var user = {};

          user._id = '3234dasf';
          user.twitter = profile.user_id;
          user.password = 'asdre123';
          user.displayName = user.displayName || profile.screen_name;

          res.send({ token: createToken(user) });
      } else {
        // Step 4b. Create a new user account or return an existing one.

          var user = {};

          user._id = '3234dasf';
          user.twitter = profile.user_id;
          user.password = 'asdre123';
          user.displayName = user.displayName || profile.screen_name;
          res.send({ token: createToken(user) });
      }
    });
  };
};
