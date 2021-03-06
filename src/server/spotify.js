
var https = require('https');

module.exports = {
    call: function(args, done) {
        var request = https.request({
            host: 'api.spotify.com',
            path: args.path,
            body: args.body,
            method: args.method,
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + args.token
            }
        }, function(response) {

            var data = '';

            response.setEncoding('utf8');

            response.on('data', function(chunk) {
                data += chunk;
            });

            response.on('end', function() {
                var err, json;

                try {
                    json = JSON.parse(data);
                } catch(e) {
                    err = {status: 500, message: e};
                    console.log(e);
                }

                done(err || json.error, json);
            });
        });

        request.end();

        request.on('error', function(err) {
            done({status: 500, message: err});
        });
    }
};
