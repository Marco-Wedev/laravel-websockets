FROM node:18

# faz da pasta 'app' o diretório atual de trabalho
WORKDIR /app

# copia os arquivos 'package.json' e 'yarn.lock'
COPY package.json yarn.lock ./

# instala as dependências do projeto
RUN yarn install
COPY . .

# Escuta a porta 3000
EXPOSE 3000

# Seta usuário node
USER node

# starta
CMD ["yarn", "start"]