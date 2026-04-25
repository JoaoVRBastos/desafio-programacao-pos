const assert = require('assert');
const { fazerLogin } = require('../src/login');

describe('fazerLogin', () => {
  it('deve retornar mensagem de sucesso com email e senha corretos', () => {
    const resultado = fazerLogin('joao@exemplo.com', 'senha123');
    assert.strictEqual(resultado, 'Login realizado com sucesso');
  });

  it('deve lançar erro de credenciais expiradas', () => {
    assert.throws(
      () => fazerLogin('carlos@expirado.com', 'senhaExpirada789'),
      { message: 'Renove suas credenciais' }
    );
  });

  it('deve lançar erro quando o usuário não é encontrado', () => {
    assert.throws(
      () => fazerLogin('naoexiste@exemplo.com', 'qualquersenha'),
      { message: 'Credenciais incorretas' }
    );
  });

  it('deve lançar erro quando a senha está incorreta para o usuário encontrado', () => {
    assert.throws(
      () => fazerLogin('joao@exemplo.com', 'senhaErrada'),
      { message: 'Credenciais incorretas' }
    );
  });
});
