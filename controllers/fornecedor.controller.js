angular.module('fornecedoresApp')
    .controller('FornecedorController', ['$scope', '$routeParams', '$location', 'FornecedorService', 
        function($scope, $routeParams, $location, FornecedorService) {
        
        $scope.fornecedores = [];
        $scope.fornecedor = {};
        $scope.loading = false;
        $scope.isEditing = false;
        $scope.alert = { show: false };
        $scope.confirmMessage = '';
        $scope.confirmAction = null;
        $scope.fornecedorToDelete = null;
        $scope.deletingInProgress = false;
        
        if ($routeParams.id) {
            $scope.isEditing = true;
            $scope.fornecedorId = parseInt($routeParams.id);
        }
        
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
        
        $scope.initForm = function() {
            $scope.fornecedor = {
                name: '',
                email: '',
                cnpj: '',
                comment: ''
            };
            $scope.isEditing = false;
        };
        
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
        
        $scope.deleteFornecedor = function(fornecedor) {
            console.log('deleteFornecedor chamado com:', fornecedor);

            // Armazena o fornecedor que será deletado para exibir no modal
            $scope.fornecedorToDelete = angular.copy(fornecedor);
            $scope.deletingInProgress = false;

            // Mensagem de fallback caso o objeto não esteja disponível
            $scope.confirmMessage = 'Tem certeza que deseja excluir o fornecedor "' + fornecedor.name + '"?\n\n' +
                                   'CNPJ: ' + (fornecedor.cnpj || 'Não informado') + '\n' +
                                   'Email: ' + (fornecedor.email || 'Não informado') + '\n\n' +
                                   'Esta ação não pode ser desfeita.';

            // Define a ação que será executada ao confirmar
            $scope.confirmAction = function() {
                console.log('confirmAction executada para ID:', fornecedor.id);
                $scope.executeDelete(fornecedor.id);
            };

            // Exibe o modal
            var modal = new bootstrap.Modal(document.getElementById('confirmModal'));
            modal.show();
        };
        
        $scope.executeDelete = function(id) {
            console.log('executeDelete chamado com ID:', id);
            $scope.loading = true;
            $scope.deletingInProgress = true;

            FornecedorService.delete(id)
                .then(function() {
                    console.log('Fornecedor deletado com sucesso');
                    $scope.loading = false;
                    $scope.deletingInProgress = false;
                    $scope.showAlert('success', 'Fornecedor excluído com sucesso!', 'check-circle');
                    $scope.loadFornecedores();

                    // Limpa as variáveis do modal
                    $scope.fornecedorToDelete = null;
                    $scope.confirmMessage = '';
                    $scope.confirmAction = null;
                })
                .catch(function(error) {
                    console.error('Erro ao deletar fornecedor:', error);
                    $scope.loading = false;
                    $scope.deletingInProgress = false;
                    $scope.showAlert('danger', 'Erro ao excluir fornecedor: ' + (error.data?.error || error.message), 'exclamation-triangle');
                });
        };
        
        $scope.editFornecedor = function(id) {
            $location.path('/editar/' + id);
        };
        
        $scope.validateForm = function() {
            var validation = FornecedorService.validate($scope.fornecedor);
            
            if (!validation.valid) {
                $scope.showAlert('warning', validation.message, 'exclamation-triangle');
                return false;
            }
            
            return true;
        };

        $scope.showAlert = function(type, message, icon) {
            $scope.alert = {
                show: true,
                type: type,
                message: message,
                icon: icon || 'info-circle'
            };
            
            if (type === 'success' || type === 'info') {
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.closeAlert();
                    });
                }, 5000);
            }
        };
        
        $scope.closeAlert = function() {
            $scope.alert.show = false;
        };

        // Função para limpar dados do modal quando ele for fechado
        $scope.clearModalData = function() {
            $scope.fornecedorToDelete = null;
            $scope.confirmMessage = '';
            $scope.confirmAction = null;
            $scope.deletingInProgress = false;
        };
        
        $scope.cancel = function() {
            $location.path('/lista');
        };
        
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
        
        $scope.$on('httpError', function(event, error) {
            $scope.showAlert('danger', error.message, 'exclamation-triangle');
        });
        
        $scope.init();
        
    }]);
