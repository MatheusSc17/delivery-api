Delivery API - Desafio Técnico Coco Bambu
Esta API foi desenvolvida para gerenciar o fluxo completo de pedidos de um sistema de delivery, desde o recebimento até a entrega final, garantindo a integridade dos dados através de uma máquina de estados.

    Tecnologias Utilizadas
Node.js: Ambiente de execução principal.

Express: Framework para construção e gerenciamento das rotas da API.

CORS: Middleware para permitir a comunicação entre o Frontend e a API.

FS (File System): Utilizado para a persistência de dados em formato JSON.

    Como Executar o Projeto
Pré-requisitos
Ter o Node.js instalado (Versão 18 ou superior recomendada).

Passo a Passo
Instalar dependências:
No terminal, dentro da pasta do projeto, execute:

Bash
npm install
Iniciar o servidor:
Ainda no terminal, execute:

Bash
node index.js
Acessar a Interface:
Abra o arquivo index.html diretamente no seu navegador ou via Live Server para visualizar o painel de pedidos.

    Arquitetura e Decisões Técnicas
Persistência de Dados: Armazenamento em arquivo pedidos.json, garantindo que as informações persistam mesmo após o servidor ser reiniciado.

Máquina de Estados: Validação rigorosa das transições de status (ex: pedidos DELIVERED ou CANCELED tornam-se imutáveis), assegurando a integridade do processo.

Interface Frontend: Painel visual desenvolvido em HTML/CSS para facilitar a gestão e o acompanhamento dos pedidos em tempo real.

    Backlog de Desenvolvimento (Ordem de Execução)
Configuração inicial do servidor Express e middlewares (CORS/JSON).

Estruturação do arquivo de persistência pedidos.json.

Implementação das rotas de CRUD (Listar, Criar, Atualizar e Deletar).

Desenvolvimento da lógica de transição da Máquina de Estados.

Criação da interface gráfica para monitoramento dos pedidos.

Conteinerização da aplicação utilizando Docker.

Documentação final do projeto.
