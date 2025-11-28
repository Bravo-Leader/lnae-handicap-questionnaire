#!/bin/bash

# Script de configuration pour la production
# À exécuter après docker-compose up -d sur le VPS

echo "🚀 Configuration de l'application en production..."
echo ""

# Variables par défaut (modifiez selon vos besoins)
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@echecs-nouvelleaquitaine.fr}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-Admin123!}"
ADMIN_NAME="${ADMIN_NAME:-Administrateur}"
IS_SUPER_ADMIN="${IS_SUPER_ADMIN:-true}"

echo "📧 Email admin: $ADMIN_EMAIL"
echo "👤 Nom admin: $ADMIN_NAME"
echo "🔐 Super Admin: $IS_SUPER_ADMIN"
echo ""

# 1. Créer le compte administrateur
echo "1️⃣ Création du compte administrateur..."
docker-compose exec -T app node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

(async () => {
  try {
    // Vérifier si l'admin existe déjà
    const existing = await prisma.admin.findUnique({
      where: { email: '$ADMIN_EMAIL' }
    });

    if (existing) {
      console.log('⚠️  Un administrateur avec cet email existe déjà.');
      await prisma.\$disconnect();
      return;
    }

    const password = await bcrypt.hash('$ADMIN_PASSWORD', 10);
    const admin = await prisma.admin.create({
      data: {
        email: '$ADMIN_EMAIL',
        name: '$ADMIN_NAME',
        password,
        isSuperAdmin: $IS_SUPER_ADMIN
      }
    });

    console.log('✅ Compte administrateur créé avec succès!');
    console.log('📧 Email:', admin.email);
    console.log('👤 Nom:', admin.name);
    console.log('🔐 Super Admin:', admin.isSuperAdmin ? 'Oui' : 'Non');

    await prisma.\$disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
})();
"

if [ $? -ne 0 ]; then
  echo "❌ Échec de la création de l'admin"
  exit 1
fi

echo ""

# 2. Copier et exécuter le script de seed
echo "2️⃣ Seed de la base de données avec les données d'exemple..."

# Copier le script de seed dans le conteneur
docker cp scripts/seed-responses.js handicap-app:/app/seed-responses.js

if [ $? -ne 0 ]; then
  echo "⚠️  Le script de seed n'a pas été trouvé ou n'a pas pu être copié"
  echo "   Vous pouvez l'ignorer si vous ne voulez pas de données d'exemple"
else
  # Exécuter le script de seed
  docker-compose exec -T app node seed-responses.js

  if [ $? -ne 0 ]; then
    echo "⚠️  Le seed a échoué, mais ce n'est pas critique"
  fi
fi

echo ""
echo "✅ Configuration terminée!"
echo ""
echo "🔗 Votre application est accessible à l'adresse configurée dans NEXTAUTH_URL"
echo "🔑 Identifiants de connexion:"
echo "   Email: $ADMIN_EMAIL"
echo "   Mot de passe: $ADMIN_PASSWORD"
echo ""
echo "⚠️  IMPORTANT: Changez ce mot de passe après la première connexion!"
echo ""
