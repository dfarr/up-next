'use strict';

// *****************************************************
// API
// *****************************************************

function ResultSet() {

    this.loaded = false;
    this.loading = true;

}

ResultSet.prototype.set = function(error, value) {

    this.loaded = true;
    this.loading = false;

    this.error = error;
    this.affix = value;
    this.value = (this.value instanceof Array && value instanceof Array) ? this.value.concat(value) : value;

};


module.factory('$RAW', ['$http',
    function($http) {
        return {
            call: function(m, f, d, c) {
                var now = new Date();
                return $http.post('/api/' + m + '/' + f, d)
                    .success(function(res) {
                        // parse result (again)
                        try {
                            res = JSON.parse(res);
                        } catch (ex) {}
                        // yield result
                        c(null, res, new Date() - now);
                    })
                    .error(function(res) {
                        c(res, null, new Date() - now);
                    });
            }
        };
    }
]);


module.factory('$RPC', ['$RAW', '$log',
    function($RAW, $log) {

        return {
            call: function(m, f, d, c) {
                var res = new ResultSet();
                $RAW.call(m, f, d, function(error, value) {
                    res.set(error, value);
                    $log.debug('$RPC', m, f, d, res, res.error);
                    if (typeof c === 'function') {
                        c(res.error, res);
                    }
                });
                return res;
            }
        };
    }
]);


module.factory('$RPCService', ['$q', '$RPC',
    function($q, $RPC) {
        return {
            call: function(o, f, d, c) {
                var deferred = $q.defer();
                $RPC.call(o, f, d, function(err, obj) {
                    if (typeof c === 'function') {
                        c(err, obj);
                    }
                    if(!err) {
                        deferred.resolve(obj);
                    }
                    return deferred.reject();
                });
                return deferred.promise;
            }
        };
    }
]);
