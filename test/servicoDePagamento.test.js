const assert = require('assert');
const ServicoDePagamento = require('../src/servicoDePagamento');

describe('ServicoDePagamento', () => {
  it('deve registrar um pagamento com categoria "cara" quando valor for maior que 100', () => {
    const servico = new ServicoDePagamento();
    servico.pagar('0987-7656-3475', 'Samar', 156.87);

    const ultimo = servico.consultarUltimoPagamento();
    assert.strictEqual(ultimo.categoria, 'cara');
  });

  it('deve registrar um pagamento com categoria "padrão" quando valor for menor ou igual a 100', () => {
    const servico = new ServicoDePagamento();
    servico.pagar('1111-2222-3333', 'Loja X', 50.00);

    const ultimo = servico.consultarUltimoPagamento();
    assert.strictEqual(ultimo.categoria, 'padrão');
  });

  it('deve retornar o último pagamento adicionado', () => {
    const servico = new ServicoDePagamento();
    servico.pagar('1111', 'Empresa A', 30);
    servico.pagar('2222', 'Empresa B', 200);

    const ultimo = servico.consultarUltimoPagamento();
    assert.strictEqual(ultimo.empresa, 'Empresa B');
  });
});
