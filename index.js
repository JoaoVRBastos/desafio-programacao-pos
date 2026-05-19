const ServicoDePagamento = require('./src/servicoDePagamento');

const servicoDePagamento = new ServicoDePagamento();

servicoDePagamento.pagar('0987-7656-3475', 'Samar', 156.87);

console.log(servicoDePagamento.consultarUltimoPagamento());
