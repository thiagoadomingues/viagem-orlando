// server.js (variação sem “public/”)
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

// Em vez de __dirname + '/public', servimos a raiz do projeto:
const ROOT_DIR = __dirname;
const INDEX_FILE = path.join(ROOT_DIR, 'index.html');

// 1) Servir arquivos estáticos (HTML, CSS, JS) diretamente da raiz
app.use(express.static(ROOT_DIR));

// 2) Precisamos de body-parser para ler JSON enviado no POST
app.use(bodyParser.json({ limit: '5mb' }));

// 3) Endpoint /save que recebe o HTML atualizado do cliente
app.post('/save', (req, res) => {
  const htmlContent = req.body.content;
  if (typeof htmlContent !== 'string' || htmlContent.trim().length === 0) {
    return res.status(400).json({ error: 'Conteúdo inválido' });
  }

  // Sobrescreve index.html na raiz do projeto
  fs.writeFile(INDEX_FILE, htmlContent, 'utf8', err => {
    if (err) {
      console.error('Erro ao salvar index.html:', err);
      return res.status(500).json({ error: 'Falha ao salvar arquivo' });
    }
    return res.json({ success: true });
  });
});

// 4) Qualquer rota não mapeada cai no index.html
app.get('*', (req, res) => {
  res.sendFile(INDEX_FILE);
});

// 5) Inicia servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
