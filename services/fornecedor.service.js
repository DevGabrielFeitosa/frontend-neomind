// Serviço para comunicação com a API de Fornecedores
angular.module('fornecedoresApp')
    .service('FornecedorService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
        
        var service = this;
        var baseUrl = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.FORNECEDORES;
        
        /**
         * Testa a conectividade com a API
         * @returns {Promise}
         */
        service.testConnection = function() {
            var deferred = $q.defer();
            
            $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.HELLO_WORLD)
                .then(function(response) {
                    deferred.resolve(response.data);
                })
                .catch(function(error) {
                    deferred.reject(error);
                });
            
            return deferred.promise;
        };
        
        /**
         * Busca todos os fornecedores
         * @returns {Promise}
         */
        service.getAll = function() {
            var deferred = $q.defer();
            
            $http.get(baseUrl)
                .then(function(response) {
                    deferred.resolve(response.data);
                })
                .catch(function(error) {
                    deferred.reject(error);
                });
            
            return deferred.promise;
        };
        
        /**
         * Busca um fornecedor por ID
         * @param {number} id - ID do fornecedor
         * @returns {Promise}
         */
        service.getById = function(id) {
            var deferred = $q.defer();
            
            if (!id) {
                deferred.reject({ message: 'ID é obrigatório' });
                return deferred.promise;
            }
            
            $http.get(baseUrl + '/' + id)
                .then(function(response) {
                    deferred.resolve(response.data);
                })
                .catch(function(error) {
                    deferred.reject(error);
                });
            
            return deferred.promise;
        };
        
        /**
         * Cria um novo fornecedor
         * @param {Object} fornecedor - Dados do fornecedor
         * @returns {Promise}
         */
        service.create = function(fornecedor) {
            var deferred = $q.defer();
            
            if (!fornecedor) {
                deferred.reject({ message: 'Dados do fornecedor são obrigatórios' });
                return deferred.promise;
            }
            
            // Validação básica
            var validation = service.validate(fornecedor);
            if (!validation.valid) {
                deferred.reject({ message: validation.message });
                return deferred.promise;
            }
            
            $http.post(baseUrl, fornecedor)
                .then(function(response) {
                    deferred.resolve(response.data);
                })
                .catch(function(error) {
                    deferred.reject(error);
                });
            
            return deferred.promise;
        };
        
        /**
         * Atualiza um fornecedor existente
         * @param {number} id - ID do fornecedor
         * @param {Object} fornecedor - Dados atualizados do fornecedor
         * @returns {Promise}
         */
        service.update = function(id, fornecedor) {
            var deferred = $q.defer();
            
            if (!id) {
                deferred.reject({ message: 'ID é obrigatório' });
                return deferred.promise;
            }
            
            if (!fornecedor) {
                deferred.reject({ message: 'Dados do fornecedor são obrigatórios' });
                return deferred.promise;
            }
            
            // Validação básica
            var validation = service.validate(fornecedor);
            if (!validation.valid) {
                deferred.reject({ message: validation.message });
                return deferred.promise;
            }
            
            $http.put(baseUrl + '/' + id, fornecedor)
                .then(function(response) {
                    deferred.resolve(response.data);
                })
                .catch(function(error) {
                    deferred.reject(error);
                });
            
            return deferred.promise;
        };
        
        /**
         * Remove um fornecedor
         * @param {number} id - ID do fornecedor
         * @returns {Promise}
         */
        service.delete = function(id) {
            var deferred = $q.defer();
            
            if (!id) {
                deferred.reject({ message: 'ID é obrigatório' });
                return deferred.promise;
            }
            
            $http.delete(baseUrl + '/' + id)
                .then(function(response) {
                    deferred.resolve(response);
                })
                .catch(function(error) {
                    deferred.reject(error);
                });
            
            return deferred.promise;
        };
        
        /**
         * Valida os dados de um fornecedor
         * @param {Object} fornecedor - Dados do fornecedor
         * @returns {Object} - Resultado da validação
         */
        service.validate = function(fornecedor) {
            if (!fornecedor.name || fornecedor.name.trim().length < 2) {
                return { valid: false, message: 'Nome deve ter pelo menos 2 caracteres' };
            }
            
            if (fornecedor.name.length > 100) {
                return { valid: false, message: 'Nome deve ter no máximo 100 caracteres' };
            }
            
            if (!fornecedor.email || !service.isValidEmail(fornecedor.email)) {
                return { valid: false, message: 'Email deve ter formato válido' };
            }
            
            if (fornecedor.email.length > 150) {
                return { valid: false, message: 'Email deve ter no máximo 150 caracteres' };
            }
            
            if (!fornecedor.cnpj || !service.isValidCNPJ(fornecedor.cnpj)) {
                return { valid: false, message: 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX' };
            }
            
            if (fornecedor.comment && fornecedor.comment.length > 500) {
                return { valid: false, message: 'Comentário deve ter no máximo 500 caracteres' };
            }
            
            return { valid: true };
        };
        
        /**
         * Valida formato de email
         * @param {string} email
         * @returns {boolean}
         */
        service.isValidEmail = function(email) {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };
        
        /**
         * Valida formato de CNPJ
         * @param {string} cnpj
         * @returns {boolean}
         */
        service.isValidCNPJ = function(cnpj) {
            var cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
            return cnpjRegex.test(cnpj);
        };
        
    }]);
