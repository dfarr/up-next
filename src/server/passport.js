var merge = require('merge');

var passport = require('passport');
var Strategy = require('passport-spotify').Strategy;

passport.use(new Strategy({
    clientID: process.env.SPOTIFY_CLIENT,
    clientSecret: process.env.SPOTIFY_SECRET,
    callbackURL: 'http://localhost:5000/auth/spotify/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    done(null, merge(profile._json, {
        token: accessToken
    }));
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});
