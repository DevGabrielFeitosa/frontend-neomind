// Controller principal para gerenciamento de fornecedores
angular.module('fornecedoresApp')
    .controller('FornecedorController', ['$scope', '$routeParams', '$location', 'FornecedorService', 
        function($scope, $routeParams, $location, FornecedorService) {
        
        // Inicialização das variáveis
        $scope.fornecedores = [];
        $scope.fornecedor = {};
        $scope.loading = false;
        $scope.isEditing = false;
        $scope.alert = { show: false };
        $scope.confirmMessage = '';
        $scope.confirmAction = null;
        
        // Verifica se está editando baseado na rota
        if ($routeParams.id) {
            $scope.isEditing = true;
            $scope.fornecedorId = parseInt($routeParams.id);
        }
        
        /**
         * Inicializa o controller baseado na rota atual
         */
        $scope.init = function() {
            var path = $location.path();
            
            if (path === '/lista' || path === '/') {
                $scope.loadFornecedores();
            } else if (path === '/novo') {
                $scope.initForm();
            } else if (path.startsWith('/editar/')) {
                $scope.loadFornecedorForEdit();
            }
        };
        
        /**
         * Carrega a lista de fornecedores
         */
        $scope.loadFornecedores = function() {
            $scope.loading = true;
            
            FornecedorService.getAll()
                .then(function(data) {
                    $scope.fornecedores = data;
                    $scope.loading = false;
                    
                    if (data.length === 0) {
                        $scope.showAlert('info', 'Nenhum fornecedor cadastrado ainda.', 'info-circle');
                    }
                })
                .catch(function(error) {
                    $scope.loading = false;
                    $scope.showAlert('danger', 'Erro ao carregar fornecedores: ' + (error.data?.error || error.message), 'exclamation-triangle');
                });
        };
        
        /**
         * Inicializa o formulário para novo fornecedor
         */
        $scope.initForm = function() {
            $scope.fornecedor = {
                name: '',
                email: '',
                cnpj: '',
                comment: ''
            };
            $scope.isEditing = false;
        };
        
        /**
         * Carrega fornecedor para edição
         */
        $scope.loadFornecedorForEdit = function() {
            if (!$scope.fornecedorId) {
                $scope.showAlert('danger', 'ID do fornecedor não informado', 'exclamation-triangle');
                $location.path('/lista');
                return;
            }
            
            $scope.loading = true;
            
            FornecedorService.getById($scope.fornecedorId)
                .then(function(data) {
                    $scope.fornecedor = angular.copy(data);
                    $scope.loading = false;
                })
                .catch(function(error) {
                    $scope.loading = false;
                    $scope.showAlert('danger', 'Erro ao carregar fornecedor: ' + (error.data?.error || error.message), 'exclamation-triangle');
                    $location.path('/lista');
                });
        };
        
        /**
         * Salva o fornecedor (criar ou atualizar)
         */
        $scope.saveFornecedor = function() {
            if (!$scope.validateForm()) {
                return;
            }
            
            $scope.loading = true;
            
            var promise;
            if ($scope.isEditing) {
                promise = FornecedorService.update($scope.fornecedorId, $scope.fornecedor);
            } else {
                promise = FornecedorService.create($scope.fornecedor);
            }
            
            promise
                .then(function(data) {
                    $scope.loading = false;
                    var message = $scope.isEditing ? 'Fornecedor atualizado com sucesso!' : 'Fornecedor criado com sucesso!';
                    $scope.showAlert('success', message, 'check-circle');
                    
                    // Redireciona para a lista após 2 segundos
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $location.path('/lista');
                        });
                    }, 2000);
                })
                .catch(function(error) {
                    $scope.loading = false;
                    $scope.showAlert('danger', 'Erro ao salvar fornecedor: ' + (error.data?.error || error.message), 'exclamation-triangle');
                });
        };
        
        /**
         * Confirma e executa a exclusão de um fornecedor
         */
        $scope.deleteFornecedor = function(fornecedor) {
            $scope.confirmMessage = 'Tem certeza que deseja excluir o fornecedor "' + fornecedor.name + '"?';
            $scope.confirmAction = function() {
                $scope.executeDelete(fornecedor.id);
            };
            
            // Abre o modal de confirmação
            var modal = new bootstrap.Modal(document.getElementById('confirmModal'));
            modal.show();
        };
        
        /**
         * Executa a exclusão do fornecedor
         */
        $scope.executeDelete = function(id) {
            $scope.loading = true;
            
            FornecedorService.delete(id)
                .then(function() {
                    $scope.loading = false;
                    $scope.showAlert('success', 'Fornecedor excluído com sucesso!', 'check-circle');
                    $scope.loadFornecedores();
                })
                .catch(function(error) {
                    $scope.loading = false;
                    $scope.showAlert('danger', 'Erro ao excluir fornecedor: ' + (error.data?.error || error.message), 'exclamation-triangle');
                });
        };
        
        /**
         * Navega para a página de edição
         */
        $scope.editFornecedor = function(id) {
            $location.path('/editar/' + id);
        };
        
        /**
         * Valida o formulário
         */
        $scope.validateForm = function() {
            var validation = FornecedorService.validate($scope.fornecedor);
            
            if (!validation.valid) {
                $scope.showAlert('warning', validation.message, 'exclamation-triangle');
                return false;
            }
            
            return true;
        };
        
        /**
         * Exibe um alerta
         */
        $scope.showAlert = function(type, message, icon) {
            $scope.alert = {
                show: true,
                type: type,
                message: message,
                icon: icon || 'info-circle'
            };
            
            // Auto-hide após 5 segundos para alertas de sucesso e info
            if (type === 'success' || type === 'info') {
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.closeAlert();
                    });
                }, 5000);
            }
        };
        
        /**
         * Fecha o alerta
         */
        $scope.closeAlert = function() {
            $scope.alert.show = false;
        };
        
        /**
         * Cancela a operação e volta para a lista
         */
        $scope.cancel = function() {
            $location.path('/lista');
        };
        
        /**
         * Testa a conexão com a API
         */
        $scope.testConnection = function() {
            $scope.loading = true;
            
            FornecedorService.testConnection()
                .then(function(data) {
                    $scope.loading = false;
                    $scope.showAlert('success', 'Conexão com a API estabelecida com sucesso!', 'check-circle');
                })
                .catch(function(error) {
                    $scope.loading = false;
                    $scope.showAlert('danger', 'Erro de conexão com a API. Verifique se o servidor está rodando.', 'exclamation-triangle');
                });
        };
        
        // Listener para erros HTTP globais
        $scope.$on('httpError', function(event, error) {
            $scope.showAlert('danger', error.message, 'exclamation-triangle');
        });
        
        // Inicializa o controller
        $scope.init();
        
    }]);
