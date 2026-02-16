1. Define a imagem base (usando a versão estável do Node.js)
FROM node:18

2. Cria o diretório de trabalho dentro do container
WORKDIR /usr/src/app

3. Copia os arquivos de dependências (package.json e package-lock.json)
COPY package*.json ./

4. Instala as dependências do projeto
RUN npm install

5. Copia todo o conteúdo da sua pasta para dentro do container
COPY . .

6. Informa a porta que o container deve expor (a mesma que você usou no index.js)
EXPOSE 3000

7. Comando para iniciar a aplicação

CMD [ "node", "index.js" ]
