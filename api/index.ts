const { exec } = require('child_process');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

app.get('/results', (req, res) => {
    const resultsPath = path.join(__dirname, '..', 'results.html');
    res.sendFile(resultsPath);
});

//const scriptPath = path.join(__dirname, '..', 'script.js');

app.post('/process-login', (req, res) => {
    const { valorConta, consumoConta, numberOfApartments, numberOfLojas, consumosApartamentosIndividuais, apartamentos, lojas } = req.body;

    console.log('Dados recebidos no lado do servidor:', valorConta, consumoConta, numberOfApartments, consumosApartamentosIndividuais, apartamentos, lojas);

    exec(`node script.js "${valorConta}" "${consumoConta}" "${numberOfApartments}" "${numberOfLojas}" "${consumosApartamentosIndividuais}" "${apartamentos}" "${lojas}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro na execução do script: ${error.message}`);
            res.status(500).json({ error: `Erro na execução do script: ${error.message}` });
            return;
        }
        if (stderr) {
            console.error(`Erro no script: ${stderr}`);
            res.status(500).json({ error: `Erro no script: ${stderr}` });
            return;
        }
        const resultado = JSON.parse(stdout);
        console.log('Resultado do script:', resultado);
        res.json(resultado);
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

module.exports = app;