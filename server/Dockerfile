# Utilisation de l'image Node.js LTS
FROM node:20-alpine

WORKDIR /app

# Copie des fichiers de dépendances (Racine + Workspaces)
COPY package*.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# Installation des dépendances depuis la racine
RUN npm install

# Copie du code source du serveur
COPY server/ ./server/

# Définition du répertoire de travail
WORKDIR /app/server

# Exposition du port
EXPOSE 3001

# Commande de démarrage
CMD ["npm", "start"]
