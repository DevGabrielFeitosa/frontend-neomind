angular.module('fornecedoresApp', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/lista', {
                templateUrl: 'views/lista-fornecedores.html',
                controller: 'FornecedorController'
            })
            .when('/novo', {
                templateUrl: 'views/form-fornecedor.html',
                controller: 'FornecedorController'
            })
            .when('/editar/:id', {
                templateUrl: 'views/form-fornecedor.html',
                controller: 'FornecedorController'
            })
            .otherwise({
                redirectTo: '/lista'
            });
    }])
    
    .constant('API_CONFIG', {
        BASE_URL: 'http://localhost:8080/api',
        ENDPOINTS: {
            FORNECEDORES: '/fornecedores',
            HELLO_WORLD: '/hello-world'
        }
    })
    
    .filter('cnpjFormat', function() {
        return function(cnpj) {
            if (!cnpj) return '';

            if (cnpj.indexOf('.') !== -1 || cnpj.indexOf('/') !== -1 || cnpj.indexOf('-') !== -1) {
                return cnpj;
            }

            var numbers = cnpj.toString().replace(/\D/g, '');

            if (numbers.length === 14) {
                return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
            } else if (numbers.length === 11) {
                return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            }

            return cnpj;
        };
    })
    
    .directive('cnpjMask', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {

                function formatCNPJ(value) {
                    if (!value) return '';

                    var numbers = value.replace(/\D/g, '');
                    var formattedValue = '';

                    if (numbers.length > 0) {
                        if (numbers.length <= 2) {
                            formattedValue = numbers;
                        } else if (numbers.length <= 5) {
                            formattedValue = numbers.replace(/(\d{2})(\d+)/, '$1.$2');
                        } else if (numbers.length <= 8) {
                            formattedValue = numbers.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
                        } else if (numbers.length <= 12) {
                            formattedValue = numbers.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4');
                        } else {
                            formattedValue = numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5');
                        }
                    }

                    return formattedValue;
                }

                element.on('input', function() {
                    var currentValue = element.val();
                    var formattedValue = formatCNPJ(currentValue);

                    if (formattedValue !== currentValue) {
                        element.val(formattedValue);
                        ctrl.$setViewValue(formattedValue);
                        ctrl.$render();
                    }
                });

                ctrl.$formatters.push(function(value) {
                    return formatCNPJ(value);
                });
            }
        };
    })
    
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push(['$q', '$rootScope', function($q, $rootScope) {
            return {
                'request': function(config) {
                    config.headers = config.headers || {};
                    if (config.method === 'POST' || config.method === 'PUT') {
                        config.headers['Content-Type'] = 'application/json';
                    }
                    config.headers['Accept'] = 'application/json';
                    
                    return config;
                },
                
                'responseError': function(rejection) {
                    var errorMessage = 'Erro desconhecido';
                    
                    switch (rejection.status) {
                        case 400:
                            errorMessage = rejection.data?.error || 'Dados inválidos';
                            break;
                        case 404:
                            errorMessage = rejection.data?.error || 'Recurso não encontrado';
                            break;
                        case 500:
                            errorMessage = 'Erro interno do servidor';
                            break;
                        case 0:
                        case -1:
                            errorMessage = 'Erro de conexão com o servidor. Verifique se a API está rodando.';
                            break;
                        default:
                            errorMessage = rejection.data?.error || 'Erro na comunicação com o servidor';
                    }
                    
                    $rootScope.$broadcast('httpError', {
                        status: rejection.status,
                        message: errorMessage
                    });
                    
                    return $q.reject(rejection);
                }
            };
        }]);
    }])
    
    .run(['$rootScope', '$location', function($rootScope, $location) {
        $rootScope.$on('$routeChangeStart', function() {
        });
        
        $rootScope.$on('$routeChangeError', function() {
            $location.path('/lista');
        });
    }]);
