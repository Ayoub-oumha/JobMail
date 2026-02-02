# Étape 1 : Build de l'app React
FROM node:20-alpine as builder

WORKDIR /app

# Copie des dépendances
COPY package*.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# Installation
RUN npm install

# Copie du code source complet
COPY client/ ./client/

# Build du frontend
WORKDIR /app/client
RUN npm run build

# Étape 2 : Serveur Nginx pour la prod
FROM nginx:alpine

# Copie des fichiers buildés depuis l'étape 1
COPY --from=builder /app/client/dist /usr/share/nginx/html

# Copie de la config Nginx personnalisée
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
