const routes = ($routeProvider, $httpProvider, $locationProvider) => {
    $locationProvider.html5Mode(false).hashPrefix('');
    $routeProvider
        .when('/', {
            templateUrl: 'bundles/serie/views/homepage.html',
            controller: 'hpController',
            controllerAs: 'vm',
            resolve: {
                connected: checkIsConnected
            }
        })
        .when('/serie/:id', {
            templateUrl: 'bundles/serie/views/serie.html',
            controller: 'serieController',
            controllerAs: 'vm'
        })
        .when('/calendrier', {
            templateUrl: 'bundles/serie/views/calendrier.html'
        })
        .when('/profiledit', {
            templateUrl: 'bundles/serie/views/profiledit.html'
        })
        .when('/profil', {
            templateUrl: 'bundles/serie/views/profile.html'
        })
        .when('/inscription', {
            templateUrl: 'bundles/serie/views/inscription.html'
        })
        .when('/inscriptionbis', {
            templateUrl: 'bundles/serie/views/inscriptionbis.html'
        })
        .when('/resultats/:query', {
            templateUrl: 'bundles/serie/views/resultats.html',
            controller: 'searchController',
            controllerAs: 'vm'
        })
        .when('/connexion', {
            templateUrl: 'bundles/serie/views/connexion.html'
        })
        .otherwise({
            redirectTo: ''
        });


    $httpProvider.interceptors.push(($q, $location, $rootScope, $window, sessionFactory) => {
        return {
            request(config) {
                config.headers = config.headers || {};
                if ($window.localStorage.token && !((config.url.match(/api\.themoviedb\.org/) || []).length > 0)) {
                    sessionFactory.token = $window.localStorage.token
                    sessionFactory.user.id = $window.localStorage.id
                    sessionFactory.user.username = $window.localStorage.username
                    config.headers.authorization = $window.localStorage.token
                }
                return config
            },
            responseError(response) {
                if (response.status === 401 || response.status === 403) {
                    $rootScope.$emit('loginStatusChanged', false);
                    $location.path('app_dev.php/user/login')
                }
                return $q.reject(response)
            }
        }
    })
}

const loginStatus = ($rootScope, $window, sessionFactory) => {
    $rootScope.$on('loginStatusChanged', (event, isLogged) => {
        $window.localStorage.token = sessionFactory.token;
        $window.localStorage.id = sessionFactory.user.id;
        $window.localStorage.username = sessionFactory.user.username;
    sessionFactory.isLogged = isLogged;
})

}

const checkIsConnected = ($q, $http, $location, $window, $rootScope) => {
    let deferred = $q.defer()

    $http.get('app_dev.php/user/loggedin').success(() => {
        $rootScope.$emit('loginStatusChanged', true);
    // Authenticated
    deferred.resolve()
}).error(() => {
        $window.localStorage.removeItem('token');
    $window.localStorage.removeItem('id');
    $rootScope.$emit('loginStatusChanged', false);
    // Not Authenticated
    deferred.reject()
    $location.url('/connexion')
})

    return deferred.promise
}
