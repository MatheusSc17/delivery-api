const express = require('express');
const fs = require('fs');
const cors = require('cors'); // Importa o CORS

const app = express(); // Cria o servidor PRIMEIRO

app.use(cors()); // Agora sim, ativa o CORS
app.use(express.json()); // Middleware para JSON

const PORT = 3000;
const FILE_PATH = './pedidos.json';

// --- ROTAS DA API ---

//[span_6](start_span)// 1. Listar pedidos (O "R" do CRUD)[span_6](end_span)
app.get('/pedidos', (req, res) => {
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        const pedidos = JSON.parse(data);
        res.status(200).json(pedidos); // REMOVA O PONTO ANTES DO RES
    } catch (err) {
        res.status(500).json({ message: "Erro ao ler os pedidos." });
    }
});
// 2. Criar novo pedido (O "C" do CRUD)
app.post('/pedidos', (req, res) => {
    try {
        const { cliente, produto, valor } = req.body;
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        const pedidos = JSON.parse(data);

        const novoPedido = {
            id: pedidos.length > 0 ? pedidos[pedidos.length - 1].id + 1 : 1,
            cliente,
            produto,
            valor,
            entregue: false,
            status: "RECEIVED" // Regra do desafio: novos pedidos nascem como RECEIVED
        };
        pedidos.push(novoPedido);
        fs.writeFileSync(FILE_PATH, JSON.stringify(pedidos, null, 2));

        res.status(201).json(novoPedido);
    } catch (err) {
        res.status(500).json({ message: "Erro ao salvar o pedido." });
    }
});
// 3. Atualizar Status do Pedido (Máquina de Estados)
app.patch('/pedidos/:id/status', (req, res) => {
    try {
        const { id } = req.params;
        const { novoStatus } = req.body;
        const statusPermitidos = ['RECEIVED', 'CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELED'];

        if (!statusPermitidos.includes(novoStatus)) {
            return res.status(400).json({ message: "Status inválido." });
        }

        const data = fs.readFileSync(FILE_PATH, 'utf8');
        let pedidos = JSON.parse(data);
        const index = pedidos.findIndex(p => p.id === Number(id));

        if (index === -1) return res.status(404).json({ message: "Pedido não encontrado." });

        const statusAtual = pedidos[index].status;

        // --- REGRAS DA MÁQUINA DE ESTADOS ---
        
        // 1. Não pode mudar se já for DELIVERED ou CANCELED[span_5](end_span)
        if (statusAtual === 'DELIVERED' || statusAtual === 'CANCELED') {
            return res.status(400).json({ message: "Pedidos finalizados não podem ser alterados." });
        }

    // 2. CONFIRMED não volta para RECEIVED[span_6](end_span)
        if (statusAtual === 'CONFIRMED' && novoStatus === 'RECEIVED') {
            return res.status(400).json({ message: "Pedido confirmado não pode voltar para Recebido." });
        }

        // 3. DISPATCHED não volta para estados anteriores[span_7](end_span)
        if (statusAtual === 'DISPATCHED' && ['RECEIVED', 'CONFIRMED'].includes(novoStatus)) {
            return res.status(400).json({ message: "Pedido despachado não pode voltar atrás." });
        }

        // Atualiza o status e salva
        pedidos[index].status = novoStatus;
        if (novoStatus === 'DELIVERED') pedidos[index].entregue = true;

        fs.writeFileSync(FILE_PATH, JSON.stringify(pedidos, null, 2));
        res.json(pedidos[index]);
    } catch (err) {
    console.error(err); // <--- Adicione isso aqui!
    res.status(500).json({ message: "Erro ao atualizar status.", error: err.message });
    }
});

// --- COLE O PUT AQUI ---
app.put('/pedidos/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { cliente, produto, valor } = req.body;

        const data = fs.readFileSync(FILE_PATH, 'utf8');
        let pedidos = JSON.parse(data);
        const index = pedidos.findIndex(p => p.id === Number(id));

        if (index === -1) return res.status(404).json({ message: "Pedido não encontrado." });

        // Atualiza os dados
        pedidos[index].cliente = cliente;
        pedidos[index].produto = produto;
        pedidos[index].valor = valor;

        fs.writeFileSync(FILE_PATH, JSON.stringify(pedidos, null, 2));
        res.json(pedidos[index]);
    } catch (err) {
        res.status(500).json({ message: "Erro ao editar pedido." });
    }
});

// 5. Deletar pedido (O "D" do CRUD)
app.delete('/pedidos/:id', (req, res) => {
    try {
        const { id } = req.params;
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        let pedidos = JSON.parse(data);
        
        // Criamos uma nova lista filtrando e removendo o pedido com o ID enviado
        const novosPedidos = pedidos.filter(p => p.id !== Number(id));

        // Se o tamanho da lista não mudou, significa que o ID não existia
        if (pedidos.length === novosPedidos.length) {
            return res.status(404).json({ message: "Pedido não encontrado." });
        }

        // Salva a nova lista (sem o pedido deletado) no arquivo
        fs.writeFileSync(FILE_PATH, JSON.stringify(novosPedidos, null, 2));
        
        // No DELETE, é comum retornar o status 204 (Sucesso sem conteúdo)
        res.status(204).send(); 
    } catch (err) {
        res.status(500).json({ message: "Erro ao deletar o pedido." });
    }
});

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`Acesse http://localhost:3000/pedidos para ver seus dados!`);

});
