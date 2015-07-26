var spotify = require('../spotify');

module.exports = {

    all: function(req, done) {
        var path = '/v1/users/' + req.user.id + '/playlists';
        spotify.call(path, 'GET', req.user.token, done);
    }

    // TODO:
    // playlist:get, playlist:create, track:add, track:reorder

};
