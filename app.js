// Configuração principal do AngularJS
angular.module('fornecedoresApp', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        
        // Configuração das rotas
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
    
    // Configurações globais da aplicação
    .constant('API_CONFIG', {
        BASE_URL: 'http://localhost:8080/api',
        ENDPOINTS: {
            FORNECEDORES: '/fornecedores',
            HELLO_WORLD: '/hello-world'
        }
    })
    
    // Filtros customizados
    .filter('cnpjFormat', function() {
        return function(cnpj) {
            if (!cnpj) return '';
            
            // Remove caracteres não numéricos
            var numbers = cnpj.replace(/\D/g, '');
            
            // Aplica a máscara XX.XXX.XXX/XXXX-XX
            if (numbers.length === 14) {
                return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
            }
            
            return cnpj;
        };
    })
    
    // Diretivas customizadas
    .directive('cnpjMask', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                element.on('input', function() {
                    var value = element.val().replace(/\D/g, '');
                    var formattedValue = '';
                    
                    if (value.length > 0) {
                        if (value.length <= 2) {
                            formattedValue = value;
                        } else if (value.length <= 5) {
                            formattedValue = value.replace(/(\d{2})(\d+)/, '$1.$2');
                        } else if (value.length <= 8) {
                            formattedValue = value.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
                        } else if (value.length <= 12) {
                            formattedValue = value.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4');
                        } else {
                            formattedValue = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d+)/, '$1.$2.$3/$4-$5');
                        }
                    }
                    
                    if (formattedValue !== element.val()) {
                        element.val(formattedValue);
                        ctrl.$setViewValue(formattedValue);
                    }
                });
            }
        };
    })
    
    // Interceptor para tratamento de erros HTTP
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push(['$q', '$rootScope', function($q, $rootScope) {
            return {
                'request': function(config) {
                    // Adiciona headers padrão
                    config.headers = config.headers || {};
                    if (config.method === 'POST' || config.method === 'PUT') {
                        config.headers['Content-Type'] = 'application/json';
                    }
                    config.headers['Accept'] = 'application/json';
                    
                    return config;
                },
                
                'responseError': function(rejection) {
                    // Tratamento global de erros
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
                    
                    // Emite evento global de erro
                    $rootScope.$broadcast('httpError', {
                        status: rejection.status,
                        message: errorMessage
                    });
                    
                    return $q.reject(rejection);
                }
            };
        }]);
    }])
    
    // Controller principal da aplicação
    .run(['$rootScope', '$location', function($rootScope, $location) {
        // Configurações iniciais
        $rootScope.$on('$routeChangeStart', function() {
            // Pode adicionar lógica de autenticação aqui se necessário
        });
        
        $rootScope.$on('$routeChangeError', function() {
            $location.path('/lista');
        });
    }]);
