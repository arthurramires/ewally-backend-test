import { TIT_BANK_REGEX, PAG_CONC_REGEX } from '../constants';

//Método de cálculo do digito verificador
const dacModulo10 = code => {
    let multiplier = 2;

    let sum = code
        .split('')
        .reverse()
        .reduce((accumulated, item) => {
            let x = item * multiplier;

            if (x > 9) {
                let s = String(x);
                x = Number(s[0]) + Number(s[1]);
            }

            multiplier = multiplier === 2 ? 1 : 2;

            return accumulated + x;
        }, 0);

    let restOfDivision = 10 - (sum % 10);

    return String(restOfDivision === 10 ? 0 : restOfDivision);
};

const dacModulo11 = code => {
    let multiplier = 2;

    let soma = code
        .split('')
        .reverse()
        .reduce((accumulated, item) => {
            let x = item * multiplier;

            multiplier = multiplier < 9 ? multiplier + 1 : 2;

            return accumulated + x;
        }, 0);

    let restOfDivision = 11 - (soma % 11);

    return String([0, 10].includes(restOfDivision) ? 1 : restOfDivision);
};

//A cada 9000 dias a data base é alterada a partir de 03/07/2000
const calcularDataBaseVenc = () => {
    let hoje = new Date().toISOString();

    let dataBase = new Date('2000-07-03');
    let proxData = new Date('2000-07-03');

    proxData.setDate(proxData.getDate() + 9000);

    while (proxData.toISOString() <= hoje) {
        dataBase = proxData;
        proxData.setDate(proxData.getDate() + 9000);
    }

    return dataBase.toISOString().slice(0, 10);
};

//Verifica a data no formato YYYYMMDD
const verificarData = date => {
    let year = date.slice(0, 4);
    let month = date.slice(4, 6);
    let day = date.slice(6, 8);
    if (Number(year) < 2000) return null;
    if (Number(year) >= 3000) return null;

    let formattedDate = new Date(`${year}-${month}-${day}`);
    return isNaN(formattedDate.getDate()) ? null : `${year}-${month}-${day}`;
};

//Valida os Titulos Bancários
const valTitBancario = line => {
    if (!TIT_BANK_REGEX.exec(line)) return false;

    //Separa os campos principais
    const bank = line.slice(0, 3);
    const moeda = line.slice(3, 4);
    const extra1 = line.slice(4, 9);
    const dv1 = line.slice(9, 10);
    const extra2 = line.slice(10, 20);
    const dv2 = line.slice(20, 21);
    const extra3 = line.slice(21, 31);
    const dv3 = line.slice(31, 32);
    const dv = line.slice(32, 33);
    const fatorVenc = line.slice(33, 37);
    const value = line.slice(37, 47);

    if (bank === '') {
        return null;
    }

    //Ordena os valores representando o valor númerico do código de barras
    const codigo =
        bank + moeda + dv + fatorVenc + value + extra1 + extra2 + extra3;

    //Calcula os 3 digitos verificadores segmentados
    const field1 = line.slice(0, 9);
    const field2 = line.slice(10, 20);
    const field3 = line.slice(21, 31);

    const dacModuloField1 = dacModulo10(field1);
    const dacModuloField2 = dacModulo10(field2);
    const dacModuloField3 = dacModulo10(field3);

    //Calculo o digito verificador do codigo de barras
    const codeWithoutDigit = codigo
        .split('')
        .filter((e, i) => i !== 4)
        .join('');

    const ndv = dacModulo11(codeWithoutDigit);

    //Verifica se os digitos bateram
    if (
        dacModuloField1 !== dv1 ||
        dacModuloField2 !== dv2 ||
        dacModuloField3 !== dv3 ||
        ndv !== dv
    ) {
        return false;
    }

    //Converte o valor do boleto
    const decimalValue = value / 100;

    //Calcula o vencimento do boleto
    let expiration = null;

    if (fatorVenc >= 1000) {
        const dataBase = calcularDataBaseVenc();

        expiration = new Date(dataBase);
        expiration.setDate(expiration.getDate() + (fatorVenc - 1000));
        expiration = expiration.toISOString().slice(0, 10);
    }

    return {
        amount: decimalValue.toFixed(2),
        expirationDate: expiration,
        line,
        barCode: codigo
    };
};

//Valida os Titulos de Arrecadação de Concessionarias
const valTitArrecadacao = line => {
    if (!PAG_CONC_REGEX.exec(line)) return false;

    //Separa a linha digitada em grupos e digitos verificadores
    const dv = line.slice(3, 4);
    const group1 = line.slice(0, 11);
    const dv1 = line.slice(11, 12);
    const group2 = line.slice(12, 23);
    const dv2 = line.slice(23, 24);
    const group3 = line.slice(24, 35);
    const dv3 = line.slice(35, 36);
    const group4 = line.slice(36, 47);
    const dv4 = line.slice(47, 48);

    if (dv === '') {
        return null;
    }
    let data1 = (group1 + group2 + group3).slice(19, 27);
    let data2 = (group1 + group2 + group3).slice(23, 31);
    let [ndv, ndv1, ndv2, ndv3, ndv4] = [null, null, null, null, null];

    //Verifica o identificador de valor efetivo ou referência
    const idValue = line[2];

    //Calcula os digitos verificadores utilizando metodos diferentes
    //de acordo com o valor do identificador
    const lineWithoutDigit =
        group1.slice(0, 3) + group1.slice(4, 11) + group2 + group3 + group4;

    if (['6', '7'].includes(idValue)) {
        ndv1 = dacModulo10(group1);
        ndv2 = dacModulo10(group2);
        ndv3 = dacModulo10(group3);
        ndv4 = dacModulo10(group4);
        ndv = dacModulo10(lineWithoutDigit);
    }

    if (['8', '9'].includes(idValue)) {
        ndv1 = dacModulo11(group1);
        ndv2 = dacModulo11(group2);
        ndv3 = dacModulo11(group3);
        ndv4 = dacModulo11(group4);
        ndv = dacModulo11(lineWithoutDigit);
    }

    //Verifica se os digitos bateram
    if (
        dv !== ndv ||
        dv1 !== ndv1 ||
        dv2 !== ndv2 ||
        dv3 !== ndv3 ||
        dv4 !== ndv4
    ) {
        return false;
    }

    //Converte o valor do boleto
    let valorDecimal = (group1 + group2).slice(4, 15);
    valorDecimal = valorDecimal / 100;

    return {
        amount: valorDecimal,
        expirationDate: verificarData(data1) || verificarData(data2),
        line,
        barCode: group1 + group2 + group3 + group4
    };
};

module.exports = {
    valTitBancario,
    valTitArrecadacao
};
