angular.module('fornecedoresApp')
    .controller('FornecedorController', ['$scope', '$routeParams', '$location', '$timeout', 'FornecedorService',
        function($scope, $routeParams, $location, $timeout, FornecedorService) {
        
        $scope.fornecedores = [];
        $scope.fornecedor = {};
        $scope.loading = false;
        $scope.isEditing = false;
        $scope.alert = { show: false };
        $scope.confirmMessage = '';
        $scope.confirmAction = null;
        $scope.currentFornecedorId = null;

        $scope.confirmAction = function() {
            var idToDelete = $scope.currentFornecedorId ||
                           ($scope.fornecedorToDelete && $scope.fornecedorToDelete.id) ||
                           window.currentDeleteId;

            if (idToDelete) {
                $scope.executeDelete(idToDelete);

                window.currentDeleteId = null;
            }
        };
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
            if (!fornecedor) {
                $scope.showAlert('danger', 'Erro: Dados do fornecedor não encontrados', 'exclamation-triangle');
                return;
            }

            if (!fornecedor.id) {
                $scope.showAlert('danger', 'Erro: ID do fornecedor não encontrado', 'exclamation-triangle');
                return;
            }

            $scope.fornecedorToDelete = angular.copy(fornecedor);
            $scope.deletingInProgress = false;

            $scope.confirmMessage = 'Tem certeza que deseja excluir o fornecedor "' + (fornecedor.name || 'Sem nome') + '"?\n\n' +
                                   'CNPJ: ' + (fornecedor.cnpj || 'Não informado') + '\n' +
                                   'Email: ' + (fornecedor.email || 'Não informado') + '\n\n' +
                                   'Esta ação não pode ser desfeita.';

            $scope.currentFornecedorId = fornecedor.id;
            window.currentDeleteId = fornecedor.id;

            var modalElement = document.getElementById('confirmModal');
            if (!modalElement) {
                $scope.showAlert('danger', 'Erro: Modal de confirmação não encontrado', 'exclamation-triangle');
                return;
            }

            if (typeof bootstrap === 'undefined') {
                $scope.showAlert('danger', 'Erro: Bootstrap não carregado', 'exclamation-triangle');
                return;
            }

            try {
                var modal = new bootstrap.Modal(modalElement);
                modal.show();
            } catch (error) {
                $scope.showAlert('danger', 'Erro ao exibir modal: ' + error.message, 'exclamation-triangle');
            }
        };
        
        $scope.executeDelete = function(id) {
            $scope.loading = true;
            $scope.deletingInProgress = true;

            FornecedorService.delete(id)
                .then(function(response) {
                    $scope.loading = false;
                    $scope.deletingInProgress = false;

                    var modalElement = document.getElementById('confirmModal');
                    if (modalElement && typeof bootstrap !== 'undefined') {
                        var modal = bootstrap.Modal.getInstance(modalElement);
                        if (modal) {
                            modal.hide();
                        }
                    }

                    // Remove o fornecedor da lista local imediatamente para feedback visual
                    if ($scope.fornecedores && Array.isArray($scope.fornecedores)) {
                        $scope.fornecedores = $scope.fornecedores.filter(function(f) {
                            return f.id !== id;
                        });
                    }

                    $scope.showAlert('success', 'Fornecedor excluído com sucesso!', 'check-circle');

                    // Recarrega a página após um pequeno delay para mostrar a mensagem de sucesso
                    $timeout(function() {
                        window.location.reload();
                    }, 1500);

                    // Limpa as variáveis do modal
                    $scope.fornecedorToDelete = null;
                    $scope.confirmMessage = '';
                    $scope.currentFornecedorId = null;
                })
                .catch(function(error) {
                    $scope.loading = false;
                    $scope.deletingInProgress = false;

                    var modalElement = document.getElementById('confirmModal');
                    if (modalElement && typeof bootstrap !== 'undefined') {
                        var modal = bootstrap.Modal.getInstance(modalElement);
                        if (modal) {
                            modal.hide();
                        }
                    }

                    var errorMessage = 'Erro desconhecido';
                    if (error.status === 0 || error.status === -1) {
                        errorMessage = 'Erro de conexão com o servidor. Verifique se a API está rodando em http://localhost:8080';
                    } else if (error.data && error.data.error) {
                        errorMessage = error.data.error;
                    } else if (error.message) {
                        errorMessage = error.message;
                    } else if (error.status) {
                        errorMessage = 'Erro HTTP ' + error.status + ': ' + (error.statusText || 'Erro no servidor');
                    }

                    $scope.showAlert('danger', 'Erro ao excluir fornecedor: ' + errorMessage, 'exclamation-triangle');
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

        $scope.clearModalData = function() {
            $scope.fornecedorToDelete = null;
            $scope.confirmMessage = '';
            $scope.currentFornecedorId = null;
            $scope.deletingInProgress = false;
        };
        
        $scope.cancel = function() {
            $location.path('/lista');
        };
        

        
        $scope.$on('httpError', function(event, error) {
            $scope.showAlert('danger', error.message, 'exclamation-triangle');
        });
        
        $scope.init();
        
    }]);
