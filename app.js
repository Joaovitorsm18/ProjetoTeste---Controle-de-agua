const { exec } = require('child_process');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});
app.get('/results', (req, res) => {
    res.sendFile(__dirname + '/results.html');
});




app.post('/process-login', (req, res) => {
    const { valorConta, consumoConta, numberOfApartments, numberOfLojas, consumosApartamentosIndividuais } = req.body;

    //console.log('Dados recebidos no lado do servidor:', valorConta, consumoConta, numberOfApartments, consumosApartamentosIndividuais);

    exec(`node script.js "${valorConta}" "${consumoConta}" "${numberOfApartments}" "${numberOfLojas}" "${consumosApartamentosIndividuais}"`, (error, stdout, stderr) => {
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
        console.log(`Resultado do script: ${stdout}`);
        res.redirect(`/results?output=${stdout}`);
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
