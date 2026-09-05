import { UserModel, UserProfile } from './src/model/usuario';
import { LojaModel } from './src/model/loja';
import { ProdutoModel } from './src/model/produto';
import { CarrinhoModel } from './src/model/carrinho';
import { PedidoModel } from './src/model/pedido';
import { PagamentoModel } from './src/model/pagamento';
import { NotificacaoModel } from './src/model/notificaçao';

console.log('\n========================================');
console.log('     TESTE DOS MODELS - BUZZYMARKET');
console.log('========================================\n');

function testarModel(nome: string, model: any, dados: any): void {
  try {
    const documento = new model(dados);
    const erro = documento.validateSync();

    if (erro) {
      console.log(`❌ ${nome}: INVÁLIDO`);

      Object.values(erro.errors).forEach((error: any) => {
        console.log(`   → ${error.message}`);
      });

      console.log('');
      return;
    }

    console.log(`✅ ${nome}: OK`);
    console.log('');
  } catch (error) {
    console.log(`❌ ${nome}: ERRO`);
    console.error(error);
    console.log('');
  }
}

/*
========================================
1. USER
========================================
*/

testarModel('User', UserModel, {
  nome: 'João',
  email: 'joao@email.com',
  senhaHash: 'senha-hash',
  perfil: UserProfile.Cliente,

  endereco: {
    cep: '76980-000',
    logradouro: 'Rua das Flores',
    numero: '123',
    complemento: 'Casa',
    bairro: 'Centro',
    cidade: 'Vilhena',
    estado: 'RO'
  }
});

/*
========================================
2. LOJA
========================================
*/

testarModel('Loja', LojaModel, {
  nome: 'Mercado do João',
  descricao: 'Mercado de produtos diversos',
  categoria: 'Mercado',

  proprietarioId: '000000000000000000000000',

  status: 'pendente',
  funcionamento: 'fechada'
});

/*
========================================
3. PRODUTO
========================================
*/

testarModel('Produto', ProdutoModel, {
  lojaId: '000000000000000000000000',

  nome: 'Mouse Gamer',
  descricao: 'Mouse gamer RGB',
  categoria: 'Periféricos',

  preco: 129.90,
  estoque: 20,

  imagem: 'mouse.jpg',

  ativo: true
});

/*
========================================
4. CARRINHO
========================================
*/

testarModel('Carrinho', CarrinhoModel, {
  usuarioId: '000000000000000000000000',

  itens: [
    {
      produtoId: '000000000000000000000000',
      nome: 'Tênis Esportivo',
      preco: 199.90,
      imagem: 'https://exemplo.com/tenis.jpg',
      quantidade: 2
    }
  ]
});

/*
========================================
5. PEDIDO
========================================
*/

testarModel('Pedido', PedidoModel, {
  usuarioId: '000000000000000000000000',

  lojaId: '000000000000000000000000',

  itens: [
    {
      produtoId: '000000000000000000000000',
      nome: 'Mouse Gamer',
      quantidade: 2,
      preco: 129.90,
      subtotal: 259.80
    }
  ],

  valorTotal: 259.80,

  enderecoEntrega: {
    cep: '76980-000',
    logradouro: 'Rua das Flores',
    numero: '123',
    complemento: 'Casa',
    bairro: 'Centro',
    cidade: 'Vilhena',
    estado: 'RO'
  },

  status: 'pendente'
});

/*
========================================
6. PAGAMENTO
========================================
*/

testarModel('Pagamento', PagamentoModel, {
  pedidoId: '000000000000000000000000',

  valor: 259.80,

  metodo: 'pix',

  status: 'pendente',

  transacaoId: 'TRANSACAO-001'
});

/*
========================================
7. NOTIFICAÇÃO
========================================
*/

testarModel('Notificacao', NotificacaoModel, {
  remetenteId: '000000000000000000000000',

  usuarioId: '000000000000000000000000',

  titulo: 'Pedido recebido',

  mensagem: 'Seu pedido foi recebido com sucesso.',

  tipo: 'pedido',

  lida: false
});

console.log('========================================');
console.log('        TESTE FINALIZADO');
console.log('========================================\n');