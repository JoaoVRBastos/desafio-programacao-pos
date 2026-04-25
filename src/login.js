const usuarios = [
  { id: 1, nome: 'João Silva',    email: 'joao@exemplo.com',    senha: 'senha123',        expirado: false },
  { id: 2, nome: 'Maria Santos',  email: 'maria@exemplo.com',   senha: 'minhasenha456',   expirado: false },
  { id: 3, nome: 'Carlos Lima',   email: 'carlos@expirado.com', senha: 'senhaExpirada789', expirado: true  },
];

function fazerLogin(email, senha) {
  const usuario = usuarios.find(u => u.email === email);

  if (!usuario) {
    throw new Error('Credenciais incorretas');
  }

  if (usuario.senha !== senha) {
    throw new Error('Credenciais incorretas');
  }

  if (usuario.expirado) {
    throw new Error('Renove suas credenciais');
  }

  return 'Login realizado com sucesso';
}

module.exports = { fazerLogin };
