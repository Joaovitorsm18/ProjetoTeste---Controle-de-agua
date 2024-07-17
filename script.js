const { type } = require('os');
const { passarFaixas } = require('./calculo.js');
const { passarFaixasLoja } = require('./calculoLoja.js');
// Definição das variáveis
async function runScript(valorConta, consumoConta, numberOfApartments, numberOfLojas, consumosApartamentosIndividuais, apartamentos, lojas) {
    // Remover espaço em branco após o último valor na string
    const consumosApartamentosIndividuaisSemEspaco = consumosApartamentosIndividuais.trim();

    // Dividir a string em substrings com base nos espaços em branco e converter para números de ponto flutuante
    const consumosApartamentos = consumosApartamentosIndividuaisSemEspaco.split(/\s+/).map(value => parseFloat(value));

    // Transforme a string em um array de números de apartamentos
    const apartamentosArray = apartamentos.split(',').map(apartamento => apartamento.trim());

    // Transforme a string em um array de números de lojas
    const lojasArray = lojas.split(',').map(loja => loja.trim());
    const taxaFixa = 36.93; // R$ por apartamento

    let consumoCondominio = 0;
    let valorCondomínio = 0;

    // Cálculo do total de consumo de água
    let consumoTotalApartamentos = consumosApartamentos.reduce((total, consumo) => total + consumo, 0);

    // Verifica se sobrará agua para o condomínio e adiciona ao final do array de consumosApartamentos
    if (consumoConta >= consumoTotalApartamentos) {
        consumoCondominio = consumoConta - consumoTotalApartamentos;
        consumosApartamentos.push(consumoCondominio);
    }
    consumoTotalApartamentos = consumosApartamentos.reduce((total, consumo) => total + consumo, 0);
    //verifica se tem loja, caso verdadeiro, vai para calculoLojas
    numberOfLojas = parseInt(numberOfLojas)
    if (numberOfLojas != 0) {
        passarFaixasLoja(valorConta, consumosApartamentos, consumoTotalApartamentos, numberOfApartments, numberOfLojas, consumoCondominio, valorCondomínio, apartamentosArray, lojasArray)
    } else {
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

            const cobrancasPorApartamento = consumosApartamentos.map((consumo, index) => {
                const firstTierValue = resultPrimeiraFaixa[index]; // Acesso ao valor correspondente de resultPrimeiraFaixa usando o índice
                return firstTierValue + taxaFixa + valorCondomínio;
            });

            const resultado = {
                valorFaixa1: firstTierRate.toFixed(4),
                valorCondominio: valorCondomínio.toFixed(2),
                cobrancaPorApartamento: cobrancasPorApartamento.map((cobranca, index) => ({
                    [`${apartamentosArray[index]}`]: `R$ ${cobranca.toFixed(2)}`
                })),
                taxaFixa: (`R$ ` + taxaFixa.toFixed(2)),
                consumosApartamentos: consumosApartamentos.map(consumo => consumo.toFixed(2)),
                consumoApartamentosPrimeirafaixa: consumosApartamentos.map(consumo => consumo.toFixed(2)),
                resultadoApartamentosPrimeirafaixa: resultPrimeiraFaixa.map(resultado => `R$ ` + resultado.toFixed(2))
            };

            // Imprimir o objeto como JSON
            console.log(JSON.stringify(resultado));
        }
        else {
            passarFaixas(consumosApartamentos, valorExcedente, numberOfApartments, taxaFixa, consumoCondominio, valorCondomínio, apartamentosArray)
        }
    }
}
// Pega os argumentos da linha de comando

const valorConta = process.argv[2];
const consumoConta = process.argv[3];
const numberOfApartments = process.argv[4];
const numberOfLojas = process.argv[5];
const consumosApartamentosIndividuais = process.argv[6];
const apartamentos = process.argv[7];
const lojas = process.argv[8];

// Chama a função principal com os argumentos
runScript(valorConta, consumoConta, numberOfApartments, numberOfLojas, consumosApartamentosIndividuais, apartamentos, lojas);
