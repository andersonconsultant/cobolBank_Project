const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const iconv = require('iconv-lite');
const app = express();

const path = require('path');

app.use(express.static(path.join(__dirname, '../../')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'));
});

app.get('/api/cobol', (req, res) => {
  exec(__dirname + '/start', (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro: ${error.message}`);
      res.status(500).send({ error: 'Erro ao executar o programa COBOL' });

      return;
    }

    if (stderr) {
      console.error(`Erro: ${stderr}`);
      res.status(500).send({ error: 'Erro ao executar o programa COBOL' });
      return;
    }

    res.send({ cobolOutput: iconv.decode(stdout, 'latin1') });
  });
});
app.listen(3000, '0.0.0.0', () => {
  console.log('API rodando na porta 3000 e acessível em http://192.168.0.15:3000');
});

