# 🚀 Instruções de Execução - Sistema de Fornecedores

## ⚡ Início Rápido

### 1. Verificar Pré-requisitos
```bash
# Verificar se Node.js está instalado
node --version
# Deve retornar v14.0.0 ou superior

# Verificar se npm está instalado
npm --version
# Deve retornar 6.0.0 ou superior
```

### 2. Instalar Dependências
```bash
# No diretório do projeto
npm install
```

### 3. Iniciar a Aplicação
```bash
# Inicia o servidor e abre no navegador
npm start
```

A aplicação estará disponível em: **http://localhost:3000**

## 🔧 Configuração da API Backend

**IMPORTANTE**: A aplicação frontend precisa que a API backend esteja rodando.

### Verificar se a API está funcionando:
```bash
# Teste simples via curl
curl http://localhost:8080/api/hello-world
```

Se retornar "Hello, World!", a API está funcionando corretamente.

### Se a API não estiver rodando:
1. Navegue até o diretório do projeto backend
2. Execute o comando para iniciar a API:
   ```bash
   # Exemplo para projeto Java/Maven
   mvn spring-boot:run
   
   # Ou se já compilado
   java -jar target/api-fornecedores.jar
   ```

## 📋 Testando a Aplicação

### 1. Teste de Conectividade
- Acesse http://localhost:3000
- Clique em "Testar API" na página inicial
- Deve aparecer mensagem de sucesso

### 2. Teste CRUD Completo

#### Criar Fornecedor:
1. Clique em "Novo Fornecedor"
2. Preencha os dados:
   - **Nome**: Empresa Teste Ltda
   - **Email**: teste@empresa.com.br
   - **CNPJ**: 12.345.678/0001-90
   - **Comentário**: Fornecedor para testes
3. Clique em "Salvar"

#### Listar Fornecedores:
1. Volte para "Fornecedores" no menu
2. Deve aparecer o fornecedor criado
3. Teste a busca digitando parte do nome

#### Editar Fornecedor:
1. Clique no botão de editar (ícone de lápis)
2. Modifique algum campo
3. Clique em "Atualizar"

#### Excluir Fornecedor:
1. Clique no botão de excluir (ícone de lixeira)
2. Confirme a exclusão
3. Fornecedor deve ser removido da lista

## 🐛 Solução de Problemas

### Problema: "Erro de conexão com o servidor"
**Solução**: 
- Verifique se a API backend está rodando em http://localhost:8080
- Teste: `curl http://localhost:8080/api/hello-world`

### Problema: "Cannot GET /"
**Solução**:
- Certifique-se de que está acessando http://localhost:3000
- Reinicie o servidor: `npm start`

### Problema: "npm: command not found"
**Solução**:
- Instale o Node.js: https://nodejs.org/
- Reinicie o terminal após a instalação

### Problema: Página em branco
**Solução**:
- Abra o console do navegador (F12)
- Verifique se há erros JavaScript
- Certifique-se de que todos os arquivos foram criados corretamente

### Problema: CORS Error
**Solução**:
- Verifique se a API backend permite requisições de http://localhost:3000
- Configure CORS no backend se necessário

## 📱 Testando Responsividade

### Desktop (1200px+):
- Abra em tela cheia
- Todas as funcionalidades devem estar visíveis

### Tablet (768px - 1199px):
- Redimensione a janela ou use DevTools
- Menu deve colapsar em dispositivos menores

### Mobile (320px - 767px):
- Use DevTools para simular dispositivo móvel
- Tabela deve ser responsiva
- Botões devem ser touch-friendly

## 🔍 Validando Funcionalidades

### ✅ Checklist de Testes

#### Interface:
- [ ] Navbar responsiva funciona
- [ ] Menu colapsa em telas pequenas
- [ ] Ícones carregam corretamente
- [ ] Estilos Bootstrap aplicados

#### Listagem:
- [ ] Lista carrega fornecedores da API
- [ ] Busca filtra resultados
- [ ] Botão "Atualizar" recarrega dados
- [ ] Estado vazio mostra mensagem apropriada

#### Formulário:
- [ ] Validação em tempo real funciona
- [ ] Máscara de CNPJ é aplicada
- [ ] Campos obrigatórios são validados
- [ ] Contador de caracteres funciona

#### CRUD:
- [ ] Criar fornecedor salva na API
- [ ] Editar carrega dados existentes
- [ ] Atualizar salva modificações
- [ ] Excluir remove da API

#### Feedback:
- [ ] Alertas aparecem nas operações
- [ ] Loading states são exibidos
- [ ] Erros são tratados adequadamente
- [ ] Confirmações funcionam

## 🎯 Cenários de Teste Específicos

### Teste 1: Validação de Dados
```
1. Tente criar fornecedor sem nome → Deve mostrar erro
2. Digite email inválido → Deve mostrar erro
3. Digite CNPJ incompleto → Deve mostrar erro
4. Preencha comentário com 501 caracteres → Deve mostrar erro
```

### Teste 2: Conectividade
```
1. Pare a API backend
2. Tente listar fornecedores → Deve mostrar erro de conexão
3. Clique em "Testar API" → Deve mostrar erro
4. Reinicie a API → Funcionalidades devem voltar ao normal
```

### Teste 3: Navegação
```
1. Acesse /lista → Deve mostrar listagem
2. Acesse /novo → Deve mostrar formulário vazio
3. Acesse /editar/1 → Deve carregar fornecedor ID 1
4. URL inválida → Deve redirecionar para /lista
```

## 📊 Monitoramento

### Console do Navegador:
- Abra DevTools (F12)
- Verifique aba Console para erros JavaScript
- Verifique aba Network para requisições HTTP

### Logs Úteis:
```javascript
// No console do navegador, você pode testar:
angular.element(document.body).scope().$root.$$phase
// Deve retornar null quando não há digest em andamento
```

## 🔄 Reinicialização Completa

Se algo não estiver funcionando:

```bash
# 1. Pare o servidor (Ctrl+C)
# 2. Limpe cache do npm
npm cache clean --force

# 3. Reinstale dependências
rm -rf node_modules
npm install

# 4. Reinicie
npm start
```

## 📞 Suporte

Se encontrar problemas:

1. **Verifique este guia** primeiro
2. **Consulte o README.md** para informações detalhadas
3. **Verifique o console** do navegador para erros
4. **Teste a API** separadamente
5. **Documente o erro** com passos para reproduzir

---

**✅ Aplicação configurada e testada com sucesso!**
