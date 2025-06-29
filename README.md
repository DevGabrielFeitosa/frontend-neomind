# 🏢 Sistema de Fornecedores - Frontend

Sistema web para gerenciamento de fornecedores desenvolvido com **AngularJS** e **Bootstrap**, consumindo uma API REST para operações CRUD.

## 🚀 Tecnologias Utilizadas

- **AngularJS 1.8.3** - Framework MVW para desenvolvimento da aplicação
- **Bootstrap 5.3.0** - Framework CSS para interface responsiva
- **Font Awesome 6.0.0** - Ícones para melhor experiência visual
- **HTML5 & CSS3** - Estrutura e estilização
- **JavaScript ES5** - Lógica da aplicação

## 📋 Funcionalidades

### ✅ Implementadas

- **📋 Listagem de Fornecedores**
  - Visualização em tabela responsiva
  - Busca por nome, email ou CNPJ
  - Contadores e estatísticas
  - Atualização manual da lista

- **➕ Cadastro de Fornecedores**
  - Formulário com validação em tempo real
  - Máscara automática para CNPJ
  - Validação de email
  - Campos obrigatórios e opcionais

- **✏️ Edição de Fornecedores**
  - Carregamento automático dos dados
  - Mesmo formulário do cadastro
  - Preview dos dados atuais

- **🗑️ Exclusão de Fornecedores**
  - Modal de confirmação
  - Feedback visual do resultado

- **🔧 Funcionalidades Extras**
  - Teste de conectividade com API
  - Alertas informativos
  - Loading states
  - Interface responsiva
  - Tratamento de erros

## 🏗️ Estrutura do Projeto

```
fornecedores-frontend/
├── index.html                 # Página principal
├── app.js                     # Configuração do AngularJS
├── package.json              # Dependências e scripts
├── README.md                 # Documentação
├── controllers/
│   └── fornecedor.controller.js  # Controller principal
├── services/
│   └── fornecedor.service.js     # Serviço para API
├── views/
│   ├── lista-fornecedores.html   # Template da listagem
│   └── form-fornecedor.html      # Template do formulário
└── css/
    └── style.css             # Estilos customizados
```

## 🔧 Configuração e Instalação

### Pré-requisitos

- **Node.js** (versão 14 ou superior)
- **npm** (versão 6 ou superior)
- **API Backend** rodando em `http://localhost:8080`

### Instalação

1. **Clone ou baixe o projeto**
   ```bash
   git clone <url-do-repositorio>
   cd fornecedores-frontend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm start
   ```

4. **Acesse a aplicação**
   - URL: `http://localhost:3000`
   - A aplicação abrirá automaticamente no navegador

### Scripts Disponíveis

```bash
# Inicia servidor e abre no navegador
npm start

# Inicia servidor em modo desenvolvimento (sem cache)
npm run dev

# Apenas inicia o servidor (sem abrir navegador)
npm run serve
```

## 🌐 API Backend

A aplicação consome uma API REST que deve estar rodando em:
```
http://localhost:8080/api
```

### Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/hello-world` | Teste de conectividade |
| `GET` | `/fornecedores` | Lista todos os fornecedores |
| `GET` | `/fornecedores/{id}` | Busca fornecedor por ID |
| `POST` | `/fornecedores` | Cria novo fornecedor |
| `PUT` | `/fornecedores/{id}` | Atualiza fornecedor |
| `DELETE` | `/fornecedores/{id}` | Remove fornecedor |

### Modelo de Dados

```json
{
  "id": 1,
  "name": "Nome da Empresa Ltda",
  "email": "contato@empresa.com.br",
  "comment": "Comentário opcional",
  "cnpj": "12.345.678/0001-90"
}
```

## 🎯 Como Usar

### 1. Acessar a Lista de Fornecedores
- A página inicial mostra todos os fornecedores cadastrados
- Use a barra de busca para filtrar por nome, email ou CNPJ
- Clique em "Atualizar" para recarregar os dados

### 2. Cadastrar Novo Fornecedor
- Clique em "Novo Fornecedor" no menu ou na página inicial
- Preencha os campos obrigatórios (Nome, Email, CNPJ)
- O comentário é opcional
- Clique em "Salvar" para confirmar

### 3. Editar Fornecedor
- Na lista, clique no botão de editar (ícone de lápis)
- Modifique os dados necessários
- Clique em "Atualizar" para salvar as alterações

### 4. Excluir Fornecedor
- Na lista, clique no botão de excluir (ícone de lixeira)
- Confirme a exclusão no modal que aparece
- O fornecedor será removido permanentemente

### 5. Testar Conectividade
- Clique em "Testar API" na página de listagem
- Verifica se a comunicação com o backend está funcionando

## 🔍 Validações Implementadas

### Campos Obrigatórios
- **Nome**: 2-100 caracteres
- **Email**: Formato válido, máximo 150 caracteres
- **CNPJ**: Formato XX.XXX.XXX/XXXX-XX

### Campos Opcionais
- **Comentário**: Máximo 500 caracteres

### Validações em Tempo Real
- Formatação automática do CNPJ
- Validação de email
- Contagem de caracteres
- Feedback visual de erros

## 🎨 Interface e Experiência

### Design Responsivo
- Funciona em desktop, tablet e mobile
- Tabelas adaptáveis para telas pequenas
- Botões e formulários otimizados para touch

### Feedback Visual
- Loading spinners durante operações
- Alertas de sucesso, erro e informação
- Estados vazios informativos
- Confirmações para ações destrutivas

### Acessibilidade
- Ícones descritivos
- Labels apropriados nos formulários
- Cores contrastantes
- Navegação por teclado

## 🐛 Tratamento de Erros

### Erros de Conectividade
- Detecta quando a API está offline
- Mensagens claras sobre problemas de conexão
- Botão para testar conectividade

### Erros de Validação
- Validação no frontend e backend
- Mensagens específicas para cada tipo de erro
- Destaque visual nos campos com problema

### Erros de Operação
- Feedback claro sobre falhas nas operações
- Possibilidade de tentar novamente
- Logs de erro para debugging

## 📱 Compatibilidade

### Navegadores Suportados
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Dispositivos
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔧 Configurações Avançadas

### Alterar URL da API
Edite o arquivo `app.js`:
```javascript
.constant('API_CONFIG', {
    BASE_URL: 'http://seu-servidor:porta/api',
    // ...
})
```

### Personalizar Estilos
Edite o arquivo `css/style.css` para customizar:
- Cores do tema
- Espaçamentos
- Tipografia
- Animações

## 📞 Suporte e Contribuição

### Reportar Problemas
- Descreva o problema detalhadamente
- Inclua passos para reproduzir
- Informe navegador e versão

### Melhorias Futuras
- [ ] Paginação da lista de fornecedores
- [ ] Exportação para Excel/PDF
- [ ] Filtros avançados
- [ ] Histórico de alterações
- [ ] Upload de logo do fornecedor
- [ ] Integração com CEP para endereços

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ para Neomind**
