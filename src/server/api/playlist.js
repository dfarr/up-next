var spotify = require('../spotify');

module.exports = {

    all: function(req, done) {
        var path = '/v1/users/' + req.user.id + '/playlists';
        spotify.call({
            path: path,
            method: 'GET',
            token: req.user.token
        }, done);
    },

    get: function(req, done) {
        var path = '/v1/users/' + req.user.id + '/playlists/' + req.args.id;
        spotify.call({
            path: path,
            method: 'GET',
            token: req.user.token
        }, done);
    }

    // TODO:
    // playlist:create, track:add

};
