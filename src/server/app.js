'use strict';

var path = require('path');
var glob = require('glob');
var colors = require('colors');
var express = require('express');
var passport = require('passport');

var app = express();

app.use(require('body-parser').json());
app.use(require('cookie-parser')());
app.use(require('cookie-session')({
    secret: 'up-next',
    cookie: {
        maxAge: 60 * 60 * 1000
    }
}));
app.use(passport.initialize());
app.use(passport.session());

//////////////////////////////////////////////////////////////////////////////////////////////
// Middleware
//////////////////////////////////////////////////////////////////////////////////////////////

app.use('/api', require('./middleware/param'));
app.use('/api', require('./middleware/authenticated'));

//////////////////////////////////////////////////////////////////////////////////////////////
// Passport
//////////////////////////////////////////////////////////////////////////////////////////////

require('./passport');

var scope = [
  'playlist-read-private', 
  'playlist-modify-public', 
  'playlist-modify-private', 
  'streaming'
];

app.get('/auth/spotify',
  passport.authenticate('spotify', { scope: scope }),
  function(req, res) {
  });

app.get('/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

//////////////////////////////////////////////////////////////////////////////////////////////
// API
//////////////////////////////////////////////////////////////////////////////////////////////

var api = {};

glob(__dirname + '/api/*', function(err, file) {
    if(file && file.length) {
        file.forEach(function(f) {
            console.log('✓ '.bold.green + path.relative(process.cwd(), f));
            api[path.basename(f, '.js')] = require(f);
        });
    }
});

app.all('/api/:obj/:fun', function(req, res) {
    res.set('Content-Type', 'application/json');
    api[req.params.obj][req.params.fun](req, function(err, obj) {
        if(err) {
            return res.status(err.status || 500).send(err.message || err);
        }
        res.send(obj);
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////
// App
//////////////////////////////////////////////////////////////////////////////////////////////

app.all('/', function(req, res) {
    res.send('hello world');
});

module.exports = app;
