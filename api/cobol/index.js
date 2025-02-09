const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const iconv = require('iconv-lite');
const app = express();

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
app.listen(3000, () => {
  console.log('API rodando na porta 3000');
});
