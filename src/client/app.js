'use strict';

var module = angular.module('app',
    ['filters',
     'ui.utils',
     'ui.router',
     'ui.bootstrap',
     'ngSanitize']);

var filters = angular.module('filters', []);

// *************************************************************
// Delay start
// *************************************************************

angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
});

// *************************************************************
// States
// *************************************************************

module.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$sceDelegateProvider', '$compileProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider, $sceDelegateProvider, $compileProvider) {

        $stateProvider

            .state('home', {
                url: '/',
                templateUrl: '/templates/home.html',
                controller: 'HomeCtrl'
            })

            .state('play', {
                url: '/:id',
                templateUrl: '/templates/play.html',
                controller: 'PlayCtrl',
                resolve: {
                    playlist: ['$stateParams', '$RPCService',
                        function($stateParams, $RPCService) {
                            return $RPCService.call('playlist', 'get', {
                                id: $stateParams.id
                            });
                        }
                    ]
                }
            });

        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);

        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'https://embed.spotify.com/**'
        ]);

        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|spotify):/);
    }
])
.run(['$rootScope', '$state', '$stateParams',
    function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }
]);
