
// Definição das variáveis
const valorConta = 500; // R$
const consumoConta = 80; // M³
const numberOfApartments = 6;
const taxaFixa = 36.93; // R$ por apartamento
const apartmentoPrimeiraFaixa = [];
const apartamentoSegundaFaixa = [];
const apartamentoTerceiraFaixa = [];
const apartamentoQuartaFaixa = [];
let consumoCondominio = 0;
let valorCondomínio = 0;
// Array de consumo de água por apartamento
const consumosApartamentos = [20.710, 18.036, 11.921, 12.773, 8.276, 8.346]; // m³

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

function passarSegundaFaixa(consumosApartamentos) {
    // Criando o array apartamentoprimeirafaixa
    const apartamentoPrimeiraFaixa = consumosApartamentos.map(consumo => {
        if (consumo > 5) {
            return 5;
        } else {
            return consumo;
        }
    });

    // Criando o array apartamentoSegundaFaixa
    const apartamentoSegundaFaixa = consumosApartamentos.map((consumo, index) => {
        const primeiraFaixa = apartamentoPrimeiraFaixa[index];
        const diff = consumo - primeiraFaixa;
        return diff > 0 ? diff : 0;
    });

    return { apartamentoPrimeiraFaixa, apartamentoSegundaFaixa };
}

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

    console.log('Valor da primeira faixa: ' + firstTierRate);
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

else if (firstTierRate > 3.83) {
    firstTierRate = 3.83;

    const { apartamentoPrimeiraFaixa, apartamentoSegundaFaixa } = passarSegundaFaixa(consumosApartamentos);

    // Array para armazenar os valores multiplicados pela primeira faixa
    const resultPrimeiraFaixa = apartamentoPrimeiraFaixa.map(consumo => consumo * firstTierRate);


    // Cálculo do valor total da primeira faixa   
    const totalFirstTierValue = resultPrimeiraFaixa.reduce((total, value) => total + value, 0);


    // Cálculo do consumo total da segunda faixa
    const consumoTotalSegundaFaixa = apartamentoSegundaFaixa.reduce((total, consumo) => total + consumo, 0);


    let secondTierRate = (valorExcedente - totalFirstTierValue) / consumoTotalSegundaFaixa;


    // Array para armazenar os valores multiplicados pela Segunda faixa
    const resultSegundaFaixa = apartamentoSegundaFaixa.map(consumo => consumo * secondTierRate);



    if (consumoCondominio > 0) {
        const ultimoItem1 = resultPrimeiraFaixa[resultPrimeiraFaixa.length - 1];
        const ultimoItem2 = resultSegundaFaixa[resultSegundaFaixa.length - 1];
        valorCondomínio = (ultimoItem1 + ultimoItem2) / numberOfApartments;
        // Removendo o último item do array, no caso o condomínio.
        resultPrimeiraFaixa.pop();
        resultSegundaFaixa.pop();
        consumosApartamentos.pop();
    }


    console.log('Valor da primeira faixa: ' + firstTierRate);
    console.log('Valor da segunda faixa: ' + secondTierRate);
    console.log('Valor do condomínio: R$ ' + (valorCondomínio.toFixed(2)));
    // Cálculo da cobrança para cada apartamento
    const cobrancasPorApartamento = consumosApartamentos.map((consumo, index) => {
        const firstTierValue = resultPrimeiraFaixa[index]; // Acesso ao valor correspondente de resultPrimeiraFaixa usando o índice
        const secondTierValue = resultSegundaFaixa[index]; // Acesso ao valor correspondente de resultSegundaFaixa usando o índice
        return firstTierValue + secondTierValue + taxaFixa + valorCondomínio;
    });

    // Saída dos resultados
    console.log(`Cobrança por apartamento:`);
    cobrancasPorApartamento.forEach((cobranca, index) => console.log(`Apartamento ${index + 1}: R$ ${cobranca.toFixed(2)}`));
}
else {
    console.log("Não é possível cálcular");
}