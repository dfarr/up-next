module.controller('HomeCtrl', ['$scope', '$RPC',
    function($scope, $RPC) {

        $scope.playlist = $RPC.call('playlist', 'all');

    }
]);
