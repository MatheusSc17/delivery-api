const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();

// --- CONFIGURAÇÕES E MIDDLEWARES ---
app.use(cors()); // Permite o acesso da interface gráfica
app.use(express.json()); // Middleware para interpretar JSON

const PORT = 3000;
const FILE_PATH = './pedidos.json';

// --- ROTAS DA API (CRUD) ---

// 1. Listar pedidos (Read)
app.get('/pedidos', (req, res) => {
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        const pedidos = JSON.parse(data);
        res.status(200).json(pedidos);
    } catch (err) {
        res.status(500).json({ message: "Erro ao ler os pedidos." });
    }
});

// 2. Criar novo pedido (Create)
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
            entregue: false, // Inicia como não entregue por padrão
            status: "RECEIVED" // Regra: Novos pedidos nascem como RECEIVED
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
        
        // Não permite alteração se o pedido já estiver finalizado
        if (statusAtual === 'DELIVERED' || statusAtual === 'CANCELED') {
            return res.status(400).json({ message: "Pedidos finalizados não podem ser alterados." });
        }

        // Validações de fluxo (não permite retroceder status importantes)
        if (statusAtual === 'CONFIRMED' && novoStatus === 'RECEIVED') {
            return res.status(400).json({ message: "Pedido confirmado não pode voltar para Recebido." });
        }

        if (statusAtual === 'DISPATCHED' && ['RECEIVED', 'CONFIRMED'].includes(novoStatus)) {
            return res.status(400).json({ message: "Pedido despachado não pode voltar atrás." });
        }

        // Atualiza status e marca como entregue se necessário
        pedidos[index].status = novoStatus;
        if (novoStatus === 'DELIVERED') pedidos[index].entregue = true;

        fs.writeFileSync(FILE_PATH, JSON.stringify(pedidos, null, 2));
        res.json(pedidos[index]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao atualizar status." });
    }
});

// 4. Editar dados do pedido (Update)
app.put('/pedidos/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { cliente, produto, valor } = req.body;

        const data = fs.readFileSync(FILE_PATH, 'utf8');
        let pedidos = JSON.parse(data);
        const index = pedidos.findIndex(p => p.id === Number(id));

        if (index === -1) return res.status(404).json({ message: "Pedido não encontrado." });

        pedidos[index].cliente = cliente;
        pedidos[index].produto = produto;
        pedidos[index].valor = valor;

        fs.writeFileSync(FILE_PATH, JSON.stringify(pedidos, null, 2));
        res.json(pedidos[index]);
    } catch (err) {
        res.status(500).json({ message: "Erro ao editar pedido." });
    }
});

// 5. Deletar pedido (Delete)
app.delete('/pedidos/:id', (req, res) => {
    try {
        const { id } = req.params;
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        let pedidos = JSON.parse(data);
        
        const novosPedidos = pedidos.filter(p => p.id !== Number(id));

        if (pedidos.length === novosPedidos.length) {
            return res.status(404).json({ message: "Pedido não encontrado." });
        }

        fs.writeFileSync(FILE_PATH, JSON.stringify(novosPedidos, null, 2));
        res.status(204).send(); 
    } catch (err) {
        res.status(500).json({ message: "Erro ao deletar o pedido." });
    }
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`Acesse http://localhost:${PORT}/pedidos para ver seus dados!`);
});
