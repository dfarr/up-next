module.controller('PlayCtrl', ['$scope', '$RPC', '$stateParams', '$timeout', 'playlist',
    function($scope, $RPC, $stateParams, $timeout, playlist) {

        var next = 0;

        $scope.play = null;

        $scope.playlist = playlist;

        var noway = function() {
            if(next < playlist.value.tracks.items.length) {
                $scope.play = playlist.value.tracks.items[next++];
                $('#' + $scope.play.track.id)[0].click();
                $timeout(noway, $scope.play.track.duration_ms);
            }
        };

        $timeout(noway, 500);

    }
]);
