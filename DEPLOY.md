# Guide de Déploiement sur VPS

## Prérequis
- Un VPS (IP: 72.61.105.71)
- Docker et Docker Compose installés sur le VPS

## 1. Transfert des fichiers
Copiez tout le dossier de votre projet vers le VPS. Vous pouvez utiliser `scp` ou `rsync` depuis votre terminal local.
Exemple (remplacez `user` par votre utilisateur VPS) :
```bash
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'client/node_modules' --exclude 'server/node_modules' ./ user@72.61.105.71:~/JobMailer
```

## 2. Configuration sur le VPS
Connectez-vous à votre VPS :
```bash
ssh user@72.61.105.71
```

Allez dans le dossier :
```bash
cd ~/JobMailer
```

Assurez-vous que le fichier `.env` du serveur est bien présent et configuré (notamment `MONGO_URI`, `SMTP_USER`, `SMTP_PASS`).

## 3. Lancement
Lancez les conteneurs avec Docker Compose en mode détaché :
```bash
docker-compose up -d --build
```

## 4. Vérification
- L'application sera accessible sur : **http://72.61.105.71:8081**
- Le backend tourne en interne, mais l'API est accessible via le frontend grâce au proxy Nginx.

## dépannage
Si le port 8081 est déjà utilisé, modifiez `docker-compose.yml` :
```yaml
ports:
  - "8082:80" # Changez 8081 par un autre port libre
```
Puis relancez : `docker-compose up -d`
