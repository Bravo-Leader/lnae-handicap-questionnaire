const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@echecs-nouvelleaquitaine.fr'
  const passwordPlain = process.env.ADMIN_PASSWORD || 'ChangeThis123!'
  const name = process.env.ADMIN_NAME || 'Administrateur'
  const isSuperAdmin = process.env.IS_SUPER_ADMIN === 'true'

  console.log('🔐 Création d\'un compte administrateur...\n')

  // Vérifier si l'admin existe déjà
  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  })

  if (existingAdmin) {
    console.log('⚠️  Un administrateur avec cet email existe déjà.')
    console.log(`Email: ${email}`)
    console.log('\nVoulez-vous le supprimer et en créer un nouveau ?')
    console.log('Utilisez: npx prisma studio pour gérer les admins existants\n')
    return
  }

  // Hash du mot de passe
  const password = await bcrypt.hash(passwordPlain, 10)

  // Créer l'admin
  const admin = await prisma.admin.create({
    data: {
      email,
      name,
      password,
      isSuperAdmin,
    },
  })

  console.log('✅ Compte administrateur créé avec succès!\n')
  console.log('📧 Email:', admin.email)
  console.log('👤 Nom:', admin.name)
  console.log('🔑 Mot de passe:', passwordPlain)
  console.log('🔐 Super Admin:', isSuperAdmin ? 'Oui' : 'Non')
  console.log('\n⚠️  IMPORTANT: Changez ce mot de passe après la première connexion!\n')
  console.log('🔗 Connexion: http://localhost:3000/admin/login\n')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de la création de l\'admin:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
