//teste

const { passarFaixas } = require('./calculo.js')
// Definição das variáveis
const valorConta = 2833.98; // R$
const consumoConta = 233; // M³
const numberOfApartments = 12;
const taxaFixa = 36.93; // R$ por apartamento

let consumoCondominio = 0;
let valorCondomínio = 0;
// Array de consumo de água por apartamento
const consumosApartamentos = [34.371,
    17.180,
    5.778,
    5.135,
    16.147,
    14.784,
    17.478,
    12.178,
    10.041,
    10.670,
    39.251,
    25.812]; // m³

// Cálculo do total de consumo de água
const consumoTotalApartamentos = consumosApartamentos.reduce((total, consumo) => total + consumo, 0);

// Verifica se sobrará agua para o condomínio e adiciona ao final do array de consumosApartamentos
if (consumoConta >= consumoTotalApartamentos) {
    consumoCondominio = consumoConta - consumoTotalApartamentos;
    consumosApartamentos.push(consumoCondominio);
}

// Cálculo do valor excedente (valor da conta menos o total das taxas fixas)
const valorMinimoResidencial = taxaFixa * numberOfApartments;
let valorExcedente = valorConta - valorMinimoResidencial;

// Verificação se o valor da primeira faixa ultrapassa o valor correto (3,83)
let firstTierRate = valorExcedente / consumoTotalApartamentos;

if (firstTierRate <= 3.83) {
    // Array para armazenar os valores multiplicados pela primeira faixa
    const resultPrimeiraFaixa = consumosApartamentos.map(consumo => consumo * firstTierRate);

    if (consumoCondominio > 0) {
        const ultimoItem1 = resultPrimeiraFaixa[resultPrimeiraFaixa.length - 1];
        valorCondomínio = (ultimoItem1) / numberOfApartments;
        // Removendo o último item do array, no caso o condomínio.
        resultPrimeiraFaixa.pop();
        consumosApartamentos.pop();
    }

    console.log('Valor da primeira faixa: ' + firstTierRate.toFixed(4));
    console.log('Valor do condomínio: R$ ' + (valorCondomínio.toFixed(2)));
    // Cálculo da cobrança para cada apartamento
    const cobrancasPorApartamento = consumosApartamentos.map((consumo, index) => {
        const firstTierValue = resultPrimeiraFaixa[index]; // Acesso ao valor correspondente de resultPrimeiraFaixa usando o índice
        return firstTierValue + taxaFixa + valorCondomínio;
    });

    // Saída dos resultados
    console.log(`Cobrança por apartamento:`);
    cobrancasPorApartamento.forEach((cobranca, index) => console.log(`Apartamento ${index + 1}: R$ ${cobranca.toFixed(2)}`));

}
else {
    passarFaixas(consumosApartamentos, valorExcedente, numberOfApartments, taxaFixa, consumoCondominio, valorCondomínio)
}


