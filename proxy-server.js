// Servidor proxy para evitar problemas de CORS
const http = require('http');
const httpProxy = require('http-proxy');
const path = require('path');
const fs = require('fs');
const url = require('url');

// Criar proxy para a API
const proxy = httpProxy.createProxyServer({});

// Configurações
const FRONTEND_PORT = 3000;
const BACKEND_URL = 'http://localhost:8080';
const STATIC_DIR = __dirname;

// Tipos MIME
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

// Função para servir arquivos estáticos
function serveStatic(req, res, filePath) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Arquivo não encontrado');
            return;
        }

        const ext = path.extname(filePath);
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

// Criar servidor
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    console.log(`${new Date().toISOString()} - ${req.method} ${pathname}`);

    // Adicionar headers CORS para todas as respostas
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Tratar requisições OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Proxy para API (requisições que começam com /api)
    if (pathname.startsWith('/api')) {
        console.log(`Proxy para API: ${BACKEND_URL}${pathname}`);
        
        proxy.web(req, res, {
            target: BACKEND_URL,
            changeOrigin: true,
            timeout: 10000
        }, (err) => {
            console.error('Erro no proxy:', err.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: 'Erro de conexão com a API. Verifique se o backend está rodando em ' + BACKEND_URL
            }));
        });
        return;
    }

    // Servir arquivos estáticos
    let filePath = path.join(STATIC_DIR, pathname);

    // Se for a raiz, servir index.html
    if (pathname === '/') {
        filePath = path.join(STATIC_DIR, 'index.html');
    }

    // Verificar se o arquivo existe
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Se não encontrar o arquivo, servir index.html (para SPA routing)
            if (pathname !== '/index.html') {
                filePath = path.join(STATIC_DIR, 'index.html');
            } else {
                res.writeHead(404);
                res.end('Arquivo não encontrado');
                return;
            }
        }
        
        serveStatic(req, res, filePath);
    });
});

// Tratar erros do proxy
proxy.on('error', (err, req, res) => {
    console.error('Erro no proxy:', err);
    if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            error: 'Erro interno do proxy'
        }));
    }
});

// Iniciar servidor
server.listen(FRONTEND_PORT, () => {
    console.log(`
🚀 Servidor proxy iniciado com sucesso!

📍 Frontend: http://localhost:${FRONTEND_PORT}
🔗 API Proxy: http://localhost:${FRONTEND_PORT}/api
🎯 Backend: ${BACKEND_URL}

✅ CORS configurado automaticamente
✅ Proxy para API configurado
✅ Arquivos estáticos sendo servidos

Para parar o servidor: Ctrl+C
    `);
});

// Tratar encerramento graceful
process.on('SIGINT', () => {
    console.log('\n🛑 Encerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor encerrado com sucesso!');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Encerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor encerrado com sucesso!');
        process.exit(0);
    });
});
