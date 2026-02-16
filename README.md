Delivery API 

Esta é uma API desenvolvida para gerenciar pedidos de um sistema de delivery, permitindo o controle completo desde o recebimento até a entrega final.

Tecnologias Utilizadas

Node.js: Ambiente de execução.


Express: Framework para construção das rotas da API.


CORS: Middleware para permitir o acesso da interface gráfica.
+1


FS (File System): Para persistência de dados em arquivo JSON.
+2

📋 Como Executar o Projeto
Pré-requisitos
Ter o Node.js instalado em sua máquina.

Passo a Passo
Instalar dependências:
No terminal da pasta do projeto, execute:

Bash
npm install
Iniciar o servidor:
Execute o comando:

Bash
node index.js
Acessar a Interface:
Abra o arquivo index.html diretamente no seu navegador para visualizar o painel de pedidos.
+2

🏗️ Arquitetura e Decisões

Persistência: Os dados são armazenados no arquivo pedidos.json para garantir que as informações não sejam perdidas ao reiniciar o servidor.
+1


Máquina de Estados: O sistema valida rigorosamente as transições de status (ex: um pedido DELIVERED não pode ser cancelado) para garantir a integridade do processo de entrega.
+1


Interface: Foi desenvolvida uma página simples em HTML/CSS para facilitar a gestão visual dos pedidos em tempo real.
+1

Backlog de Desenvolvimento
Configuração inicial do servidor e middlewares (CORS/JSON).

Implementação das rotas CRUD (Listar, Criar, Editar, Deletar).
+1

Desenvolvimento da lógica da Máquina de Estados.

Criação da interface gráfica para o usuário.
+1

Documentação do projeto.
+2